// nav.js を使わないブログ向け。画面・保存・復元・独自カウンターは変更しない。
(function () {
  'use strict';
  var id = 'G-9DSFS2TYHG';
  var path = window.location.pathname;
  if (window.location.hostname !== 'bigfive.jr-genius.jp' ||
      window.location.protocol !== 'https:' ||
      !/^\/blog\/[^/]+\.html$/.test(path) || path === '/blog/index.html') return;
  try { if (window.localStorage.getItem('dev_nocount') === '1') return; } catch (e) {}
  if (window.__bigfiveBlogAnalytics) return;
  // 将来 nav.js が静的に追加された記事では、その計測処理へ任せる。
  var scripts = document.querySelectorAll('script[src]');
  for (var i = 0; i < scripts.length; i++) {
    if (/(^|\/)nav\.js(?:[?#]|$)/.test(scripts[i].getAttribute('src'))) return;
  }
  window.__bigfiveBlogAnalytics = true;

  // ===== 行動の記録（2026-10-17） =====
  // サービス改善のため、ランダムな端末番号ごとに「どのページを見て、何をしたか」を時刻つきで記録する。
  // 名前・メールアドレスなど個人を特定する情報は送らない。GA4へ送る出来事と同じものを、自分の倉庫にも残す。
  // dev_nocount=1 の端末（検品・開発）は記録しない。
  (function () {
    if (window.__bfLog) return;
    var host = location.hostname;
    var local = host === 'localhost' || host === '127.0.0.1';
    if (host !== 'bigfive.jr-genius.jp' && !local) return;
    var api = '/api/log/batch';
    try {
      if (local) { api = localStorage.getItem('dev_log_api') || ''; if (!api) return; }
      else if (localStorage.getItem('dev_nocount') === '1') return;
    } catch (e) { return; }
    if (navigator.webdriver && !local) return;
  
    function rid() {
      return (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
        : 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 10);
    }
    var device = '', sess = '', ref = '';
    try {
      device = localStorage.getItem('bigfive_log_id') || '';
      if (!/^[A-Za-z0-9-]{8,64}$/.test(device)) { device = rid(); localStorage.setItem('bigfive_log_id', device); }
    } catch (e) { return; }
    try {
      sess = sessionStorage.getItem('bf_log_sess') || '';
      if (!sess) {
        sess = rid(); sessionStorage.setItem('bf_log_sess', sess);
        // 訪問の入口（最初のページのときだけ）：参照元のドメイン、または utm_source
        var u = new URLSearchParams(location.search).get('utm_source');
        if (u && /^[A-Za-z0-9.\-_]{1,60}$/.test(u)) ref = 'utm:' + u;
        else if (document.referrer) {
          var rh = new URL(document.referrer).hostname;
          if (rh && rh !== host) ref = rh;
        }
      }
    } catch (e) {}
  
    function pagePath() {
      var p = location.pathname;
      try { var v = new URLSearchParams(location.search).get('v'); if (v && /^[0-9]{1,3}$/.test(v)) p += '?v=' + v; } catch (e) {}
      return p;
    }
    // GA4の補足から、短い値だけを残す（関数や長い文字は捨てる）
    var SKIP = { event_callback: 1, event_timeout: 1, send_to: 1, transport_type: 1, non_interaction: 1 };
    function clean(x) {
      if (!x || typeof x !== 'object') return undefined;
      var out = {}, n = 0;
      for (var k in x) {
        if (!Object.prototype.hasOwnProperty.call(x, k) || SKIP[k] || n >= 8 || !/^[a-z0-9_]{1,24}$/.test(k)) continue;
        var v = x[k];
        if ((typeof v === 'number' && isFinite(v)) || typeof v === 'boolean' || (typeof v === 'string' && v.length <= 60)) { out[k] = v; n++; }
      }
      return n ? out : undefined;
    }
    var queue = [], timer = null;
    function flush() {
      if (timer) { clearTimeout(timer); timer = null; }
      while (queue.length) {
        var body = JSON.stringify({ d: device, s: sess, r: ref || undefined, e: queue.splice(0, 20) });
        ref = '';
        var sent = false;
        try { sent = navigator.sendBeacon && navigator.sendBeacon(api, new Blob([body], { type: 'text/plain' })); } catch (e) {}
        if (!sent) { try { fetch(api, { method: 'POST', body: body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(function () {}); } catch (e) {} }
      }
    }
    function push(name, extra) {
      if (typeof name !== 'string' || !/^[a-z0-9_]{1,48}$/.test(name)) return;
      queue.push({ n: name, t: Date.now(), p: pagePath(), x: clean(extra) });
      if (queue.length >= 20) flush();
      else if (!timer) timer = setTimeout(flush, 4000);
    }
    window.__bfLog = push;
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(); });
    window.addEventListener('pagehide', flush);
  
    // ページを開いたこと＋そのときのカード枚数・600円で開いているか
    var cards = 0, paid = false;
    try { var a = JSON.parse(localStorage.getItem('bigfive_album') || '[]'); cards = Array.isArray(a) ? a.length : 0; } catch (e) {}
    try {
      var r = JSON.parse(localStorage.getItem('bigfive_paid') || 'null');
      paid = localStorage.getItem('counted_paid_buy_click') === '1' || !!(r && r.sid && r.tok && !r.refunded);
    } catch (e) {}
    push('page_view', { c: cards, pd: paid });
  })();

  if (typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // config が通常のページ閲覧を送るため、page_view は別送しない。
    window.gtag('config', id);
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(tag);
  }
  // GA4へ送る出来事を、行動の記録にも残す（2026-10-17）
  (function () {
    var orig = window.gtag;
    if (typeof orig !== 'function' || orig.__bfWrapped) return;
    var wrapped = function () {
      orig.apply(this, arguments);
      try { if (arguments[0] === 'event' && window.__bfLog) window.__bfLog(String(arguments[1]), arguments[2]); } catch (e) {}
    };
    wrapped.__bfWrapped = true;
    window.gtag = wrapped;
  })();
  function bind() {
    var links = document.querySelectorAll('a.cta-btn');
    for (var j = 0; j < links.length; j++) {
      (function (link) {
        if (link.getAttribute('data-cta-bound') === '1') return;
        link.setAttribute('data-cta-bound', '1');
        link.addEventListener('click', function () {
          try {
            if (window.localStorage.getItem('dev_nocount') === '1') return;
          } catch (e) {}
          try {
            window.gtag('event', 'blog_cta_click', {
              pos: link.getAttribute('data-cta-pos') || 'bottom',
              variant: link.getAttribute('data-cta-variant') || 'self',
              slug: path.split('/').pop().replace(/\.html$/, '')
            });
          } catch (e) {}
        });
      })(links[j]);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
})();
