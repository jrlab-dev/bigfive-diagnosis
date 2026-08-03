/* クロス予告カード（2026-08-03・気づかせ計画 柱①）
 * 単発診断の結果ページに、その人の実データで「クロス分析の入り口」を1枚見せる。
 * 文言は無料クロス（cross-att-texts.js）の既存文の書き出しを流用＝新規執筆なし。
 * 3状態：①BF＋該当文あり=書き出しチラ見せ ②BFありだが該当文なし=総合レポート案内 ③BF未受診=BFへの誘い
 * 計測：cross_teaser_view / cross_teaser_click（端末1回・dev_nocount対応） */
(function () {
  'use strict';

  var PAGE = (location.pathname.split('/').pop() || '').replace(/\?.*$/, '');

  function safe(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function count(name) {
    try {
      if (localStorage.getItem('dev_nocount') === '1') return;
      if (localStorage.getItem('counted_' + name) === '1') return;
      localStorage.setItem('counted_' + name, '1');
      fetch('/count/hit?e=' + name, { method: 'POST', keepalive: true }).catch(function () {});
    } catch (e) {}
  }

  /* ビッグファイブ（report.htmlと同じ読み方・レベル分け） */
  function getBF() {
    var list = safe('bigfive_my_results') || [];
    if (!list.length) return null;
    var idx = Math.min(parseInt(localStorage.getItem('bigfive_active_my_index') || '0', 10), list.length - 1);
    var s = (list[idx] || {}).scores || {};
    function level(v) { if (!v) return 'mid'; if (v >= 4) return 'high'; if (v <= 2) return 'low'; return 'mid'; }
    return { O: level(s.O), C: level(s.C), E: level(s.E), A: level(s.A), N: level(s.N) };
  }

  function dlv(v) { return v >= 60 ? 'high' : (v < 40 ? 'low' : ''); }

  /* ページごとの候補選び（report.htmlの無料クロス選抜と同じ条件） */
  var PICKERS = {
    'attachment.html': function (CA, lv) {
      var r = safe('attachment_result'); if (!r || !r.typeKey) return null;
      return {
        cands: (CA.cuts || []).filter(function (c) { return c.type === r.typeKey && lv[c.factor] === c.dir; }),
        soron: (CA.soron || {})[r.typeKey]
      };
    },
    'hsp.html': function (CA, lv) {
      var r = safe('hsp_result'); var t = r && r.scores ? r.scores.total : null; if (t == null) return null;
      var l = t >= 34 ? 'high' : (t <= 19 ? 'low' : ''); if (!l) return { cands: [], soron: null };
      return {
        cands: (CA.hspcuts || []).filter(function (c) { return c.hsp === l && lv[c.factor] === c.dir; }),
        soron: (CA.hsp_soron || {})[l]
      };
    },
    'impostor.html': function (CA, lv) {
      var r = safe('impostor_result'); if (!r || r.severityLevel !== 'high') return null;
      return {
        cands: (CA.impcuts || []).filter(function (c) { return c.imp === 'high' && lv[c.factor] === c.dir; }),
        soron: CA.imp_soron
      };
    },
    'eq.html': function (CA, lv) {
      var r = safe('eq_result'); if (!r || (!r.level && !r.weakest)) return null;
      return {
        cands: (CA.eqcuts || []).filter(function (c) { return c.eq === r.level && lv[c.factor] === c.dir; }),
        soron: CA.eq_soron
      };
    },
    'dark-triad.html': function (CA, lv) {
      var r = safe('dark_triad_result'); var s = r && r.scores; if (!s) return null;
      var mine = { narc: dlv(s.nPct), mach: dlv(s.mPct), psy: dlv(s.pPct) };
      return {
        cands: (CA.dtcuts || []).filter(function (c) { return mine[c.dt] === c.lvl && lv[c.factor] === c.dir; }),
        soron: CA.dt_soron
      };
    },
    'locus.html': function (CA, lv) {
      var r = safe('locus_result'); if (!r || !r.type) return null;
      var cands = (CA.locuscuts || []).filter(function (c) { return c.locus === r.type && lv[c.factor] === c.dir; });
      var m = safe('mindset_result');
      if (m && m.type) cands = cands.concat((CA.lm || []).filter(function (c) { return c.locus === r.type && c.mind === m.type; }));
      return { cands: cands, soron: CA.locus_soron };
    },
    'mindset.html': function (CA, lv) {
      var r = safe('mindset_result'); if (!r || !r.type) return null;
      var cands = (CA.mindcuts || []).filter(function (c) { return c.mind === r.type && lv[c.factor] === c.dir; });
      var l = safe('locus_result');
      if (l && l.type) cands = cands.concat((CA.lm || []).filter(function (c) { return c.mind === r.type && c.locus === l.type; }));
      return { cands: cands, soron: CA.mind_soron };
    },
    'sdt.html': function (CA, lv) {
      var r = safe('sdt_result'); if (!r || !r.strongest) return null;
      return {
        cands: (CA.sdtcuts || []).filter(function (c) { return c.sdtk === r.strongest && lv[c.factor] === c.dir; }),
        soron: CA.sdt_soron
      };
    },
    'love.html': function (CA, lv) {
      var r = safe('love_result'); if (!r || !r.mainStyle) return null;
      return {
        cands: (CA.lovecuts || []).filter(function (c) { return c.lovek === r.mainStyle && lv[c.factor] === c.dir; }),
        soron: CA.love_soron
      };
    },
    'schwartz.html': function (CA, lv) {
      var r = safe('schwartz_result'); if (!r) return null;
      return { cands: [], soron: null }; /* 価値観の無料クロス文は無し＝総合レポート案内 */
    },
    'hexaco.html': function (CA, lv) {
      var r = safe('hexaco_result'); var h = r && r.scores ? r.scores.H : null;
      if (typeof h !== 'number') return null;
      var l = h >= 4.0 ? 'high' : (h < 2.5 ? 'low' : ''); if (!l) return { cands: [], soron: null };
      return {
        cands: (CA.hexcuts || []).filter(function (c) { return c.hexh === l && lv[c.factor] === c.dir; }),
        soron: CA.hex_soron
      };
    },
    'riasec.html': function (CA, lv) {
      var r = safe('riasec_result'); var code = r && r.scores ? r.scores.code : '';
      var t = code ? String(code).charAt(0) : ''; if ('RIASEC'.indexOf(t) < 0) return null;
      return {
        cands: (CA.ricuts || []).filter(function (c) { return c.ri === t && lv[c.factor] === c.dir; }),
        soron: CA.ri_soron
      };
    }
  };

  if (!PICKERS[PAGE]) return;

  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* 書き出しの切り出し：最初の段落から、100字以内で最後の「。」まで（短すぎるときは92字＋…） */
  function preview(body) {
    var p = String(body).split('\n\n')[0];
    if (p.length <= 100) return p;
    var head = p.slice(0, 100);
    var cut = head.lastIndexOf('。');
    if (cut >= 40) return head.slice(0, cut + 1);
    return p.slice(0, 92) + '…';
  }

  function buildCard(state, quoteHtml) {
    var box = document.createElement('div');
    box.id = 'crossTeaserCard';
    box.setAttribute('style',
      'max-width:640px;margin:20px auto 6px;padding:16px 18px;border:1px solid rgba(139,92,246,.45);' +
      'border-radius:14px;background:rgba(139,92,246,.10);text-align:left;line-height:1.75;');
    var label = '<div style="font-size:.76rem;font-weight:700;letter-spacing:.06em;color:#a78bfa;margin-bottom:8px;">' +
      (state === 'invite' ? 'もうひと掘り' : 'あなた専用のクロス分析（無料）') + '</div>';
    var cta;
    if (state === 'invite') {
      cta = '<a href="start.html" data-ct="1" style="display:inline-block;margin-top:10px;background:#8b5cf6;color:#fff;' +
        'padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:700;font-size:.92rem;">ビッグファイブ診断を受ける（2分〜） →</a>';
    } else {
      cta = '<a href="report.html" data-ct="1" style="display:inline-block;margin-top:10px;background:#8b5cf6;color:#fff;' +
        'padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:700;font-size:.92rem;">続きを総合レポートで読む（無料） →</a>';
    }
    box.innerHTML = label + quoteHtml + cta;
    return box;
  }

  function render() {
    var area = document.getElementById('resultArea');
    if (!area || !area.offsetParent) return false;           /* 結果がまだ表示されていない */
    if (document.getElementById('crossTeaserCard')) return true;

    var lv = getBF();
    var card;
    if (!lv) {
      card = buildCard('invite',
        '<div style="font-size:.92rem;">この結果は、<b>ビッグファイブ診断</b>と掛け合わせると「あなた専用のクロス分析」に変わります。' +
        '受け終わると総合レポートに自動で追加されます。</div>');
    } else {
      var picked = PICKERS[PAGE](window.CROSS_ATT || {}, lv);
      if (!picked) return true; /* この診断の結果が無い（未完了で結果画面でない等）＝出さない */
      var cands = (picked.cands || []).slice().sort(function (a, b) { return b.total - a.total; });
      var body = cands.length ? cands[0].body : picked.soron;
      if (body) {
        card = buildCard('quote',
          '<div style="font-size:.93rem;opacity:.92;">' + esc(preview(body)) + '</div>' +
          '<div style="font-size:.78rem;opacity:.65;margin-top:6px;">— あなたのビッグファイブとこの診断を重ねた分析の書き出しです</div>');
      } else {
        card = buildCard('generic',
          '<div style="font-size:.92rem;">総合レポートでは、この結果をビッグファイブや他の診断と重ねた<b>クロス分析</b>が読めます。' +
          '受けた診断が増えるほど、分析も増えていきます。</div>');
      }
    }
    area.appendChild(card);
    count('cross_teaser_view');
    var a = card.querySelector('a[data-ct]');
    if (a) a.addEventListener('click', function () { count('cross_teaser_click'); });
    return true;
  }

  function withData(cb) {
    if (window.CROSS_ATT) return cb();
    var s = document.createElement('script');
    s.src = 'cross-att-texts.js?v=7';
    s.onload = cb;
    s.onerror = function () {};
    document.head.appendChild(s);
  }

  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    if (tries > 120) { clearInterval(timer); return; }        /* 約90秒で諦める（未完了のまま離脱） */
    var area = document.getElementById('resultArea');
    if (!area || !area.offsetParent) return;
    clearInterval(timer);
    withData(function () { render(); });
  }, 750);
})();
