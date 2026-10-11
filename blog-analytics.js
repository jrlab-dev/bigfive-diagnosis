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
