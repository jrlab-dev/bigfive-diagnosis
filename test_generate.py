"""
ビッグファイブ キャラクター画像テスト生成
対象: 31111（無頑着・内向的）
モデル: gpt-image-1 / quality: medium
"""

import os
import base64
from openai import OpenAI

API_KEY = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY)

PROMPT = """Create two chibi characters in Nendoroid / Q-version / Super Deformed (SD) style. High quality professional anime illustration. Clean cel-shaded art with soft glossy highlights and smooth shadows. Vibrant colors. Game icon quality.

Place the two 2.5-head-tall chibi characters side by side with enough space between them. Left is female, right is male. Both facing front. Large head, small rounded body silhouette. Legs are extremely short, less than half the head height.

EYES (critical): Eyes must have a clearly visible white sclera. Large white area of the eye is visible. The iris/pupil is a colored circle sitting inside the white. Female character has slightly emphasized eyelashes. Male character has slightly thicker eyebrows. Otherwise gender differences are minimal and androgynous.

Nose is just a dot or tiny shadow. Arms and legs are short and rounded. Body height is about 1.5x the head. Simple clean lineart. Transparent background. Not a school uniform. Not students. Both characters share the same color palette and clothing vibe.

**Expression**: relaxed expression, no frown lines, calm gentle eyes, mouth corners naturally slightly raised, peaceful expression, eyes slightly downcast or gazing into the distance, mouth closed, quiet reserved atmosphere, sharp strong gaze, unapproachable impression

**Pose**: both hands hanging naturally at sides, slightly hunched with shoulders forward, back curved, facing forward

**Hair**: Female — jaw-length bob or long/semi-long hair, low volume understated hair, soft calm clean appearance, modern contemporary hairstyle. Male — short hair, low volume understated hair, soft calm clean appearance, modern contemporary hairstyle.

**Clothing**: slightly messy clothing, unbuttoned, wrinkled, ill-fitting, muted colors (black, navy, grey, brown), understated clothing giving a sharp, dark, unapproachable impression, soft relaxed texture, calm atmosphere, modern trend-conscious style

**Accessories**: no accessories, or casually wearing some

**Style**: clean anime illustration style, professional character design, high quality, vibrant colors, soft shading, transparent background.

**Character vibe**: calm, at ease with oneself, quiet, reserved, guarded, unapproachable, easygoing, casual.

Both characters share the same color palette and clothing vibe."""

OUTPUT_PATH = r"C:\Users\user\Desktop\Claude Code\ウェブサイト\あそびラボ_プロジェクト\ビックファイブ診断サイト\画像\キャラクター（商用利用可）\31111.png"

print("生成開始: 31111（無頑着・内向的）")
print("モデル: gpt-image-1 / quality: medium")

response = client.images.generate(
    model="gpt-image-1",
    prompt=PROMPT,
    n=1,
    size="1024x1024",
    quality="medium"
)

image_data = base64.b64decode(response.data[0].b64_json)

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
with open(OUTPUT_PATH, "wb") as f:
    f.write(image_data)

print(f"保存完了: {OUTPUT_PATH}")
print(f"ファイルサイズ: {len(image_data):,} bytes")
