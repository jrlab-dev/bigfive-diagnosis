'use strict';

(function() {
  var config = window.BEHAVIOR_GAME;
  if (!config) return;

  var REPLAY_FEE = 3;
  var FIXED_REWARD = 2;
  var state = { value: null, result: null, feePaid: 0, rewardGranted: false, resultSaved: false, isFirstPlay: true };

  function $(id) { return document.getElementById(id); }

  // ===== 研究員ガイド設定（ページ側のconfig.doctorで上書き可能） =====
  var useGuide = !!window.DoctorGuide;
  var doctor = config.doctor || {};
  if (!doctor.entry) {
    doctor.entry = [{ text: config.lead, pose: 'speaking' }]
      .concat(config.rules.map(function(t) { return { text: t, pose: 'speaking' }; }))
      .concat([{ text: '準備ができたら「はじめる」を押してください！', pose: 'smile' }]);
  }
  if (!doctor.replay) doctor.replay = [{ text: 'おかえりなさい！今回はミニゲームとして気軽にどうぞ。', pose: 'smile' }];
  if (!doctor.question) doctor.question = [{ text: '直感で選んでみてください。正解・不正解はありませんよ。', pose: 'thinking' }];
  if (!doctor.result) doctor.result = [{ text: '結果が出ました！あなたは「{name}」。下に詳しい解説をまとめましたよ。', pose: 'smile' }];

  function doctorLines(lines, result) {
    return lines.map(function(l) {
      return { text: l.text.replace('{name}', result ? result.name : ''), pose: l.pose };
    });
  }

  function showPhase(id) {
    document.querySelectorAll('.phase').forEach(function(el) { el.classList.remove('active'); });
    $(id).classList.add('active');
    window.scrollTo(0, 0);
  }

  function updateCoins() {
    if ($('coinDisplay') && window.GachaUtils) $('coinDisplay').textContent = '\u{1FA99} ' + GachaUtils.getCoins() + '枚';
  }

  function initEntry() {
    updateCoins();
    var isReplay = !!localStorage.getItem(config.storageKey);
    state.isFirstPlay = !isReplay;
    $('gameBadge').textContent = config.badge;
    $('gameIcon').innerHTML = config.icon;
    $('gameTitle').textContent = config.title;
    $('gameLead').textContent = config.lead;
    $('ruleList').innerHTML = config.rules.map(function(t) { return '<li>' + t + '</li>'; }).join('');
    $('entryLack').style.display = 'none';
    $('entryNote').textContent = isReplay ? '前回の結果は残したまま、今回はミニゲームとして遊びます。' : '初回無料：診断結果として保存されます。';
    $('entryCost').textContent = isReplay ? '2回目以降の参加費：3コイン / 終了報酬：2コイン' : '終了報酬：2コイン + 初回診断ボーナス';
    $('startBtn').disabled = false;
    var coinLack = false;
    if (isReplay && window.GachaUtils && GachaUtils.getCoins() < REPLAY_FEE) {
      coinLack = true;
      $('startBtn').disabled = true;
      $('entryLack').style.display = 'block';
      $('entryLack').textContent = 'コインが足りません（あと' + (REPLAY_FEE - GachaUtils.getCoins()) + '枚）';
    }

    // 研究員ガイド：長文ルールの代わりに、その都度1つずつ説明する
    if (useGuide) {
      var rulesEl = document.querySelector('#phaseEntry .rules');
      var leadEl = $('gameLead');
      if (rulesEl) rulesEl.style.display = 'none';
      if (leadEl) leadEl.style.display = 'none';
      DoctorGuide.mount(rulesEl ? rulesEl.parentNode : $('phaseEntry'), rulesEl);
      if (isReplay) {
        DoctorGuide.say(doctorLines(doctor.replay));
      } else {
        // 初回は読み終わるまで「はじめる」を押せない（チュートリアル）
        $('startBtn').disabled = true;
        DoctorGuide.say(doctorLines(doctor.entry), {
          onDone: function() { if (!coinLack) $('startBtn').disabled = false; }
        });
      }
    }
  }

  function renderQuestion() {
    $('questionNo').textContent = config.questionLabel;
    $('scenario').innerHTML = config.scenario;
    $('answerArea').innerHTML = '';
    state.value = config.defaultValue;
    $('submitBtn').disabled = false;

    if (config.inputType === 'slider') {
      $('answerArea').innerHTML =
        '<div class="slider-box">' +
          '<input type="range" id="valueSlider" min="' + config.min + '" max="' + config.max + '" step="' + config.step + '" value="' + config.defaultValue + '">' +
          '<div class="stat-grid"><div class="stat"><div class="label">' + config.valueLabel + '</div><div class="value" id="liveValue"></div></div></div>' +
          '<div class="meter"><span id="liveMeter"></span></div>' +
        '</div>';
      var slider = $('valueSlider');
      var sync = function() {
        state.value = Number(slider.value);
        $('liveValue').textContent = config.formatValue(state.value);
        $('liveMeter').style.width = ((state.value - config.min) / (config.max - config.min) * 100) + '%';
      };
      slider.addEventListener('input', sync);
      sync();
    } else if (config.inputType === 'number') {
      $('answerArea').innerHTML =
        '<input class="number-input" id="numberInput" type="number" min="' + config.min + '" max="' + config.max + '" value="' + config.defaultValue + '">' +
        '<div class="entry-note">' + config.numberHint + '</div>';
      var input = $('numberInput');
      input.addEventListener('input', function() {
        var v = Number(input.value);
        if (isNaN(v)) v = config.defaultValue;
        state.value = Math.max(config.min, Math.min(config.max, v));
      });
    } else {
      state.value = null;
      $('submitBtn').disabled = true;
      $('answerArea').innerHTML = '<div class="option-grid">' + config.options.map(function(opt) {
        return '<button class="option" type="button" data-value="' + opt.value + '">' +
          '<div class="main">' + opt.label + '</div><div class="sub">' + opt.note + '</div></button>';
      }).join('') + '</div><div class="entry-lack" id="answerError" style="display:none">返す額を選んでください</div>';
      document.querySelectorAll('.option').forEach(function(btn) {
        btn.addEventListener('click', function() {
          document.querySelectorAll('.option').forEach(function(el) { el.classList.remove('selected'); });
          btn.classList.add('selected');
          state.value = Number(btn.getAttribute('data-value'));
          $('submitBtn').disabled = false;
          $('answerError').style.display = 'none';
        });
      });
    }

    if (useGuide) {
      var panel = document.querySelector('#phaseQuestion .panel');
      DoctorGuide.mount(panel, panel.querySelector('.question-head'));
      DoctorGuide.say(doctorLines(doctor.question), { compact: true });
    }
    showPhase('phaseQuestion');
  }

  function getMyScores() {
    try {
      var list = JSON.parse(localStorage.getItem('bigfive_my_results') || '[]');
      var idx = Math.min(parseInt(localStorage.getItem('bigfive_active_my_index') || '0', 10), Math.max(0, list.length - 1));
      return list[idx] && list[idx].scores ? list[idx].scores : null;
    } catch(e) { return null; }
  }

  function grantReward() {
    if (state.rewardGranted) return;
    state.rewardGranted = true;
    if (window.GachaUtils) {
      GachaUtils.addCoins(FIXED_REWARD);
      updateCoins();
    }
  }

  function saveResult() {
    if (state.resultSaved) return;
    state.resultSaved = true;
    var result = state.result;
    var data = {
      type: result.key,
      typeName: result.name,
      value: state.value,
      metrics: result.metrics,
      rewardCoins: FIXED_REWARD,
      playCount: 1,
      timestamp: Date.now()
    };

    if (state.isFirstPlay) {
      localStorage.setItem(config.storageKey, JSON.stringify(data));
      if (window.GachaUtils) GachaUtils.grantDiagnosisBonus(config.id);
      try {
        var list = JSON.parse(localStorage.getItem('bigfive_my_results') || '[]');
        var idx = Math.min(parseInt(localStorage.getItem('bigfive_active_my_index') || '0', 10), Math.max(0, list.length - 1));
        if (list[idx]) {
          list[idx][config.id] = data;
          localStorage.setItem('bigfive_my_results', JSON.stringify(list));
        }
      } catch(e) {}
    } else {
      try {
        var existing = JSON.parse(localStorage.getItem(config.storageKey));
        existing.playCount = (existing.playCount || 1) + 1;
        existing.lastValue = state.value;
        existing.lastType = result.key;
        existing.lastTypeName = result.name;
        existing.lastMetrics = result.metrics;
        existing.lastRewardCoins = FIXED_REWARD;
        existing.lastPlayedAt = Date.now();
        localStorage.setItem(config.storageKey, JSON.stringify(existing));
      } catch(e) {}
    }
  }

  function showResult() {
    var scores = getMyScores();
    state.result = config.evaluate(state.value, scores);
    grantReward();
    saveResult();
    var r = state.result;
    $('resultIcon').innerHTML = r.icon;
    $('resultName').textContent = r.name;
    $('resultName').style.color = r.color;
    $('resultSummary').textContent = r.summary;
    $('statGrid').innerHTML = r.stats.map(function(s) {
      return '<div class="stat"><div class="label">' + s.label + '</div><div class="value">' + s.value + '</div></div>';
    }).join('');
    $('analysis').innerHTML = '<p><b>行動傾向：</b>' + r.detail + '</p><p><b>ビッグファイブとの見方：</b>' + r.cross + '</p><p><b>コイン：</b>終了報酬 +' + FIXED_REWARD + 'コイン' + (state.feePaid ? ' / 参加費 -' + state.feePaid + 'コイン' : '') + '</p>';

    if (useGuide) {
      var panel = document.querySelector('#phaseResult .panel');
      DoctorGuide.mount(panel, $('analysis'));
      DoctorGuide.say(doctorLines(doctor.result, r), { compact: true });
    }
    showPhase('phaseResult');
  }

  $('startBtn').addEventListener('click', function() {
    var isFirst = state.isFirstPlay;
    if (!isFirst && window.GachaUtils && !GachaUtils.spendCoins(REPLAY_FEE)) {
      $('entryLack').style.display = 'block';
      updateCoins();
      return;
    }
    state = { value: null, result: null, feePaid: isFirst ? 0 : REPLAY_FEE, rewardGranted: false, resultSaved: false, isFirstPlay: isFirst };
    updateCoins();
    renderQuestion();
  });

  $('submitBtn').addEventListener('click', function() {
    if (state.value === null || typeof state.value === 'undefined') {
      if ($('answerError')) $('answerError').style.display = 'block';
      return;
    }
    showResult();
  });
  $('replayBtn').addEventListener('click', function() {
    initEntry();
    showPhase('phaseEntry');
  });

  initEntry();
})();
