'use strict';

// 2026-05-21 00:00:00 JST = 2026-05-20T15:00:00Z
var UNLOCK_DEPLOY_DATE = '2026-05-20T15:00:00.000Z';

var UNLOCK_TABLE = [
  { cards:  1, id: 'love',               label: '恋愛スタイル診断',       url: 'love.html' },
  // 2026-08-09：総合レポートを8枚→1枚へ（診断を1回受ければ開く）。
  // 理由＝①中身は全部無料コンテンツで、隠す理由が無かった ②「¥980を断った人の出口」として
  // result.htmlから案内している先が、カード8枚未満の人には鍵付きの扉になっていた
  // ③クロス分析は「他の診断を受けた人にしか書けない」ので、カード枚数で隠す必要が無い
  // （未受診の人には「サブ診断を受けるとここに表示されます」という案内文が元から出る作り）
  // loveの後に置いているのは、解放バナーを「恋愛スタイル→総合レポート」の順に出すため
  { cards:  1, id: 'report',             label: '総合レポート',          url: 'report.html' },
  { cards:  2, id: 'other',              label: 'あの人診断',            url: 'other_quiz.html' },
  { cards:  3, id: 'career',             label: 'キャリア適性診断',      url: 'career.html' },
  { cards:  4, id: 'impostor',           label: 'インポスター症候群チェック', url: 'impostor.html' },
  { cards:  5, id: 'other-detailed',     label: 'あの人診断 精密版（60問）', url: 'other_quiz.html' },
  { cards:  6, id: 'team',               label: 'チーム相性診断',        url: 'team.html' },
  { cards: 70, id: 'other-detailed2',   label: 'あの人診断 120問相当精密版', url: 'other_quiz.html' },
  { cards: 10, id: 'attachment',         label: '愛着スタイル診断',      url: 'attachment.html' },
  { cards: 14, id: 'mindset',            label: 'マインドセット診断',     url: 'mindset.html' },
  { cards: 18, id: 'schwartz',           label: '価値観診断',            url: 'schwartz.html' },
  { cards: 20, id: 'zukan_s2',           label: 'コレクション Stage 2',   url: 'zukan.html' },
  { cards: 25, id: 'eq',                 label: 'EQ診断',               url: 'eq.html' },
  { cards: 30, id: 'riasec',             label: 'RIASEC職業興味診断',    url: 'riasec.html' },
  { cards: 30, id: 'other_limit_30',     label: 'あの人保存30件に拡張',   url: null },
  { cards: 35, id: 'career-integration', label: 'キャリア統合分析',      url: 'career-integration.html' },
  { cards: 40, id: 'locus',              label: '統制の所在診断',        url: 'locus.html' },
  { cards: 40, id: 'other_limit_40',     label: 'あの人保存40件に拡張',   url: null },
  { cards: 45, id: 'sdt',                label: '動機づけ診断',          url: 'sdt.html' },
  { cards: 50, id: 'dark-triad',         label: 'ダークトライアド診断',   url: 'dark-triad.html' },
  { cards: 50, id: 'other_limit_50',     label: 'あの人保存50件に拡張',   url: null },
  { cards: 55, id: 'other-dark-triad',   label: 'あの人のダークトライアド診断', url: 'other_dark_triad.html' },
  { cards: 60, id: 'other-attachment',   label: 'あの人の愛着スタイル診断', url: 'other_attachment.html' },
  { cards: 65, id: 'other-eq',           label: 'あの人のEQ診断',          url: 'other_eq.html' },
  { cards: 77, id: 'bigfiveman',         label: 'ビッグファイブマン分析',   url: 'team.html' },
  { cards: 80, id: 'other_limit_70',     label: 'あの人保存70件に拡張',    url: null },
  { cards: 110, id: 'other_limit_85',    label: 'あの人保存85件に拡張',    url: null },
  { cards: 150, id: 'other_limit_100',   label: 'あの人保存100件に拡張',   url: null },
  { cards: 90, id: 'group',             label: 'グループ分けツール',       url: 'group.html' },
  { cards: 100, id: 'zukan_s3',          label: '完全図鑑 Stage 3',      url: 'zukan.html' },
  { cards: 200, id: 'hexaco',            label: 'HEXACO性格診断',         url: 'hexaco.html' },
];

// 常に解放済みのID
var ALWAYS_UNLOCKED_IDS = ['bigfive', 'hsp', 'kodomo'];

function isLegacyUser() {
  try { if (localStorage.getItem('bigfive_legacy_user') === 'true') return true; } catch(e) { return false; }
  try {
    var album = JSON.parse(localStorage.getItem('bigfive_album') || '[]');
    var myResults = JSON.parse(localStorage.getItem('bigfive_my_results') || '[]');
    var allData = album.concat(myResults);
    var hasOldData = allData.some(function(r) {
      return r.date && r.date < UNLOCK_DEPLOY_DATE;
    });
    if (hasOldData) {
      localStorage.setItem('bigfive_legacy_user', 'true');
      return true;
    }
  } catch(e) {}
  return false;
}

function getCardCount() {
  try {
    return JSON.parse(localStorage.getItem('bigfive_album') || '[]').length;
  } catch(e) { return 0; }
}

function isUnlocked(featureId) {
  if (ALWAYS_UNLOCKED_IDS.indexOf(featureId) >= 0) return true;
  if (isLegacyUser()) return true;
  var count = getCardCount();
  var entry = null;
  for (var i = 0; i < UNLOCK_TABLE.length; i++) {
    if (UNLOCK_TABLE[i].id === featureId) { entry = UNLOCK_TABLE[i]; break; }
  }
  if (!entry) return true;
  return count >= entry.cards;
}

function getNewUnlocks(oldCount, newCount) {
  if (isLegacyUser()) return [];
  return UNLOCK_TABLE.filter(function(e) {
    return e.cards > oldCount && e.cards <= newCount;
  });
}

function getRequiredCards(featureId) {
  for (var i = 0; i < UNLOCK_TABLE.length; i++) {
    if (UNLOCK_TABLE[i].id === featureId) return UNLOCK_TABLE[i].cards;
  }
  return 0;
}

function getOtherLimit() {
  if (isLegacyUser()) return 100;
  var count = getCardCount();
  if (count >= 150) return 100;
  if (count >= 110) return 85;
  if (count >= 80) return 70;
  if (count >= 50) return 50;
  if (count >= 40) return 40;
  if (count >= 30) return 30;
  if (count >= 1)  return 20;
  // カード0枚でも基本10件（シェアで初めて来た人がすぐ保存できる＝通常運営。
  // こども診断・あの人診断側のMath.max(10,...)下駄と同じ値）
  return 10;
}

// ゲート表示（ロックされたページ用）
function renderGate(featureId) {
  if (isUnlocked(featureId)) return;
  if (document.getElementById('unlock-gate')) return;
  var required = getRequiredCards(featureId);
  var current = getCardCount();
  var remaining = required - current;
  var label = featureId;
  for (var i = 0; i < UNLOCK_TABLE.length; i++) {
    if (UNLOCK_TABLE[i].id === featureId) { label = UNLOCK_TABLE[i].label; break; }
  }
  var pct = required > 0 ? Math.min(100, Math.round(current / required * 100)) : 0;

  var isLight = document.body.classList.contains('theme-light');
  var c = isLight ? {
    bg: 'rgba(248,250,252,0.20)',
    cardBg: 'rgba(248,250,252,0.93)',
    cardShadow: '0 8px 32px rgba(0,0,0,0.18)',
    text: '#1e293b',
    sub: '#475569',
    muted: '#64748b',
    h2: '#1e293b',
    boxBg: 'rgba(139,92,246,0.06)',
    boxBorder: 'rgba(139,92,246,0.2)',
    label: '#6d28d9',
    accent: '#7c3aed',
    barBg: '#e2e8f0',
    backLink: '#94a3b8'
  } : {
    bg: 'rgba(10,14,39,0.20)',
    cardBg: 'rgba(10,14,39,0.93)',
    cardShadow: '0 8px 32px rgba(0,0,0,0.5)',
    text: '#e2e8f0',
    sub: '#94a3b8',
    muted: '#64748b',
    h2: '#e2e8f0',
    boxBg: 'rgba(139,92,246,0.1)',
    boxBorder: 'rgba(139,92,246,0.3)',
    label: '#c4b5fd',
    accent: '#a78bfa',
    barBg: '#1e293b',
    backLink: '#64748b'
  };

  // チーム相性診断は「すぐ開く」ことが伝わるよう、その人の今の状態に合わせた最短ルートを出す（2026-10-22）
  // 鍵の枚数（UNLOCK_TABLEの6枚）は変えない。順番は 自分の診断 → ガチャ → あの人診断（あの人診断は2枚で開くため）
  if (featureId === 'team') {
    renderTeamGate(c, current, required);
    return;
  }

  var teamNote = '';
  if (featureId === 'team') {
    teamNote = '<p style="color:' + c.text + ';font-size:0.8rem;margin:0 0 20px 0;line-height:1.6;background:' + c.boxBg + ';border:1px solid ' + c.boxBorder + ';border-radius:10px;padding:12px 14px;text-align:left;">💡 あの人診断をすると、カードが増えるうえに、そのまま「チーム相性診断」のメンバーとしても使えるようになります。</p>';
  }

  document.body.style.overflow = 'hidden';
  var gate = document.createElement('div');
  gate.id = 'unlock-gate';
  gate.innerHTML =
    '<div style="position:fixed;top:52px;left:0;right:0;bottom:0;background:' + c.bg + ';backdrop-filter:none;-webkit-backdrop-filter:none;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;padding:24px 20px;text-align:center;font-family:\'Hiragino Sans\',\'Noto Sans JP\',sans-serif;overflow-y:auto;">'
    + '<div style="max-width:340px;width:100%;background:' + c.cardBg + ';border-radius:16px;padding:24px 20px;box-shadow:' + c.cardShadow + ';">'
    + '<div style="font-size:2.5rem;margin-bottom:12px;">🔒</div>'
    + '<h2 style="color:' + c.h2 + ';font-size:1.15rem;margin-bottom:16px;line-height:1.5;">' + label + '</h2>'
    + '<div style="background:' + c.boxBg + ';border:1px solid ' + c.boxBorder + ';border-radius:12px;padding:16px;margin-bottom:20px;text-align:left;">'
    + '<p style="color:' + c.label + ';font-size:0.85rem;margin:0 0 10px 0;font-weight:bold;">解放条件</p>'
    + '<p style="color:' + c.text + ';font-size:0.95rem;margin:0 0 6px 0;line-height:1.6;">ビッグファイブ診断を受けると使えるようになります</p>'
    + '<p style="color:' + c.sub + ';font-size:0.85rem;margin:0 0 12px 0;line-height:1.6;">カード <strong style="color:' + c.accent + ';">' + required + '枚</strong> で解放（あと ' + remaining + ' 枚）</p>'
    + '<div style="border-top:1px solid ' + c.boxBorder + ';padding-top:12px;">'
    + '<p style="color:' + c.sub + ';font-size:0.8rem;margin:0 0 6px 0;font-weight:bold;">カードの増やし方</p>'
    + '<p style="color:' + c.muted + ';font-size:0.8rem;margin:0 0 4px 0;line-height:1.6;">・ビッグファイブ診断を受ける（自分・あの人どちらでも）</p>'
    + '<p style="color:' + c.muted + ';font-size:0.8rem;margin:0 0 4px 0;line-height:1.6;">・ガチャ（gacha.html）には最初から使えるコインが3枚あります。回すだけでカードが増えます</p>'
    + '<p style="color:' + c.muted + ';font-size:0.8rem;margin:0 0 8px 0;line-height:1.6;">・友達から診断結果をシェアしてもらう</p>'
    + '<p style="color:' + c.muted + ';font-size:0.75rem;margin:0;line-height:1.6;opacity:0.8;">※ 同じカード・絵柄・診断版の重複は追加されません。<a href="child-update.html" style="color:inherit">カードの種類と新しいルール</a></p>'
    + '</div>'
    + '</div>'
    + teamNote
    + '<div style="margin-bottom:16px;">'
    + '<div style="background:' + c.barBg + ';border-radius:999px;height:8px;width:100%;">'
    + '<div style="background:linear-gradient(90deg,#8b5cf6,#ec4899);height:100%;border-radius:999px;width:' + pct + '%;"></div>'
    + '</div>'
    + '</div>'
    + '<a href="quiz.html" style="display:block;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:0.95rem;margin-bottom:12px;">診断してカードを手に入れる</a>'
    + '<a href="index.html" style="display:inline-block;color:' + c.backLink + ';font-size:0.8rem;text-decoration:none;">トップに戻る</a>'
    + '</div>'
    + '</div>';
  document.body.appendChild(gate);
}

// チーム相性診断の鍵の画面（最短ルートつき）
function teamGatePlan(current, required) {
  var need = Math.max(0, required - current);
  var mine = [];
  try { mine = JSON.parse(localStorage.getItem('bigfive_my_results') || '[]') || []; } catch (e) { mine = []; }
  var selfDone = mine.length > 0 || current > 0;
  var coins = 3;                                  // ガチャのコインは、初めての人は3枚から（gacha-utils.js と同じ）
  try {
    var raw = localStorage.getItem('bigfive_coins');
    if (raw !== null) coins = Math.max(0, parseInt(raw, 10) || 0);
  } catch (e) {}
  var bonus = {};
  try { bonus = JSON.parse(localStorage.getItem('bigfive_coin_bonus') || '{}') || {}; } catch (e) { bonus = {}; }
  var selfCards = selfDone ? 0 : 1;
  var coinsAfter = coins + (selfDone || bonus['10'] ? 0 : 1);   // 10問版の初回ボーナスはコイン1枚
  var gacha = Math.min(coinsAfter, Math.max(0, need - selfCards));
  var others = Math.max(0, need - selfCards - gacha);
  return { need: need, selfDone: selfDone, coins: coins, gacha: gacha, others: others };
}

function renderTeamGate(c, current, required) {
  // 説明が長いので、カードは透けない色にし、後ろは強めにぼかす（後ろの文字が重なって読みにくいため）
  var light = document.body.classList.contains('theme-light');
  c.solid = light ? '#ffffff' : '#0f1430';
  c.veil = light ? 'rgba(241,245,249,0.88)' : 'rgba(5,8,25,0.88)';
  var plan = teamGatePlan(current, required);
  var pct = required > 0 ? Math.min(100, Math.round(current / required * 100)) : 0;
  var btn = 'display:block;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;padding:11px 14px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:0.9rem;margin-top:8px;text-align:center;';
  var stepBox = 'background:' + c.boxBg + ';border:1px solid ' + c.boxBorder + ';border-radius:12px;padding:12px 14px;margin:0 0 10px 0;text-align:left;';
  var num = function (n, done) {
    return '<span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;margin-right:8px;font-size:0.8rem;font-weight:bold;flex-shrink:0;' +
      (done ? 'background:#10b981;color:#fff;">✓' : 'background:' + c.accent + ';color:#fff;">' + n) + '</span>';
  };
  var head = function (n, done, text) {
    return '<div style="display:flex;align-items:center;color:' + c.text + ';font-size:0.92rem;font-weight:bold;line-height:1.5;">' + num(n, done) + '<span>' + text + '</span></div>';
  };
  var small = function (text) {
    return '<p style="color:' + c.sub + ';font-size:0.8rem;margin:6px 0 0 30px;line-height:1.6;">' + text + '</p>';
  };
  var steps = '';
  var n = 0;
  if (plan.selfDone) {
    steps += '<div style="' + stepBox + 'opacity:0.75;">' + head('', true, '自分の診断') + small('済んでいます') + '</div>';
  } else {
    n++;
    steps += '<div style="' + stepBox + '">' + head(n, false, '自分を診断する（10問・約2分）') +
      small('カードが1枚と、ガチャのコインが1枚もらえます') +
      '<a href="quiz.html?v=10" style="' + btn + '">自分を診断する</a></div>';
  }
  if (plan.gacha > 0) {
    n++;
    steps += '<div style="' + stepBox + '">' + head(n, false, 'ガチャを' + plan.gacha + '回引く（約1分）') +
      small('コイン1枚で1回。' + (plan.selfDone ? 'いまコインが' + plan.coins + '枚あります' : '最初からある' + plan.coins + '枚と、①でもらう1枚で' + plan.gacha + '回引けます') + '。1回ごとにカードが1枚増えます') +
      '<a href="gacha.html" style="' + btn + '">ガチャを引く</a></div>';
  }
  if (plan.others > 0) {
    n++;
    steps += '<div style="' + stepBox + '">' + head(n, false, '職場の人や友だちを' + plan.others + '人「あの人診断」する（1人30問・約5分）') +
      small('1人ごとにカードが1枚増えます。<b>診断した人は、そのままこのチームのメンバーになります</b>') +
      '<a href="other_quiz.html" style="' + btn + '">あの人診断をする</a></div>';
  }
  var minutes = (plan.selfDone ? 0 : 2) + (plan.gacha > 0 ? 1 : 0) + plan.others * 5;
  var soon = minutes <= 3 ? 'すぐに' : '約' + (Math.ceil(minutes / 5) * 5) + '分で';

  document.body.style.overflow = 'hidden';
  var gate = document.createElement('div');
  gate.id = 'unlock-gate';
  gate.innerHTML =
    '<div style="position:fixed;top:52px;left:0;right:0;bottom:0;background:' + c.veil + ';display:flex;flex-direction:column;align-items:center;justify-content:flex-start;z-index:9999;padding:20px 16px 96px;text-align:center;font-family:\'Hiragino Sans\',\'Noto Sans JP\',sans-serif;overflow-y:auto;">'
    + '<div style="max-width:380px;width:100%;margin:auto 0;background:' + c.solid + ';border-radius:16px;padding:22px 18px;box-shadow:' + c.cardShadow + ';">'
    + '<div style="font-size:2.2rem;margin-bottom:6px;">👥</div>'
    + '<h2 style="color:' + c.h2 + ';font-size:1.15rem;margin:0 0 8px 0;line-height:1.5;">チーム相性診断</h2>'
    + '<p style="color:' + c.text + ';font-size:0.95rem;margin:0 0 4px 0;line-height:1.6;">職場や仲間（最大8人）の性格を並べて、<br>チーム全体の相性・一人ひとりの役割・<br>相性のよいペアが分かります</p>'
    + '<p style="color:' + c.accent + ';font-size:1.05rem;font-weight:bold;margin:12px 0 4px 0;line-height:1.6;">カードを集めると開きます。<br>下の順番なら' + soon + 'できます</p>'
    + '<p style="color:' + c.sub + ';font-size:0.8rem;margin:0 0 8px 0;">いま カード ' + current + '枚 ／ ' + required + '枚で開く（あと ' + plan.need + '枚）</p>'
    + '<div style="background:' + c.barBg + ';border-radius:999px;height:8px;width:100%;margin-bottom:16px;">'
    + '<div style="background:linear-gradient(90deg,#8b5cf6,#ec4899);height:100%;border-radius:999px;width:' + pct + '%;"></div></div>'
    + steps
    + '<p style="color:' + c.sub + ';font-size:0.8rem;margin:12px 0 4px 0;line-height:1.6;">' + required + '枚になると「チーム相性診断が解放されました！」と出ます。「今すぐ使う」を押すと、このページに戻れます。</p>'
    + '<p style="color:' + c.muted + ';font-size:0.72rem;margin:0 0 14px 0;line-height:1.6;">※ ガチャで同じカードが出たときは増えません（まれです）。<a href="child-update.html" style="color:inherit">カードのルール</a></p>'
    + '<a href="index.html" style="display:inline-block;color:' + c.backLink + ';font-size:0.8rem;text-decoration:none;">トップに戻る</a>'
    + '</div>'
    + '</div>';
  document.body.appendChild(gate);
}

// data-feature-gate属性がある場合は自動ゲートチェック
document.addEventListener('DOMContentLoaded', function() {
  var gateId = document.body.getAttribute('data-feature-gate');
  if (gateId) renderGate(gateId);
});
