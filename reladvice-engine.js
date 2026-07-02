/* ===== reladvice 判定エンジン v2（2026-07-02 フェーズ2：個別化） =====
   reladvice-data.js（RULES/THEMES/CATEGORIES/PAIR_NOTES/SELF_NOTES）とセットで読み込む。
   v1からの変更点：
   - 固定優先度 → ペアごとの「目立ち度」でルールを選択・並び替え
   - 実スコア・差・程度ラベルを各カードに付与（scoreline）
   - 汎用フォールバック廃止 → 因子×2人の状態に応じた PAIR_NOTES で必ず個別の話をする
   - アプローチ系テーマでは自分側の極端因子から SELF_NOTES を1枚追加 */

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

/* --- v2: 目立ち度（このペアでどの因子が話の主役か） --- */
function degLabel(d) { return d >= 3 ? 'かなり大きい' : d === 2 ? '大きめ' : d === 1 ? '少しだけ' : 'ほぼ同じ'; }
function extremeness(p, key) { return Math.abs(sc(p, key) - 3); }
function salience(p1, p2) {
  return FACTORS.map(function(f) {
    var k = f.key;
    return {
      key: k, name: f.name,
      v1: sc(p1, k), v2: sc(p2, k), diff: diff(p1, p2, k),
      score: diff(p1, p2, k) * 2 + extremeness(p1, k) + extremeness(p2, k)
    };
  }).sort(function(a, b) { return b.score - a.score; });
}

/* ルールが言及している因子を when関数のソースから推定（rに f:'C' 等の明示タグがあれば優先） */
function ruleFactors(r) {
  if (r.f) return Array.isArray(r.f) ? r.f : [r.f];
  var src = String(r.when);
  var out = [];
  ['O','C','E','A','N'].forEach(function(k) {
    if (src.indexOf("'" + k + "'") >= 0 || src.indexOf('"' + k + '"') >= 0) out.push(k);
  });
  return out;
}

/* 2人の状態（因子ごと）: hh=両方高い ll=両方低い p1hi/p2hi=差2以上 mid=近い */
function pairState(p1, p2, key) {
  var v1 = sc(p1, key), v2 = sc(p2, key);
  if (v1 >= 4 && v2 >= 4) return 'hh';
  if (v1 <= 2 && v2 <= 2) return 'll';
  if (v1 - v2 >= 2) return 'p1hi';
  if (v2 - v1 >= 2) return 'p2hi';
  return 'mid';
}

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
    ctx['diff:' + k] = diff(p1, p2, k);
    ctx['deg:' + k] = degLabel(diff(p1, p2, k));
  });
  return ctx;
}
function fillTemplate(str, ctx) {
  return String(str).replace(/\{(\w+(?::\w+)?)\}/g, function(_, key) {
    return ctx[key] !== undefined ? ctx[key] : '';
  });
}

/* 因子キー配列 → 「誠実性：太郎さん 4 ／ 花子さん 2（差2・大きめ）」のスコア表示文 */
function buildScoreline(keys, p1, p2, ctx) {
  var parts = [];
  keys.forEach(function(k) {
    var f = null;
    FACTORS.forEach(function(x) { if (x.key === k) f = x; });
    if (!f) return;
    var v1 = sc(p1, k), v2 = sc(p2, k), d = Math.abs(v1 - v2);
    parts.push(f.name + '：' + ctx.name1 + 'さん ' + v1 + ' ／ ' + ctx.name2 + 'さん ' + v2 + '（差' + d + '・' + degLabel(d) + '）');
  });
  return parts.join('　');
}

/* ===== メイン：ペア分析 =====
   戻り値: { items: [{title,detail,advice,scoreline,kind,factors}], selfNote, salience, top } */
function analyzePair(themeId, p1, p2, ctx, maxN) {
  maxN = maxN || 3;
  var sal = salience(p1, p2);
  var salMap = {};
  sal.forEach(function(s, i) { salMap[s.key] = { score: s.score, rank: i }; });

  /* 1) テーマ固有ルール（旧フォールバック＝因子なし&priority0 は除外）を目立ち度で採点 */
  var rules = (typeof RULES !== 'undefined' && RULES[themeId]) || [];
  var matched = [];
  for (var i = 0; i < rules.length; i++) {
    var r = rules[i];
    var fks = ruleFactors(r);
    if (fks.length === 0 && (r.priority || 0) === 0) continue; /* 汎用フォールバック廃止 */
    try {
      if (r.when(p1, p2, ctx)) {
        var relScore = 0;
        fks.forEach(function(k) { if (salMap[k]) relScore = Math.max(relScore, salMap[k].score); });
        matched.push({
          kind: 'rule', order: i, factors: fks,
          rank: relScore * 10 + (r.priority || 0),
          title: fillTemplate(r.title, ctx),
          detail: fillTemplate(r.detail, ctx),
          advice: fillTemplate(r.advice, ctx),
          scoreline: buildScoreline(fks, p1, p2, ctx)
        });
      }
    } catch (e) {}
  }
  matched.sort(function(a, b) { return (b.rank - a.rank) || (a.order - b.order); });

  /* 同じ因子の組の話が2枚並ばないように間引く（話題を散らす） */
  var used = {}, picked = [];
  matched.forEach(function(m) {
    var key = m.factors.slice().sort().join('');
    if (picked.length < maxN && !used[key]) { picked.push(m); used[key] = true; }
  });

  /* 1b) 見立てで名指しする最重要因子の話が必ず入るようにする */
  if (typeof PAIR_NOTES !== 'undefined') {
    var topKey = sal[0].key;
    var hasTop = picked.some(function(m) { return m.factors.indexOf(topKey) >= 0; });
    if (!hasTop) {
      var topNote = PAIR_NOTES[topKey] && PAIR_NOTES[topKey][pairState(p1, p2, topKey)];
      if (topNote) {
        picked.unshift({
          kind: 'pair', factors: [topKey],
          title: fillTemplate(topNote.title, ctx),
          detail: fillTemplate(topNote.detail, ctx),
          advice: fillTemplate(topNote.advice, ctx),
          scoreline: buildScoreline([topKey], p1, p2, ctx)
        });
        if (picked.length > maxN) picked.pop();
      }
    }
  }

  /* 2) 枠が余ったら PAIR_NOTES（因子×2人の状態）で必ず個別の話を足す */
  if (typeof PAIR_NOTES !== 'undefined') {
    for (var s = 0; s < sal.length && picked.length < maxN; s++) {
      var k = sal[s].key;
      var covered = picked.some(function(m) { return m.factors.indexOf(k) >= 0; });
      if (covered) continue;
      var note = PAIR_NOTES[k] && PAIR_NOTES[k][pairState(p1, p2, k)];
      if (!note) continue;
      picked.push({
        kind: 'pair', factors: [k],
        title: fillTemplate(note.title, ctx),
        detail: fillTemplate(note.detail, ctx),
        advice: fillTemplate(note.advice, ctx),
        scoreline: buildScoreline([k], p1, p2, ctx)
      });
    }
  }

  /* 3) アプローチ系テーマ: 自分側の一番の極端因子から一言（SELF_NOTES） */
  var selfNote = null;
  var selfThemes = { like:1, 'work-close':1, 'work-trust':1, 'friend-close':1 };
  if (typeof SELF_NOTES !== 'undefined' && selfThemes[themeId]) {
    var best = null;
    FACTORS.forEach(function(f) {
      var e = extremeness(p1, f.key);
      if (e >= 2 && (!best || e > best.e)) best = { key: f.key, e: e, hi: sc(p1, f.key) >= 4 };
    });
    if (best) {
      var sn = SELF_NOTES[best.key] && SELF_NOTES[best.key][best.hi ? 'high' : 'low'];
      if (sn) {
        selfNote = {
          kind: 'self', factors: [best.key],
          title: fillTemplate(sn.title, ctx),
          detail: fillTemplate(sn.detail, ctx),
          advice: fillTemplate(sn.advice, ctx),
          scoreline: ''
        };
      }
    }
  }

  return { items: picked, selfNote: selfNote, salience: sal, top: sal[0] };
}

/* ===== ペア相性タイプ判定（フェーズ3）：一番目立つ因子とその形で16タイプ =====
   戻り値: { name, copy, roleLine, factorKey, factorName, color, state, v1, v2 } */
function pairType(p1, p2, ctx) {
  if (typeof PAIR_TYPES === 'undefined') return null;
  var sal = salience(p1, p2);
  var top = sal[0];
  var f = null;
  FACTORS.forEach(function(x) { if (x.key === top.key) f = x; });
  var st = pairState(p1, p2, top.key);
  var base = { factorKey: top.key, factorName: top.name, color: f ? f.color : '#8b5cf6', v1: top.v1, v2: top.v2 };

  if (st === 'mid' || (st !== 'p1hi' && st !== 'p2hi' && st !== 'hh' && st !== 'll')) {
    var b = PAIR_TYPES.balance;
    return Object.assign(base, { name: b.name, copy: b.copy, roleLine: '', state: 'balance' });
  }
  var t;
  if (st === 'p1hi' || st === 'p2hi') {
    t = PAIR_TYPES[top.key] && PAIR_TYPES[top.key].gap;
    if (!t) return null;
    var hiName = st === 'p1hi' ? ctx.name1 : ctx.name2;
    var loName = st === 'p1hi' ? ctx.name2 : ctx.name1;
    return Object.assign(base, {
      name: t.name, copy: t.copy, state: 'gap',
      roleLine: hiName + 'さんが' + t.hiRole + '、' + loName + 'さんが' + t.loRole
    });
  }
  t = PAIR_TYPES[top.key] && PAIR_TYPES[top.key][st];
  if (!t) return null;
  return Object.assign(base, { name: t.name, copy: t.copy, roleLine: '', state: st });
}

/* v1互換ラッパー（計測スクリプト等が使用） */
function evaluateRules(themeId, p1, p2, ctx, maxN) {
  var r = analyzePair(themeId, p1, p2, ctx, maxN ? Math.min(maxN, 3) : 3);
  var items = r.items.slice();
  if (r.selfNote) items.push(r.selfNote);
  return items;
}

function buildTitle(theme, ctx) {
  if (!theme || !theme.sub) return '';
  return fillTemplate(theme.sub, ctx);
}
