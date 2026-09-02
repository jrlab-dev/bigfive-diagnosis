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
  // 他のページ・他のJSからも出来事を送れるように公開する（2026-08-04）
  // ねらい＝カウンター（KVの書き込み1,000回/日が上限）を使わずに計測を増やす
  window.gtag = gtag;
})();

// ===== グローバルナビゲーション =====
(function() {
  // トップページは専用ヘッダーを使うのでスキップ
  if (window.__SKIP_NAV) return;
  if (location.pathname === '/' || location.pathname.endsWith('/index.html')) return;
  var basePath = location.pathname.includes('/blog/') ? '../' : '';

  var NAV_HTML = `
<nav id="globalNav">
  <div class="nav-inner">
    <a href="${basePath}index.html" class="nav-logo"><img src="${basePath}images/ロゴ.webp" alt="V BiG" width="64" height="64" style="height:28px;width:auto;"></a>
    <div class="nav-links" id="navLinks">
      <a href="${basePath}index.html" data-page="index" aria-label="ホーム"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></a>
      <a href="${basePath}mypage.html" data-page="mypage"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> マイページ</a>
      <a href="${basePath}diagnoses.html" data-page="diagnoses"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> 性格診断</a>
      <a href="${basePath}report.html" data-page="report"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> 総合レポート</a>
    </div>
    <div class="nav-fade" id="navFade"></div>
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
  position: relative;
}
.nav-fade {
  position: absolute; right: 0; top: 0; bottom: 0; width: 40px;
  background: linear-gradient(to left, rgba(8,11,32,0.95), rgba(8,11,32,0));
  pointer-events: none; opacity: 0; transition: opacity 0.25s;
}
#globalNav.nav-scroll-more .nav-fade { opacity: 1; }
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
/* スマホ幅：詰めて「総合レポート」までスライドなしで見せる（2026-08-03準也さん指示） */
@media (max-width: 460px) {
  .nav-inner { padding: 0 12px; gap: 8px; }
  .nav-links a { padding: 6px 8px; font-size: 12px; }
}
/* さらに狭い幅：ホームはロゴが兼ねる（アイコンも隠す） */
@media (max-width: 412px) {
  .nav-links a[data-page="index"] { display: none; }
}
/* ページ上部の余白（navの高さ分） */
body { padding-top: 52px !important; }
`;

  // スタイル注入
  const style = document.createElement('style');
  style.textContent = NAV_CSS;
  document.head.appendChild(style);

  // フッターHTML
  var FOOTER_HTML = `
<footer id="globalFooter">
  <div class="footer-inner">
    <span class="footer-copy">© Jr. Genius</span>
    <div class="footer-links">
      <a href="${basePath}blog/">ブログ</a>
      <a href="${basePath}legal.html">プライバシーポリシー・利用規約</a>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSdF_53zxYjvJtJjqVh2U578K_BHDhqSqAAHT6P-tXGQdvNQZg/viewform" target="_blank" rel="noopener">お問い合わせ</a>
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
  font-size: 13px;
  color: #475569;
}
.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 4px;
}
.footer-links a {
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
  padding: 8px 2px;
  display: inline-block;
  white-space: nowrap;
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

  // ナビ右端フェード：横スクロールできる残りがある間だけヒントを表示
  function updateNavFade() {
    var el = document.getElementById('navLinks');
    var nav = document.getElementById('globalNav');
    if (!el || !nav) return;
    var more = el.scrollWidth - el.clientWidth > 4 &&
               el.scrollLeft < el.scrollWidth - el.clientWidth - 4;
    nav.classList.toggle('nav-scroll-more', more);
  }
  updateNavFade();
  const navLinksEl = document.getElementById('navLinks');
  if (navLinksEl) {
    navLinksEl.addEventListener('scroll', updateNavFade, { passive: true });
  }
  window.addEventListener('resize', updateNavFade, { passive: true });

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
    document.querySelectorAll('.feature-bg-img, .card-showcase img').forEach(function(img) {
      var src = img.getAttribute('src');
      if (!src) return;
      if (isLight) {
        if (src.indexOf('-light.webp') === -1) img.src = src.replace('.webp', '-light.webp');
      } else {
        img.src = src.replace('-light.webp', '.webp');
      }
    });
  }

  // ダーク明示保存時のみダーク、それ以外は全ページライト
  if (saved === 'dark') {
    document.body.classList.remove('theme-light');
    setThemeImages(false);
  }

  // ボタン生成
  var btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'テーマ切り替え');
  btn.textContent = document.body.classList.contains('theme-light') ? 'DARK' : 'LIGHT';
  document.body.appendChild(btn);

  // 初期表示時に画像も切り替え
  if (saved !== 'dark') {
    setThemeImages(true);
  }

  btn.addEventListener('click', function() {
    var isLight = document.body.classList.toggle('theme-light');
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    btn.textContent = isLight ? 'DARK' : 'LIGHT';
    setThemeImages(isLight);
  });
})();

// ===== 訪問時の自動バックアップ =====
(function() {
  // file:等（test_auto.js対策）では動かさない
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

  var SYNC_ID_KEY = 'bigfive_sync_id';
  var LAST_AUTO_KEY = 'bigfive_sync_last_auto';
  var RESTORE_CHECKED_KEY = 'bigfive_restore_checked';
  var AUTO_BACKUP_URL = 'https://bigfive.jr-genius.jp/api/save';
  var AUTO_LOAD_URL = 'https://bigfive.jr-genius.jp/api/load';
  var COUNT_URL = 'https://bigfive.jr-genius.jp/count/hit?e=';
  var SYNC_ID_MIN_CARDS = 3; // カードがこの枚数になったら同期IDを自動発行する（2026-09-02）
  var FIXED_KEYS = [
    'attachment_result', 'hsp_result', 'locus_result', 'eq_result',
    'impostor_result', 'sdt_result', 'schwartz_result', 'mindset_result',
    'love_result', 'pgg_result', 'risk_result', 'honne_shindan_v1',
    'dark_triad_result', 'riasec_result', 'hexaco_result', 'delay_result',
    'ultimatum_result', 'beauty_result', 'trust_result'
  ];

  function collectBackupData() {
    var data = {};
    FIXED_KEYS.forEach(function(k) {
      var v = localStorage.getItem(k);
      if (v) data[k] = v;
    });
    // bigfive_ で始まる残りのキーも収集（同期ID・自動バックアップの記録用キーは除外）
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf('bigfive_') === 0 && key !== LAST_AUTO_KEY && key !== SYNC_ID_KEY && !data[key]) {
        data[key] = localStorage.getItem(key);
      }
    }
    return data;
  }

  // 計測（1端末1回・dev_nocount=1で止まる）＝result.html の count() と同じ流儀
  function count(name) {
    try {
      if (localStorage.getItem('dev_nocount') === '1') return;
      if (localStorage.getItem('counted_' + name) === '1') return;
      localStorage.setItem('counted_' + name, '1');
      fetch(COUNT_URL + name, { method: 'POST', keepalive: true }).catch(function() {});
    } catch (e) {}
  }

  function albumCount() {
    try {
      var a = JSON.parse(localStorage.getItem('bigfive_album') || '[]');
      return Array.isArray(a) ? a.length : 0;
    } catch (e) { return 0; }
  }

  // 同期IDの自動発行（2026-09-02）＝カードが3枚以上になった人にだけ発行する。
  // ⚠️順位表（/api/rank）に載る条件は変えていない。ここは「保存のための発行」。
  function ensureSyncId() {
    var id = localStorage.getItem(SYNC_ID_KEY);
    if (id) return id;
    if (albumCount() < SYNC_ID_MIN_CARDS) return '';
    if (!window.crypto || typeof crypto.randomUUID !== 'function') return ''; // 古いブラウザでは何もしない
    id = crypto.randomUUID();
    localStorage.setItem(SYNC_ID_KEY, id);
    count('sync_id_auto');
    return id;
  }

  function autoBackup() {
    try {
      var syncId = ensureSyncId();
      if (!syncId) return; // カードが3枚未満・IDも無い＝いままでどおり何もしない

      var lastAuto = parseInt(localStorage.getItem(LAST_AUTO_KEY), 10) || 0;
      if (Date.now() - lastAuto < 24 * 60 * 60 * 1000) return; // 24時間以内はスキップ

      var data = collectBackupData();
      // 開発用端末（dev_norank）のときは、ランキングに載せない印を一緒に送る（2026-08-19）
      // ※dev_norank は bigfive_ を付けないキー名＝引継ぎデータとして他端末に渡さない意図
      var payload = { user_id: syncId, data: data };
      if (localStorage.getItem('dev_norank') === '1') payload.norank = true;
      fetch(AUTO_BACKUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Workerが置くクッキー（bf_sync）を受け取るため
        body: JSON.stringify(payload)
      }).then(function(res) {
        return res.json();
      }).then(function(json) {
        if (json && json.ok) {
          localStorage.setItem(LAST_AUTO_KEY, String(Date.now()));
          count('backup_auto_ok');
        }
      }).catch(function() {
        // 失敗時は無音（リトライ・通知なし）
      });
    } catch (e) {
      // ページ表示に影響を与えない
    }
  }

  // ===== 自動復元（2026-09-02）=====
  // Safariの7日消去で localStorage が消えても、Workerが Set-Cookie で置いた bf_sync は残る。
  // それを頼りに、引数なしの /api/load で前回の続きを取り戻す。
  var RESTORE_ARRAY_KEYS = ['bigfive_my_results', 'bigfive_other_results', 'bigfive_album'];
  var RESTORE_LIMITS = { 'bigfive_my_results': 5, 'bigfive_other_results': 100, 'bigfive_album': 8300 };

  // mypage.html の applySyncData(…, 'merge') と同じ規則で戻す。
  // 違いは1点＝配列以外のキーは「手元に無いものだけ」入れる（手元の値を上書きしない）
  function mergeRestoredData(data) {
    Object.keys(data).forEach(function(k) {
      if (k === SYNC_ID_KEY || k === LAST_AUTO_KEY) return;
      var v = data[k];
      if (typeof v !== 'string') return;
      if (RESTORE_ARRAY_KEYS.indexOf(k) < 0) {
        if (localStorage.getItem(k) === null) localStorage.setItem(k, v);
        return;
      }
      try {
        var current = JSON.parse(localStorage.getItem(k) || '[]');
        var loaded = JSON.parse(v);
        if (!Array.isArray(current) || !Array.isArray(loaded)) { localStorage.setItem(k, v); return; }
        var seen = {}, merged = [];
        current.concat(loaded).forEach(function(item) {
          var sig = JSON.stringify(item);
          if (!Object.prototype.hasOwnProperty.call(seen, sig)) { seen[sig] = 1; merged.push(item); }
        });
        var limit = RESTORE_LIMITS[k];
        if (limit && merged.length > limit) merged = merged.slice(0, limit);
        localStorage.setItem(k, JSON.stringify(merged));
      } catch (e) {
        localStorage.setItem(k, v);
      }
    });
  }

  function showRestoreToast(cards) {
    try {
      var el = document.createElement('div');
      el.textContent = '前回の続きを戻しました（カード' + cards + '枚）';
      el.setAttribute('style', 'position:fixed;right:12px;bottom:12px;z-index:99999;max-width:80vw;' +
        'padding:9px 13px;border-radius:9px;font-size:12px;line-height:1.5;' +
        'background:rgba(17,24,39,0.92);color:#e2e8f0;box-shadow:0 4px 14px rgba(0,0,0,0.3);');
      document.body.appendChild(el);
      setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 3000);
    } catch (e) {}
  }

  function autoRestore() {
    try {
      if (localStorage.getItem(SYNC_ID_KEY)) return null;          // IDがある人は対象外
      if (albumCount() > 0) return null;                            // カードが残っている＝消えていない
      if (localStorage.getItem(RESTORE_CHECKED_KEY)) return null;   // 1端末1回だけ
      if (!window.fetch) return null;
      // ⚠️印（bigfive_restore_checked）は「200で答えが返った」ときだけ置く。
      //   引数なし /api/load に未対応の古いWorkerは 400 {"error":"Invalid id"} を返す（2026-09-02にcurlで実測）。
      //   そこで印を置くと、Workerが新しくなっても二度と戻せない端末になる。
      var answered = false;
      return fetch(AUTO_LOAD_URL, { credentials: 'include' }).then(function(res) {
        answered = !!res.ok;
        if (!answered) return null; // 古いWorker＝答えではない。次の訪問でもう一度試す
        return res.json().catch(function() { return null; });
      }).then(function(json) {
        if (!answered) return;
        // 答えが届いた＝見つかっても見つからなくても印を置く（通信エラーのときは置かない）
        localStorage.setItem(RESTORE_CHECKED_KEY, '1');
        if (!json || !json.found || !json.data) { count('restore_auto_miss'); return; }
        mergeRestoredData(json.data);
        if (json.user_id) localStorage.setItem(SYNC_ID_KEY, json.user_id);
        count('restore_auto_ok');
        showRestoreToast(albumCount());
        setTimeout(function() { location.reload(); }, 1500);
      }).catch(function() {
        // 通信エラー＝印を置かないので、次の訪問でもう一度試す
      });
    } catch (e) {
      return null;
    }
  }

  // ページ表示をブロックしないよう遅延実行（戻してから、いつもの自動バックアップ）
  setTimeout(function() {
    var p = autoRestore();
    if (p && p.then) p.then(autoBackup, autoBackup); else autoBackup();
  }, 2500);
})();

/* ===== 掛け合わせデータの送信（2026-08-15新設・準也さん指示） =====
 *
 * 何のためか＝「ビッグファイブ×他の心理学診断」を同じ人から取ったデータは国内にほぼ無い。
 *   例＝「外向性が低い人は愛着スタイルのどの型が多いか」。ここが唯一、大手に勝てる場所。
 *   ⚠️データは始めた日からしか貯まらない（過去に遡れない）ので、思い立った日に入れる。
 *
 * 送るもの＝ビッグファイブの5桁コード＋どの診断か＋その結果だけ。
 *   名前・メール・端末を見分ける印は送らない（受け取る側にも列が無い）。
 * 1診断につき1回だけ送る（送った診断名を端末に控える）。同じ診断をやり直しても2件目は送らない。
 * 画面には何も出さない・体験は一切変わらない。 */
(function () {
  'use strict';
  var SENT_KEY = 'bigfive_cross_sent';
  var TESTS = ['attachment', 'eq', 'darkTriad', 'locus', 'mindset', 'hsp', 'sdt',
               'love', 'schwartz', 'hexaco', 'riasec', 'impostor',
               'pgg', 'risk', 'trust', 'delay', 'ultimatum', 'beauty'];

  function send() {
    try {
      if (localStorage.getItem('dev_nocount') === '1') return;

      var list = JSON.parse(localStorage.getItem('bigfive_my_results') || '[]');
      if (!Array.isArray(list) || !list.length) return;
      var idx = Math.min(parseInt(localStorage.getItem('bigfive_active_my_index') || '0', 10) || 0, list.length - 1);
      var me = list[idx];
      if (!me || !me.scores) return;

      var s = me.scores;
      var bf = '' + s.O + s.C + s.E + s.A + s.N;
      if (!/^[1-5]{5}$/.test(bf)) return;

      var sent = [];
      try { sent = JSON.parse(localStorage.getItem(SENT_KEY) || '[]'); } catch (e) {}
      if (!Array.isArray(sent)) sent = [];

      var device = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'm' : 'd';
      var bfv = me.version ? String(me.version) : null;

      TESTS.forEach(function (t) {
        if (sent.indexOf(t) !== -1) return;      // もう送った診断は飛ばす
        var r = me[t];
        if (!r) return;                           // まだ受けていない診断は飛ばす
        fetch('https://bigfive.jr-genius.jp/count/cross', {
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bf: bf, bfv: bfv, test: t, result: r, device: device })
        }).catch(function () {});
        sent.push(t);
      });

      localStorage.setItem(SENT_KEY, JSON.stringify(sent));
    } catch (e) {
      // ページ表示に影響を与えない
    }
  }

  // 表示をブロックしないよう遅延実行
  setTimeout(send, 3000);
})();

/* ===== ブログの「診断を受ける」ボタンのクリックを数える（2026-08-27追加）=====
 *
 * なぜ＝ブログ着地414のうち start.html まで来るのは12（2.9%）しかない。
 *   原因を切り分けたいが、start.html 到達だけを見ていると
 *   「どのボタンが押されたか」「どの文言が効いたか」が分からない。
 *   ★転換率で判定しようとすると各群708セッション＝3か月かかる（2026-08-27に試算）。
 *     ボタン自体のクリックを数えれば、2週間で答えが出る。
 *
 * 何を送るか＝GA4イベント blog_cta_click
 *   pos     … bottom（記事のいちばん下・いまの1か所）／ mid（記事の途中・これから足す）
 *   variant … self（いまの「診断を受ける」系）／ compat（「あの人との相性を見る」系・A案）
 *   slug    … どの記事か
 *   ★属性が無いときは bottom / self として数える＝既存246本は1本も編集せずに数え始められる。
 *     文言や位置を変えるときに data-cta-pos / data-cta-variant を足せばよい。
 *
 * ★カウンター（KVの無料枠1,000回/日）は使わない。GA4は費用も枠も増えない
 *   （2026-08-04に決めた「枠を使わない計測はGA4へ」の方針どおり）。
 * ★ブログ配下だけで動かす（cta-btn はトップ・FAQ・科学的根拠でも使われているため）。 */
(function () {
  try {
    if (location.pathname.indexOf('/blog/') === -1) return;

    var slug = (location.pathname.split('/').pop() || '').replace('.html', '');

    function bind() {
      var btns = document.querySelectorAll('a.cta-btn');
      for (var i = 0; i < btns.length; i++) {
        (function (a) {
          if (a.getAttribute('data-cta-bound') === '1') return;   // 二重登録よけ
          a.setAttribute('data-cta-bound', '1');
          a.addEventListener('click', function () {
            try {
              if (window.gtag) window.gtag('event', 'blog_cta_click', {
                pos: a.getAttribute('data-cta-pos') || 'bottom',
                variant: a.getAttribute('data-cta-variant') || 'self',
                slug: slug
              });
            } catch (e) {}
          });
        })(btns[i]);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bind);
    } else {
      bind();
    }
  } catch (e) {
    // 計測の失敗でページを壊さない
  }
})();
