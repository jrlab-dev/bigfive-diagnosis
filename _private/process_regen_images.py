"""
再生成画像 一括処理スクリプト
==============================
1. 白背景 → 透明化（角からflood fill）
2. 1000×700 にリサイズ
3. F/M 分割（隙間検出 or 中央分割）
4. WebP 圧縮
5. images/characters/F/ M/ に配置

【使い方】
  python _private/process_regen_images.py

【入力】
  画像/再生成_20260531/XXXXX.png

【出力】
  images/characters/F/XXXXX.webp
  images/characters/M/XXXXX.webp
"""

import os
import sys
import json
import numpy as np
from PIL import Image
from collections import deque

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE_DIR = os.path.join(BASE_DIR, "画像", "再生成_20260531")
F_DIR = os.path.join(BASE_DIR, "images", "characters", "F")
M_DIR = os.path.join(BASE_DIR, "images", "characters", "M")
LOG_FILE = os.path.join(SOURCE_DIR, "process_log.json")

TARGET_W, TARGET_H = 1000, 700
WEBP_QUALITY = 90
TRIM_PADDING = 16  # トリム後に追加する均一パディング(px)

# 白背景判定の閾値
WHITE_THRESHOLD = 240  # RGB各値がこれ以上なら「白」
FLOOD_TOLERANCE = 20   # flood fill の許容誤差

# ===== CLIP_TYPE 設定 =====
CLIP_TYPE = {}

for code in [
    "11511", "13151", "15353", "31513", "33115", "33553",
    "51111", "51113", "51151", "51315", "51353", "51355",
    "51515", "51531", "51555", "53131", "53133", "53311",
    "53315", "53353", "53513", "53551", "53553", "53555",
    "55111", "55113", "55151", "55153", "55311", "55313",
    "55351", "55513", "55533", "55555",
]:
    CLIP_TYPE[code] = "both"

for code in [
    "11533", "11551", "11553", "31511", "31531", "31551",
    "33133", "33331", "33513", "33515", "51155", "51311",
    "51331", "51551", "53115", "53151", "53313", "53335",
    "55155", "55553",
]:
    CLIP_TYPE[code] = "F"

for code in [
    "15331", "33533", "35553", "51351", "51553", "53511", "55315",
]:
    CLIP_TYPE[code] = "M"
# ==========================


def remove_white_background(img):
    """
    角からflood fillで白背景を透明化。
    キャラ内部の白は残す。
    """
    arr = np.array(img)
    if arr.shape[2] < 4:
        # RGBAに変換
        img = img.convert("RGBA")
        arr = np.array(img)

    h, w = arr.shape[:2]
    alpha = arr[:, :, 3].copy()
    rgb = arr[:, :, :3]

    # 既に背景が透明ならスキップ
    corners = [
        alpha[0, 0], alpha[0, w-1],
        alpha[h-1, 0], alpha[h-1, w-1]
    ]
    if sum(corners) / 4 < 50:
        return img

    # Flood fill用の訪問済みマスク
    visited = np.zeros((h, w), dtype=bool)
    bg_mask = np.zeros((h, w), dtype=bool)

    # BFS用キュー
    queue = deque()

    # 4辺の全ピクセルを開始点に（確実にエッジから埋める）
    for x in range(w):
        queue.append((0, x))         # 上辺
        queue.append((h - 1, x))     # 下辺
    for y in range(h):
        queue.append((y, 0))         # 左辺
        queue.append((y, w - 1))     # 右辺

    while queue:
        y, x = queue.popleft()
        if visited[y, x]:
            continue
        visited[y, x] = True

        r, g, b = int(rgb[y, x, 0]), int(rgb[y, x, 1]), int(rgb[y, x, 2])

        # 白またはそれに近い色かチェック
        if r >= WHITE_THRESHOLD - FLOOD_TOLERANCE and \
           g >= WHITE_THRESHOLD - FLOOD_TOLERANCE and \
           b >= WHITE_THRESHOLD - FLOOD_TOLERANCE and \
           abs(r - g) <= FLOOD_TOLERANCE and \
           abs(g - b) <= FLOOD_TOLERANCE:

            bg_mask[y, x] = True
            # 隣接ピクセルをキューに追加
            for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                    queue.append((ny, nx))

    # 背景ピクセルを透明に
    alpha[bg_mask] = 0
    arr[:, :, 3] = alpha

    return Image.fromarray(arr, "RGBA")


def resize_to_target(img):
    """アスペクト比を維持しつつ1000×700にフィット（余白は透明）"""
    w, h = img.size
    scale = min(TARGET_W / w, TARGET_H / h)
    new_w = int(w * scale)
    new_h = int(h * scale)

    img_resized = img.resize((new_w, new_h), Image.LANCZOS)

    # 中央配置のキャンバス
    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
    offset_x = (TARGET_W - new_w) // 2
    offset_y = (TARGET_H - new_h) // 2
    canvas.paste(img_resized, (offset_x, offset_y), img_resized)

    return canvas


def find_split_x(img):
    """アルファチャンネルの隙間から分割位置を検出"""
    arr = np.array(img)
    alpha = arr[:, :, 3]
    w = alpha.shape[1]

    # 中央付近（30%〜70%）の透明な縦列を探す
    center_start = int(w * 0.30)
    center_end = int(w * 0.70)
    region = alpha[:, center_start:center_end]

    col_alpha = region.mean(axis=0)
    min_idx = int(np.argmin(col_alpha))
    split_x = center_start + min_idx

    # 隙間がない場合は中央分割
    if col_alpha[min_idx] > 100:
        split_x = w // 2

    return split_x


def trim_to_content(img, padding=TRIM_PADDING):
    """透明余白を4隅からトリム → 均一パディングを追加"""
    arr = np.array(img)
    alpha = arr[:, :, 3]

    # コンテンツのバウンディングボックス
    rows = np.any(alpha > 0, axis=1)
    cols = np.any(alpha > 0, axis=0)

    if not rows.any() or not cols.any():
        return img  # 完全に透明ならそのまま

    y_min, y_max = np.where(rows)[0][[0, -1]]
    x_min, x_max = np.where(cols)[0][[0, -1]]

    # トリム
    trimmed = img.crop((x_min, y_min, x_max + 1, y_max + 1))

    # 均一パディングを追加
    w, h = trimmed.size
    canvas = Image.new("RGBA", (w + padding * 2, h + padding * 2), (0, 0, 0, 0))
    canvas.paste(trimmed, (padding, padding), trimmed)

    return canvas


def process_image(code):
    """1コード分の処理: 背景透明化→リサイズ→分割→トリム→保存"""
    src = os.path.join(SOURCE_DIR, f"{code}.png")
    if not os.path.exists(src):
        print(f"  [スキップ] {code}.png が見つかりません")
        return None

    clip = CLIP_TYPE.get(code, "both")

    # 1. 背景透明化
    img = Image.open(src).convert("RGBA")
    w0, h0 = img.size
    img = remove_white_background(img)

    # 2. リサイズ
    img = resize_to_target(img)

    # 3. 分割位置検出
    split_x = find_split_x(img)

    result = {
        "code": code,
        "clip": clip,
        "original_size": f"{w0}x{h0}",
        "split_x": split_x,
    }

    # 4. 分割 & トリム & 保存
    if clip in ("both", "F"):
        f_img = img.crop((0, 0, split_x, TARGET_H))
        f_img = trim_to_content(f_img)
        f_path = os.path.join(F_DIR, f"{code}.webp")
        f_img.save(f_path, "WEBP", quality=WEBP_QUALITY)
        result["F_size"] = str(f_img.size)
        result["F_file"] = os.path.getsize(f_path)

    if clip in ("both", "M"):
        m_img = img.crop((split_x, 0, TARGET_W, TARGET_H))
        m_img = trim_to_content(m_img)
        m_path = os.path.join(M_DIR, f"{code}.webp")
        m_img.save(m_path, "WEBP", quality=WEBP_QUALITY)
        result["M_size"] = str(m_img.size)
        result["M_file"] = os.path.getsize(m_path)

    print(f"  {code}: {w0}x{h0} → split@{split_x} clip={clip}"
          + (f" F={result.get('F_size','')}" if 'F_size' in result else "")
          + (f" M={result.get('M_size','')}" if 'M_size' in result else ""))

    return result


def main():
    print("=" * 60)
    print("再生成画像 一括処理: 背景透明化→リサイズ→分割→WebP")
    print("=" * 60)
    print(f"入力: {SOURCE_DIR}")
    print(f"出力: {F_DIR}")
    print(f"      {M_DIR}")
    print(f"ターゲット: {TARGET_W}x{TARGET_H}")
    print()

    codes = sorted(CLIP_TYPE.keys())
    print(f"対象: {len(codes)}コード\n")

    log = []
    success = 0
    skipped = 0

    for code in codes:
        result = process_image(code)
        if result:
            log.append(result)
            success += 1
        else:
            skipped += 1

    # ログ保存
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(log, f, ensure_ascii=False, indent=2)

    # 合計ファイルサイズ
    total_f = sum(r.get("F_file", 0) for r in log)
    total_m = sum(r.get("M_file", 0) for r in log)

    print()
    print("=" * 60)
    print(f"完了: 成功={success}  スキップ={skipped}")
    print(f"F/ 合計: {total_f/1024:.0f}KB")
    print(f"M/ 合計: {total_m/1024:.0f}KB")
    print(f"ログ: {LOG_FILE}")
    print()
    print("次のステップ:")
    print("  ブラウザで character_review.html を開いて確認")
    print("  問題なければ git add / commit / push")
    print("=" * 60)


if __name__ == "__main__":
    main()
