// ===== グローバルナビゲーション =====
(function() {
  const NAV_HTML = `
<nav id="globalNav">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo">✦ BIG5</a>
    <div class="nav-links" id="navLinks">
      <a href="index.html" data-page="index">🏠 ホーム</a>
      <a href="mypage.html" data-page="mypage">👤 マイページ</a>
      <a href="quiz.html?v=10" data-page="quiz">🧬 性格診断</a>
      <a href="love.html" data-page="love">💕 恋愛</a>
      <a href="mindset.html" data-page="mindset">🧠 思考</a>
      <a href="sdt.html" data-page="sdt">⚡ 動機</a>
      <a href="schwartz.html" data-page="schwartz">🌍 価値観</a>
      <a href="hsp.html" data-page="hsp">🌸 HSP</a>
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
