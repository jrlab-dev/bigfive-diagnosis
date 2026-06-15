/* ===== ビッグファイブ診断 共通レアリティ計算 ===== */

// オリジナルアニメキャラ レアリティ上書きテーブル
// key: コード, value: { default: 'rN', F: 'rN'|'secret', M: 'rN'|'secret' }
var ANIME_RARITY_OVERRIDE = {
  '33433': { default: 'r3' },   // 真士（ME社時代）
  '13215': { default: 'r3' },   // 安田毅 / 里見彩
  '22455': { default: 'r3' },   // 仲田陽介 / 沢田誠子
  '44352': { default: 'r5' },   // 五味拓海（終盤）
  '35453': { default: 'r4' },   // 真士（覚醒後）
  '54421': { F: 'r4', M: 'secret' }, // メンタリスト（オリジナル）M=secret / F=r4(F版未実装) ※神山凜は別コード(45411)の通常キャラ・シークレット外
};

function isMax(factor, value) {
  if (factor === 'N') return value === 1;
  if (factor === 'E' || factor === 'A') return value === 1 || value === 5;
  return value === 5;
}

function computeRarity(code, gender) {
  // アニメキャラ上書きチェック
  var ov = ANIME_RARITY_OVERRIDE[code];
  if (ov) {
    if (gender && ov[gender]) return ov[gender];
    return ov.default;
  }

  var o = +code[0], c = +code[1], e = +code[2], a = +code[3], n = +code[4];
  var mc = 0;
  if (isMax('O', o)) mc++;
  if (isMax('C', c)) mc++;
  if (isMax('E', e)) mc++;
  if (isMax('A', a)) mc++;
  if (isMax('N', n)) mc++;
  if (mc === 0) return 'r1';
  if (mc === 1) return 'r2';
  if (mc === 2) return 'r3';
  if (mc === 3) return 'r4';
  return 'r5';
}
