"""
全243プロンプトを英語に変換して5つのMDファイルに書き出すスクリプト
"""
import re, os

PROMPT_DIR = "G:/マイドライブ/Claude Code/ウェブサイト/あそびラボ_プロジェクト/ビックファイブ診断サイト/キャラクター作成データ"
OUTPUT_DIR = PROMPT_DIR

ENGLISH_BASE = """Create two chibi characters in Nendoroid / Q-version / Super Deformed (SD) style. High quality professional anime illustration. Clean cel-shaded art with soft glossy highlights and smooth shadows. Vibrant colors. Game icon quality.

Place the two 2.5-head-tall chibi characters side by side with enough space between them. Left is female, right is male. Both facing front. Large head, small rounded body silhouette. Legs are extremely short, less than half the head height.

EYES (critical): Eyes must have a clearly visible white sclera. Large white area of the eye is visible. The iris/pupil is a colored circle sitting inside the white. Female character has slightly emphasized eyelashes. Male character has slightly thicker eyebrows. Otherwise gender differences are minimal and androgynous.

Nose is just a dot or tiny shadow. Arms and legs are short and rounded. Body height is about 1.5x the head. Simple clean lineart. Transparent background. Not a school uniform. Not students. Both characters share the same color palette and clothing vibe.

"""

SECTION_KEYS = {
    "顔の表情": "Expression",
    "ポーズ": "Pose",
    "髪型": "Hair",
    "服装": "Clothing",
    "アクセサリー": "Accessories",
    "スタイル": "Style",
    "キャラクターの雰囲気": "Character vibe",
}

# ========== 翻訳辞書 ==========
TRANS = {
    # --- 表情共通 ---
    "リラックスした表情": "relaxed expression",
    "眉間のシワなし": "no frown lines",
    "穏やかな目": "calm gentle eyes",
    "口角が自然に少し上がっている": "mouth corners naturally slightly raised",
    "安らぎの表情": "peaceful expression",
    "目が伏せがちで目線が下や遠く": "eyes slightly downcast or gazing into the distance",
    "口が閉じている": "mouth closed",
    "静かで控えめな雰囲気": "quiet reserved atmosphere",
    "鋭く強い眼差し": "sharp strong gaze",
    "近寄りがたい印象": "unapproachable impression",
    # N5（不安定）
    "眉間に深いシワ": "deep frown lines between brows",
    "口角が下がっている": "mouth corners turned down",
    "口角が下がる": "mouth corners turned down",
    "目に不安と緊張が見える": "eyes showing anxiety and tension",
    "全体的に苦しそうな表情": "overall strained anxious expression",
    "不安": "anxiety",
    "緊張": "tension",
    "苦しそうで不安な表情": "pained and anxious expression",
    "苦しそう": "pained",
    "眉間にシワが寄り": "brows furrowed",
    "表情に深みがある": "expression with depth",
    # E5（外向型）
    "目が大きく輝いている": "eyes wide and sparkling",
    "口角が上がった笑顔": "bright smile with raised mouth corners",
    "エネルギーに満ちた活き活きした表情": "energetic lively expression",
    "大きく輝く目": "large bright eyes",
    "口角が上がった": "corners of mouth raised",
    "笑顔": "smile",
    "エネルギーに満ちた活き活きした雰囲気": "energetic lively atmosphere",
    # E3（普通）
    "中立的な表情": "neutral expression",
    "目も口も特に特徴なし": "eyes and mouth without particular features",
    "何の感情も読み取れない顔": "face showing no particular emotion",
    "普通の表情": "ordinary expression",
    "中立的な口元": "neutral mouth expression",
    "普通": "ordinary",
    "特徴のない印象": "unremarkable impression",
    "どちらとも言えない": "neutral",
    "普通のボリューム": "ordinary volume",
    "普通の大きさの目で": "ordinary-sized eyes facing",
    "普通の大きさの目": "ordinary-sized eyes",
    "普通の雰囲気": "ordinary atmosphere",
    "普通に手入れされた服装": "ordinarily maintained clothing",
    "すっきり短髪": "clean short hair",
    # A5（協調型）
    "柔らかく優しい目": "soft gentle eyes",
    "親しみやすいフレンドリーな印象": "friendly approachable impression",
    "目が柔らかい": "soft eyes",
    "眉が上がっている": "eyebrows slightly raised",
    "口元が穏やかな微笑み": "gentle smile",
    "誰にでも好かれそうな印象": "impression of being liked by everyone",
    "親しみやすい": "friendly",
    "親しみやすい印象": "friendly impression",
    "親しみやすい": "approachable",
    # A1（非協調型）
    "目つきが鋭い": "sharp piercing eyes",
    "眉が下がっている": "eyebrows lowered",
    "口が引き結ばれている": "lips pressed together",
    # 普通の目
    "普通の大きさの目": "normal-sized eyes",
    "目線は正面": "gaze facing forward",
    "普通の口元": "neutral mouth",
    "特に目立たない顔": "unremarkable face",

    # --- ポーズ ---
    # O1（保守的）
    "腕を組んで防御的な姿勢": "arms crossed in a defensive posture",
    "猫背で肩が前に出ている": "slightly hunched with shoulders forward",
    "背中が丸まっている": "back curved",
    "視線が下": "gaze downward",
    "閉じた防御的な姿勢": "closed-off defensive stance",
    "背筋は普通": "posture is ordinary",
    "背筋は": "posture is",
    "肩の位置も普通": "shoulders at ordinary position",
    "肩の位置も": "shoulders also",
    # O3（普通）
    "両手が自然に下に落ちている": "both hands hanging naturally at sides",
    "体はまっすぐ": "body straight",
    "視線は正面": "gaze facing forward",
    "何の特徴もない立ち姿": "unremarkable neutral standing pose",
    "前を向いている": "facing forward",
    "背筋は普通": "normal posture",
    # O5（開放的）
    "両腕を広げている": "both arms spread wide open",
    "体が前に進み出ている": "body leaning forward eagerly",
    "視線が上または遠く": "gaze upward or into the distance",
    "好奇心や热情に満ちた姿勢": "posture full of curiosity and enthusiasm",
    "好奇心や情熱に満ちた姿勢": "posture full of curiosity and passion",
    "世界に向かって開かれた姿勢": "open posture reaching toward the world",
    # C5（几帳面）
    "背筋がピンと伸びている": "back perfectly straight and upright",
    "肩が真っ直ぐ": "shoulders perfectly level",
    "体が完璧にまっすぐ": "body perfectly aligned",
    "きっちりと整った姿勢": "neatly composed upright posture",
    # C1（無頑着）
    "体が傾いている": "body slightly tilted",
    "だらっとした姿勢": "slouchy relaxed posture",
    "リラックスしすぎ": "overly relaxed",
    "乱れた雰囲気": "disheveled atmosphere",
    "無造作で乱れた": "unkempt",
    "着崩": "disheveled clothes",
    "寝癖がある": "with bedhead",

    # --- 髪型 ---
    "女性は顎丈のボブかロング、セミロング": "Female — jaw-length bob or long/semi-long hair",
    "控えめでボリュームのない髪": "low volume understated hair",
    "ボリュームのない髪": "low volume hair",
    "柔らかく落ち着いた清潔感": "soft calm clean appearance",
    "女性はおでこを出したスタイル": "Female — forehead-baring style",
    "おでこを出したスタイル": "forehead-baring style",
    "男性は": "Male —",
    "男性は短髪": "Male — short hair",
    "短髪": "short hair",
    "額を完全に出した": "with fully exposed forehead",
    "額を完全に出した短髪": "short hair with fully exposed forehead",
    "普通のボリューム": "normal volume",
    "ボリュームたっぷりで": "voluminous",
    "ボリュームたっぷり": "voluminous",
    "な髪": " hair",
    "普通の雰囲気": "normal atmosphere",
    # 髪型（COMPOUND_TRANSで処理するが念のため残す）
    "オールバック、きっちりセットして額を出した髪型": "slicked-back hair with forehead fully exposed",
    "刈り上げ短髪": "tapered short hair",
    "おでこを出したアップスタイル": "updo with forehead fully visible",
    "タイトなポニーテール": "tight sleek ponytail",
    "ハーフアップ": "half-up hairstyle",
    "前髪なし": "no bangs",
    "おでこ全開のスタイル": "hairstyle with fully exposed forehead",
    "男性は短髪": "Male — short hair",
    "スポーツ選手風の短髪・刈り上げ・バズカット": "athletic short crop / tapered undercut / buzz cut",
    "スポーツ選手風の短髪": "athletic short-cropped hair",
    "刈り上げ": "tapered undercut",
    "バズカット": "buzz cut",
    "オールバック": "slicked-back hair showing forehead",

    # --- 服装 ---
    "だらしない服装": "slightly messy clothing",
    "ボタンを外した": "unbuttoned",
    "皺だらけ": "wrinkled",
    "サイズが合っていない": "ill-fitting",
    "だらしない印象": "sloppy impression",
    "普通の色使いの服で": "ordinary-colored clothing",
    "普通の色使いの服で普通の印象": "ordinary-colored clothing with normal impression",
    "普通の色使いの服": "ordinary-colored clothing",
    "大胆なカラフルの服で": "bold colorful clothing",
    "大胆なカラフルの服": "bold colorful clothing",
    "大胆なカラフルの服で普通の印象": "bold colorful clothing with normal impression",
    "落ち着いた色（黒、ネイビー、グレー、茶色）": "muted colors (black, navy, grey, brown)",
    "で": " with ",
    "な表情": " expression",
    "印象": " impression",
    "ordinaryの": "ordinary ",
    "ordinaryに": "ordinary ",
    "ordinary ボリューム": "ordinary volume",
    "ordinary 大きさの目": "ordinary-sized eyes",
    "ordinary 雰囲気": "ordinary atmosphere",
    "ordinary 手入れされた服装": "ordinarily maintained clothing",
    "ordinary 色使いの服": "ordinary-colored clothing",
    "落ち着いた色（黒、ネイビー、グレー）": "refined colors (black, navy, grey)",
    "控えめな色使いの服": "understated color clothing",
    "柔らかいリラックスした質感": "soft relaxed texture",
    "落ち着いた雰囲気": "calm atmosphere",
    "伝統的で保守的": "traditional conservative",
    "ベーシックなスタイル": "basic style",
    "現代的でトレンドを意識したスタイル": "modern trend-conscious style",
    "個性的でアーティスティック、エキセントリックなスタイル": "artistic eccentric style",
    "個性的でアーティスティックなスタイル": "artistic distinctive style",
    "きちんとした服装": "neat and tidy clothing",
    "ボタンを正しく留めた": "properly buttoned",
    "シワのない清潔な服": "wrinkle-free clean clothing",
    "サイズがぴったり合っている": "perfectly fitting",
    "整然とした印象": "orderly impression",
    "しっかりした質感": "crisp well-structured texture",
    "きちんとした印象": "neat and proper impression",
    "暗く": "dark",
    "鋭く": "sharp",
    "柔らかく": "soft",
    "優しく": "gentle",
    "明るく": "bright",
    "温かく": "warm",

    # --- アクセサリー ---
    "アクセサリーなし、または適当につけている": "no accessories, or casually wearing some",
    "アクセサリーなし": "no accessories",
    "シンプルなアクセサリー": "simple accessories",
    "機能的なアクセサリー（時計、メガネなど）": "functional accessories (watch, glasses, etc.)",
    "機能的なアクセサリー（時計など）": "functional accessories (watch etc.)",
    "個性的なアクセサリー": "distinctive accessories",
    "目立つアクセサリー": "eye-catching accessories",

    # --- スタイル ---
    "クリーンなアニメイラスト風": "clean anime illustration style",
    "プロフェッショナルなキャラクターデザイン": "professional character design",
    "高品質": "high quality",
    "鮮やかな色": "vibrant colors",
    "柔らかい陰影": "soft shading",
    "シンプルな単色背景": "simple solid color background",
    "透明背景": "transparent background",

    # --- 服装の複合フレーズ ---
    "控えめな色使いの服で鋭く、暗く、近寄りがたい印象": "understated clothing with a sharp, dark, unapproachable impression",
    "控えめな色使いの服で柔らかく、優しく、親しみやすい印象": "understated clothing with a soft, gentle, approachable impression",
    "控えめな色使いの服で明るく、温かく、フレンドリーな印象": "understated clothing with a bright, warm, friendly impression",
    "控えめな色使いの服で明るく、エネルギッシュ、目立つ印象": "understated clothing with a bright, energetic, eye-catching impression",
    "きちんとした色使いの服で鋭く、きっちりした印象": "neat clothing with a sharp, precise impression",
    "きちんとした色使いの服で柔らかく、きっちりした印象": "neat clothing with a soft, composed impression",
    "きちんとした色使いの服で明るく、きっちりした印象": "neat clothing with a bright, polished impression",

    # --- 残りパーツ語クリーンアップ ---
    "のいずれか": "",
    "されている": "",
    "している": "",
    "ポニーテール": "ponytail",
    "おだんご": "bun",
    "ツインテール": "twin tails",
    "高めポニーテール": "high ponytail",
    "額を大きく出した": "with forehead fully exposed, ",
    "額を出した": "with forehead exposed, ",
    "すっきり短髪": "clean short crop",
    "スポーツカット": "sporty cut",
    "クルーカット": "crew cut",
    "七三分け": "neatly side-parted",
    "腕時計": "watch",
    "眼鏡": "glasses",
    "ブレスレット": "bracelet",
    "など": "",
    "または": "or",
    "かつ": "and",

    # --- ポーズ（C3 普通体型補足）---
    "肩の位置も普通": "shoulders at normal position",
    "平均的な立ち姿": "average unremarkable standing posture",
    "姿勢が完璧に整っている": "posture perfectly aligned and composed",

    # --- 服装（C3 普通）---
    "普通に手入れされた服装": "normally maintained clothing",
    "平均的な清潔感": "average cleanliness",
    "普通の清潔感": "ordinary cleanliness",

    # --- アクセサリー ---
    "時々アクセサリーをつけている": "occasionally wears accessories",
    "シンプルなアクセサリーをつけている": "wearing simple accessories",
    "機能的なアクセサリーをつけている（時計、メガネなど）": "wearing functional accessories (watch, glasses, etc.)",
    "個性的なアクセサリーをつけている": "wearing distinctive accessories",
    "目立つアクセサリーをつけている": "wearing eye-catching accessories",

    # --- 髪型（C5 几帳面 おでこ出し）---
    "女性はおでこを出したスタイル（no bangs / tight sleek ponytail / half-up hairstyle / すっきりショートのいずれか）": "Female — forehead-baring style (no bangs / tight sleek ponytail / half-up / short crop)",
    "一髪乱れず清潔感": "immaculate well-groomed appearance",
    "男性はslicked-back hair showing foreheadまたは七三分け": "Male — slicked-back hair with forehead exposed, or neatly side-parted",
    "額を完全に出した短髪": "short hair with fully exposed forehead",
    "きっちり整えた清潔感": "neatly groomed clean appearance",
    "すっきりショート": "short neat crop",
    "七三分け": "neatly side-parted hair",

    # --- キャラクターの雰囲気 ---
    "好奇心旺盛": "curious and open-minded",
    "柔軟": "flexible and adaptable",
    "近寄りがたい": "unapproachable",
    "落ち着いている": "calm",
    "安らいでいる": "at ease",
    "安らい": "at ease",
    "いる": "",
    "静か": "quiet",
    "控えめ": "reserved",
    "警戒心が強い": "guarded",
    "保守的": "conservative",
    "伝統的": "traditional",
    "無頑着": "easygoing",
    "雑": "casual",
    "内向的": "introverted",
    "現代的": "modern",
    "個性的": "distinctive",
    "アーティスティック": "artistic",
    "自由奔放": "free-spirited",
    "几帳面": "meticulous",
    "きっちりした": "precise",
    "整理整頓": "organized",
    "責任感が強い": "highly responsible",
    "外向的": "extroverted",
    "明るい": "cheerful",
    "エネルギッシュ": "energetic",
    "社交的": "sociable",
    "協調的": "cooperative",
    "思いやりがある": "compassionate",
    "優しい": "gentle",
    "フレンドリー": "friendly",
    "温かい": "warm",
    "非協調的": "uncooperative",
    "自己中心的": "self-focused",
    "競争心が強い": "competitive",
    "独立心が強い": "highly independent",
    "不安定": "emotionally unstable",
    "神経質": "nervous",
    "繊細": "sensitive",
    "感情的": "emotional",
    "心配性": "worrying",
}

# 複合フレーズ（先に処理する必要があるもの）
COMPOUND_TRANS = {
    # 服装の「服でXX印象」パターン（長いフレーズを先に）
    "控えめな色使いの服で鋭く、暗く、近寄りがたい印象": "understated clothing giving a sharp, dark, unapproachable impression",
    "控えめな色使いの服で柔らかく、優しく、親しみやすい印象": "understated clothing giving a soft, gentle, approachable impression",
    "控えめな色使いの服で明るく、温かく、フレンドリーな印象": "understated clothing giving a bright, warm, friendly impression",
    "控えめな色使いの服で明るく、エネルギッシュで、目立つ印象": "understated clothing giving a bright, energetic, eye-catching impression",
    "きちんとした色使いの服で鋭く、きっちりした印象": "neat clothing giving a sharp, precise impression",
    "きちんとした色使いの服で柔らかく、きっちりした印象": "neat clothing giving a soft, composed impression",
    "きちんとした色使いの服で明るく、きっちりした印象": "neat clothing giving a bright, polished impression",
    "きちんとした色使いの服で温かく、きっちりした印象": "neat clothing giving a warm, polished impression",
    # 髪型フレーズ（な髪型ごとセット）
    "伝統的で保守的な髪型": "traditional conservative hairstyle",
    "現代的でトレンドを意識したな髪型": "modern trend-conscious hairstyle",
    "現代的な髪型": "modern contemporary hairstyle",
    "個性的でアーティスティックな髪型": "artistic and distinctive hairstyle",
    "きっちりとまとめた髪型": "neatly arranged hairstyle",
    "オールバック、きっちりセットして額を出した髪型": "slicked-back hair with forehead fully exposed",
    # 服装スタイル（な込み）
    "伝統的で保守的、ベーシックなスタイル": "traditional conservative basic style",
    "現代的でトレンドを意識したスタイル": "modern trend-conscious style",
    "個性的でアーティスティック、エキセントリックなスタイル": "artistic eccentric style",

    # C5 服装（几帳面）
    "綺麗に整えられた服装": "immaculately maintained clothing",
    "アイロンがけ完璧": "perfectly ironed",
    "皺なし": "wrinkle-free",
    "サイズがぴったり": "perfectly fitting",
    "身だしなみ整っている": "impeccable grooming",

    # C5 アクセサリー
    "常にアクセサリーをつけている（腕時計, 眼鏡, ブレスレットなど）": "always wearing accessories (watch, glasses, bracelet, etc.)",
    "常にアクセサリーをつけている": "always wearing accessories",

    # --- 残存日本語対応 ---
    "で普通の印象": " with normal impression",
    "控えめな色使いの服で普通の印象": "understated colored clothing with normal impression",
    # C5 キャラクターの雰囲気
    "整理整頓されている": "organized and tidy",

    # C5 ヘアスタイル（元の日本語テキストに合わせたキー）
    "女性はおでこを出したスタイル（前髪なし・タイトなポニーテール・ハーフアップ・すっきりショートのいずれか）、一髪乱れず清潔感、伝統的で保守的な髪型。男性はオールバックまたは七三分け、額を完全に出した短髪、きっちり整えた清潔感、伝統的で保守的な髪型。": "Female — forehead-baring style (no bangs / tight sleek ponytail / half-up / short neat crop), immaculate clean appearance, traditional conservative hairstyle. Male — slicked-back or neatly side-parted, short hair with fully exposed forehead, neatly groomed, traditional conservative hairstyle.",
    "女性はおでこを出したスタイル（前髪なし・ポニーテール・ハーフアップ・すっきりショートのいずれか）、清潔感と整った雰囲気、現代的な髪型。男性はスポーツカットまたはクルーカット（額を出したすっきり短髪）、清潔感と整った雰囲気、現代的な髪型。": "Female — forehead-baring style (no bangs / ponytail / half-up / short neat crop), clean and neat appearance, modern hairstyle. Male — sporty cut or crew cut (short and clean with exposed forehead), clean and neat appearance, modern hairstyle.",
    # No.8 (O3C5) 髪型
    "女性はおでこを出したスタイル（前髪なし・ポニーテール・ハーフアップ・すっきりショートのいずれか）、きっちり整えた清潔感、現代的な髪型。男性はスポーツカットまたはクルーカット（額を出したすっきり短髪）、きっちり整えた清潔感、現代的な髪型。": "Female — forehead-baring style (no bangs / ponytail / half-up / short neat crop), neatly groomed clean appearance, modern hairstyle. Male — sporty cut or crew cut (short and clean with exposed forehead), neatly groomed clean appearance, modern hairstyle.",
    # No.9 (O5C5) 髪型
    "女性は個性的なアップスタイル（高めポニーテール・おだんご・ツインテールのいずれか）、前髪なしで額を大きく出した独特なスタイル。男性は個性的なオールバックまたはデザイン刈り上げ、額を大きく出したアーティスティックなスタイル。": "Female — distinctive updo (high ponytail / bun / twin tails), no bangs with forehead fully exposed, unique style. Male — distinctive slicked-back or designed tapered undercut, artistic style with fully exposed forehead.",
}

def translate(text):
    result = text
    # まず複合フレーズを処理
    for jp, en in COMPOUND_TRANS.items():
        result = result.replace(jp, en)
    # 次に個別フレーズ
    for jp, en in TRANS.items():
        result = result.replace(jp, en)
    # 日本語句読点を英語に変換
    result = result.replace("、", ", ")
    result = result.replace("。", ".")
    result = result.replace("・", " / ")
    return result

def build_english_prompt(jp_prompt):
    lines = ENGLISH_BASE
    for jp_key, en_key in SECTION_KEYS.items():
        pattern = rf'\*\*{jp_key}\*\*:\s*(.+?)(?=\n\n\*\*|\n\n2体とも|\Z)'
        m = re.search(pattern, jp_prompt, re.DOTALL)
        if m:
            en_text = translate(m.group(1).strip())
            lines += f"**{en_key}**: {en_text}\n\n"
    lines += "Both characters share the same color palette and clothing vibe."
    return lines

# ========== 全プロンプト収集 ==========
all_prompts = []  # (no, code, name, en_prompt)

for i in range(1, 14):
    path = f"{PROMPT_DIR}/キャラクター画像生成プロンプト_Part{i:02d}.md"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    pattern = r'###\s+(\d+)\.\s+(.+?)（(\d{5})）\n\n(.*?)(?=\n---\n|\Z)'
    matches = re.findall(pattern, content, re.DOTALL)
    for no, name, code, jp_prompt in matches:
        en_prompt = build_english_prompt(jp_prompt.strip())
        all_prompts.append((int(no), code, name.strip(), en_prompt))

print(f"総プロンプト数: {len(all_prompts)}")

# ========== 5ファイルに分割して書き出し ==========
chunk_size = (len(all_prompts) + 4) // 5  # 切り上げ

for file_idx in range(5):
    start = file_idx * chunk_size
    end = min(start + chunk_size, len(all_prompts))
    chunk = all_prompts[start:end]
    if not chunk:
        break

    first_no = chunk[0][0]
    last_no = chunk[-1][0]
    filename = f"英語プロンプト_Part{file_idx+1:02d}_No{first_no:03d}-{last_no:03d}.md"
    filepath = os.path.join(OUTPUT_DIR, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(f"# 英語プロンプト Part {file_idx+1} (No.{first_no}〜{last_no})\n\n")
        f.write(f"> 総{len(chunk)}件\n\n---\n\n")
        for no, code, name, en_prompt in chunk:
            f.write(f"### {no}. {name}（{code}）\n\n")
            f.write(en_prompt)
            f.write("\n\n---\n\n")

    print(f"書き出し完了: {filename}  ({len(chunk)}件)")

print("\n全ファイル書き出し完了！")
