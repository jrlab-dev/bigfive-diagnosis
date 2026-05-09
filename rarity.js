/* ===== ビッグファイブ診断 共通レアリティ計算 ===== */

function isMax(factor, value) {
  if (factor === 'N') return value === 1;
  if (factor === 'E' || factor === 'A') return value === 1 || value === 5;
  return value === 5;
}

function computeRarity(code) {
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
