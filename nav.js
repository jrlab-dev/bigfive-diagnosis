// ===== Google Analytics =====
(function() {
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-9DSFS2TYHG';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-9DSFS2TYHG');
})();

// ===== グローバルナビゲーション =====
(function() {
  const NAV_HTML = `
<nav id="globalNav">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo"><img src="images/ロゴ.png" alt="V BiG" style="height:28px;width:auto;"></a>
    <div class="nav-links" id="navLinks">
      <a href="index.html" data-page="index"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> ホーム</a>
      <a href="mypage.html" data-page="mypage"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> マイページ</a>
      <a href="diagnoses.html" data-page="diagnoses"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> 性格診断</a>
      <a href="report.html" data-page="report"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> 総合レポート</a>
    </div>
  </div>
</nav>`;

  const NAV_CSS = `
#globalNav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 9999;
  background: rgba(8, 11, 32, 0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.18);
  transform: translateY(-100%);
  transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1),
              background 0.3s ease;
  will-change: transform;
}
#globalNav.nav-visible {
  transform: translateY(0);
}
.nav-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 18px;
  height: 52px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-logo {
  font-size: 15px;
  font-weight: 900;
  color: #a78bfa;
  text-decoration: none;
  letter-spacing: 0.04em;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.2s;
}
.nav-logo:hover { color: #c4b5fd; }
.nav-links {
  display: flex;
  gap: 2px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
}
.nav-links::-webkit-scrollbar { display: none; }
.nav-links a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 11px;
  border-radius: 20px;
  font-size: 12.5px;
  color: rgba(148, 163, 184, 0.85);
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;
  font-weight: 400;
}
.nav-links a:hover {
  background: rgba(139, 92, 246, 0.15);
  color: #e2e8f0;
}
.nav-links a.nav-current {
  background: rgba(139, 92, 246, 0.22);
  color: #c4b5fd;
  font-weight: 600;
}
/* ページ上部の余白（navの高さ分） */
body { padding-top: 52px !important; }
`;

  // スタイル注入
  const style = document.createElement('style');
  style.textContent = NAV_CSS;
  document.head.appendChild(style);

  // フッターHTML
  const FOOTER_HTML = `
<footer id="globalFooter">
  <div class="footer-inner">
    <span class="footer-copy">© Jr. Genius</span>
    <div class="footer-links">
      <a href="legal.html">プライバシーポリシー・利用規約</a>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSerzLle9YKVqQD6vaS3YlLsBHETnYRcXfukzgdJ5Rs_2HFaVg/viewform" target="_blank" rel="noopener">お問い合わせ</a>
    </div>
  </div>
</footer>`;

  const FOOTER_CSS = `
#globalFooter {
  background: rgba(8,11,32,0.9);
  border-top: 1px solid rgba(139,92,246,0.12);
  padding: 16px 20px;
  margin-top: 40px;
}
.footer-inner {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.footer-copy {
  font-size: 11px;
  color: #475569;
}
.footer-links {
  display: flex;
  gap: 16px;
}
.footer-links a {
  font-size: 11px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-links a:hover { color: #94a3b8; }
`;

  // フッタースタイル注入
  const footerStyle = document.createElement('style');
  footerStyle.textContent = FOOTER_CSS;
  document.head.appendChild(footerStyle);

  // フッターHTML注入（bodyの末尾）
  document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);

  // HTML注入（bodyの先頭）
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

  const nav = document.getElementById('globalNav');

  // 現在ページをハイライト
  const path = location.pathname.split('/').pop() || 'index.html';
  const pageKey = path.replace('.html', '').split('?')[0] || 'index';
  document.querySelectorAll('.nav-links a[data-page]').forEach(function(a) {
    if (a.getAttribute('data-page') === pageKey) {
      a.classList.add('nav-current');
    }
  });

  // スクロール連動：上スクロール or トップ → 表示 / 下スクロール → 非表示
  let lastY = window.scrollY;
  let ticking = false;

  function updateNav() {
    const y = window.scrollY;
    if (y < 60 || y < lastY) {
      nav.classList.add('nav-visible');
    } else if (y > lastY + 4) {
      nav.classList.remove('nav-visible');
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // 初期表示（トップにいる場合は最初から見せる）
  if (window.scrollY < 60) {
    nav.classList.add('nav-visible');
  }
})();

// ===== テーマ切り替え =====
(function() {
  var THEME_KEY = 'bigfive_theme';
  var saved = localStorage.getItem(THEME_KEY);

  function setThemeImages(isLight) {
    document.querySelectorAll('.feature-bg-img').forEach(function(img) {
      var src = img.getAttribute('src');
      if (!src) return;
      if (isLight) {
        img.src = src.replace('.webp', '-light.webp');
      } else {
        img.src = src.replace('-light.webp', '.webp');
      }
    });
  }

  // 初期テーマ適用（bodyにtheme-lightがあればそのページのデフォルトはlight）
  var defaultLight = document.body.classList.contains('theme-light');
  if (saved === 'light' || (saved === null && defaultLight)) {
    document.body.classList.add('theme-light');
  } else if (saved === 'dark') {
    document.body.classList.remove('theme-light');
  }

  // ボタン生成
  var btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'テーマ切り替え');
  btn.textContent = document.body.classList.contains('theme-light') ? 'DARK' : 'LIGHT';
  document.body.appendChild(btn);

  // 初期表示時に画像も切り替え
  if (saved === 'light') {
    setThemeImages(true);
  }

  btn.addEventListener('click', function() {
    var isLight = document.body.classList.toggle('theme-light');
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    btn.textContent = isLight ? 'DARK' : 'LIGHT';
    setThemeImages(isLight);
  });
})();
