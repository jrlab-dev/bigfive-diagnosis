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
  { id:'luffy',      name:'モンキー・D・ルフィ',      work:'ワンピース',              o:5, c:1, e:5, a:3, n:1, gender:'any', img:'隠し_ルフィ.webp' },
  { id:'zoro',       name:'ロロノア・ゾロ',            work:'ワンピース',              o:1, c:5, e:1, a:1, n:1, gender:'any', img:'隠し_ゾロ.webp' },
  { id:'nami',       name:'ナミ',                      work:'ワンピース',              o:3, c:5, e:4, a:2, n:3, gender:'any', img:'隠し_ナミ.webp' },
  { id:'sanji',      name:'サンジ',                    work:'ワンピース',              o:3, c:3, e:4, a:4, n:3, gender:'any', img:'隠し_サンジ.webp' },
  { id:'robin',      name:'ニコ・ロビン',              work:'ワンピース',              o:5, c:4, e:1, a:3, n:2, gender:'any', img:'隠し_ロビン.webp' },
  { id:'ace',        name:'ポートガス・D・エース',     work:'ワンピース',              o:3, c:2, e:5, a:5, n:3, gender:'any', img:'隠し_ポートガス・D・エース.webp' },
  { id:'shanks',     name:'シャンクス',                work:'ワンピース',              o:4, c:2, e:5, a:5, n:1, gender:'any', img:'隠し_シャンクス.webp' },
  { id:'law',        name:'トラファルガー・ロー',      work:'ワンピース',              o:3, c:5, e:1, a:2, n:2, gender:'any', img:'隠し_ロー.webp' },
  { id:'hancock',    name:'ボア・ハンコック',          work:'ワンピース',              o:2, c:3, e:3, a:1, n:3, gender:'any', img:'隠し_ハンコック.webp' },
  { id:'doflamingo', name:'ドフラミンゴ',              work:'ワンピース',              o:4, c:5, e:5, a:1, n:1, gender:'any', img:'隠し_ドフラミンゴ.webp' },

  // ===== 呪術廻戦（3体）=====
  { id:'gojo',       name:'五条悟',                    work:'呪術廻戦',                o:5, c:2, e:5, a:2, n:1, gender:'any', img:'隠し_五条悟.webp' },
  { id:'itadori',    name:'虎杖悠仁',                  work:'呪術廻戦',                o:3, c:3, e:5, a:5, n:3, gender:'any', img:'隠し_虎杖.webp' },
  { id:'sukuna',     name:'両面宿儺',                  work:'呪術廻戦',                o:3, c:5, e:1, a:1, n:1, gender:'any', img:'隠し_両面宿儺.webp' },

  // ===== 鬼滅の刃（4体）=====
  { id:'tanjiro',    name:'竈門炭治郎',                work:'鬼滅の刃',                o:3, c:4, e:4, a:5, n:2, gender:'any', img:'隠し_炭治郎.webp' },
  { id:'rengoku',    name:'煉獄杏寿郎',                work:'鬼滅の刃',                o:3, c:5, e:5, a:4, n:1, gender:'any', img:'隠し_煉獄.webp' },
  { id:'tomioka',    name:'冨岡義勇',                  work:'鬼滅の刃',                o:2, c:5, e:1, a:3, n:2, gender:'any', img:'隠し_冨岡.webp' },
  { id:'nezuko',     name:'竈門禰豆子',                work:'鬼滅の刃',                o:2, c:3, e:2, a:5, n:1, gender:'any', img:'隠し_禰豆子.webp' },

  // ===== 進撃の巨人（3体）=====
  { id:'levi',       name:'リヴァイ・アッカーマン',   work:'進撃の巨人',              o:2, c:5, e:2, a:2, n:1, gender:'any', img:'隠し_リヴァイ.webp' },
  { id:'mikasa',     name:'ミカサ・アッカーマン',     work:'進撃の巨人',              o:1, c:5, e:1, a:3, n:3, gender:'any', img:'隠し_ミカサ.webp' },
  { id:'eren',       name:'エレン・イェーガー',        work:'進撃の巨人',              o:3, c:3, e:5, a:1, n:5, gender:'any', img:'隠し_エレン.webp' },

  // ===== 君に届け（2体）=====
  { id:'kazehaya',   name:'風早翔太',                  work:'君に届け',                o:3, c:3, e:5, a:5, n:1, gender:'any', img:'隠し_風早.webp' },
  { id:'sawako',     name:'黒沼爽子',                  work:'君に届け',                o:2, c:4, e:1, a:5, n:4, gender:'any', img:'隠し_爽子.webp' },

  // ===== 逃げるは恥だが役に立つ（2体）=====
  { id:'tsuzaki',    name:'津崎平匡',                  work:'逃げるは恥だが役に立つ',   o:3, c:5, e:1, a:3, n:3, gender:'any', img:'隠し_津崎.webp' },
  { id:'mikuri',     name:'森山みくり',                work:'逃げるは恥だが役に立つ',   o:4, c:4, e:3, a:4, n:3, gender:'any', img:'隠し_みくり.webp' },

  // ===== 名探偵コナン（4体）=====
  { id:'conan',      name:'江戸川コナン',              work:'名探偵コナン',            o:5, c:5, e:3, a:3, n:1, gender:'any', img:'隠し_コナン.webp' },
  { id:'ran',        name:'毛利蘭',                    work:'名探偵コナン',            o:2, c:3, e:3, a:5, n:3, gender:'any', img:'隠し_毛利蘭.webp' },
  { id:'kid',        name:'怪盗キッド',                work:'名探偵コナン',            o:5, c:3, e:5, a:3, n:1, gender:'any', img:'隠し_怪盗キッド.webp' },
  { id:'amuro',      name:'安室透',                    work:'名探偵コナン',            o:4, c:5, e:4, a:3, n:1, gender:'any', img:'隠し_安室透.webp' },

  // ===== その他 =====
  { id:'usagi',      name:'月野うさぎ',                work:'美少女戦士セーラームーン',  o:3, c:1, e:5, a:5, n:5, gender:'any', img:'隠し_月野うさぎ.webp' },
  { id:'sephiroth',  name:'セフィロス',                work:'FINAL FANTASY VII',       o:4, c:5, e:2, a:1, n:3, gender:'any', img:'隠し_セフィロス.webp' },

  // ===== 同スコア・性別分岐ペア =====
  { id:'frieren',    name:'フリーレン',                work:'葬送のフリーレン',        o:5, c:3, e:1, a:1, n:1, gender:'F',   img:'隠し_フリーレン.webp' },
  { id:'l',          name:'L',                         work:'デスノート',              o:5, c:3, e:1, a:1, n:1, gender:'M',   img:'隠し_L.webp' },

  { id:'asuka',      name:'式波・アスカ・ラングレー',  work:'新世紀エヴァンゲリオン', o:4, c:4, e:5, a:1, n:5, gender:'any', img:'隠し_アスカ・ラングレー.webp' },
  { id:'light',      name:'夜神月',                    work:'デスノート',              o:5, c:5, e:3, a:1, n:1, gender:'any', img:'隠し_夜神月.webp' },

];
