/* 他人から見たあなた（2026-11-14）
 * 友だちが other_quiz.html で「あなた」を答え、結果をリンクで本人へ送る。
 * 本人の端末だけに保存する（サーバーなし）。鍵なし。
 * 根拠：Vazire 2010（SOKAモデル）・Connelly & Ones 2010（他者評定のメタ分析）
 */
(function (global) {
  'use strict';
  var KEY = 'bigfive_seen_by';
  var MAX = 30;
  var F = ['O', 'C', 'E', 'A', 'N'];
  var NAMES = { O: '開放性', C: '誠実性', E: '外向性', A: '協調性', N: '感受性' };
  var REL = { love: '恋人・パートナー', work: '職場の人', friend: '友人・知人' };
  var SITE = 'https://bigfive.jr-genius.jp/';

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function cleanName(v) {
    return String(v == null ? '' : v).replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 20);
  }
  function load() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(v) ? v.filter(function (e) { return e && e.s && F.every(function (f) { return typeof e.s[f] === 'number'; }); }) : [];
    } catch (e) { return []; }
  }
  function store(list) { try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); } catch (e) {} }

  /* s＝5因子の平均（1.0〜5.0）を10倍した2けた×5＝10けた */
  function encode(means) {
    return F.map(function (f) {
      var n = Math.round(Math.max(1, Math.min(5, means[f])) * 10);
      return String(n);
    }).join('');
  }
  function decode(s) {
    if (!/^(?:[1-4][0-9]|50){5}$/.test(String(s || ''))) return null;
    var o = {};
    F.forEach(function (f, i) { o[f] = parseInt(s.substr(i * 2, 2), 10) / 10; });
    return o;
  }

  /* 受け取ったリンク（seen.html?s=..&rel=..&by=..&i=..&a=..）を保存。新しく足せたら entry、同じものなら 'same'、読めなければ null */
  function receive(search) {
    var p = new URLSearchParams(search || '');
    var s = decode(p.get('s'));
    if (!s) return null;
    var rel = REL[p.get('rel')] ? p.get('rel') : 'friend';
    var by = cleanName(p.get('by'));
    var id = /^[A-Za-z0-9]{6,24}$/.test(p.get('i') || '') ? p.get('i') : '';
    var entry = { s: s, rel: rel, by: by, id: id, about: cleanName(p.get('a')), date: new Date().toISOString() };
    var list = load();
    var idx = -1;
    for (var k = 0; k < list.length; k++) {
      if ((id && list[k].id === id) || (!id && !list[k].id && list[k].by === by && encode(list[k].s) === encode(s))) { idx = k; break; }
    }
    if (idx >= 0) {
      if (encode(list[idx].s) === encode(s) && list[idx].rel === rel) return 'same';
      list.splice(idx, 1);
    }
    list.unshift(entry);
    store(list);
    return entry;
  }
  function remove(i) { var list = load(); list.splice(i, 1); store(list); }

  /* 自分のビッグファイブ（適用中の結果）。1〜5 */
  function mine() {
    try {
      var rs = JSON.parse(localStorage.getItem('bigfive_my_results') || '[]');
      if (!Array.isArray(rs) || !rs.length) return null;
      var idx = Math.min(parseInt(localStorage.getItem('bigfive_active_my_index') || '0', 10) || 0, rs.length - 1);
      var r = rs[idx] || rs[0];
      var o = {};
      var code = String(r.code || '');
      for (var i = 0; i < F.length; i++) {
        var f = F[i];
        var v = r.scores && typeof r.scores[f] === 'number' ? r.scores[f] : parseInt(code[i], 10);
        if (!(v >= 1 && v <= 5)) return null;
        o[f] = v;
      }
      /* 10問版は1・3・5の3段階、それ以外は1〜5の5段階で保存されている */
      o.three = String(r.version) === '10';
      return o;
    } catch (e) { return null; }
  }
  function average(list) {
    if (!list.length) return null;
    var o = {};
    F.forEach(function (f) {
      o[f] = list.reduce(function (a, e) { return a + e.s[f]; }, 0) / list.length;
    });
    return o;
  }

  /* 本人の結果は段階に丸めて保存されているので、友だちの平均も同じ規則（quiz.html の toLevel／toLevel3）で丸めてから比べる */
  function level(v, three) {
    return three ? (v < 2.5 ? 1 : v < 3.5 ? 3 : 5) : (v < 1.5 ? 1 : v < 2.5 ? 2 : v < 3.5 ? 3 : v < 4.5 ? 4 : 5);
  }
  /* 差＝他人の見立て − 自分（同じ段階どうし）。同じ段階ならそろっている、5段階で2段階以上（3段階版は2段階）なら大きなずれ */
  function compare(self, other) {
    return F.map(function (f) {
      var o = level(other[f], self.three);
      var d = o - self[f];
      var kind = d === 0 ? 'same' : (d > 0 ? 'higher' : 'lower');
      return { f: f, name: NAMES[f], self: self[f], other: o, diff: d, kind: kind, big: Math.abs(d) >= (self.three ? 4 : 2) };
    });
  }

  var TEXT = {
    O: {
      higher: '周りには、あなたが思っている以上に好奇心や発想の豊かさが伝わっています。自分のアイデアを控えめに見積もっていないか、一度疑ってみる価値があります。',
      lower: '頭の中ではいろいろ考えていても、外にはあまり出ていないようです。新しい考えを口にする機会が少ないと、周りからは「堅実で手がたい人」に見えがちです。考えていることを少し言葉にするだけで、見え方は変わります。',
      same: '好奇心や新しいものへの向き合い方は、自己像と周りの見方がそろっています。'
    },
    C: {
      higher: '周りはあなたを、自分で思うよりきちんとした人だと見ています。自分では「抜けている」「段取りが悪い」と感じていても、人前で見せている姿は頼りになるものです。内心の焦りは外から見えにくいので、こうしたずれが起きることがあります。',
      lower: 'あなたが思うほど、計画性や几帳面さは周りに伝わっていないようです。頭の中で段取りをしていても、途中経過が見えないと「大丈夫かな」と思われがちです。予定や進み具合をひと言共有すると、評価が追いつきやすくなります。',
      same: '計画性やまじめさは、自己像と周りの見方がそろっています。'
    },
    E: {
      higher: '周りからは、あなたが思うより明るく社交的に見えています。人前では場に合わせて元気にふるまっている人も、この形になりやすいです。人と会ったあとにどっと疲れるなら、一人で回復する時間を意識して取りましょう。',
      lower: '自分では人と話すのが好きだと思っていても、周りからは落ち着いた人に見えています。外向性は行動に出やすく、本来は本人も周りも同じくらい正確に判断できる因子です。周りの人の前では、見せている面が限られているのかもしれません。',
      same: '外向性は行動に表れやすく、本人も周りも同じくらい正確に判断できる因子です。ここは見えているとおりのあなたです。'
    },
    A: {
      higher: '周りはあなたを、自分で思うより優しく話しやすい人だと見ています。内心のいら立ちや遠慮を外に出さずにいると、こう見えることがあります。我慢しすぎていないか、ときどき振り返ってみてください。',
      lower: 'あなたが思うより、周りはあなたを率直で厳しめの人と見ているようです。率直さが強みになる場面も多い一方で、言い方を少しやわらげると伝わり方が変わることもあります。',
      same: '人へのやさしさや協力の仕方は、自己像と周りの見方がそろっています。'
    },
    N: {
      higher: '周りからは、あなたが思うより心配性で気持ちが揺れやすい人に見えています。表情や口ぐせ、確認の多さに不安が出ているのかもしれません。本人が思う以上に、周りは気にかけてくれているかもしれません。',
      lower: '周りはあなたを、自分で思うより落ち着いた人だと見ています。不安や緊張は心の中の動きなので、外からは見えにくい部分です。研究でも、不安や緊張は本人の評価のほうが当たりやすいとされています。内側の揺れに気づいてもらえず、ひとりで抱えこまないようにしてください。',
      same: '気持ちの揺れやすさは、自己像と周りの見方がそろっています。心の中の動きは外から見えにくいので、ここが一致しているのは、周りの人があなたをよく知っているからかもしれません。'
    }
  };
  var REL_NOTE = {
    love: '恋人・パートナーは、ふだんの姿やくつろいだ面まで見ている相手です。',
    work: '職場の人が見ているのは、主に仕事中のあなたです。家や友人の前とは違って見えるのは自然なことです。',
    friend: '友人・知人は、くつろいだ場でのあなたをよく知る相手です。'
  };

  function headline(rows) {
    var gaps = rows.filter(function (r) { return r.kind !== 'same'; });
    if (!gaps.length) return '自分で思う自分と、周りから見えるあなたがよくそろっています。';
    gaps.sort(function (a, b) { return Math.abs(b.diff) - Math.abs(a.diff); });
    var g = gaps[0];
    return 'いちばんずれが大きいのは<b>' + g.name + '</b>です。周りからは、あなたが思うより' +
      (g.f === 'N' ? (g.kind === 'higher' ? '気持ちが揺れやすく' : '落ち着いて')
        : (g.kind === 'higher' ? g.name + 'が高く' : g.name + 'が低く')) + '見えています。';
  }

  function askUrl(myName) {
    var u = SITE + 'other_quiz.html?ask=' + encodeURIComponent(cleanName(myName) || 'わたし');
    return u;
  }
  function sendUrl(means, rel, by, id, about) {
    var u = SITE + 'seen.html?s=' + encode(means) + '&rel=' + encodeURIComponent(REL[rel] ? rel : 'friend');
    if (cleanName(by)) u += '&by=' + encodeURIComponent(cleanName(by));
    if (cleanName(about)) u += '&a=' + encodeURIComponent(cleanName(about));
    if (id) u += '&i=' + id;
    return u;
  }
  function shareId() {
    try {
      var id = localStorage.getItem('bigfive_share_id') || '';
      if (!/^[A-Za-z0-9]{6,24}$/.test(id)) {
        id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
        localStorage.setItem('bigfive_share_id', id);
      }
      return id;
    } catch (e) { return ''; }
  }
  /* 送る：スマホは共有シート、だめならコピー。結果 'shared' | 'copied' | 'shown' */
  function share(url, text) {
    if (navigator.share) {
      return navigator.share({ text: text, url: url }).then(function () { return 'shared'; }, function (e) {
        if (e && e.name === 'AbortError') return 'cancel';
        return copy(url);
      });
    }
    return copy(url);
  }
  function copy(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(url).then(function () { return 'copied'; }, function () { return 'shown'; });
    }
    return Promise.resolve('shown');
  }
  function ev(name, props) { try { if (typeof gtag === 'function') gtag('event', name, props || {}); } catch (e) {} }

  global.SeenBy = {
    F: F, NAMES: NAMES, REL: REL, REL_NOTE: REL_NOTE, TEXT: TEXT,
    esc: esc, cleanName: cleanName, load: load, remove: remove, receive: receive,
    encode: encode, decode: decode, mine: mine, average: average, compare: compare,
    headline: headline, askUrl: askUrl, sendUrl: sendUrl, shareId: shareId, share: share, ev: ev
  };
})(window);
