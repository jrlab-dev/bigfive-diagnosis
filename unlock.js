'use strict';

// 2026-05-21 00:00:00 JST = 2026-05-20T15:00:00Z
var UNLOCK_DEPLOY_DATE = '2026-05-20T15:00:00.000Z';

var UNLOCK_TABLE = [
  { cards:  1, id: 'other',               label: 'あの人診断',          url: 'other_quiz.html' },
  { cards:  2, id: 'career',              label: 'キャリア適性診断',     url: 'career.html' },
  { cards:  3, id: 'team',               label: 'チーム相性診断',       url: 'team.html' },
  { cards:  4, id: 'report',             label: '総合レポート',         url: 'report.html' },
  { cards:  5, id: 'attachment',         label: '愛着スタイル診断',     url: 'attachment.html' },
  { cards:  7, id: 'mindset',            label: 'マインドセット診断',    url: 'mindset.html' },
  { cards: 10, id: 'schwartz',           label: '価値観診断',           url: 'schwartz.html' },
  { cards: 13, id: 'eq',                 label: 'EQ診断',               url: 'eq.html' },
  { cards: 15, id: 'riasec',             label: 'RIASEC職業興味診断',   url: 'riasec.html' },
  { cards: 16, id: 'career-integration', label: 'キャリア統合分析',     url: 'career-integration.html' },
  { cards: 18, id: 'locus',             label: '統制の所在診断',        url: 'locus.html' },
  { cards: 20, id: 'sdt',               label: '動機づけ診断',          url: 'sdt.html' },
  { cards: 20, id: 'zukan_s2',          label: '図鑑 Stage 2',          url: 'zukan.html' },
  { cards: 25, id: 'other_limit_30',    label: 'あの人保存30件に拡張',  url: null },
  { cards: 30, id: 'other_limit_40',    label: 'あの人保存40件に拡張',  url: null },
  { cards: 40, id: 'other_limit_50',    label: 'あの人保存50件に拡張',  url: null },
  { cards: 50, id: 'zukan_s3',          label: '完全図鑑 Stage 3',      url: 'zukan.html' },
  { cards: 60, id: 'group',             label: 'グループ分けツール',    url: 'group.html' },
];

// 常に解放済みのID
var ALWAYS_UNLOCKED_IDS = ['bigfive', 'hsp', 'love', 'impostor', 'kodomo'];

function isLegacyUser() {
  if (localStorage.getItem('bigfive_legacy_user') === 'true') return true;
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
  if (isLegacyUser()) return 50;
  var count = getCardCount();
  if (count >= 40) return 50;
  if (count >= 30) return 40;
  if (count >= 25) return 30;
  if (count >= 1)  return 20;
  return 0;
}

// ゲート表示（ロックされたページ用）
function renderGate(featureId) {
  if (isUnlocked(featureId)) return;
  var required = getRequiredCards(featureId);
  var current = getCardCount();
  var remaining = required - current;
  var label = featureId;
  for (var i = 0; i < UNLOCK_TABLE.length; i++) {
    if (UNLOCK_TABLE[i].id === featureId) { label = UNLOCK_TABLE[i].label; break; }
  }
  var pct = required > 0 ? Math.min(100, Math.round(current / required * 100)) : 0;

  document.body.style.overflow = 'hidden';
  var gate = document.createElement('div');
  gate.id = 'unlock-gate';
  gate.innerHTML =
    '<div style="position:fixed;inset:0;background:#0a0e27;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;padding:24px 20px;text-align:center;font-family:\'Hiragino Sans\',\'Noto Sans JP\',sans-serif;overflow-y:auto;">'
    + '<div style="max-width:340px;width:100%;">'
    + '<div style="font-size:2.5rem;margin-bottom:12px;">🔒</div>'
    + '<h2 style="color:#e2e8f0;font-size:1.15rem;margin-bottom:16px;line-height:1.5;">' + label + '</h2>'
    + '<div style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:12px;padding:16px;margin-bottom:20px;text-align:left;">'
    + '<p style="color:#c4b5fd;font-size:0.85rem;margin:0 0 10px 0;font-weight:bold;">解放条件</p>'
    + '<p style="color:#e2e8f0;font-size:0.95rem;margin:0 0 12px 0;line-height:1.6;">カードを <strong style="color:#a78bfa;">' + required + '枚</strong> 集めると使えるようになります</p>'
    + '<p style="color:#94a3b8;font-size:0.8rem;margin:0;line-height:1.6;">カードの集め方</p>'
    + '<ul style="color:#94a3b8;font-size:0.8rem;margin:6px 0 0 0;padding-left:16px;line-height:1.8;">'
    + '<li>自分の診断結果を保存する</li>'
    + '<li>友達にシェアして受け取る</li>'
    + '</ul>'
    + '</div>'
    + '<div style="margin-bottom:16px;">'
    + '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">'
    + '<span style="color:#94a3b8;font-size:0.8rem;">現在 ' + current + ' 枚</span>'
    + '<span style="color:#a78bfa;font-size:0.8rem;">あと ' + remaining + ' 枚</span>'
    + '</div>'
    + '<div style="background:#1e293b;border-radius:999px;height:8px;width:100%;">'
    + '<div style="background:linear-gradient(90deg,#8b5cf6,#ec4899);height:100%;border-radius:999px;width:' + pct + '%;"></div>'
    + '</div>'
    + '</div>'
    + '<a href="quiz.html" style="display:block;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:0.95rem;margin-bottom:12px;">診断してカードを集める</a>'
    + '<a href="index.html" style="display:inline-block;color:#64748b;font-size:0.8rem;text-decoration:none;">トップに戻る</a>'
    + '</div>'
    + '</div>';
  document.body.appendChild(gate);
}

// data-feature-gate属性がある場合は自動ゲートチェック
document.addEventListener('DOMContentLoaded', function() {
  var gateId = document.body.getAttribute('data-feature-gate');
  if (gateId) renderGate(gateId);
});
