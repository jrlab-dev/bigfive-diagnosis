/**
 * 隠しキャラクターデータ
 *
 * スコアは診断結果の 1〜5 をそのまま指定（ズバリ照合を最優先）
 * 照合ロジック：①ズバリスコア → ②1/3/5丸め照合 の2段階
 * gender: 'any' → 性別問わず出現
 *         'F'   → 女性ユーザーのみ
 *         'M'   → 男性ユーザーのみ
 * img:    images/characters/hidden/ 以下のファイル名
 *
 * ★ キャラを追加するときはこのリストに追記するだけでOK ★
 */
const HIDDEN_CHARACTERS = [

  // ===== ワンピース（10体）=====
  { id:'luffy',      name:'モンキー・D・ルフィ',      work:'ワンピース',              o:5, c:1, e:5, a:3, n:1, gender:'any', img:'51531.webp' },
  { id:'nami',       name:'ナミ',                      work:'ワンピース',              o:3, c:5, e:4, a:2, n:3, gender:'any', img:'35423.webp' },
  { id:'sanji',      name:'サンジ',                    work:'ワンピース',              o:3, c:3, e:4, a:4, n:3, gender:'any', img:'33443.webp' },
  { id:'robin',      name:'ニコ・ロビン',              work:'ワンピース',              o:5, c:4, e:1, a:3, n:2, gender:'any', img:'54132.webp' },
  { id:'ace',        name:'ポートガス・D・エース',     work:'ワンピース',              o:3, c:2, e:5, a:5, n:3, gender:'any', img:'32553.webp' },
  { id:'shanks',     name:'シャンクス',                work:'ワンピース',              o:4, c:2, e:5, a:5, n:1, gender:'any', img:'42551.webp' },
  { id:'law',        name:'トラファルガー・ロー',      work:'ワンピース',              o:3, c:5, e:1, a:2, n:2, gender:'any', img:'35122.webp' },
  { id:'hancock',    name:'ボア・ハンコック',          work:'ワンピース',              o:2, c:3, e:3, a:1, n:3, gender:'any', img:'23313.webp' },

  // ===== 呪術廻戦（3体）=====
  { id:'gojo',       name:'五条悟',                    work:'呪術廻戦',                o:5, c:2, e:5, a:2, n:1, gender:'any', img:'52521.webp' },
  { id:'itadori',    name:'虎杖悠仁',                  work:'呪術廻戦',                o:3, c:3, e:5, a:5, n:3, gender:'any', img:'33553.webp' },

  // ===== 鬼滅の刃（4体）=====
  { id:'tanjiro',    name:'竈門炭治郎',                work:'鬼滅の刃',                o:3, c:4, e:4, a:5, n:2, gender:'any', img:'34452.webp' },
  { id:'rengoku',    name:'煉獄杏寿郎',                work:'鬼滅の刃',                o:3, c:5, e:5, a:4, n:1, gender:'any', img:'35541.webp' },
  { id:'tomioka',    name:'冨岡義勇',                  work:'鬼滅の刃',                o:2, c:5, e:1, a:3, n:2, gender:'any', img:'25132.webp' },
  { id:'nezuko',     name:'竈門禰豆子',                work:'鬼滅の刃',                o:2, c:3, e:2, a:5, n:1, gender:'any', img:'23251.webp' },

  // ===== 進撃の巨人（3体）=====
  { id:'levi',       name:'リヴァイ・アッカーマン',   work:'進撃の巨人',              o:2, c:5, e:2, a:2, n:1, gender:'any', img:'25221.webp' },
  { id:'mikasa',     name:'ミカサ・アッカーマン',     work:'進撃の巨人',              o:1, c:5, e:1, a:3, n:3, gender:'any', img:'15133.webp' },
  { id:'eren',       name:'エレン・イェーガー',        work:'進撃の巨人',              o:3, c:3, e:5, a:1, n:5, gender:'any', img:'33515.webp' },

  // ===== 君に届け（2体）=====
  { id:'kazehaya',   name:'風早翔太',                  work:'君に届け',                o:3, c:3, e:5, a:5, n:1, gender:'any', img:'33551.webp' },
  { id:'sawako',     name:'黒沼爽子',                  work:'君に届け',                o:2, c:4, e:1, a:5, n:4, gender:'any', img:'24154.webp' },

  // ===== 逃げるは恥だが役に立つ（2体）=====
  { id:'tsuzaki',    name:'津崎平匡',                  work:'逃げるは恥だが役に立つ',   o:3, c:5, e:1, a:3, n:3, gender:'any', img:'35133.webp' },
  { id:'mikuri',     name:'森山みくり',                work:'逃げるは恥だが役に立つ',   o:4, c:4, e:3, a:4, n:3, gender:'any', img:'44343.webp' },

  // ===== 名探偵コナン（4体）=====
  { id:'conan',      name:'江戸川コナン',              work:'名探偵コナン',            o:5, c:5, e:3, a:3, n:1, gender:'any', img:'55331.webp' },
  { id:'ran',        name:'毛利蘭',                    work:'名探偵コナン',            o:2, c:3, e:3, a:5, n:3, gender:'any', img:'23353.webp' },
  { id:'kid',        name:'怪盗キッド',                work:'名探偵コナン',            o:5, c:3, e:5, a:3, n:1, gender:'any', img:'53531.webp' },
  { id:'amuro',      name:'安室透',                    work:'名探偵コナン',            o:4, c:5, e:4, a:3, n:1, gender:'any', img:'45431.webp' },

  // ===== その他 =====
  { id:'usagi',      name:'月野うさぎ',                work:'美少女戦士セーラームーン',  o:3, c:1, e:5, a:5, n:5, gender:'any', img:'31555.webp' },
  { id:'sephiroth',  name:'セフィロス',                work:'FINAL FANTASY VII',       o:4, c:5, e:2, a:1, n:3, gender:'any', img:'45213.webp' },

  // ===== 同スコア・性別分岐ペア =====

  { id:'asuka',      name:'式波・アスカ・ラングレー',  work:'新世紀エヴァンゲリオン', o:4, c:4, e:5, a:1, n:5, gender:'any', img:'44515.webp' },

  // ===== オリジナル =====

  // ===== ビッグファイブマン（仮）アニメキャラクター =====
  // メインストーリー
  // 会社あるなしキャラクター

];
