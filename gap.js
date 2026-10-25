/* ===== あの人診断：ぶつかりやすいところ（自分と相手の差から） ===== */
/* my / partner は { O, C, E, A, N }（1〜5）。差が2以上の因子を大きい順に最大2つ出す。 */

var GAP_TEXTS = {
  C: {
    label: '誠実性',
    hi: { clash: '期限や段取り、約束の細かさ',
          why: 'あなたには{n}が「いい加減」に、{n}にはあなたが「細かい・急かす」に見えやすい組み合わせです。',
          tip: '守ってほしいことは「いつまでに・どこまで」を1つに絞って伝える。全部を自分の基準に合わせようとしないほうが楽になります。' },
    lo: { clash: '期限や確認、決まりごと',
          why: '{n}の確認や注意が「うるさい・信用されていない」と感じやすい組み合わせです。{n}は「任せて大丈夫か」が不安なだけのことが多いです。',
          tip: '途中で一度、進み具合を自分から伝える。それだけで口出しが減りやすくなります。' }
  },
  E: {
    label: '外向性',
    hi: { clash: '会話の量、誘い、反応の速さ',
          why: '{n}の口数の少なさが「冷たい・興味がない」に見えやすい組み合わせです。{n}には、あなたの勢いが少し疲れることがあります。',
          tip: '返事の少なさを気持ちの表れと読まない。大事な話は1対1で、考える時間をあげると伝わりやすくなります。' },
    lo: { clash: '会話の量、誘い、にぎやかさ',
          why: '{n}の話の多さや誘いが「押しが強い」と感じやすい組み合わせです。{n}は、あなたの静かさを「乗り気じゃない」と受け取りがちです。',
          tip: '断るときは「今日は疲れているだけ」と理由を一言そえる。関係そのものを嫌がっているとは思われにくくなります。' }
  },
  A: {
    label: '協調性',
    hi: { clash: '言い方、譲り合い、意見がぶつかったとき',
          why: '{n}のはっきりした物言いが「きつい・自分勝手」に見えやすい組み合わせです。あなたは我慢をため込みやすい側です。',
          tip: '{n}のきつさは、攻撃ではなく率直さのことが多いです。限界になる前に「私はこうしてほしい」と小さく早めに伝えてください。' },
    lo: { clash: '本音の言い方、遠慮のしかた',
          why: '{n}が合わせてくるので「何を考えているか分からない」と感じやすい組み合わせです。{n}は、あなたの率直さで傷ついても言わないことがあります。',
          tip: '{n}の「大丈夫」をうのみにしない。「AとBならどっちがいい？」と選べる聞き方にすると、本音が出やすくなります。' }
  },
  O: {
    label: '開放性',
    hi: { clash: '新しいこと、やり方を変えるかどうか',
          why: '{n}が「頭が固い」に見えやすい組み合わせです。{n}には、あなたが「思いつきで振り回す」ように見えることがあります。',
          tip: '新しい案は、今のやり方の良さを認めてから「小さく試す」形で出すと通りやすくなります。' },
    lo: { clash: '新しい提案、話の飛び方',
          why: '{n}の提案や話が「現実的でない・落ち着かない」と感じやすい組み合わせです。{n}は「乗ってくれない」と感じがちです。',
          tip: '全部に付き合わなくて大丈夫です。「面白いね。まずどれから？」と具体に戻すと、かみ合いやすくなります。' }
  },
  N: {
    label: '感受性（神経症傾向）',
    hi: { clash: '心配や不安の受け止め方',
          why: '{n}の「気にしすぎ」「大丈夫でしょ」が「分かってくれない」と響きやすい組み合わせです。{n}は本当に気にならないだけで、悪気はないことが多いです。',
          tip: '話す前に「解決より、まず聞いてほしい」と伝える。言われれば聞ける人が多いです。' },
    lo: { clash: '心配や落ち込みへの反応',
          why: '{n}の心配が「大げさ」に見えやすい組み合わせです。{n}は、あなたの軽い返事で「突き放された」と感じがちです。',
          tip: '励ます前に「それは不安になるよね」と一度受け止める。そのほうが話が早く落ち着くことが多いです。' }
  }
};

function gapEsc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* 差が2以上の因子を大きい順に（同じ差なら C,E,A,O,N の順）最大2つ */
function pickGaps(my, partner) {
  var order = ['C', 'E', 'A', 'O', 'N'];
  var list = [];
  for (var i = 0; i < order.length; i++) {
    var f = order[i];
    var m = Number(my && my[f]), p = Number(partner && partner[f]);
    if (!(m >= 1 && m <= 5 && p >= 1 && p <= 5)) return null;
    var d = m - p;
    if (Math.abs(d) >= 2) list.push({ f: f, d: d, rank: i });
  }
  list.sort(function (a, b) { return Math.abs(b.d) - Math.abs(a.d) || a.rank - b.rank; });
  return list.slice(0, 2);
}

/* 表示用HTML。点数が不正なら空文字 */
function generateGapHtml(my, partner, name) {
  var gaps = pickGaps(my, partner);
  if (gaps === null) return '';
  var n = name ? gapEsc(name) + 'さん' : 'あの人';
  var fill = function (s) { return s.split('{n}').join(n); };
  var html = '<p class="advice-title">' + n + 'とぶつかりやすいところ</p>';
  if (gaps.length === 0) {
    html += '<p class="advice-item-text">' + n + 'とあなたは、5つの面のどれも大きくは違いません。合わないと感じるなら、性格よりも、立場や忙しさ、そのときの状況に理由があるのかもしれません。</p>';
  } else {
    html += '<p class="advice-item-text gap-lead">あなたの診断結果と、あなたが答えた' + n + 'の様子を比べると、いちばん違うのはここです。どちらが悪いのではなく、感覚の「ものさし」が違います。</p>';
    gaps.forEach(function (g) {
      var t = GAP_TEXTS[g.f], v = g.d > 0 ? t.hi : t.lo;
      html += '<div class="advice-item gap-item">' +
        '<p class="advice-item-title">' + t.label + '：あなた' + (g.d > 0 ? '高め' : '低め') + '・' + n + (g.d > 0 ? '低め' : '高め') + '</p>' +
        '<p class="advice-item-text"><strong>ぶつかりやすいこと：</strong>' + v.clash + '</p>' +
        '<p class="advice-item-text"><strong>そう見える理由：</strong>' + fill(v.why) + '</p>' +
        '<p class="advice-item-text"><strong>楽になるコツ：</strong>' + fill(v.tip) + '</p>' +
        '</div>';
    });
  }
  html += '<p class="gap-note">' + n + 'の結果は「あなたから見た' + n + '」です。本人の感じ方とはずれることがあります。</p>';
  return html;
}
