const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const HTML_FILE = path.resolve(__dirname, 'card_capture.html');
const OUTPUT_DIR = path.resolve(__dirname, '画像');

const cards = [
  { id: 'wrapper1', file: 'card_left_kira.png', pad: 100 },
  { id: 'wrapper2', file: 'card_center_common.png' },
  { id: 'wrapper3', file: 'card_right_holo.png', pad: 100 }
];

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  await page.goto(`file:///${HTML_FILE.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0', timeout: 30000 });

  // 画像とホログラムキャンバスの描画を待つ
  await page.waitForFunction(() => window._imagesLoaded >= window._totalImages, { timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  for (const { id, file, pad } of cards) {
    const rect = await page.evaluate(el => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    }, await page.$(`#${id}`));

    const p = pad || 0;
    await page.screenshot({
      path: path.join(OUTPUT_DIR, file),
      clip: { x: rect.x - p, y: rect.y - p, width: rect.w + p * 2, height: rect.h + p * 2 }
    });
    console.log(`OK: ${file} (${rect.w}x${rect.h})`);
  }

  await browser.close();
  console.log('Done!');
})();
