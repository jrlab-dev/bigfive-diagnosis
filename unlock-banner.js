'use strict';

(function() {

  // HTML要素を動的に生成
  var canvas = document.createElement('canvas');
  canvas.id = 'unlockConfettiCanvas';
  canvas.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:8002;pointer-events:none;';
  document.body.appendChild(canvas);

  var overlay = document.createElement('div');
  overlay.id = 'unlockBannerOverlay';
  overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(100,80,160,0.25);z-index:8000;';
  document.body.appendChild(overlay);

  var banner = document.createElement('div');
  banner.id = 'unlockBanner';
  banner.style.cssText = 'display:none;position:fixed;left:50%;bottom:0;transform:translateX(-50%);width:min(420px,94vw);background:linear-gradient(135deg,#faf5ff,#ede9fe);border:1px solid rgba(139,92,246,0.35);border-radius:20px 20px 0 0;padding:28px 24px 36px;z-index:8001;text-align:center;box-shadow:0 -4px 40px rgba(139,92,246,0.2);transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);';
  banner.innerHTML =
    '<div style="font-size:2.4rem;margin-bottom:10px;" id="unlockBannerEmoji">🎉</div>' +
    '<div style="color:#7c3aed;font-size:0.8rem;font-weight:bold;letter-spacing:0.1em;margin-bottom:6px;" id="unlockBannerCount"></div>' +
    '<div style="color:#3b0764;font-size:1.2rem;font-weight:bold;margin-bottom:6px;" id="unlockBannerTitle"></div>' +
    '<div style="color:#6d28d9;font-size:0.85rem;margin-bottom:24px;">が解放されました！</div>' +
    '<div style="display:flex;gap:10px;justify-content:center;">' +
      '<a id="unlockBannerGoBtn" href="#" style="flex:1;max-width:180px;display:block;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;padding:12px 0;border-radius:999px;text-decoration:none;font-weight:bold;font-size:0.95rem;">今すぐ使う</a>' +
      '<button id="unlockBannerCloseBtn" style="flex:1;max-width:120px;background:transparent;border:1px solid #c4b5fd;color:#7c3aed;padding:12px 0;border-radius:999px;font-size:0.95rem;cursor:pointer;">あとで</button>' +
    '</div>';
  document.body.appendChild(banner);

  var goBtn    = document.getElementById('unlockBannerGoBtn');
  var closeBtn = document.getElementById('unlockBannerCloseBtn');

  // 紙吹雪
  function launchConfetti() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    var ctx = canvas.getContext('2d');
    var colors = ['#a78bfa','#c4b5fd','#f9a8d4','#fde68a','#6ee7b7','#93c5fd','#ec4899'];
    var pieces = [];
    for (var i = 0; i < 90; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 60,
        w: 7 + Math.random() * 7,
        h: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 5,
        vy: 2.5 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.15,
        opacity: 1
      });
    }
    var start = Date.now();
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var elapsed = Date.now() - start;
      var alive = false;
      pieces.forEach(function(p) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        if (elapsed > 1800) p.opacity = Math.max(0, p.opacity - 0.025);
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        if (p.y < canvas.height + 20 && p.opacity > 0) alive = true;
      });
      if (alive && elapsed < 3500) requestAnimationFrame(animate);
      else canvas.style.display = 'none';
    }
    animate();
  }

  // バナー制御
  var queue = [];
  var isShowing = false;

  function showNext() {
    if (queue.length === 0) { isShowing = false; return; }
    isShowing = true;
    var item = queue.shift();

    document.getElementById('unlockBannerCount').textContent = item.cards + '枚達成';
    document.getElementById('unlockBannerTitle').textContent = item.label;
    goBtn.href = item.url || 'zukan.html';
    goBtn.style.display = item.url ? '' : 'none';

    overlay.style.display = 'block';
    banner.style.display  = 'block';
    banner.style.transform = 'translateX(-50%) translateY(100%)';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        banner.style.transform = 'translateX(-50%) translateY(0)';
        launchConfetti();
      });
    });
  }

  function hideBanner(cb) {
    banner.style.transform = 'translateX(-50%) translateY(100%)';
    setTimeout(function() {
      banner.style.display  = 'none';
      overlay.style.display = 'none';
      if (cb) cb();
    }, 400);
  }

  closeBtn.addEventListener('click', function() {
    hideBanner(function() { showNext(); });
  });

  goBtn.addEventListener('click', function() {
    hideBanner(null);
  });

  overlay.addEventListener('click', function() {
    hideBanner(function() { showNext(); });
  });

  window.showUnlockBanners = function(unlocks) {
    unlocks.forEach(function(u) { queue.push(u); });
    if (!isShowing) showNext();
  };

})();
