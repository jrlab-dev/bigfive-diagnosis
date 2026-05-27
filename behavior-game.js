'use strict';

(function() {
  var config = window.BEHAVIOR_GAME;
  if (!config) return;

  var REPLAY_FEE = 3;
  var FIXED_REWARD = 2;
  var state = { value: null, result: null, feePaid: 0, rewardGranted: false, resultSaved: false, isFirstPlay: true };

  function $(id) { return document.getElementById(id); }

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
    if (isReplay && window.GachaUtils && GachaUtils.getCoins() < REPLAY_FEE) {
      $('startBtn').disabled = true;
      $('entryLack').style.display = 'block';
      $('entryLack').textContent = 'コインが足りません（あと' + (REPLAY_FEE - GachaUtils.getCoins()) + '枚）';
    }
  }

  function renderQuestion() {
    $('questionNo').textContent = config.questionLabel;
    $('scenario').innerHTML = config.scenario;
    $('answerArea').innerHTML = '';
    state.value = config.defaultValue;

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
      $('answerArea').innerHTML = '<div class="option-grid">' + config.options.map(function(opt) {
        return '<button class="option" type="button" data-value="' + opt.value + '">' +
          '<div class="main">' + opt.label + '</div><div class="sub">' + opt.note + '</div></button>';
      }).join('') + '</div>';
      document.querySelectorAll('.option').forEach(function(btn) {
        btn.addEventListener('click', function() {
          document.querySelectorAll('.option').forEach(function(el) { el.classList.remove('selected'); });
          btn.classList.add('selected');
          state.value = Number(btn.getAttribute('data-value'));
        });
      });
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

  $('submitBtn').addEventListener('click', showResult);
  $('replayBtn').addEventListener('click', function() {
    initEntry();
    showPhase('phaseEntry');
  });

  initEntry();
})();
