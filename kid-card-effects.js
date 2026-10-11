/* result.htmlの光を再利用。診断・保存・計測処理は含まない。 */

window.ChildCardEffects = function(card, record) {
  const wrapper = card;
  const controller = new AbortController();
  const callbacks = new Set();
  let stopped = false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function requestAnimationFrame(fn) { if (stopped || reduced) return 0; const id = window.requestAnimationFrame(function(t){callbacks.delete(id); if(!stopped && card.isConnected) fn(t);}); callbacks.add(id); return id; }
  const observers=[];
  function listen(target, event, fn, options) { target.addEventListener(event,fn,Object.assign({}, options||{}, {signal:controller.signal})); if(target===window&&event==='resize'&&window.ResizeObserver){const observer=new ResizeObserver(fn);observer.observe(card);observers.push(observer);} }
  function getMaxFactor(){const factors=['O','C','E','A','N'];return factors.find((f,i)=>isMax(f,Number(record.code[i])));}
  if (!card || !wrapper) return;

  const holoCv = card.querySelector('.holo-cv');
  const foilCv = card.querySelector('.foil-cv');
  const glitterCv = card.querySelector('.glitter-cv');

  // マウストラッキング
  let mx = 0.5, my = 0.5, hovered = false;
  listen(wrapper, 'mousemove', e => {
    const r = card.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width;
    my = (e.clientY - r.top) / r.height;
  });
  listen(wrapper, 'mouseenter', () => { hovered = true; });
  listen(wrapper, 'mouseleave', () => { mx = 0.5; my = 0.5; hovered = false; });

  // タッチ対応（スマホ指ドラッグ）
  listen(wrapper, 'touchmove', e => {
    if (e.touches.length > 0) {
      const r = card.getBoundingClientRect();
      mx = Math.max(0, Math.min(1, (e.touches[0].clientX - r.left) / r.width));
      my = Math.max(0, Math.min(1, (e.touches[0].clientY - r.top) / r.height));
    }
  }, { passive: true });
  listen(wrapper, 'touchstart', () => { hovered = true; }, { passive: true });
  listen(wrapper, 'touchend', () => { hovered = false; });

  // ジャイロ対応（スマホ傾き）
  let gyroX = 0.5, gyroY = 0.5, hasGyro = false;
  listen(window, 'deviceorientation', e => {
    if (e.gamma === null) return;
    hasGyro = true;
    gyroX = (Math.max(-45, Math.min(45, e.gamma)) + 45) / 90;
    gyroY = (Math.max(-30, Math.min(30, e.beta || 0)) + 30) / 60;
  }, { passive: true });

  // 回転中はキラキラ層の光源もカードの角度で動かす。
  // この層は「マウスが乗っている間だけ」動く作りなので、回転中は静止して反射感が消える
  let spinPrev = null;
  (function syncSpinLight() {
    const sp = window.cardSpinState;
    if (sp && sp.active) {
      if (!spinPrev) spinPrev = { hovered: hovered, mx: mx, my: my };
      const m = ((sp.angle % 360) + 360) % 360;
      const app = m <= 90 ? m : (m >= 270 ? m - 360 : null);   // 表が見えている角度
      if (app !== null) {
        hovered = true;
        mx = Math.max(0, Math.min(1, 0.5 + app / 36));         // ±18度でカードの端に届く
        my = 0.34;
      }
    } else if (spinPrev) {
      hovered = spinPrev.hovered; mx = spinPrev.mx; my = spinPrev.my;
      spinPrev = null;
    }
    requestAnimationFrame(syncSpinLight);
  })();

  // レアリティを取得
  let rarity = 'r0';
  card.className.split(' ').forEach(c => { if (c.startsWith('rarity-')) rarity = c.replace('rarity-', ''); });

  // 因子色設定
  const FC = { O: '#8b5cf6', C: '#3b82f6', E: '#f97316', A: '#f472b6', N: '#14b8a6' };

  // MAX因子取得（R2用）
  function getMaxFactorColor() {
    if (rarity !== 'r2') return null;
    const maxFactor = getMaxFactor();
    return maxFactor ? FC[maxFactor] : null;
  }

  const maxFactorColor = getMaxFactorColor();

  // ============================================================
  // 共通: グリッター
  // ============================================================
  function createGlitter(cv) {
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let W, H;
    const sparkles = [];

    function init() {
      const r = card.getBoundingClientRect();
      W = r.width || 340; H = r.height || 340;
      cv.width = W * devicePixelRatio; cv.height = H * devicePixelRatio;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      sparkles.length = 0;
      const defaultAngle = 0.4;
      for (let i = 0; i < 70; i++) {
        const nearDefault = Math.random() > .65;
        sparkles.push({
          x: Math.random() * W, y: Math.random() * H,
          size: Math.random() * 1.2 + .4,
          catchAngle: nearDefault ? defaultAngle + (Math.random()-.5)*.5 : Math.random() * Math.PI * 2,
          catchWidth: Math.random() * .6 + .3,
          intensity: nearDefault ? Math.random() * .3 + .7 : Math.random() * .5 + .3,
        });
      }
      for (let i = 0; i < 18; i++) {
        const nearDefault = Math.random() > .5;
        sparkles.push({
          x: Math.random() * W, y: Math.random() * H,
          size: Math.random() * 1 + 1.2,
          catchAngle: nearDefault ? defaultAngle + (Math.random()-.5)*.4 : Math.random() * Math.PI * 2,
          catchWidth: Math.random() * .4 + .2,
          intensity: nearDefault ? 1 : Math.random() * .4 + .5,
        });
      }
      for (let i = 0; i < 10; i++) {
        sparkles.push({
          x: Math.random() * (W - 40) + 20, y: Math.random() * (H - 60) + 10,
          size: Math.random() * 1.5 + 2.2,
          catchAngle: defaultAngle + (Math.random()-.5)*.3,
          catchWidth: Math.random() * .25 + .15, intensity: 1,
        });
      }
      for (let i = 0; i < 6; i++) {
        sparkles.push({
          x: Math.random() * (W - 60) + 30, y: Math.random() * (H - 80) + 15,
          size: Math.random() * 2 + 3.5,
          catchAngle: defaultAngle + (Math.random()-.5)*.25,
          catchWidth: Math.random() * .2 + .12, intensity: 1,
        });
      }
    }
    init();
    listen(window, 'resize', init);

    let tick = 0;
    function frame() {
      tick++;
      ctx.clearRect(0, 0, W, H);
      const lightAngle = hovered
        ? Math.atan2(my - .5, mx - .5)
        : hasGyro
          ? Math.atan2(gyroY - .5, gyroX - .5)
          : tick * 0.002;

      sparkles.forEach(s => {
        let diff = lightAngle - s.catchAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const raw = Math.cos(diff / s.catchWidth);
        const directional = Math.max(0, raw) * s.intensity;
        const twinkle = .06 * Math.sin(tick * .012 * s.intensity + s.catchAngle * 3);
        const ambient = .2 + s.intensity * .15;
        const boost = directional * ((hovered || hasGyro) ? 1.4 : 0.9);
        const brightness = Math.min(1, ambient + boost + twinkle);
        if (brightness < .04) return;

        const r = s.size * (.5 + brightness * .5);
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(.3, r * .5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,240,${brightness})`;
        ctx.fill();

        if (s.size > .8) {
          const outerR = r + brightness * r * 1.2;
          const innerR = outerR * .22;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4 - Math.PI / 2;
            const rad = i % 2 === 0 ? outerR : innerR;
            const px = s.x + Math.cos(angle) * rad;
            const py = s.y + Math.sin(angle) * rad;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = `rgba(255,255,240,${brightness * .35})`;
          ctx.fill();
        }
      });
      requestAnimationFrame(frame);
    }
    frame();
  }

  // ============================================================
  // R1: グリッターのみ / R2: グリッター + 金属箔
  // ============================================================
  if (rarity === 'r1' || rarity === 'r2' || rarity === 'kid') {
    createGlitter(glitterCv);
  }

  // ============================================================
  // R2: 金属箔（MAX因子色反映）
  // ============================================================
  if (rarity === 'r2') {

    if (foilCv) {
      const ctx = foilCv.getContext('2d');
      let W, H, cardW, cardH, bright = .55;

      function init() {
        const cr = card.getBoundingClientRect();
        cardW = cr.width || 340; cardH = cr.height || 340;
        W = cardW + 200; H = cardH + 200;
        foilCv.width = W * devicePixelRatio; foilCv.height = H * devicePixelRatio;
        foilCv.style.width = W + 'px'; foilCv.style.height = H + 'px';
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      }
      init();
      listen(window, 'resize', init);

      let tick = 0;
      function drawFoil() {
        tick++;
        bright += ((hovered ? 1 : .55) - bright) * .05;
        ctx.clearRect(0, 0, W, H);

        const wobbleX = Math.sin(tick * .008) * .05;
        const wobbleY = Math.cos(tick * .006) * .04;
        const smx = hovered ? mx : hasGyro ? gyroX : (.5 + wobbleX);
        const smy = hovered ? my : hasGyro ? gyroY : (.5 + wobbleY);
        const bx = smx * cardW + 100, by = smy * cardH + 100;

        const hexToRgb = (hex) => {
          const r = parseInt(hex.slice(1,3), 16);
          const g = parseInt(hex.slice(3,5), 16);
          const b = parseInt(hex.slice(5,7), 16);
          return {r, g, b};
        };
        const fc = maxFactorColor ? hexToRgb(maxFactorColor) : {r:212, g:190, b:140};

        const base = ctx.createLinearGradient(0, 0, W, H);
        base.addColorStop(0, `rgba(${fc.r},${fc.g},${fc.b},${bright * .12})`);
        base.addColorStop(.5, `rgba(${Math.min(255, fc.r+20)},${Math.min(255, fc.g+20)},${Math.min(255, fc.b+20)},${bright * .18})`);
        base.addColorStop(1, `rgba(${fc.r*0.8},${fc.g*0.8},${fc.b*0.8},${bright * .10})`);
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(-25 * Math.PI / 180);
        const g1 = ctx.createLinearGradient(-W, 0, W, 0);
        g1.addColorStop(0, 'rgba(255,255,255,0)');
        g1.addColorStop(.3, `rgba(${Math.min(255, fc.r+50)},${Math.min(255, fc.g+50)},${Math.min(255, fc.b+50)},${bright * .15})`);
        g1.addColorStop(.5, `rgba(255,255,255,${bright * .35})`);
        g1.addColorStop(.7, `rgba(${Math.min(255, fc.r+50)},${Math.min(255, fc.g+50)},${Math.min(255, fc.b+50)},${bright * .15})`);
        g1.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g1;
        ctx.fillRect(-W, -H, W * 2, H * 2);
        ctx.restore();

        ctx.save();
        ctx.translate(bx * .6, by * 1.3);
        ctx.rotate(40 * Math.PI / 180);
        const g2 = ctx.createLinearGradient(-W * .5, 0, W * .5, 0);
        g2.addColorStop(0, 'rgba(255,255,255,0)');
        g2.addColorStop(.35, `rgba(${Math.min(255, fc.r+40)},${Math.min(255, fc.g+40)},${Math.min(255, fc.b+40)},${bright * .10})`);
        g2.addColorStop(.5, `rgba(255,255,255,${bright * .25})`);
        g2.addColorStop(.65, `rgba(${Math.min(255, fc.r+40)},${Math.min(255, fc.g+40)},${Math.min(255, fc.b+40)},${bright * .10})`);
        g2.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g2;
        ctx.fillRect(-W * .5, -H, W, H * 2);
        ctx.restore();

        requestAnimationFrame(drawFoil);
      }
      drawFoil();
    }

    // R2の背景色をMAX因子色に設定
    if (maxFactorColor) {
      const cardBg = card.querySelector('.card-bg');
      if (cardBg) {
        cardBg.style.background = `linear-gradient(160deg, ${maxFactorColor}50 0%, ${maxFactorColor}70 50%, ${maxFactorColor}40 100%), linear-gradient(160deg, #0a0e27 0%, #1a0a3e 40%, #0f172a 100%)`;
      }
    }
  }

  // ============================================================
  // R3-R7: ホログラム演出
  // ============================================================
  if (rarity === 'r3' || rarity === 'r4' || rarity === 'r5' || rarity === 'r6' || rarity === 'r7' || rarity === 'kid') {
    const ctx = holoCv.getContext('2d');
    let W = 0, H = 0, cardW = 0, cardH = 0;
    let t = 0, brightness = 0;

    function init() {
      const cr = card.getBoundingClientRect();
      cardW = cr.width || 340; cardH = cr.height || 340;
      W = cardW + 200; H = cardH + 200;
      holoCv.width = W * devicePixelRatio; holoCv.height = H * devicePixelRatio;
      holoCv.style.width = W + 'px'; holoCv.style.height = H + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    init();
    listen(window, 'resize', init);

    // R3: オーロラ/レインボー
    if (rarity === 'r3') {
      function frame() {
        ctx.clearRect(0, 0, W, H);
        const smx = hovered ? mx : hasGyro ? gyroX : .5;
        const smy = hovered ? my : hasGyro ? gyroY : .5;
        const curtainCount = 5;
        for (let i = 0; i < curtainCount; i++) {
          const baseX = (W / (curtainCount + 1)) * (i + 1);
          const hueBase = 120 + i * 50;
          const wave1 = Math.sin(smx * Math.PI * 3 + i * 1.3) * 45;
          const wave2 = Math.sin(smy * Math.PI * 2 + i * 2.1) * 28;
          const xShift = (smx - .5) * 80;

          for (let layer = 2; layer >= 0; layer--) {
            const spread = 30 + layer * 25;
            const hue = (hueBase + layer * 15 + smx * 90 + smy * 45) % 360;
            const alpha = (.20 - layer * .02) * (hovered ? 1.2 : 1);

            ctx.beginPath();
            ctx.moveTo(baseX + wave1 - spread + xShift, 0);
            for (let y = 0; y <= H; y += 8) {
              const wv = Math.sin(y * .008 + smx * Math.PI * 4 + i) * (15 + layer * 5)
                       + Math.sin(y * .015 + smy * Math.PI * 3 + i * 2) * 8;
              ctx.lineTo(baseX + wave1 + wv - spread + xShift, y);
            }
            for (let y = H; y >= 0; y -= 8) {
              const wv = Math.sin(y * .009 + smx * Math.PI * 3 + i + 1) * (15 + layer * 5)
                       + Math.sin(y * .013 + smy * Math.PI * 2 + i * 3) * 8;
              ctx.lineTo(baseX + wave2 + wv + spread + xShift, y);
            }
            ctx.closePath();

            const grad = ctx.createLinearGradient(baseX - spread + xShift, 0, baseX + spread + xShift, H);
            grad.addColorStop(0, `hsla(${hue}, 85%, 55%, ${alpha})`);
            grad.addColorStop(.3, `hsla(${(hue + 20) % 360}, 90%, 60%, ${alpha * 1.3})`);
            grad.addColorStop(.6, `hsla(${(hue + 40) % 360}, 80%, 50%, ${alpha})`);
            grad.addColorStop(1, `hsla(${(hue + 30) % 360}, 85%, 45%, ${alpha * .6})`);
            ctx.fillStyle = grad;
            ctx.fill();
          }
        }

        for (let i = 0; i < 3; i++) {
          const gx = W * (.2 + i * .3) + (smx - .5) * 80;
          const gy = H * (.3 + i * .2) + (smy - .5) * 60;
          const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, 100);
          const gHue = (140 + i * 80 + smx * 120 + smy * 60) % 360;
          gr.addColorStop(0, `hsla(${gHue}, 100%, 75%, ${hovered ? .14 : .09})`);
          gr.addColorStop(1, `hsla(${gHue}, 100%, 75%, 0)`);
          ctx.fillStyle = gr;
          ctx.fillRect(gx - 100, gy - 100, 200, 200);
        }

        if (hovered) {
          const hx = smx * W, hy = smy * H;
          const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 90);
          hg.addColorStop(0, 'rgba(255,255,255,.12)');
          hg.addColorStop(.5, 'rgba(255,255,255,.04)');
          hg.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = hg;
          ctx.fillRect(hx - 90, hy - 90, 180, 180);
        }

        requestAnimationFrame(frame);
      }
      frame();
    }

    // R4: ダイヤモンドホログラム（金・角度対応）
    if (rarity === 'r4') {
      const CELL = 18, DEPTH = 0.42, BASE_HUE = 38;

      // ジャイロ（スマホの傾き）対応
      let gyroX4 = 0.5, gyroY4 = 0.5, hasGyro4 = false;
      listen(window, 'deviceorientation', e => {
        if (e.gamma === null) return;
        hasGyro4 = true;
        gyroX4 = (Math.max(-45, Math.min(45, e.gamma)) + 45) / 90;
        gyroY4 = (Math.max(-30, Math.min(30, e.beta || 0)) + 30) / 60;
      }, { passive: true });

      // 光源位置を取得（マウス優先 → ジャイロ → 自動揺動）
      function getLightPos4() {
        if (hovered) return [mx, my];
        if (hasGyro4) return [gyroX4, gyroY4];
        const a = t * 0.003;
        return [0.5 + Math.sin(a) * 0.4, 0.5 + Math.cos(a * 0.7) * 0.3];
      }

      // 各ファセットの明度を光源方向から計算
      // faceIdx: 0=上 1=下 2=左 3=右
      function getFacetL(faceIdx, lx, ly) {
        const dx = (lx - 0.5) * 2; // -1〜1
        const dy = (ly - 0.5) * 2; // -1〜1
        switch(faceIdx) {
          case 0: return 55 + Math.max(0, -dy) * 38; // 上面：光が上から来るほど明るい
          case 1: return 12 + Math.max(0,  dy) * 28; // 下面：光が下から来るほど明るい
          case 2: return 35 + Math.max(0, -dx) * 32; // 左面：光が左から来るほど明るい
          case 3: return 22 + Math.max(0,  dx) * 32; // 右面：光が右から来るほど明るい
        }
      }

      function getCellColor(col, row, faceIdx) {
        const [lx, ly] = getLightPos4();
        const cols = Math.ceil(W / CELL) + 1;
        const rows = Math.ceil(H / CELL) + 1;
        const x = col / cols, y = row / rows;
        const wave =
          Math.sin(x * 6.28 + y * 2.09 + t * 0.00025) * 0.35 +
          Math.sin(x * 3.71 - y * 5.13 + t * 0.00035) * 0.28 +
          Math.sin((x - y)  * 4.97      + t * 0.00020) * 0.22 +
          Math.sin(x * 2.33 + y * 7.81 + t * 0.00030) * 0.15;
        const hue = BASE_HUE + wave * 18;
        const sat = 85 + wave * 12;
        const facetL = getFacetL(faceIdx, lx, ly);
        const lit = facetL + wave * 8;
        return `hsl(${hue.toFixed(1)},${sat.toFixed(1)}%,${Math.max(4, lit).toFixed(1)}%)`;
      }

      function drawCell(col, row) {
        const cx = col * CELL, cy = row * CELL, d = CELL * DEPTH;
        const tl = [cx, cy], tr = [cx+CELL, cy], bl = [cx, cy+CELL], br = [cx+CELL, cy+CELL];
        const cc = [cx + CELL/2, cy + CELL/2 - d*0.2];
        [
          { pts:[tl,tr,cc], fi:0 }, { pts:[bl,br,cc], fi:1 },
          { pts:[tl,bl,cc], fi:2 }, { pts:[tr,br,cc], fi:3 },
        ].forEach(({ pts, fi }) => {
          ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);
          ctx.lineTo(pts[1][0], pts[1][1]);
          ctx.lineTo(pts[2][0], pts[2][1]);
          ctx.closePath();
          ctx.fillStyle = getCellColor(col, row, fi);
          ctx.fill();
        });
      }

      function frame() {
        t++; // 常にアニメーション
        ctx.clearRect(0, 0, W, H);
        const cols = Math.ceil(W / CELL) + 1;
        const rows = Math.ceil(H / CELL) + 1;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            drawCell(c, r);
          }
        }
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 0.5;
        for (let r = 0; r <= rows; r++) { ctx.beginPath(); ctx.moveTo(0,r*CELL); ctx.lineTo(W,r*CELL); ctx.stroke(); }
        for (let c = 0; c <= cols; c++) { ctx.beginPath(); ctx.moveTo(c*CELL,0); ctx.lineTo(c*CELL,H); ctx.stroke(); }
        requestAnimationFrame(frame);
      }
      frame();
    }

    // R5: サンドホログラム
    if (rarity === 'r5') {
      const PARTICLE_COUNT = 5000;
      const particles = [];
      const bgImg = new Image();
      bgImg.src = 'images/holo/sand.jpg';

      // ジャイロ（スマホの傾き）対応
      let gyroX5 = 0.5, gyroY5 = 0.5, hasGyro5 = false;
      listen(window, 'deviceorientation', e => {
        if (e.gamma === null) return;
        hasGyro5 = true;
        gyroX5 = (Math.max(-45, Math.min(45, e.gamma)) + 45) / 90;
        gyroY5 = (Math.max(-30, Math.min(30, e.beta || 0)) + 30) / 60;
      }, { passive: true });

      function generateParticles() {
        particles.length = 0;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: Math.random() * W, y: Math.random() * H,
            size: Math.random() * 3.5 + 0.5,
            catchAngle: Math.random() * Math.PI * 2, // 全方向に均等分布
            catchWidth: Math.random() * 0.5 + 0.25,
            catchIntensity: Math.random() * 0.5 + 0.5,
            hue: Math.random() * 360,
          });
        }
      }
      generateParticles();

      function frame() {
        t++; // 常にアニメーション
        ctx.clearRect(0, 0, W, H);
        if (bgImg.complete && bgImg.naturalWidth > 0) {
          ctx.globalAlpha = 0.55; // CSS背景が透けて見えるよう半透明で描画
          ctx.drawImage(bgImg, 0, 0, W, H);
          ctx.globalAlpha = 1;
        }

        const smx = hovered ? mx : hasGyro5 ? gyroX5 : 0.5;
        const smy = hovered ? my : hasGyro5 ? gyroY5 : 0.5;
        // ホバー/ジャイロ時は位置から角度計算、それ以外は時間で自動回転
        const lightAngle = (hovered || hasGyro5)
          ? Math.atan2(smy - .5, smx - .5)
          : t * 0.002;
        const hueShift = (smx - .5) * 40 + (smy - .5) * 20;

        ctx.globalCompositeOperation = 'screen';
        particles.forEach(p => {
          let diff = lightAngle - p.catchAngle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          const catchBright = Math.max(0, Math.cos(diff / p.catchWidth)) * p.catchIntensity;
          if (catchBright < 0.03) return;
          const hue = (p.hue + hueShift + 360) % 360;
          const light = 50 + catchBright * 50;
          const alpha = catchBright * 0.9;
          ctx.fillStyle = `hsla(${hue.toFixed(1)}, 80%, ${light.toFixed(1)}%, ${alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(frame);
      }
      frame();
    }

    // R6/R7: ランダム/ダークランダムホログラム
    if (rarity === 'r6' || rarity === 'r7' || rarity === 'kid') {
      const IS_DARK = rarity === 'r7';
      const quads = [];
      const bgImg = new Image();
      bgImg.src = IS_DARK ? 'images/holo/dark_random.jpg' : 'images/holo/random.jpg';

      function generateTiles() {
        quads.length = 0;
        const COLS = 22, ROWS = 32;
        const cw = W / COLS, ch = H / ROWS;
        const JITTER = .55;
        const pts = [];
        for (let r = 0; r <= ROWS; r++) {
          pts[r] = [];
          for (let c = 0; c <= COLS; c++) {
            const jx = (c === 0 || c === COLS) ? 0 : (Math.random() - .5) * cw * JITTER;
            const jy = (r === 0 || r === ROWS) ? 0 : (Math.random() - .5) * ch * JITTER;
            pts[r][c] = { x: c * cw + jx, y: r * ch + jy };
          }
        }
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const tl = pts[r][c], tr = pts[r][c+1];
            const bl = pts[r+1][c], br = pts[r+1][c+1];
            quads.push({
              tl, tr, bl, br,
              cx: (tl.x+tr.x+bl.x+br.x)/4, cy: (tl.y+tr.y+bl.y+br.y)/4,
              hue: IS_DARK ? (Math.random() * 60 + 200) : (Math.random() * 360),
              catchAngle: Math.random() * Math.PI * 2,
              catchWidth: Math.random() * .4 + .2,
              catchIntensity: Math.random() * .5 + .5,
            });
          }
        }
      }
      generateTiles();

      function frame() {
        t++;
        ctx.clearRect(0, 0, W, H);
        if (bgImg.complete && bgImg.naturalWidth > 0) {
          ctx.drawImage(bgImg, 0, 0, W, H);
        }
        const smx = hovered ? mx : hasGyro ? gyroX : .5;
        const smy = hovered ? my : hasGyro ? gyroY : .5;
        const lightAngle = (hovered || hasGyro) ? Math.atan2(smy - .5, smx - .5) : t * 0.002;

        ctx.globalCompositeOperation = 'screen';
        quads.forEach(q => {
          let diff = lightAngle - q.catchAngle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          const brightness = Math.max(0, Math.cos(diff / q.catchWidth)) * q.catchIntensity;
          if (brightness < .04) return;
          const hueShift = (smx - .5) * 60 + (smy - .5) * 30;
          const hue = (q.hue + hueShift + 360) % 360;
          const sat = IS_DARK ? (25 + brightness * 45) : 85;
          const light = 15 + brightness * (IS_DARK ? 40 : 65);
          const alpha = brightness * .85;
          ctx.fillStyle = `hsla(${hue.toFixed(1)}, ${sat.toFixed(0)}%, ${light.toFixed(1)}%, ${alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.moveTo(q.tl.x, q.tl.y);
          ctx.lineTo(q.tr.x, q.tr.y);
          ctx.lineTo(q.bl.x, q.bl.y);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(q.tr.x, q.tr.y);
          ctx.lineTo(q.br.x, q.br.y);
          ctx.lineTo(q.bl.x, q.bl.y);
          ctx.closePath();
          ctx.fill();
        });
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(frame);
      }
      frame();
    }
  }
return function(){stopped=true;controller.abort();observers.forEach(o=>o.disconnect());callbacks.forEach(id=>window.cancelAnimationFrame(id));callbacks.clear();};
};
