"""
透明の「穴」修正スクリプト v2
- 小さい穴（歯など）だけ白で塗りつぶす
- 大きい隙間（股・腕の間など）は透明のまま
"""

from PIL import Image
import numpy as np
from scipy import ndimage

INPUT_PATH = r"G:\マイドライブ\Claude Code\ウェブサイト\あそびラボ_プロジェクト\ビックファイブ診断サイト\画像\隠しキャラ_テスト_ルフィ2.png"
OUTPUT_PATH = r"G:\マイドライブ\Claude Code\ウェブサイト\あそびラボ_プロジェクト\ビックファイブ診断サイト\画像\隠しキャラ_テスト_ルフィ2_fixed.png"

# 小さい穴とみなすピクセル数の上限（これより大きい穴は透明のまま）
MAX_HOLE_SIZE = 800

img = Image.open(INPUT_PATH).convert("RGBA")
data = np.array(img)

alpha = data[:, :, 3]
is_transparent = alpha == 0

# 全ての透明領域をラベリング
labeled, num_features = ndimage.label(is_transparent)

# 端に接しているラベルを「外側の背景」として記録
background_labels = set()
background_labels.update(labeled[0, :].tolist())
background_labels.update(labeled[-1, :].tolist())
background_labels.update(labeled[:, 0].tolist())
background_labels.update(labeled[:, -1].tolist())
background_labels.discard(0)

print(f"透明領域の数: {num_features}")

result = data.copy()
filled_count = 0
skipped_count = 0

for label_id in range(1, num_features + 1):
    region = labeled == label_id
    size = np.sum(region)

    if label_id in background_labels:
        # 外側の背景 → 透明のまま
        continue
    elif size <= MAX_HOLE_SIZE:
        # 小さい内部穴 → 白で塗りつぶす
        result[region] = [255, 255, 255, 255]
        filled_count += size
        print(f"  穴#{label_id}: {size}px → 白に塗りつぶし")
    else:
        # 大きい内部隙間 → 透明のまま
        skipped_count += size
        print(f"  穴#{label_id}: {size}px → 大きすぎるためスキップ（透明のまま）")

output_img = Image.fromarray(result, "RGBA")
output_img.save(OUTPUT_PATH)

print(f"\n完了: {filled_count}px 白に変換 / {skipped_count}px 透明のまま")
print(f"保存先: {OUTPUT_PATH}")
