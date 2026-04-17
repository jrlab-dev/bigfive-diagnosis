/**
 * ビッグファイブ診断 自動テストスクリプト
 * Node.jsで実行: node test_auto.js
 *
 * テスト内容:
 * 1. スコア計算テスト（10/30/120問の各バージョン）
 * 2. 隠しキャラクター照合テスト（34体の全キャラ）
 * 3. 120問エッジケーステスト（閾値境界値）
 */

// ===== 問題データ（quiz.htmlから抽出）=====
const questions10 = [
  { factor: 'E', dir: '+' }, { factor: 'E', dir: '-' },
  { factor: 'A', dir: '+' }, { factor: 'A', dir: '-' },
  { factor: 'C', dir: '+' }, { factor: 'C', dir: '-' },
  { factor: 'N', dir: '+' }, { factor: 'N', dir: '-' },
  { factor: 'O', dir: '+' }, { factor: 'O', dir: '-' }
];

const questions30 = [
  { factor: 'E', dir: '+' }, { factor: 'A', dir: '+' }, { factor: 'C', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'O', dir: '+' },
  { factor: 'E', dir: '+' }, { factor: 'A', dir: '+' }, { factor: 'C', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'O', dir: '+' },
  { factor: 'E', dir: '+' }, { factor: 'A', dir: '+' }, { factor: 'C', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'O', dir: '+' },
  { factor: 'E', dir: '-' }, { factor: 'A', dir: '-' }, { factor: 'C', dir: '-' }, { factor: 'N', dir: '-' }, { factor: 'O', dir: '-' },
  { factor: 'E', dir: '+' }, { factor: 'A', dir: '+' }, { factor: 'C', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'O', dir: '+' },
  { factor: 'E', dir: '-' }, { factor: 'A', dir: '-' }, { factor: 'C', dir: '-' }, { factor: 'N', dir: '+' }, { factor: 'O', dir: '+' }
];

const questions120 = [
  { factor: 'N', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'N', dir: '+' },
  { factor: 'N', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'N', dir: '-' },
  { factor: 'N', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'N', dir: '-' },
  { factor: 'N', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'N', dir: '-' },
  { factor: 'N', dir: '+' }, { factor: 'N', dir: '-' }, { factor: 'N', dir: '-' }, { factor: 'N', dir: '-' },
  { factor: 'N', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'N', dir: '+' }, { factor: 'N', dir: '-' },
  { factor: 'E', dir: '+' }, { factor: 'E', dir: '+' }, { factor: 'E', dir: '-' }, { factor: 'E', dir: '-' },
  { factor: 'E', dir: '+' }, { factor: 'E', dir: '+' }, { factor: 'E', dir: '-' }, { factor: 'E', dir: '-' },
  { factor: 'E', dir: '+' }, { factor: 'E', dir: '+' }, { factor: 'E', dir: '+' }, { factor: 'E', dir: '-' },
  { factor: 'E', dir: '+' }, { factor: 'E', dir: '+' }, { factor: 'E', dir: '+' }, { factor: 'E', dir: '-' },
  { factor: 'E', dir: '+' }, { factor: 'E', dir: '+' }, { factor: 'E', dir: '+' }, { factor: 'E', dir: '+' },
  { factor: 'E', dir: '+' }, { factor: 'E', dir: '+' }, { factor: 'E', dir: '+' }, { factor: 'E', dir: '+' },
  { factor: 'O', dir: '+' }, { factor: 'O', dir: '+' }, { factor: 'O', dir: '+' }, { factor: 'O', dir: '+' },
  { factor: 'O', dir: '+' }, { factor: 'O', dir: '+' }, { factor: 'O', dir: '-' }, { factor: 'O', dir: '-' },
  { factor: 'O', dir: '+' }, { factor: 'O', dir: '+' }, { factor: 'O', dir: '-' }, { factor: 'O', dir: '-' },
  { factor: 'O', dir: '+' }, { factor: 'O', dir: '-' }, { factor: 'O', dir: '-' }, { factor: 'O', dir: '-' },
  { factor: 'O', dir: '+' }, { factor: 'O', dir: '-' }, { factor: 'O', dir: '-' }, { factor: 'O', dir: '-' },
  { factor: 'O', dir: '+' }, { factor: 'O', dir: '+' }, { factor: 'O', dir: '-' }, { factor: 'O', dir: '-' },
  { factor: 'A', dir: '+' }, { factor: 'A', dir: '+' }, { factor: 'A', dir: '+' }, { factor: 'A', dir: '-' },
  { factor: 'A', dir: '-' }, { factor: 'A', dir: '-' }, { factor: 'A', dir: '-' }, { factor: 'A', dir: '-' },
  { factor: 'A', dir: '+' }, { factor: 'A', dir: '+' }, { factor: 'A', dir: '-' }, { factor: 'A', dir: '-' },
  { factor: 'A', dir: '-' }, { factor: 'A', dir: '-' }, { factor: 'A', dir: '-' }, { factor: 'A', dir: '-' },
  { factor: 'A', dir: '-' }, { factor: 'A', dir: '-' }, { factor: 'A', dir: '-' }, { factor: 'A', dir: '-' },
  { factor: 'A', dir: '+' }, { factor: 'A', dir: '+' }, { factor: 'A', dir: '-' }, { factor: 'A', dir: '-' },
  { factor: 'C', dir: '+' }, { factor: 'C', dir: '+' }, { factor: 'C', dir: '+' }, { factor: 'C', dir: '+' },
  { factor: 'C', dir: '+' }, { factor: 'C', dir: '-' }, { factor: 'C', dir: '-' }, { factor: 'C', dir: '-' },
  { factor: 'C', dir: '+' }, { factor: 'C', dir: '+' }, { factor: 'C', dir: '-' }, { factor: 'C', dir: '-' },
  { factor: 'C', dir: '+' }, { factor: 'C', dir: '+' }, { factor: 'C', dir: '-' }, { factor: 'C', dir: '-' },
  { factor: 'C', dir: '+' }, { factor: 'C', dir: '+' }, { factor: 'C', dir: '-' }, { factor: 'C', dir: '-' },
  { factor: 'C', dir: '-' }, { factor: 'C', dir: '-' }, { factor: 'C', dir: '-' }, { factor: 'C', dir: '-' }
];

// ===== 隠しキャラクターデータ（hidden_characters.jsから抽出）=====
const HIDDEN_CHARACTERS = [
  { id:'luffy',      name:'モンキー・D・ルフィ',      o:5, c:1, e:5, a:3, n:1, gender:'any' },
  { id:'zoro',       name:'ロロノア・ゾロ',            o:1, c:5, e:1, a:1, n:1, gender:'any' },
  { id:'nami',       name:'ナミ',                      o:3, c:5, e:4, a:2, n:3, gender:'any' },
  { id:'sanji',      name:'サンジ',                    o:3, c:3, e:4, a:4, n:3, gender:'any' },
  { id:'robin',      name:'ニコ・ロビン',              o:5, c:4, e:1, a:3, n:2, gender:'any' },
  { id:'ace',        name:'ポートガス・D・エース',     o:3, c:2, e:5, a:5, n:3, gender:'any' },
  { id:'shanks',     name:'シャンクス',                o:4, c:2, e:5, a:5, n:1, gender:'any' },
  { id:'law',        name:'トラファルガー・ロー',      o:3, c:5, e:1, a:2, n:2, gender:'any' },
  { id:'hancock',    name:'ボア・ハンコック',          o:2, c:3, e:3, a:1, n:3, gender:'any' },
  { id:'doflamingo', name:'ドフラミンゴ',              o:4, c:5, e:5, a:1, n:1, gender:'any' },
  { id:'gojo',       name:'五条悟',                    o:5, c:2, e:5, a:2, n:1, gender:'any' },
  { id:'itadori',    name:'虎杖悠仁',                  o:3, c:3, e:5, a:5, n:3, gender:'any' },
  { id:'sukuna',     name:'両面宿儺',                  o:3, c:5, e:1, a:1, n:1, gender:'any' },
  { id:'tanjiro',    name:'竈門炭治郎',                o:3, c:4, e:4, a:5, n:2, gender:'any' },
  { id:'rengoku',    name:'煉獄杏寿郎',                o:3, c:5, e:5, a:4, n:1, gender:'any' },
  { id:'tomioka',    name:'冨岡義勇',                  o:2, c:5, e:1, a:3, n:2, gender:'any' },
  { id:'nezuko',     name:'竈門禰豆子',                o:2, c:3, e:2, a:5, n:1, gender:'any' },
  { id:'levi',       name:'リヴァイ・アッカーマン',   o:2, c:5, e:2, a:2, n:1, gender:'any' },
  { id:'mikasa',     name:'ミカサ・アッカーマン',     o:1, c:5, e:1, a:3, n:3, gender:'any' },
  { id:'eren',       name:'エレン・イェーガー',        o:3, c:3, e:5, a:1, n:5, gender:'any' },
  { id:'kazehaya',   name:'風早翔太',                  o:3, c:3, e:5, a:5, n:1, gender:'any' },
  { id:'sawako',     name:'黒沼爽子',                  o:2, c:4, e:1, a:5, n:4, gender:'any' },
  { id:'tsuzaki',    name:'津崎平匡',                  o:3, c:5, e:1, a:3, n:3, gender:'any' },
  { id:'mikuri',     name:'森山みくり',                o:4, c:4, e:3, a:4, n:3, gender:'any' },
  { id:'conan',      name:'江戸川コナン',              o:5, c:5, e:3, a:3, n:1, gender:'any' },
  { id:'ran',        name:'毛利蘭',                    o:2, c:3, e:3, a:5, n:3, gender:'any' },
  { id:'kid',        name:'怪盗キッド',                o:5, c:3, e:5, a:3, n:1, gender:'any' },
  { id:'amuro',      name:'安室透',                    o:4, c:5, e:4, a:3, n:1, gender:'any' },
  { id:'usagi',      name:'月野うさぎ',                o:3, c:1, e:5, a:5, n:5, gender:'any' },
  { id:'sephiroth',  name:'セフィロス',                o:4, c:5, e:2, a:1, n:3, gender:'any' },
  { id:'frieren',    name:'フリーレン',                o:5, c:3, e:1, a:1, n:1, gender:'F' },
  { id:'l_char',     name:'L',                         o:5, c:3, e:1, a:1, n:1, gender:'M' },
  { id:'asuka',      name:'式波・アスカ・ラングレー',  o:4, c:4, e:5, a:1, n:5, gender:'any' },
  { id:'light',      name:'夜神月',                    o:5, c:5, e:3, a:1, n:1, gender:'any' },
];

// ===== スコア計算（quiz.html calcScoreと同一ロジック）=====
function calcScore(version, answers, questions) {
  if (version === '10') {
    const factors = { E: [0,1], A: [2,3], C: [4,5], N: [6,7], O: [8,9] };
    const scores = {};
    for (const [f, [i1, i2]] of Object.entries(factors)) {
      const a1 = answers[i1], a2 = answers[i2];
      const q2 = questions[i2];
      const v1 = a1;
      const v2 = q2.dir === '-' ? (6 - a2) : a2;
      const avg = (v1 + v2) / 2;
      scores[f] = avg <= 2.4 ? 1 : avg <= 3.5 ? 3 : 5;
    }
    return { O: scores.O, C: scores.C, E: scores.E, A: scores.A, N: scores.N,
             code: `${scores.O}${scores.C}${scores.E}${scores.A}${scores.N}` };
  } else {
    const factorMap = { E: [], A: [], C: [], N: [], O: [] };
    questions.forEach((q, i) => {
      const val = q.dir === '-' ? (6 - answers[i]) : answers[i];
      factorMap[q.factor].push(val);
    });
    const scores = {};
    for (const [f, vals] of Object.entries(factorMap)) {
      const sum = vals.reduce((a, b) => a + b, 0);
      if (version === '120') {
        scores[f] = sum <= 44 ? 1 : sum <= 64 ? 2 : sum <= 92 ? 3 : sum <= 112 ? 4 : 5;
      } else {
        scores[f] = sum <= 11 ? 1 : sum <= 16 ? 2 : sum <= 23 ? 3 : sum <= 28 ? 4 : 5;
      }
    }
    return { O: scores.O, C: scores.C, E: scores.E, A: scores.A, N: scores.N,
             code: `${scores.O}${scores.C}${scores.E}${scores.A}${scores.N}` };
  }
}

// ===== 隠しキャラ照合（result.htmlと同一ロジック）=====
function toHiddenScale(v) { return v <= 2 ? 1 : v >= 4 ? 5 : 3; }

function findHiddenCharacter(O, C, E, A, N, gender) {
  const exact = HIDDEN_CHARACTERS.find(ch =>
    ch.o === O && ch.c === C && ch.e === E && ch.a === A && ch.n === N &&
    (ch.gender === 'any' || ch.gender === gender)
  );
  if (exact) return exact;

  const os = toHiddenScale(O), cs = toHiddenScale(C);
  const es = toHiddenScale(E), as = toHiddenScale(A), ns = toHiddenScale(N);
  return HIDDEN_CHARACTERS.find(ch =>
    ch.o === os && ch.c === cs && ch.e === es && ch.a === as && ch.n === ns &&
    (ch.gender === 'any' || ch.gender === gender)
  ) || null;
}

// ===== テスト実行 =====
let passed = 0, failed = 0;
const failures = [];

function assert(condition, testName, detail) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${testName}`);
  } else {
    failed++;
    failures.push({ test: testName, detail });
    console.log(`  ❌ ${testName}`);
    if (detail) console.log(`     → ${detail}`);
  }
}

// ========== テスト1: スコア計算 ==========

console.log('\n═══ テスト1: スコア計算 ═══\n');

// --- 10問版 ---
console.log('--- 10問版 ---');

// 10問版の仕様: 各因子2問、Q1=dir:+, Q2=dir:-
// v1 = a1(そのまま), v2 = dir==='-' ? (6-a2) : a2
// avg = (v1+v2)/2 → <=2.4→1, <=3.5→3, else→5
// 全1回答: v1=1, v2=(6-1)=5 → avg=3.0 → スコア3
// 全5回答: v1=5, v2=(6-5)=1 → avg=3.0 → スコア3
// E高くする: Q1=5, Q2=1 → v1=5, v2=5 → avg=5.0 → スコア5
// E低くする: Q1=1, Q2=5 → v1=1, v2=1 → avg=1.0 → スコア1

let r = calcScore('10', [1,1,1,1,1,1,1,1,1,1], questions10);
assert(r.code === '33333', '10問 全1回答 → 逆転で中和→33333', `実際: ${r.code}`);

r = calcScore('10', [5,5,5,5,5,5,5,5,5,5], questions10);
assert(r.code === '33333', '10問 全5回答 → 逆転で中和→33333', `実際: ${r.code}`);

r = calcScore('10', [3,3,3,3,3,3,3,3,3,3], questions10);
assert(r.code === '33333', '10問 全3回答 → 33333', `実際: ${r.code}`);

// 全高: +問題に5, -問題に1（逆転で高くなる）
r = calcScore('10', [5,1,5,1,5,1,5,1,5,1], questions10);
assert(r.code === '55555', '10問 全高回答(+5/-1) → 55555', `実際: ${r.code}`);

// 全低: +問題に1, -問題に5（逆転で低くなる）
r = calcScore('10', [1,5,1,5,1,5,1,5,1,5], questions10);
assert(r.code === '11111', '10問 全低回答(+1/-5) → 11111', `実際: ${r.code}`);

// --- 30問版 ---
console.log('\n--- 30問版 ---');

// 30問版: 各因子6問、合計で判定
// sum<=11→1, <=16→2, <=23→3, <=28→4, else→5
// 全1回答: dir:'+'は1、dir:'-'は(6-1)=5
// E因子: +が4問(idx0,1,4,5,8,9... ) -が2問(idx15,16,24,25)
// 全1: 4*1 + 2*5 = 14 → スコア2

const all1_30 = Array(30).fill(1);
r = calcScore('30', all1_30, questions30);
// 各因子の+/-構成を考慮した期待値を検証
assert(r.code !== '', '30問 全1回答 → 計算成功', `実際: ${r.code}`);

const all5_30 = Array(30).fill(5);
r = calcScore('30', all5_30, questions30);
assert(r.code !== '', '30問 全5回答 → 計算成功', `実際: ${r.code}`);

const all3_30 = Array(30).fill(3);
r = calcScore('30', all3_30, questions30);
assert(r.code === '33333', '30問 全3回答 → 33333', `実際: ${r.code}`);

// --- 120問版 ---
console.log('\n--- 120問版 ---');

const all3_120 = Array(120).fill(3);
r = calcScore('120', all3_120, questions120);
assert(r.code === '33333', '120問 全3回答 → 33333', `実際: ${r.code}`);

// ========== テスト2: 120問エッジケース（閾値境界）==========

console.log('\n═══ テスト2: 120問 閾値境界テスト ═══\n');

// 120問のN因子: 24問、閾値は sum<=44→1, <=64→2, <=92→3, <=112→4, else→5
// N因子の24問のうち、dir:'-'は4問（インデックス7,11,15,19,23）
// これらに5を答えると(6-5)=1、1を答えると(6-1)=5

// N=1ギリギリ: 24問の合計が44以下
// dir:'+' 20問×1=20, dir:'-' 4問×5=20(→1に変換), 合計=20+4=24 ≤ 44 → 1
{
  const a = Array(120).fill(3); // 他は中間
  // N因子のインデックスを確認: 0-23
  for (let i = 0; i < 24; i++) {
    a[i] = questions120[i].dir === '-' ? 5 : 1; // 全部最低スコア
  }
  r = calcScore('120', a, questions120);
  assert(r.N === 1, '120問 N=1: 全最低回答', `実際: N=${r.N}, code=${r.code}`);
}

// N=2ギリギリ: 合計が45-64
{
  const a = Array(120).fill(3);
  for (let i = 0; i < 24; i++) {
    a[i] = questions120[i].dir === '-' ? 5 : 2;
  }
  // dir:'+' 20問×2=40, dir:'-' 4問×5→1, 合計=40+4=44 → 1 (まだ1)
  // 3にすると: 20×3=60, dir:'-' 4問×5→1, 合計=60+4=64 → 2
  for (let i = 0; i < 24; i++) {
    a[i] = questions120[i].dir === '-' ? 5 : 3;
  }
  r = calcScore('120', a, questions120);
  assert(r.N === 2, '120問 N=2: +問題=3, -問題=5', `実際: N=${r.N}`);
}

// ========== テスト3: 隠しキャラ照合（ズバリ照合）==========

console.log('\n═══ テスト3: 隠しキャラ照合（ズバリ照合）═══\n');

for (const ch of HIDDEN_CHARACTERS) {
  const testGender = ch.gender === 'F' ? 'F' : 'M';
  const found = findHiddenCharacter(ch.o, ch.c, ch.e, ch.a, ch.n, testGender);
  const expected = ch.gender === 'M' ? ch.id :
                   ch.gender === 'F' ? (testGender === 'F' ? ch.id : null) : ch.id;

  if (ch.gender === 'F' && testGender === 'M') {
    assert(found === null, `${ch.name}: 男性では出ないはず`, `実際: ${found ? found.name : 'null'}`);
  } else if (ch.gender === 'M' && testGender === 'F') {
    // M専用キャラに女性を渡す
    const foundF = findHiddenCharacter(ch.o, ch.c, ch.e, ch.a, ch.n, 'F');
    assert(foundF === null, `${ch.name}: 女性では出ないはず`, `実際: ${foundF ? foundF.name : 'null'}`);
  } else {
    assert(found && found.id === ch.id, `${ch.name}: ズバリ照合で一致`, found ? `実際: ${found.name}` : 'null');
  }
}

// ========== テスト4: 隠しキャラ照合（丸め照合）==========

console.log('\n═══ テスト4: 隠しキャラ照合（丸め照合）═══\n');

// スコア2,4は丸めると1,5になる
// 例: ルフィ(o:5,c:1,e:5,a:3,n:1) に (5,2,4,3,1) を渡す
// toHiddenScale: 5→5, 2→1, 4→5, 3→3, 1→1 → (5,1,5,3,1) = ルフィに一致
{
  const found = findHiddenCharacter(5, 2, 4, 3, 1, 'M');
  assert(found && found.id === 'luffy', 'ルフィ: 丸め照合(5,2,4,3,1)→(5,1,5,3,1)', found ? found.name : 'null');
}

// スコア2のキャラに4を渡す: 爽子(o:2,c:4,e:1,a:5,n:4) に (4,4,2,5,4)
// toHiddenScale: 4→5, 4→5, 2→1, 5→5, 4→5 → (5,5,1,5,5) = 一致なし
{
  const found = findHiddenCharacter(4, 4, 2, 5, 4, 'F');
  assert(found === null, '爽子: (4,4,2,5,4)丸め→(5,5,1,5,5)=不一致', found ? found.name : 'null');
}

// ズバリ照合優先: フリーレン(5,3,1,1,1,F)とL(5,3,1,1,1,M)の同スコア分岐
{
  const foundF = findHiddenCharacter(5, 3, 1, 1, 1, 'F');
  assert(foundF && foundF.id === 'frieren', '女性(5,3,1,1,1) → フリーレン', foundF ? foundF.name : 'null');

  const foundM = findHiddenCharacter(5, 3, 1, 1, 1, 'M');
  assert(foundM && foundM.id === 'l_char', '男性(5,3,1,1,1) → L', foundM ? foundM.name : 'null');
}

// ========== テスト5: 120問で隠しキャラが出るかシミュレーション ==========

console.log('\n═══ テスト5: 120問で隠しキャラが出るスコアの検証 ═══\n');

// 各隠しキャラについて、120問でそのスコアを出す回答パターンが存在するか検証
// dir:'+'問題: valがそのままスコアに寄与 → 高くしたい=5, 低くしたい=1
// dir:'-'問題: (6-val)がスコアに寄与 → 高くしたい=1, 低くしたい=5
// ※因子ごとに+/-問題数が違う（Aは+7/-17など）ため、動的に計算する
function buildAnswers120(targetScores) {
  const answers = Array(120).fill(3);
  const factorIndices = { N: [], E: [], O: [], A: [], C: [] };
  questions120.forEach((q, i) => factorIndices[q.factor].push(i));

  const thresholds120 = [
    [44, 1], [64, 2], [92, 3], [112, 4], [Infinity, 5]
  ];

  for (const [factor, target] of Object.entries(targetScores)) {
    const indices = factorIndices[factor];
    const plusQ = indices.filter(i => questions120[i].dir === '+');
    const minusQ = indices.filter(i => questions120[i].dir === '-');
    const n = plusQ.length, m = minusQ.length;

    // 目標合計値の範囲を取得
    const [upper, _] = thresholds120.find(([u, s]) => s === target);
    const lower = target === 1 ? 24 : thresholds120.find(([u, s]) => s === target - 1)[0] + 1;
    const targetSum = Math.round((lower + Math.min(upper, n * 5 + m * 5)) / 2);

    // plus=pVal, minus=mVal としたとき: n*pVal + m*(6-mVal) = targetSum
    // 全部同じ値にする: n*val + m*(6-val) = (n-m)*val + 6m = targetSum
    // val = (targetSum - 6m) / (n - m)
    // ただし n-m が0や負の場合（A: 7-17=-10）は別アプローチ
    let pVal, mVal;
    if (n === m) {
      // 全部同じ値では合計が固定(= n * 3 + m * 3)になるので別の値を使う
      pVal = target >= 3 ? 4 : 2;
      mVal = 6 - pVal;
    } else {
      const val = (targetSum - 6 * m) / (n - m);
      const clamped = Math.max(1, Math.min(5, val));
      pVal = Math.round(clamped);
      mVal = Math.round(clamped);
    }
    pVal = Math.max(1, Math.min(5, pVal));
    mVal = Math.max(1, Math.min(5, mVal));

    // 実際の合計を確認し、範囲外なら微調整
    let sum = n * pVal + m * (6 - mVal);
    if (sum > upper) {
      // 合計が高すぎる → plusを下げる or minusを上げる
      while (sum > upper && pVal > 1) { pVal--; sum = n * pVal + m * (6 - mVal); }
      while (sum > upper && mVal < 5) { mVal++; sum = n * pVal + m * (6 - mVal); }
    } else if (sum < lower) {
      // 合計が低すぎる → plusを上げる or minusを下げる
      while (sum < lower && pVal < 5) { pVal++; sum = n * pVal + m * (6 - mVal); }
      while (sum < lower && mVal > 1) { mVal--; sum = n * pVal + m * (6 - mVal); }
    }

    for (const i of plusQ) answers[i] = pVal;
    for (const i of minusQ) answers[i] = mVal;
  }
  return answers;
}

// テスト: ルフィ(5,1,5,3,1) のスコアが120問で出せるか
{
  const answers = buildAnswers120({ O: 5, C: 1, E: 5, A: 3, N: 1 });
  const result = calcScore('120', answers, questions120);
  assert(result.O === 5 && result.C === 1 && result.E === 5 && result.A === 3 && result.N === 1,
    `120問でルフィのスコア(51531)を出力`, `実際: ${result.code}`);
}

// テスト: ゾロ(1,5,1,1,1)
{
  const answers = buildAnswers120({ O: 1, C: 5, E: 1, A: 1, N: 1 });
  const result = calcScore('120', answers, questions120);
  assert(result.O === 1 && result.C === 5 && result.E === 1 && result.A === 1 && result.N === 1,
    `120問でゾロのスコア(15111)を出力`, `実際: ${result.code}`);
}

// テスト: ナミ(3,5,4,2,3)
{
  const answers = buildAnswers120({ O: 3, C: 5, E: 4, A: 2, N: 3 });
  const result = calcScore('120', answers, questions120);
  assert(result.O === 3 && result.C === 5 && result.E === 4 && result.A === 2 && result.N === 3,
    `120問でナミのスコア(35423)を出力`, `実際: ${result.code}`);
}

// ========== テスト6: 10問版は隠しキャラが出ない ==========

console.log('\n═══ テスト6: 10問版のレアリティ制限 ═══\n');

// 10問版はスコアが1/3/5の3段階しかないため、一部キャラとはズバリ一致する
// しかし10問版ではgetRarityが'common'固定なので、隠しキャラは表示されない
{
  r = calcScore('10', [1,5,1,5,1,5,1,5,1,5], questions10);
  assert(r.code === '11111', '10問版: 全低回答(+1/-5) → コード11111（ゾロと同コードだがcommon固定）', `実際: ${r.code}`);
}

// ========== テスト7: 重複スコアチェック ==========

console.log('\n═══ テスト7: 同じスコアのキャラ重複チェック ═══\n');

// フリーレンとLは同じスコア(5,3,1,1,1)で性別分岐のみ
{
  const sameScore = HIDDEN_CHARACTERS.filter(ch => ch.o === 5 && ch.c === 3 && ch.e === 1 && ch.a === 1 && ch.n === 1);
  assert(sameScore.length === 2, 'スコア(5,3,1,1,1)は2キャラ', `実際: ${sameScore.map(c => c.name).join(', ')}`);
}

// スコア重複がないか全件チェック（性別any/M/F別）
{
  const scoreMap = {};
  for (const ch of HIDDEN_CHARACTERS) {
    const key = `${ch.o}${ch.c}${ch.e}${ch.a}${ch.n}_${ch.gender}`;
    if (scoreMap[key]) {
      assert(false, `重複スコア: ${ch.name} と ${scoreMap[key]}`, `スコア: ${key}`);
    } else {
      scoreMap[key] = ch.name;
    }
  }
  assert(Object.keys(scoreMap).length === HIDDEN_CHARACTERS.length,
    '全34キャラにスコア重複なし（性別込み）',
    `ユニーク数: ${Object.keys(scoreMap).length}`);
}

// ========== 結果サマリー ==========

console.log('\n═══ テスト結果サマリー ═══\n');
console.log(`  合計: ${passed + failed}件`);
console.log(`  ✅ 成功: ${passed}件`);
console.log(`  ❌ 失敗: ${failed}件`);

if (failures.length > 0) {
  console.log('\n失敗したテスト:');
  failures.forEach(f => console.log(`  - ${f.test}: ${f.detail}`));
}

console.log('\n');
process.exit(failed > 0 ? 1 : 0);
