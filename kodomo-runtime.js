/* 子ども診断：試作で確定した設問・結果文と採点を使用 */
window.__errs = [];
window.onerror = function (m, s, l, c) { window.__errs.push(m + ' @' + (s || '').split('/').pop() + ':' + l + ':' + c); return false; };

var DATA = window.KidQuizData || null;
var DATA_OK = !!(DATA && DATA['区分']);

function $(id) { return document.getElementById(id); }
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
/* データの配列から、空行・「---」・書きかけの注記だけを除く */
function cleanItems(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(function (t) {
    var s = String(t).trim();
    return s !== '' && s !== '---' && s.indexOf('（ここまで') !== 0 && s.indexOf('★') !== 0;
  });
}

/* ===== 固定文（Markdown）を見出しで区切って使う ===== */
var FIXED = {};
(function () {
  if (!DATA_OK || !DATA['固定文']) return;
  var cur = null;
  DATA['固定文'].split(/\r?\n/).forEach(function (line) {
    var m = line.match(/^##\s+(.*)$/);
    if (m) { cur = m[1].trim(); FIXED[cur] = []; }
    else if (cur !== null) { FIXED[cur].push(line); }
  });
})();
function fixedSec(prefix) {
  var keys = Object.keys(FIXED);
  for (var i = 0; i < keys.length; i++) if (keys[i].indexOf(prefix) === 0) return FIXED[keys[i]];
  return null;
}
function mdToHtml(lines) {
  var out = [], list = null, para = [];
  function flush() {
    if (list) { out.push('<ul>' + list.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'); list = null; }
    if (para.length) { out.push('<p>' + esc(para.join(' ')) + '</p>'); para = []; }
  }
  (lines || []).forEach(function (rawLine) {
    var line = rawLine.replace(/\s+$/, '');
    if (/^\s*-\s+/.test(line)) {
      if (para.length) flush();
      if (!list) list = [];
      list.push(line.replace(/^\s*-\s+/, ''));
    } else if (line.trim() === '') {
      flush();
    } else {
      if (list) flush();
      para.push(line.trim());
    }
  });
  flush();
  return out.join('');
}

/* ===== 状態 ===== */
var AGE_ORDER = ['3-6歳', '小1-3', '小4-6', '中学生保護者'];
var AGE_LABEL = { '3-6歳': '3〜6歳（未就学）', '小1-3': '小学1〜3年', '小4-6': '小学4〜6年', '中学生保護者': '中学生' };
var state = { who: null, group: null, activeGroup: null, order: [], answers: [], idx: 0, name: '', gender: '', result: null };
var GROUPS = {
  '3-6歳': { relation: 'kid_t3', version: 'kid3', model: 'temperament-v1', key: 'child_temperament_results_v1' },
  '小1-3': { relation: 'kid_e1', version: '30', model: 'bigfive-child-v1', key: 'bigfive_other_results' },
  '小4-6': { relation: 'kid_e2', version: '30', model: 'bigfive-child-v1', key: 'bigfive_other_results' },
  '中学生保護者': { relation: 'kid_jh', version: '30', model: 'bigfive-child-v1', key: 'bigfive_other_results' },
  '中高生本人': { relation: 'kid_self', version: '30', model: 'bigfive-youth-v1', key: 'youth_self_results_v1' }
};
var GROUP_BY_REL = {};
Object.keys(GROUPS).forEach(function (key) { GROUP_BY_REL[GROUPS[key].relation] = key; });

function showScreen(id) {
  var s = document.querySelectorAll('.screen');
  for (var i = 0; i < s.length; i++) s[i].classList.remove('active');
  $(id).classList.add('active');
  window.scrollTo(0, 0);
}

/* ===== 設問の並べ替え：因子を1問ずつ回し、各因子の中は 順→逆→順→逆 ===== */
function orderQuestions(group) {
  var codes = group['因子'].map(function (f) { return f.code; });
  var byFactor = {};
  group['設問'].forEach(function (q) { (byFactor[q.factor] = byFactor[q.factor] || []).push(q); });
  var seqs = codes.filter(function (c) { return byFactor[c] && byFactor[c].length; }).map(function (c) {
    var plus = [], minus = [];
    byFactor[c].forEach(function (q) { (q.dir === '-' ? minus : plus).push(q); });
    var seq = [], a = 0, b = 0, turn = true;
    while (a < plus.length || b < minus.length) {
      if (turn && a < plus.length) { seq.push(plus[a++]); }
      else if (!turn && b < minus.length) { seq.push(minus[b++]); }
      else if (a < plus.length) { seq.push(plus[a++]); }
      else { seq.push(minus[b++]); }
      turn = !turn;
    }
    return seq;
  });
  var out = [], r = 0;
  for (;;) {
    var took = false;
    for (var i = 0; i < seqs.length; i++) {
      if (r < seqs[i].length) { out.push(seqs[i][r]); took = true; }
    }
    if (!took) break;
    r++;
  }
  return out;
}

/* ===== 入口 ===== */
var selAge = null;
function initEntry() {
  if (!DATA_OK) $('dataNote').style.display = 'block';
  $('who-parent').addEventListener('click', function () {
    state.who = '保護者';
    selAge = null; $('startBtn').disabled = true; $('prepNote').style.display = 'none';
    var b = document.querySelectorAll('.age-btn');
    for (var i = 0; i < b.length; i++) b[i].classList.remove('selected');
    showScreen('screen-age');
  });
  $('who-self').addEventListener('click', function () {
    if (!DATA_OK) return;
    state.who = '本人';
    state.group = '中高生本人';
    showScreen('screen-profile');
  });
  $('ageBack').addEventListener('click', function () { showScreen('screen-who'); });
  var btns = document.querySelectorAll('.age-btn');
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', (function (btn) {
      return function () {
        if (!DATA_OK) return;
        var b = document.querySelectorAll('.age-btn');
        for (var j = 0; j < b.length; j++) b[j].classList.remove('selected');
        btn.classList.add('selected');
        selAge = btn.getAttribute('data-g');
        var g = DATA['区分'][selAge];
        var empty = !g || !Array.isArray(g['設問']) || g['設問'].length === 0;
        $('prepNote').style.display = empty ? 'block' : 'none';
        $('startBtn').disabled = empty;
      };
    })(btns[i]));
  }
  $('startBtn').addEventListener('click', function () {
    if (selAge) { state.group = selAge; showScreen('screen-profile'); }
  });
  $('profileBack').addEventListener('click', function () {
    showScreen(state.who === '本人' ? 'screen-who' : 'screen-age');
  });
  document.querySelectorAll('input[name="kidGender"]').forEach(function (input) {
    input.addEventListener('change', function () { $('profileStart').disabled = false; });
  });
  $('profileStart').addEventListener('click', function () {
    var selected = document.querySelector('input[name="kidGender"]:checked');
    if (!selected || !state.group) return;
    state.gender = selected.value;
    state.name = $('kidName').value.trim().slice(0, 20);
    if (state.activeGroup === state.group && state.order.length) {
      renderQuiz();
      showScreen('screen-quiz');
    } else {
      beginGroup(state.group);
    }
  });
  $('retryBtn').addEventListener('click', function () {
    state = { who: null, group: null, activeGroup: null, order: [], answers: [], idx: 0, name: '', gender: '', result: null };
    history.replaceState(null, '', 'kodomo.html');
    showScreen('screen-who');
  });
  $('saveRetry').addEventListener('click', function () { if (state.result) persistResult(state.result); });
}
function beginGroup(gKey) {
  state.group = gKey;
  state.activeGroup = gKey;
  state.order = orderQuestions(DATA['区分'][gKey]);
  state.answers = new Array(state.order.length).fill(null);
  state.idx = 0;
  renderQuiz();
  showScreen('screen-quiz');
}

/* ===== 設問画面 ===== */
var CHOICES5 = [
  { v: 1, t: 'まったく当てはまらない' },
  { v: 2, t: 'あまり当てはまらない' },
  { v: 3, t: 'どちらとも言えない' },
  { v: 4, t: 'まあ当てはまる' },
  { v: 5, t: 'よく当てはまる' }
];
var CHOICES4 = [
  { v: 1, t: 'まったく当てはまらない' },
  { v: 2, t: 'あまり当てはまらない' },
  { v: 3, t: 'まあ当てはまる' },
  { v: 4, t: 'よく当てはまる' }
];
function isSelfGroup() { return DATA['区分'][state.group]['答える人'] === '本人'; }

function renderQuiz() {
  var g = DATA['区分'][state.group];
  var selfMode = isSelfGroup();
  $('quizWhoIcon').textContent = selfMode ? '🧑‍🎓' : '👪';
  $('quizWhoName').textContent = selfMode ? '自分のこととして答える' : '保護者が答える・' + (AGE_LABEL[state.group] || state.group);
  $('quizWhoSub').textContent = selfMode ? 'ふだんの自分を思い浮かべて答えてください' : 'この子のふだんの様子を思い浮かべて答えてください';
  renderQuestion();
}
function renderQuestion() {
  var n = state.order.length, i = state.idx;
  var selfMode = isSelfGroup();
  var choices = selfMode ? CHOICES4 : CHOICES5;
  var completed = state.answers.filter(function (answer) { return answer != null; }).length;
  var percent = n ? Math.round(completed / n * 100) : 0;
  $('progressFill').style.width = percent + '%';
  $('progressBox').setAttribute('aria-valuenow', String(percent));
  $('progressText').textContent = (i + 1) + '/' + n;
  $('qNum').textContent = '問い ' + (i + 1);
  $('qText').textContent = state.order[i].text;
  var box = $('answers');
  box.innerHTML = '';
  choices.forEach(function (c) {
    var b = document.createElement('button');
    b.className = 'answer-btn' + (state.answers[i] === c.v ? ' selected' : '');
    b.setAttribute('data-v', c.v);
    b.setAttribute('aria-pressed', state.answers[i] === c.v ? 'true' : 'false');
    b.textContent = c.t;
    b.addEventListener('click', function () { onAnswer(c.v); });
    box.appendChild(b);
  });
  var last = i === n - 1;
  $('toResultBtn').style.display = last ? 'block' : 'none';
  $('toResultBtn').disabled = state.answers[i] == null;
  $('quizBackBtn').style.visibility = 'visible';
}
function onAnswer(v) {
  state.answers[state.idx] = v;
  if (state.idx < state.order.length - 1) {
    state.idx++;
    renderQuestion();
  } else {
    renderQuestion(); /* 最終問：選択状態を反映し、結果ボタンを有効化 */
  }
}
function initQuiz() {
  $('quizBackBtn').addEventListener('click', function () {
    if (state.idx > 0) { state.idx--; renderQuestion(); }
    else { showScreen('screen-profile'); }
  });
  $('toResultBtn').addEventListener('click', function () {
    var missing = state.answers.filter(function (a) { return a == null; }).length;
    if (missing > 0) return; /* 全問に答えるまで進めない */
    finishDiagnosis();
    showScreen('screen-result');
  });
}

/* ===== 採点 ===== */
function scoreCurrent() {
  var g = DATA['区分'][state.group];
  var selfMode = isSelfGroup();
  var top = selfMode ? 4 : 5;
  var sums = {}, cnts = {};
  state.order.forEach(function (q, i) {
    var v = state.answers[i];
    if (v == null) return;
    var rv = q.dir === '-' ? (top + 1 - v) : v; /* 逆向きの反転：5段階=6−回答、4段階=5−回答 */
    sums[q.factor] = (sums[q.factor] || 0) + rv;
    cnts[q.factor] = (cnts[q.factor] || 0) + 1;
  });
  var res = {};
  g['因子'].forEach(function (f) {
    var avg = cnts[f.code] ? sums[f.code] / cnts[f.code] : 0;
    var lv;
    if (selfMode) lv = avg < 2.125 ? '控えめ' : (avg < 2.875 ? '中くらい' : '強め');
    else lv = avg < 2.5 ? '控えめ' : (avg < 3.5 ? '中くらい' : '強め');
    res[f.code] = { avg: avg, level: lv };
  });
  return res;
}

/* ===== 結果画面 ===== */
var LV_CLASS = { '控えめ': 'lv1', '中くらい': 'lv2', '強め': 'lv3' };
var LVS = ['控えめ', '中くらい', '強め'];

function renderResult(override) {
  var g = DATA['区分'][state.group];
  var selfMode = isSelfGroup();
  var res = override || scoreCurrent();
  var n = state.order.length;
  window.__levels = {};
  g['因子'].forEach(function (f) { window.__levels[f.code] = res[f.code].level; });

  document.querySelector('.result-badge').textContent = selfMode ? '性格診断（本人版）結果' : '子どもの性格診断 結果';
  $('resultTitle').textContent = state.name ? state.name + 'の診断結果' : '診断結果';
  $('resultSub').textContent = (selfMode ? '中高生本人版' : '保護者版・' + (AGE_LABEL[state.group] || state.group)) + '（' + n + '問）';

  var html = '';

  /* 1. はじめの一言（固定文） */
  var opening = fixedSec(selfMode ? '本人版：はじめの一言' : '保護者版：はじめの一言');
  opening = opening.map(function(line){return line.replace(/「今のスナップ写真」/g, '現在の傾向').replace(/今のあなたのスナップ写真/g, '現在のあなたの傾向を表した結果');});
  html += '<section class="section-card prose"><p class="section-title">はじめの一言</p>' + mdToHtml(opening);
  if (state.group === '3-6歳') {
    var extra = fixedSec('3〜6歳版だけに足す一文');
    if (extra) html += '<div class="extra-note">' + mdToHtml(extra) + '</div>';
  }
  html += '</section>';

  /* 2. 見取り図（3つの位置・％なし） */
  html += '<section class="section-card"><p class="section-title">見取り図</p>';
  g['因子'].forEach(function (f) {
    var lv = res[f.code].level;
    html += '<div class="map-row"><div class="map-head"><span class="map-label">' + esc(f.name) + '</span><span class="lv ' + LV_CLASS[lv] + '">' + lv + '</span></div><div class="map-cells">';
    LVS.forEach(function (l2) { html += '<div class="map-cell' + (l2 === lv ? ' on' : '') + '">' + l2 + '</div>'; });
    html += '</div></div>';
  });
  html += '<p style="font-size:13px;color:rgba(15,45,74,0.5);margin:14px 0 0;line-height:1.7;">※ 同じ年のお子さんと比べた位置ではありません。答えの平均から出した、いまの傾向の目安です。</p></section>';

  /* 3. 因子ごとのブロック（見出しだけ・タップで開く） */
  html += '<section><p class="section-title" style="margin-bottom:10px;">因子ごとの読みかた（タップで開きます）</p>';
  g['因子'].forEach(function (f) {
    var lv = res[f.code].level;
    var lvData = (f.levels && f.levels[lv]) || {};
    html += '<div class="factor-block" id="fb-' + esc(f.code) + '"><button class="factor-head" type="button" aria-expanded="false"><span class="fname">' + esc(f.name) + '</span><span class="lv ' + LV_CLASS[lv] + '">' + lv + '</span><span class="arrow">▼</span></button><div class="factor-body">';
    Object.keys(lvData).forEach(function (k) {
      var items = cleanItems(lvData[k]);
      if (!items.length) return;
      html += '<p class="sub-title">' + esc(k) + '</p><ul class="flist">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
    });
    html += '</div></div>';
  });
  html += '</section>';

  /* 4. 気になっていること */
  var worries = g['悩み'] || [];
  html += '<section class="section-card"><p class="section-title">気になっていることから読む</p>';
  html += '<p class="prose" style="font-size:14px;color:var(--dim);line-height:1.75;margin:0 0 12px;">あてはまるものを選ぶと、そのときの' + (selfMode ? '自分でできる工夫' : '関わり方') + 'と、関係する性格のブロックが出ます。</p>';
  worries.forEach(function (w, i) {
    html += '<button class="worry-btn" type="button" aria-pressed="false" data-w="' + i + '">' + esc(w.title) + '</button>';
  });
  html += '<div id="worryDetail"></div></section>';

  var consult = fixedSec(selfMode ? '本人版：相談先の案内' : '保護者版：相談先の案内');
  html += '<section class="section-card prose"><p class="section-title">相談先の案内</p>' + mdToHtml(consult) + '</section>';

  /* 6. （本人版）親の結果と違ったとき */
  if (selfMode) {
    var diff = fixedSec('本人版：親の結果と違ったとき');
    html += '<section class="section-card prose"><p class="section-title">家の人が答えた結果と違ったとき</p>' + mdToHtml(diff) + '</section>';
  }

  $('resultBody').innerHTML = html;
  bindFactorHeads();
  bindWorries(worries, selfMode, g);
}

function bindFactorHeads() {
  var heads = document.querySelectorAll('.factor-head');
  for (var i = 0; i < heads.length; i++) {
    heads[i].addEventListener('click', function () {
      this.parentNode.classList.toggle('open');
      this.setAttribute('aria-expanded', this.parentNode.classList.contains('open') ? 'true' : 'false');
    });
  }
}
function bindWorries(worries, selfMode, g) {
  var btns = document.querySelectorAll('.worry-btn');
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', (function (btn) {
      return function () {
        var was = btn.classList.contains('on');
        for (var j = 0; j < btns.length; j++) {
          btns[j].classList.remove('on');
          btns[j].setAttribute('aria-pressed', 'false');
        }
        if (was) { $('worryDetail').innerHTML = ''; return; }
        btn.classList.add('on');
        btn.setAttribute('aria-pressed', 'true');
        renderWorry(worries[parseInt(btn.getAttribute('data-w'), 10)], selfMode, g);
      };
    })(btns[i]));
  }
}
function renderWorry(w, selfMode, g) {
  var html = '<div class="worry-detail">';
  html += '<p class="worry-factors">関係するところ：' + esc(w.factors) + '</p>';

  var ways = cleanItems(w.ways);
  var waysLabel = selfMode ? '自分でできる工夫' : '関わり方';
  if (ways.length && ways[0] === '自分でできる工夫') { waysLabel = ways.shift(); }
  html += '<p class="sub-title">' + esc(waysLabel) + '</p><ul class="flist">' + ways.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';

  var notes = cleanItems(w.notes);
  if (notes.length) {
    html += '<p class="sub-title">補足</p><ul class="flist">' + notes.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }

  if (w.consult) {
    var consult = fixedSec(selfMode ? '本人版：相談先の案内' : '保護者版：相談先の案内');
    html += '<div class="consult-inline"><p class="c-label">相談先の案内</p>' + mdToHtml(consult) + '</div>';
  }
  html += '</div>';

  var rel = g['因子'].filter(function (f) { return w.factors.indexOf(f.name) !== -1; });
  if (rel.length) {
    html += '<div style="margin-bottom:4px;">' + rel.map(function (f) {
      return '<button class="w-link" type="button" data-fb="' + esc(f.code) + '">「' + esc(f.name) + '」のブロックを開く</button>';
    }).join('') + '</div>';
  }
  $('worryDetail').innerHTML = html;
  var links = document.querySelectorAll('.w-link');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
      var blk = $('fb-' + this.getAttribute('data-fb'));
      if (blk) {
        blk.classList.add('open');
        blk.querySelector('.factor-head').setAttribute('aria-expanded', 'true');
        blk.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

/* ===== 結果コード・端末内保存・旧リンク ===== */
var LEVEL_DIGIT = { '控えめ': '1', '中くらい': '3', '強め': '5' };
var TEMPERAMENT_DIGIT = { '控えめ': '1', '中くらい': '2', '強め': '3' };
function codeFromScores(scores, groupKey) {
  var mapping = groupKey === '3-6歳' ? TEMPERAMENT_DIGIT : LEVEL_DIGIT;
  var order = groupKey === '3-6歳' ? ['S', 'N', 'EC'] : ['O', 'C', 'E', 'A', 'N'];
  return order.map(function (factor) {
    return mapping[scores[factor].level];
  }).join('');
}
function scoresFromCode(code, groupKey) {
  var levels = groupKey === '3-6歳' ? { '1': '控えめ', '2': '中くらい', '3': '強め' } : { '1': '控えめ', '3': '中くらい', '5': '強め' };
  var result = {};
  var order = groupKey === '3-6歳' ? ['S', 'N', 'EC'] : ['O', 'C', 'E', 'A', 'N'];
  order.forEach(function (factor, i) {
    result[factor] = { level: levels[code[i]], avg: null };
  });
  return result;
}
function isValidCode(code, relation) {
  return relation === 'kid_t3' ? /^[123]{3}$/.test(code || '') : /^[135]{5}$/.test(code || '');
}
function readResults(key) {
  var raw = localStorage.getItem(key);
  if (raw == null) return [];
  var list = JSON.parse(raw);
  if (!Array.isArray(list)) throw new Error('保存済みデータの形式が違います');
  return list;
}
function makeId() {
  var random = window.crypto && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0].toString(36) : Math.random().toString(36).slice(2);
  return 'kid-' + Date.now().toString(36) + '-' + random;
}
function finishDiagnosis() {
  var scores = scoreCurrent();
  var info = GROUPS[state.group];
  var record = {
    id: makeId(), date: new Date().toISOString(), name: state.name,
    code: codeFromScores(scores, state.group), gender: state.gender,
    relation: info.relation, version: info.version, model: info.model,
    rarity: info.version === 'kid3' ? 'kid' : 'common',
    levels: Object.fromEntries(Object.keys(scores).map(function (factor) { return [factor, scores[factor].level]; }))
  };
  state.result = record;
  state.awarded = false;
  $('historyLink').hidden = false;
  renderResult(scores);
  renderCard(record);
  persistResult(record);
}
function persistResult(record) {
  var info = GROUPS[GROUP_BY_REL[record.relation]];
  try {
    var list = readResults(info.key);
    if (!list.some(function (item) { return item && item.id === record.id; })) {
      list.unshift(record);
      localStorage.setItem(info.key, JSON.stringify(list));
    }
    $('saveStatus').textContent = 'この端末に保存しました。';
    $('saveRetry').hidden = true;
    if (!state.awarded) {
      state.awarded = true;
      try {
        if (window.AlbumUtils) {
          var rarity = record.version === 'kid3' ? 'kid' :
            (AlbumUtils.computeRarityForAlbum ? AlbumUtils.computeRarityForAlbum(record.code, record.version, record.gender) : 'common');
          AlbumUtils.addToAlbum({ code: record.code, gender: record.gender, version: record.version,
            rarity: rarity, typeName: window.KidResultCard ? KidResultCard.name(record) : record.code,
            date: record.date, source: 'child' });
        }
      } catch (albumError) { console.error('カード保存に失敗しました', albumError); }
      try {
        // 既存のkodomo初回コインを再利用する。この関数がGA4 diag_resultも送る。
        // 共有・保存済み表示はpersistResultを通らないため完了イベントも発火しない。
        if (localStorage.getItem('dev_nocount') !== '1' && window.GachaUtils) GachaUtils.grantDiagnosisBonus('kodomo');
      } catch (bonusError) { console.error('初回特典の処理に失敗しました', bonusError); }
    }
    history.replaceState(null, '', 'kodomo.html?saved=' + encodeURIComponent(record.id) + '&group=' + encodeURIComponent(record.relation));
    return true;
  } catch (error) {
    $('saveStatus').textContent = '保存できませんでした。端末の空き容量などをご確認のうえ、保存をやり直してください。';
    $('saveRetry').hidden = false;
    console.error('子ども診断の保存に失敗しました', error);
    return false;
  }
}
function renderCard(record) {
  var card = $('resultCard');
  if (window.KidResultCard) {
    KidResultCard.render(card, record);
    card.hidden = false;
    var link = window.CardDelivery ? CardDelivery.shareUrl({code:record.code,gender:record.gender,v:record.version}) : '';
    $('shareLink').href = link || '#';
    $('shareLink').hidden = !link;
    return;
  }
  var url = window.CardDelivery ? CardDelivery.imageUrl({ code: record.code, gender: record.gender, v: record.version }) : '';
  if (record.version === 'kid3' && /^[123]{3}$/.test(record.code) && /^[MF]$/.test(record.gender)) {
    url = 'images/kid-cards/' + record.gender + '/' + record.code + '.webp';
  }
  var share = window.CardDelivery ? CardDelivery.shareUrl({ code: record.code, gender: record.gender, v: record.version }) : '';
  var entry = window.KidCardData && Array.isArray(KidCardData.entries) ? KidCardData.entries.find(function (item) { return item.id === record.code; }) : null;
  card.innerHTML = '<img src="' + esc(url) + '" alt="' + esc(record.code) + 'のカード">' +
    '<p>カード番号 ' + esc(record.code) + '</p>' + (entry && record.version === 'kid3' ? '<p>' + esc(entry.text) + '</p>' : '');
  card.hidden = !url;
  $('shareLink').href = share || '#';
  $('shareLink').hidden = !share;
}
function showExistingResult(record, label) {
  var groupKey = GROUP_BY_REL[record.relation];
  if (!groupKey || !isValidCode(record.code, record.relation) || !/^[MF]$/.test(record.gender || '')) return false;
  var displayRecord = {
    code: record.code, gender: record.gender, relation: record.relation,
    version: GROUPS[groupKey].version,
    name: typeof record.name === 'string' ? record.name.slice(0, 20) : ''
  };
  state.who = groupKey === '中高生本人' ? '本人' : '保護者';
  state.group = groupKey;
  state.order = orderQuestions(DATA['区分'][groupKey]);
  state.name = displayRecord.name;
  state.gender = displayRecord.gender;
  state.result = displayRecord;
  state.awarded = true;
  renderResult(scoresFromCode(record.code, groupKey));
  renderCard(displayRecord);
  $('saveStatus').textContent = label;
  $('saveRetry').hidden = true;
  $('historyLink').hidden = !record.id;
  showScreen('screen-result');
  return true;
}
function restoreFromUrl() {
  var params = new URLSearchParams(location.search);
  var oldCode = params.get('type');
  var oldRel = params.get('rel');
  if (/^[1-5]{5}$/.test(oldCode || '') && /^(child46|child79)$/.test(oldRel || '')) {
    location.replace('kodomo-legacy.html' + location.search);
    return;
  }
  var relation = params.get('group');
  if (!GROUP_BY_REL[relation]) return;
  var groupKey = GROUP_BY_REL[relation];
  var saved = params.get('saved');
  if (saved) {
    try {
      var list = readResults(GROUPS[groupKey].key);
      var record = list.find(function (item) { return item && item.id === saved && item.relation === relation; });
      if (record && showExistingResult(record, 'この端末に保存された結果です。')) return;
    } catch (error) { console.error('保存結果を読み込めませんでした', error); }
    $('dataNote').textContent = '保存済みの結果がこの端末では見つかりません。';
    $('dataNote').style.display = 'block';
    return;
  }
  var code = params.get('code');
  var gender = params.get('gender');
  if (isValidCode(code, relation) && /^[MF]$/.test(gender || '')) {
    showExistingResult({ code: code, gender: gender, relation: relation,
      version: GROUPS[groupKey].version, name: '' }, '共有されたタイプの説明です。この端末には保存されません。');
  } else if (code || gender) {
    $('dataNote').textContent = '結果リンクの形式を確認してください。';
    $('dataNote').style.display = 'block';
  }
}

/* ===== 初期化 ===== */
initEntry();
initQuiz();
if (DATA_OK) restoreFromUrl();
