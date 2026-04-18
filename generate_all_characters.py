"""
ビッグファイブ キャラクター全量生成スクリプト
- 243体を順番に生成
- combined/ F/ M/ に自動分割保存
- 生成済みはスキップ（途中再開対応）
"""

import os
import re
import base64
import time
from openai import OpenAI
from PIL import Image
import numpy as np

API_KEY = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
COMBINED_DIR = os.path.join(BASE_DIR, "画像", "キャラクター（商用利用可）", "combined")
FEMALE_DIR   = os.path.join(BASE_DIR, "画像", "キャラクター（商用利用可）", "F")
MALE_DIR     = os.path.join(BASE_DIR, "画像", "キャラクター（商用利用可）", "M")

for d in [COMBINED_DIR, FEMALE_DIR, MALE_DIR]:
    os.makedirs(d, exist_ok=True)

PROMPT_FILES = [
    "キャラクター作成データ/英語プロンプト_Part01_No001-049.md",
    "キャラクター作成データ/英語プロンプト_Part02_No050-098.md",
    "キャラクター作成データ/英語プロンプト_Part03_No099-147.md",
    "キャラクター作成データ/英語プロンプト_Part04_No148-196.md",
    "キャラクター作成データ/英語プロンプト_Part05_No197-243.md",
]

FINGER_RULE = "\n\nFINGERS (critical): Every character must have exactly 5 fingers on each hand — thumb, index, middle, ring, and pinky. Count carefully. Never draw 4 fingers. 5 fingers per hand, no exceptions."

def load_all_prompts():
    items = []
    for path in PROMPT_FILES:
        full_path = os.path.join(BASE_DIR, path)
        with open(full_path, encoding="utf-8") as f:
            content = f.read()
        sections = re.split(r"---\s*\n", content)
        for sec in sections:
            m = re.search(r"###\s+\d+\.\s+.+?（(\d{5})）", sec)
            if m:
                code = m.group(1)
                prompt_text = re.sub(r"###.*\n", "", sec).strip()
                items.append((code, prompt_text + FINGER_RULE))
    return items

def find_split_x(img):
    arr = np.array(img)
    alpha = arr[:, :, 3]
    col_opacity = (alpha > 10).sum(axis=0)
    center_region = col_opacity[300:700]
    gap_col = int(np.argmin(center_region)) + 300
    return gap_col

def generate_and_save(code, prompt):
    combined_path = os.path.join(COMBINED_DIR, f"{code}.png")
    female_path   = os.path.join(FEMALE_DIR,   f"{code}.png")
    male_path     = os.path.join(MALE_DIR,      f"{code}.png")

    # 生成済みスキップ
    if os.path.exists(combined_path) and os.path.exists(female_path) and os.path.exists(male_path):
        print(f"  [スキップ] {code} (生成済み)")
        return True

    try:
        response = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            n=1,
            size="1024x1024",
            quality="medium"
        )
        image_data = base64.b64decode(response.data[0].b64_json)

        # combined 保存
        with open(combined_path, "wb") as f:
            f.write(image_data)

        # 分割
        img = Image.open(combined_path)
        split_x = find_split_x(img)

        female = img.crop((0, 0, split_x, 1024))
        male   = img.crop((split_x, 0, 1024, 1024))

        female.save(female_path)
        male.save(male_path)

        print(f"  [完了] {code} (分割点: x={split_x})")
        return True

    except Exception as e:
        print(f"  [エラー] {code}: {e}")
        return False

def main():
    items = load_all_prompts()
    total = len(items)
    print(f"対象: {total}体")
    print("=" * 50)

    success = 0
    skip = 0
    error = 0

    for i, (code, prompt) in enumerate(items, 1):
        combined_path = os.path.join(COMBINED_DIR, f"{code}.png")
        already_done = (
            os.path.exists(combined_path) and
            os.path.exists(os.path.join(FEMALE_DIR, f"{code}.png")) and
            os.path.exists(os.path.join(MALE_DIR,   f"{code}.png"))
        )
        print(f"[{i:3d}/{total}] {code}", end=" ")

        if already_done:
            print("→ スキップ")
            skip += 1
            continue

        result = generate_and_save(code, prompt)
        if result:
            success += 1
        else:
            error += 1

        # API制限対策：1秒待機
        time.sleep(1)

    print("=" * 50)
    print(f"完了: {success}体 / スキップ: {skip}体 / エラー: {error}体")

if __name__ == "__main__":
    main()
