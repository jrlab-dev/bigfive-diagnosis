/* ===== ビッグファイブ診断サイト 共通ユーティリティ ===== */

function toScale(v) { return v <= 2 ? 1 : v >= 4 ? 5 : 3; }

function formatDate(isoString) {
  var date = new Date(isoString);
  var now = new Date();
  var diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '昨日';
  if (diffDays < 7) return diffDays + '日前';
  if (diffDays < 30) return Math.floor(diffDays / 7) + '週間前';
  return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
}

function imgCodeFromScores(code) {
  return code.split('').map(function(d) { var n = parseInt(d); return n <= 2 ? '1' : n >= 4 ? '5' : '3'; }).join('');
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function getStorageData(key, fallback) {
  try { var d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; }
  catch(e) { return fallback; }
}
