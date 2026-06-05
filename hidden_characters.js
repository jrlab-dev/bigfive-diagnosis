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
  { id:'zoro',       name:'ロロノア・ゾロ',            work:'ワンピース',              o:1, c:5, e:1, a:1, n:1, gender:'any', img:'15111.webp' },
  { id:'nami',       name:'ナミ',                      work:'ワンピース',              o:3, c:5, e:4, a:2, n:3, gender:'any', img:'35423.webp' },
  { id:'sanji',      name:'サンジ',                    work:'ワンピース',              o:3, c:3, e:4, a:4, n:3, gender:'any', img:'33443.webp' },
  { id:'robin',      name:'ニコ・ロビン',              work:'ワンピース',              o:5, c:4, e:1, a:3, n:2, gender:'any', img:'54132.webp' },
  { id:'ace',        name:'ポートガス・D・エース',     work:'ワンピース',              o:3, c:2, e:5, a:5, n:3, gender:'any', img:'32553.webp' },
  { id:'shanks',     name:'シャンクス',                work:'ワンピース',              o:4, c:2, e:5, a:5, n:1, gender:'any', img:'42551.webp' },
  { id:'law',        name:'トラファルガー・ロー',      work:'ワンピース',              o:3, c:5, e:1, a:2, n:2, gender:'any', img:'35122.webp' },
  { id:'hancock',    name:'ボア・ハンコック',          work:'ワンピース',              o:2, c:3, e:3, a:1, n:3, gender:'any', img:'23313.webp' },
  { id:'doflamingo', name:'ドフラミンゴ',              work:'ワンピース',              o:4, c:5, e:5, a:1, n:1, gender:'any', img:'45511.webp' },

  // ===== 呪術廻戦（3体）=====
  { id:'gojo',       name:'五条悟',                    work:'呪術廻戦',                o:5, c:2, e:5, a:2, n:1, gender:'any', img:'52521.webp' },
  { id:'itadori',    name:'虎杖悠仁',                  work:'呪術廻戦',                o:3, c:3, e:5, a:5, n:3, gender:'any', img:'33553.webp' },
  { id:'sukuna',     name:'両面宿儺',                  work:'呪術廻戦',                o:3, c:5, e:1, a:1, n:1, gender:'any', img:'35111.webp' },

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
  { id:'frieren',    name:'フリーレン',                work:'葬送のフリーレン',        o:5, c:3, e:1, a:1, n:1, gender:'F',   img:'53111_F.webp' },
  { id:'l',          name:'L',                         work:'デスノート',              o:5, c:3, e:1, a:1, n:1, gender:'M',   img:'53111_M.webp' },

  { id:'asuka',      name:'式波・アスカ・ラングレー',  work:'新世紀エヴァンゲリオン', o:4, c:4, e:5, a:1, n:5, gender:'any', img:'44515.webp' },
  { id:'light',      name:'夜神月',                    work:'デスノート',              o:5, c:5, e:3, a:1, n:1, gender:'any', img:'55311.webp' },

  // ===== オリジナル =====
  { id:'hikari_f',   name:'光の人',                    work:'（完全人格者）',           o:5, c:5, e:5, a:5, n:1, gender:'F',   img:'55551_F.webp' },
  { id:'hikari_m',   name:'光の人',                    work:'（完全人格者）',           o:5, c:5, e:5, a:5, n:1, gender:'M',   img:'55551_M.webp' },

  // ===== ビッグファイブマン（仮）アニメキャラクター =====
  // メインストーリー
  { id:'takumi_f',       name:'拓海の部下',              work:'ビッグファイブマン',       o:4, c:3, e:1, a:5, n:2, gender:'F',   img:'43152_F.webp' },
  { id:'takumi_m',       name:'五味 拓海（初期）',       work:'ビッグファイブマン',       o:4, c:3, e:1, a:5, n:2, gender:'M',   img:'43152_M.webp' },
  { id:'takumi_late_f',  name:'拓海の部下',              work:'ビッグファイブマン',       o:4, c:4, e:3, a:5, n:2, gender:'F',   img:'44352_F.webp' },
  { id:'takumi_late_m',  name:'五味 拓海（終盤）',       work:'ビッグファイブマン',       o:4, c:4, e:3, a:5, n:2, gender:'M',   img:'44352_M.webp' },
  { id:'shinji_me_f',    name:'真士（ME社時代）F',       work:'ビッグファイブマン',       o:3, c:3, e:4, a:3, n:3, gender:'F',   img:'33433_F.webp' },
  { id:'shinji_me_m',    name:'真士（ME社時代）',        work:'ビッグファイブマン',       o:3, c:3, e:4, a:3, n:3, gender:'M',   img:'33433_M.webp' },
  { id:'shinji_aw_f',    name:'真士（覚醒後）F',         work:'ビッグファイブマン',       o:3, c:5, e:4, a:5, n:3, gender:'F',   img:'35453_F.webp' },
  { id:'shinji_aw_m',    name:'真士（覚醒後）',          work:'ビッグファイブマン',       o:3, c:5, e:4, a:5, n:3, gender:'M',   img:'35453_M.webp' },
  { id:'mitsurugi_f',    name:'御剣 怜治 F',             work:'ビッグファイブマン',       o:3, c:5, e:5, a:1, n:1, gender:'F',   img:'35511_F.webp' },
  { id:'mitsurugi_m',    name:'御剣 怜治',               work:'ビッグファイブマン',       o:3, c:5, e:5, a:1, n:1, gender:'M',   img:'35511_M.webp' },
  { id:'teya_f',         name:'徹夜先輩 F',              work:'ビッグファイブマン',       o:5, c:3, e:5, a:2, n:1, gender:'F',   img:'53521_F.webp' },
  { id:'teya_m',         name:'徹夜先輩',                work:'ビッグファイブマン',       o:5, c:3, e:5, a:2, n:1, gender:'M',   img:'53521_M.webp' },
  { id:'mentalist_f',    name:'メンタリスト F',          work:'ビッグファイブマン',       o:5, c:4, e:4, a:2, n:1, gender:'F',   img:'54421_F.webp' },
  { id:'mentalist_m',    name:'メンタリスト',            work:'ビッグファイブマン',       o:5, c:4, e:4, a:2, n:1, gender:'M',   img:'54421_M.webp' },
  // 会社あるなしキャラクター
  { id:'kamiyama_f',     name:'神山 凛',                 work:'ビッグファイブマン',       o:4, c:5, e:4, a:1, n:1, gender:'F',   img:'45411_F.webp' },
  { id:'kamiyama_m',     name:'神山 凱',                 work:'ビッグファイブマン',       o:4, c:5, e:4, a:1, n:1, gender:'M',   img:'45411_M.webp' },
  { id:'kurosaki_f',     name:'黒崎 蓮 F',              work:'ビッグファイブマン',       o:2, c:5, e:5, a:1, n:1, gender:'F',   img:'25511_F.webp' },
  { id:'kurosaki_m',     name:'黒崎 蓮',                work:'ビッグファイブマン',       o:2, c:5, e:5, a:1, n:1, gender:'M',   img:'25511_M.webp' },
  { id:'nakata_f',       name:'仲田 陽介 F',            work:'ビッグファイブマン',       o:2, c:2, e:4, a:5, n:5, gender:'F',   img:'22455_F.webp' },
  { id:'nakata_m',       name:'仲田 陽介',              work:'ビッグファイブマン',       o:2, c:2, e:4, a:5, n:5, gender:'M',   img:'22455_M.webp' },
  { id:'sawada_f',       name:'沢田 誠子',              work:'ビッグファイブマン',       o:2, c:5, e:1, a:3, n:5, gender:'F',   img:'25135_F.webp' },
  { id:'sawada_m',       name:'沢田 誠一',              work:'ビッグファイブマン',       o:2, c:5, e:1, a:3, n:5, gender:'M',   img:'25135_M.webp' },
  { id:'yoshida_f',      name:'吉田 なつき',            work:'ビッグファイブマン',       o:1, c:3, e:1, a:5, n:4, gender:'F',   img:'13154_F.webp' },
  { id:'yoshida_m',      name:'吉田 大輔',              work:'ビッグファイブマン',       o:1, c:3, e:1, a:5, n:4, gender:'M',   img:'13154_M.webp' },
  { id:'yasuda_f',       name:'安田 静',                work:'ビッグファイブマン',       o:1, c:3, e:2, a:1, n:5, gender:'F',   img:'13215_F.webp' },
  { id:'yasuda_m',       name:'安田 毅',                work:'ビッグファイブマン',       o:1, c:3, e:2, a:1, n:5, gender:'M',   img:'13215_M.webp' },
  { id:'satomi_f',       name:'里見 彩',                work:'ビッグファイブマン',       o:3, c:1, e:5, a:3, n:5, gender:'F',   img:'31535_F.webp' },
  { id:'satomi_m',       name:'里見 光',                work:'ビッグファイブマン',       o:3, c:1, e:5, a:3, n:5, gender:'M',   img:'31535_M.webp' },
  { id:'kawashima_f',    name:'川島 葵',                work:'ビッグファイブマン',       o:5, c:1, e:3, a:3, n:1, gender:'F',   img:'51331_F.webp' },
  { id:'kawashima_m',    name:'川島 翔',                work:'ビッグファイブマン',       o:5, c:1, e:3, a:3, n:1, gender:'M',   img:'51331_M.webp' },
  { id:'dojima_f',       name:'堂島 理沙',              work:'ビッグファイブマン',       o:4, c:4, e:5, a:1, n:1, gender:'F',   img:'44511_F.webp' },
  { id:'dojima_m',       name:'堂島 剛',                work:'ビッグファイブマン',       o:4, c:4, e:5, a:1, n:1, gender:'M',   img:'44511_M.webp' },
  { id:'shiraishi_f',    name:'白石 詩音',              work:'ビッグファイブマン',       o:5, c:5, e:1, a:4, n:4, gender:'F',   img:'55144_F.webp' },
  { id:'shiraishi_m',    name:'白石 篤人',              work:'ビッグファイブマン',       o:5, c:5, e:1, a:4, n:4, gender:'M',   img:'55144_M.webp' },

];
