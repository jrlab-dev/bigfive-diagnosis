/* ===== reladvice 判定エンジン（reladvice.htmlから2026-07-02外部化・ロジック変更なし） =====
   reladvice-data.js（RULES/THEMES/CATEGORIES）とセットで読み込む。 */

var FACTORS = [
  { key:'O', name:'開放性', color:'#8b5cf6' },
  { key:'C', name:'誠実性', color:'#3b82f6' },
  { key:'E', name:'外向性', color:'#f97316' },
  { key:'A', name:'協調性', color:'#f472b6' },
  { key:'N', name:'感受性', color:'#14b8a6' },
];
var CODE_IDX = { O:0, C:1, E:2, A:3, N:4 };

function sc(p, key) {
  if (p.scores && p.scores[key] !== undefined && p.scores[key] !== null) return Number(p.scores[key]);
  if (p.code && p.code.length >= 5 && CODE_IDX[key] !== undefined) {
    var v = parseInt(p.code[CODE_IDX[key]]); return isNaN(v) ? 3 : v;
  }
  return 3;
}
function isHigh(p, key) { return sc(p, key) >= 4; }
function isLow(p, key)  { return sc(p, key) <= 2; }
function diff(p1, p2, key) { return Math.abs(sc(p1, key) - sc(p2, key)); }

/* ===== テンプレート評価エンジン ===== */
function buildCtx(p1, p2, n1, n2) {
  var LVL = { high:'高め', mid:'ふつう', low:'低め' };
  var ctx = { name1: n1, name2: n2 };
  FACTORS.forEach(function(f) {
    var k = f.key;
    ctx['factor:' + k] = f.name;
    ctx['n1' + k] = sc(p1, k);
    ctx['n2' + k] = sc(p2, k);
    ctx['lvl1:' + k] = isHigh(p1, k) ? LVL.high : (isLow(p1, k) ? LVL.low : LVL.mid);
    ctx['lvl2:' + k] = isHigh(p2, k) ? LVL.high : (isLow(p2, k) ? LVL.low : LVL.mid);
  });
  return ctx;
}
function fillTemplate(str, ctx) {
  return String(str).replace(/\{(\w+(?::\w+)?)\}/g, function(_, key) {
    return ctx[key] !== undefined ? ctx[key] : '';
  });
}
function evaluateRules(themeId, p1, p2, ctx, maxN) {
  var rules = RULES[themeId] || [];
  var matched = [];
  for (var i = 0; i < rules.length; i++) {
    var r = rules[i];
    try {
      if (r.when(p1, p2, ctx)) {
        matched.push({
          priority: r.priority || 0, order: i,
          title: fillTemplate(r.title, ctx),
          detail: fillTemplate(r.detail, ctx),
          advice: fillTemplate(r.advice, ctx)
        });
      }
    } catch(e) {}
  }
  matched.sort(function(a, b) { return (b.priority - a.priority) || (a.order - b.order); });
  if (matched.length === 0) {
    matched.push({
      priority: 0, order: 0,
      title: 'おふたりのスコアから、特性の大きなズレは見つかりませんでした',
      detail: 'ビッグファイブは性格傾向の参考です。関係の形は、おふたりのタイミングや環境の影響も大きく受けます。',
      advice: 'スコアの数字だけでなく、実際のやり取りのなかで何が合って何が違うかを言葉にしてみるのがおすすめです。'
    });
  }
  return matched.slice(0, maxN || 3);
}
function buildTitle(theme, ctx) {
  if (!theme || !theme.sub) return '';
  return fillTemplate(theme.sub, ctx);
}
