// 243パターン全プロンプト生成スクリプト（日本語版・男性・女性同時生成）

const fs = require('fs');

// 服装決定関数（日本語）
function getOutfit(O, C, E, A, N) {
    // Cによる整い方
    const neatness = C === 1 ? "だらしない服装、ボタンを外した、皺だらけ、サイズが合っていない" :
                      C === 3 ? "普通に手入れされた服装、平均的な清潔感" :
                                  "綺麗に整えられた服装、アイロンがけ完璧、皺なし、サイズがぴったり、身だしなみ整っている";

    // Nによる雰囲気
    const atmosphere = N === 1 ? "柔らかいリラックスした質感、落ち着いた雰囲気" :
                           N === 3 ? "普通の雰囲気" :
                                       "乱れた雰囲気、だらしない印象、着崩している";

    // Eによる色彩
    const color = E === 1 ? "落ち着いた色（黒、ネイビー、グレー、茶色）、控えめな色使い" :
                     E === 3 ? "普通の色使い" :
                                 "明るく鮮やかな色、大胆なカラフル";

    // Aによる印象
    const impression = A === 1 ? "鋭く、暗く、近寄りがたい印象" :
                           A === 3 ? "普通の印象" :
                                       "柔らかく、優しく、親しみやすい印象";

    // Oによるスタイル
    const style = O === 1 ? "伝統的で保守的、ベーシックなスタイル" :
                      O === 3 ? "現代的でトレンドを意識したスタイル" :
                                  "個性的でアーティスティック、エキセントリックなスタイル";

    return `${neatness}、${color}の服で${impression}、${atmosphere}、${style}`;
}

// 髪型決定関数（日本語）
function getHair(E, N, O) {
    // ボリューム
    const volume = E === 1 ? "控えめでボリュームのない髪" :
                     E === 3 ? "普通のボリューム" :
                                 "ボリュームたっぷりでエネルギッシュな髪";

    // 雰囲気
    const hairAtmosphere = N === 1 ? "柔らかく落ち着いた清潔感" :
                            N === 3 ? "普通の雰囲気" :
                                        "無造作で乱れた、寝癖がある";

    // スタイル
    const hairStyle = O === 1 ? "伝統的で保守的な髪型" :
                      O === 3 ? "現代的な髪型" :
                                  "個性的でアーティスティックな髪型";

    return {
        base: `${volume}、${hairAtmosphere}、${hairStyle}`,
        male: "短髪",
        female: "顎丈のボブかロング、セミロング"
    };
}

// アクセサリー決定関数（日本語）
function getAccessories(C) {
    return C === 1 ? "アクセサリーなし、または適当につけている" :
           C === 3 ? "時々アクセサリーをつけている" :
                       "常にアクセサリーをつけている（腕時計、眼鏡、ブレスレットなど）";
}

// 背景色決定関数（日本語）
function getBackground(O, C, E, A, N) {
    const traits = [
        { val: O, name: '開放性', color5: '紫' },
        { val: C, name: '誠実性', color5: '青' },
        { val: E, name: '外向性', color5: 'オレンジ' },
        { val: A, name: '協調性', color5: 'ピンク' },
        { val: N, name: '安定性', color5: 'シアン' }
    ];

    // 最も極端な値を持つ要素を探す
    let maxDiff = 0;
    let dominantIndex = 0;
    traits.forEach((t, i) => {
        const diff = Math.abs(t.val - 3);
        if (diff > maxDiff) {
            maxDiff = diff;
            dominantIndex = i;
        }
    });

    const dominant = traits[dominantIndex];
    if (dominant.val === 5) {
        return `${dominant.color5}のグラデーション背景（${dominant.name}を象徴）`;
    }
    return 'ネイビーのグラデーション背景';
}

// 顔の表情生成（日本語）
function getFace(N, E, A) {
    // Nによるベース表情
    const nFace = N === 1 ? "リラックスした表情、眉間のシワなし、穏やかな目、口角が自然に少し上がっている、安らぎの表情" :
                  N === 3 ? "中立的な表情、目も口も特に特徴なし、何の感情も読み取れない顔、普通" :
                              "眉間に深いシワ、口角が下がる、目に不安と緊張が見える、苦しそうで不安な表情";

    // Eによる目の特徴
    const eFace = E === 1 ? "目が伏せがちで目線が下や遠く、口が閉じている、静かで控えめな雰囲気" :
                  E === 3 ? "普通の大きさの目で前を向いている、中立的な口元" :
                              "大きく輝く目、口角が上がった明るい笑顔、エネルギーに満ちた活き活きした雰囲気";

    // Aによる全体的印象
    const aFace = A === 1 ? "鋭く強い眼差し、近寄りがたい印象" :
                  A === 3 ? "特徴のない印象、どちらとも言えない" :
                              "柔らかく優しい目、親しみやすいフレンドリーな印象";

    return `${nFace}、${eFace}、${aFace}`;
}

// ポーズ生成（日本語）
function getPose(O, C) {
    const oPose = O === 1 ? "腕を組んで防御的な姿勢" :
                  O === 3 ? "両手が自然に下に落ちている" :
                              "両腕を広げている";

    const cPose = C === 1 ? "、猫背で肩が前に出ている、背中が丸まっている" :
                  C === 3 ? "、背筋は普通、肩の位置も普通、平均的な立ち姿" :
                              "、背筋がピンと伸びている、肩が真っ直ぐ、姿勢が完璧に整っている";

    const direction = O === 1 ? "、視線が下、閉じた防御的な姿勢" :
                     O === 3 ? "、前を向いている" :
                                 "、視線が上または遠く、好奇心や热情に満ちた姿勢";

    return `${oPose}${cPose}${direction}`;
}

// キャラクター雰囲気生成（日本語）
function getVibe(N, E, A, O, C) {
    const traits = [];
    if (N === 1) traits.push("落ち着いている", "安らいでいる");
    else if (N === 5) traits.push("不安", "緊張");
    else traits.push("普通");

    if (E === 1) traits.push("静か", "控えめ");
    else if (E === 5) traits.push("エネルギッシュ", "明るい");

    if (A === 1) traits.push("警戒心が強い", "近寄りがたい");
    else if (A === 5) traits.push("優しい", "親しみやすい");

    if (O === 1) traits.push("保守的", "伝統的");
    else if (O === 5) traits.push("好奇心旺盛", "柔軟");

    if (C === 1) traits.push("無頑着", "雑");
    else if (C === 5) traits.push("几帳面", "整理整頓されている");

    return traits.join("、");
}

// タイプコードから名前を生成
function getTypeName(typeCode) {
    const [O, C, E, A, N] = typeCode.split('').map(Number);

    // 主要な特徴を判断
    let features = [];

    if (O === 1) features.push("保守的");
    else if (O === 5) features.push("開放的");

    if (C === 1) features.push("無頑着");
    else if (C === 5) features.push("几帳面");

    if (E === 1) features.push("内向的");
    else if (E === 5) features.push("外向的");

    if (A === 1) features.push("非協調");
    else if (A === 5) features.push("協調的");

    if (N === 1) features.push("安定");
    else if (N === 5) features.push("不安");

    // 特徴が多すぎる場合は省略
    if (features.length === 0) return "普通タイプ";
    if (features.length <= 2) return features.join("・");
    return features[0] + "・" + features[1];
}

// 全243パターン生成
const allPatterns = [];
for (let faceNo = 1; faceNo <= 27; faceNo++) {
    const N = faceNo <= 9 ? 1 : faceNo <= 18 ? 3 : 5;
    const E_mod = (faceNo - 1) % 9;
    const E = E_mod < 3 ? 1 : E_mod < 6 ? 3 : 5;
    const A_mod = ((faceNo - 1) % 9) % 3;
    const A = A_mod === 0 ? 1 : A_mod === 1 ? 3 : 5;

    for (let poseNo = 1; poseNo <= 9; poseNo++) {
        const O_mod = (poseNo - 1) % 3;
        const O = O_mod === 0 ? 1 : O_mod === 1 ? 3 : 5;
        const C_mod = Math.floor((poseNo - 1) / 3);
        const C = C_mod === 0 ? 1 : C_mod === 1 ? 3 : 5;

        const totalNo = (faceNo - 1) * 9 + poseNo;
        const typeCode = `${O}${C}${E}${A}${N}`;

        allPatterns.push({ totalNo, typeCode, O, C, E, A, N, faceNo });
    }
}

// プロンプト生成関数（独立プロンプト形式・参考画像対応）
function generatePrompt(pattern) {
    const face = getFace(pattern.N, pattern.E, pattern.A);
    const pose = getPose(pattern.O, pattern.C);
    const hair = getHair(pattern.E, pattern.N, pattern.O);
    const clothing = getOutfit(pattern.O, pattern.C, pattern.E, pattern.A, pattern.N);
    const accessories = getAccessories(pattern.C);
    const background = getBackground(pattern.O, pattern.C, pattern.E, pattern.A, pattern.N);
    const vibe = getVibe(pattern.N, pattern.E, pattern.A, pattern.O, pattern.C);
    const typeName = getTypeName(pattern.typeCode);

    return `### ${pattern.totalNo}. ${typeName}（${pattern.typeCode}）

以下の説明から画像を作成してください。参考画像の髪型・服装・色はコピーしないでください。以下に書かれた髪型・服装・色・表情を優先してください。参考画像は2体の配置バランスだけを参考にしてください。アニメ風キャラクター（男性と女性）を2体、間を十分に空けて並べて描いてください。左が女性キャラ、右が男性キャラ。正面向き。2体とも以下の特徴を持っています。

**顔の表情**: ${face}

**ポーズ**: ${pose}

**髪型**: 女性は${hair.female}、${hair.base}。男性は${hair.male}、${hair.base}。

**服装**: ${clothing}

**アクセサリー**: ${accessories}

**背景**: ${background}

**スタイル**: クリーンなアニメイラスト風、プロフェッショナルなキャラクターデザイン、高品質、鮮やかな色、柔らかい陰影、シンプルな単色背景。

**キャラクターの雰囲気**: ${vibe}。

2体とも色使いと服装の雰囲気は共通。参考画像と同じ髪型や服装にはしないでください。

---

`;
}

// ファイル出力
const parts = [];
const patternsPerFile = 20;

for (let i = 0; i < allPatterns.length; i += patternsPerFile) {
    const partPatterns = allPatterns.slice(i, i + patternsPerFile);
    const partNum = Math.floor(i / patternsPerFile) + 1;

    let content = `# ビッグファイブ診断 キャラクター画像生成プロンプト Part ${partNum}\n\n`;
    content += `> 総No.${partPatterns[0].totalNo}-${partPatterns[partPatterns.length-1].totalNo}\n\n`;
    content += `---\n\n`;
    content += `## 使い方\n\n`;
    content += `各プロンプトをコピーして画像生成AIに入力してください。\n`;
    content += `1回の生成で男性と女性が並んだ画像が2体描かれます。\n`;
    content += `生成後、画像編集ソフトなどで半分に切り離してください。\n\n`;
    content += `## 生成時のコツ\n\n`;
    content += `- **参考画像必須：** プロンプトと一緒に \`画像/決定モデル.png\` を貼り付ける（テイスト・バランス維持のため）\n`;
    content += `- 参考画像なしではテイスト・バランスが崩れるため、必ず貼り付けてください\n`;
    content += `---\n\n`;

    partPatterns.forEach(pattern => {
        content += generatePrompt(pattern);
    });

    parts.push({ partNum, content });
}

// ファイル書き出し
parts.forEach(part => {
    fs.writeFileSync(`キャラクター画像生成プロンプト_Part${String(part.partNum).padStart(2, '0')}.md`, part.content);
    console.log(`SUCCESS: Part ${part.partNum} created`);
});

console.log('ALL PARTS CREATED SUCCESSFULLY');
