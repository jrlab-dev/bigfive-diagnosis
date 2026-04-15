/**
 * 隠しキャラクターデータ
 *
 * スコアは 1 / 3 / 5 の3段階で指定（診断スコアは自動的に1/3/5に丸めて照合）
 * gender: 'any' → 性別問わず出現
 *         'F'   → 女性ユーザーのみ
 *         'M'   → 男性ユーザーのみ
 *
 * ★ キャラを追加するときはこのリストに追記するだけでOK ★
 */
const HIDDEN_CHARACTERS = [

  // ===== ワンピース（9体）=====
  { id:'luffy',    name:'モンキー・D・ルフィ',      work:'ワンピース',                o:5, c:1, e:5, a:3, n:1, gender:'any' },
  { id:'zoro',     name:'ロロノア・ゾロ',            work:'ワンピース',                o:1, c:5, e:1, a:1, n:1, gender:'any' },
  { id:'nami',     name:'ナミ',                      work:'ワンピース',                o:3, c:5, e:4, a:2, n:3, gender:'any' },
  { id:'sanji',    name:'サンジ',                    work:'ワンピース',                o:3, c:3, e:4, a:4, n:3, gender:'any' },
  { id:'robin',    name:'ニコ・ロビン',              work:'ワンピース',                o:5, c:4, e:1, a:3, n:2, gender:'any' },
  { id:'ace',      name:'ポートガス・D・エース',     work:'ワンピース',                o:3, c:2, e:5, a:5, n:3, gender:'any' },
  { id:'shanks',   name:'シャンクス',                work:'ワンピース',                o:4, c:2, e:5, a:5, n:1, gender:'any' },
  { id:'law',      name:'トラファルガー・ロー',      work:'ワンピース',                o:3, c:5, e:1, a:2, n:2, gender:'any' },
  { id:'hancock',  name:'ボア・ハンコック',          work:'ワンピース',                o:2, c:3, e:3, a:1, n:3, gender:'any' },

  // ===== 呪術廻戦 =====
  { id:'gojo',     name:'五条悟',                    work:'呪術廻戦',                  o:5, c:2, e:5, a:2, n:1, gender:'any' },
  { id:'itadori',  name:'虎杖悠仁',                  work:'呪術廻戦',                  o:3, c:3, e:5, a:5, n:3, gender:'any' },

  // ===== 鬼滅の刃 =====
  { id:'tanjiro',  name:'竈門炭治郎',                work:'鬼滅の刃',                  o:3, c:4, e:4, a:5, n:2, gender:'any' },
  { id:'rengoku',  name:'煉獄杏寿郎',                work:'鬼滅の刃',                  o:3, c:5, e:5, a:4, n:1, gender:'any' },
  { id:'tomioka',  name:'冨岡義勇',                  work:'鬼滅の刃',                  o:2, c:5, e:1, a:3, n:2, gender:'any' },
  { id:'nezuko',   name:'竈門禰豆子',                work:'鬼滅の刃',                  o:2, c:3, e:2, a:5, n:1, gender:'any' },

  // ===== 進撃の巨人 =====
  { id:'levi',     name:'リヴァイ・アッカーマン',   work:'進撃の巨人',                o:2, c:5, e:2, a:2, n:1, gender:'any' },
  { id:'mikasa',   name:'ミカサ・アッカーマン',     work:'進撃の巨人',                o:1, c:5, e:1, a:3, n:3, gender:'any' },
  { id:'eren',     name:'エレン・イェーガー',        work:'進撃の巨人',                o:3, c:3, e:5, a:1, n:5, gender:'any' },

  // ===== 君に届け =====
  { id:'kazehaya', name:'風早翔太',                  work:'君に届け',                  o:3, c:3, e:5, a:5, n:1, gender:'any' },
  { id:'sawako',   name:'黒沼爽子',                  work:'君に届け',                  o:2, c:4, e:1, a:5, n:4, gender:'any' },

  // ===== 逃げるは恥だが役に立つ =====
  { id:'tsuzaki',  name:'津崎平匡',                  work:'逃げるは恥だが役に立つ',   o:3, c:5, e:1, a:3, n:3, gender:'any' },
  { id:'mikuri',   name:'森山みくり',                work:'逃げるは恥だが役に立つ',   o:4, c:4, e:3, a:4, n:3, gender:'any' },

  // ===== 名探偵コナン =====
  { id:'conan',    name:'江戸川コナン',              work:'名探偵コナン',              o:5, c:5, e:3, a:3, n:1, gender:'any' },
  { id:'ran',      name:'毛利蘭',                    work:'名探偵コナン',              o:2, c:3, e:3, a:5, n:3, gender:'any' },
  { id:'kid',      name:'怪盗キッド',                work:'名探偵コナン',              o:5, c:3, e:5, a:3, n:1, gender:'any' },
  { id:'amuro',    name:'安室透',                    work:'名探偵コナン',              o:4, c:5, e:4, a:3, n:1, gender:'any' },

  // ===== その他 =====
  { id:'usagi',    name:'月野うさぎ',                work:'美少女戦士セーラームーン',  o:3, c:1, e:5, a:5, n:5, gender:'any' },
  { id:'howl',     name:'ハウル',                    work:'ハウルの動く城',            o:5, c:1, e:4, a:3, n:4, gender:'any' },
  { id:'nausicaa', name:'ナウシカ',                  work:'風の谷のナウシカ',          o:5, c:3, e:4, a:5, n:1, gender:'any' },
  { id:'sephiroth',name:'セフィロス',                work:'FINAL FANTASY VII',         o:4, c:5, e:2, a:1, n:3, gender:'any' },

  // ===== 同スコア・性別分岐ペア =====
  { id:'frieren',  name:'フリーレン',                work:'葬送のフリーレン',          o:5, c:3, e:1, a:1, n:1, gender:'F'   },
  { id:'l',        name:'L',                         work:'デスノート',                o:5, c:3, e:1, a:1, n:1, gender:'M'   },

  { id:'asuka',    name:'式波・アスカ・ラングレー',  work:'新世紀エヴァンゲリオン',   o:4, c:4, e:5, a:1, n:5, gender:'any' },

];
