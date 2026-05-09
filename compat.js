/* ===== ビッグファイブ診断 共通相性計算 ===== */

function calcCompatCore(my, partner, weights) {
  const m = { E: my.E, N: my.N, O: my.O, C: my.C, A: my.A };
  const p = { E: partner.E, N: partner.N, O: partner.O, C: partner.C, A: partner.A };

  // 差分
  const dE = Math.abs(m.E - p.E);
  const dN = Math.abs(m.N - p.N);
  const dO = Math.abs(m.O - p.O);
  const dC = Math.abs(m.C - p.C);
  const dA = Math.abs(m.A - p.A);

  // 生スコア計算（Actor効果 + Partner効果 + 差分ペナルティ）
  let rawScore =
    (6 - m.N) * 5.0 +   // 自分のN低さ（Actor効果 ρ=-.29）
    (6 - p.N) * 4.0 +   // 相手のN低さ（Partner効果 r=-.22）
    m.A * 5.0 +          // 自分のA高さ（Actor効果 ρ=+.29）
    p.A * 3.5 +          // 相手のA高さ（Partner効果 r=+.15）
    m.C * 3.0 +          // 自分のC高さ（Actor効果 ρ=+.25）
    p.C * 1.5 +          // 相手のC高さ（Partner効果 r=+.12）
    (-dC * 2.0) +       // Cスコア差ペナルティ
    (-dE * 3.5) +       // Eスコア差ペナルティ
    (-dO * 0.5);        // Oスコア差ペナルティ

  // 特殊パターン補正
  if (m.N >= 4 && p.A <= 2) rawScore -= 15;
  if (p.N >= 4 && m.A <= 2) rawScore -= 15;
  if (m.N <= 2 && p.N <= 2) rawScore += 8;
  if (m.A >= 4 && p.A >= 4) rawScore += 8;

  // 関係性の重みで差分ペナルティを調整
  if (weights) {
    rawScore += (-dN) * (weights.N || 1) * 1.5;
    rawScore += (-dA) * (weights.A || 1) * 0.5;
  }

  // 正規化: -30〜130 → 0〜100
  const MIN = -30, MAX = 130;
  const normalizedScore = (rawScore - MIN) / (MAX - MIN) * 100;
  return Math.max(0, Math.min(100, normalizedScore));
}
