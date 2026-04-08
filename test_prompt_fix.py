"""
プロンプト修正テスト - 1枚だけ生成して余白・見切れを確認
キャラ: 31111（無頑着・内向的）
"""

import os
import base64
from openai import OpenAI

API_KEY = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(BASE_DIR, "画像", "キャラクター（商用利用可）", "test_prompt_fix_31111.png")

# ★修正版プロンプト（余白・全身表示の制約を追加）
PROMPT = """Create two chibi characters in Nendoroid / Q-version / Super Deformed (SD) style. High quality professional anime illustration. Clean cel-shaded art with soft glossy highlights and smooth shadows. Vibrant colors. Game icon quality.

Place the two 2.5-head-tall chibi characters side by side with enough space between them. Left is female, right is male. Both facing front. Large head, small rounded body silhouette. Legs are extremely short, less than half the head height. Both characters must be fully visible from head to toe within the canvas. Leave at least 15% empty margin on all four sides (top, bottom, left, right). Characters together should occupy no more than 65% of the canvas height. Do not crop or cut off any part of either character.

EYES (critical): Eyes must have a clearly visible white sclera. Large white area of the eye is visible. The iris/pupil is a colored circle sitting inside the white. Female character has slightly emphasized eyelashes. Male character has slightly thicker eyebrows. Otherwise gender differences are minimal and androgynous.

Nose is just a dot or tiny shadow. Arms and legs are short and rounded. Body height is about 1.5x the head. Simple clean lineart. Transparent background. Not a school uniform. Not students. Both characters share the same color palette and clothing vibe.

**Expression**: relaxed expression, no frown lines, calm gentle eyes, mouth corners naturally slightly raised, peaceful expression, eyes slightly downcast or gazing into the distance, mouth closed, quiet reserved atmosphere

**Pose**: both hands hanging naturally at sides, slightly hunched with shoulders forward, back curved, facing forward

**Hair**: Female — jaw-length bob or long/semi-long hair, low volume understated hair, soft calm clean appearance, modern contemporary hairstyle. Male — short hair, low volume understated hair, soft calm clean appearance, modern contemporary hairstyle.

**Clothing**: slightly messy clothing, unbuttoned, wrinkled, ill-fitting, muted colors (black, navy, grey, brown), understated clothing giving a sharp, dark, unapproachable impression, soft relaxed texture, calm atmosphere, modern trend-conscious style

**Accessories**: no accessories, or casually wearing some

**Style**: clean anime illustration style, professional character design, high quality, vibrant colors, soft shading, simple solid color background.

**Character vibe**: calm, at ease with silence, quiet, reserved, guarded, unapproachable, easygoing, casual.

Both characters share the same color palette and clothing vibe."""

print("生成中... (約30秒)")
response = client.images.generate(
    model="gpt-image-1",
    prompt=PROMPT,
    n=1,
    size="1024x1024",
    quality="medium"
)
image_data = base64.b64decode(response.data[0].b64_json)
with open(OUT_PATH, "wb") as f:
    f.write(image_data)

print(f"保存完了: {OUT_PATH}")
print("→ 画像を確認してください。全身が見えていて上下に余白があればOKです。")
