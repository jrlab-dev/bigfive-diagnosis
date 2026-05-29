/* ===== 共有カード描画ロジック（result.html / kodomo.html 共通） ===== */

window.CardRenderer = (function () {

  var FACTOR_COLORS = {
    O: 'var(--c-O)', C: 'var(--c-C)', E: 'var(--c-E)', A: 'var(--c-A)', N: 'var(--c-N)'
  };

  // タイプ名生成
  function genTypeName(scores) {
    var mainLabels = {
      O: { high: '探求者', low: '確実派' },
      C: { high: '実行者', low: '自由人' },
      E: { high: '社交家', low: '内省家' },
      A: { high: '調停者', low: '競争者' },
      N: { high: '感受家', low: '平静派' }
    };
    var subLabels = {
      O: { high: '発想家', low: '現実派' },
      C: { high: '規律派', low: '柔軟派' },
      E: { high: 'ムードメーカー', low: '思考家' },
      A: { high: '支援者', low: '自立派' },
      N: { high: '繊細派', low: '泰然家' }
    };
    var main = 'O', max = scores.O;
    ['C','E','A','N'].forEach(function(k) { if (scores[k] > max) { max = scores[k]; main = k; } });
    var mainLabel = max >= 4 ? mainLabels[main].high : mainLabels[main].low;
    var sub = '';
    ['O','C','E','A','N'].forEach(function(k) {
      if (!sub && k !== main && (scores[k] === 1 || scores[k] === 5)) {
        sub = subLabels[k][scores[k] === 5 ? 'high' : 'low'];
      }
    });
    return sub ? sub + '・' + mainLabel : mainLabel;
  }

  // スコアバー描画
  function renderScores(scores) {
    var el = document.getElementById('scores');
    if (!el) return;
    var html = '';
    ['O','C','E','A','N'].forEach(function(k) {
      var val = scores[k];
      var pct = val * 20;
      html += '<div class="score-item">'
        + '<span class="score-label" style="color:' + FACTOR_COLORS[k] + '">' + k + '</span>'
        + '<div class="score-bar-bg"><div class="score-bar" style="width:' + pct + '%;background:' + FACTOR_COLORS[k] + '"></div></div>'
        + '<span class="score-val">' + val + '</span>'
        + '</div>';
    });
    el.innerHTML = html;
  }

  // タイプ名が収まらない場合に縮小
  function shrinkTypeName() {
    var nameEl = document.getElementById('typeName');
    if (!nameEl) return;
    var parent = nameEl.parentElement;
    var maxW = parent.clientWidth - 32;
    if (nameEl.scrollWidth > maxW) {
      var ratio = maxW / nameEl.scrollWidth;
      var cur = parseFloat(getComputedStyle(nameEl).fontSize);
      nameEl.style.fontSize = Math.max(cur * ratio, 10) + 'px';
    }
  }

  // カード初期化
  // config: { scores:{O,C,E,A,N}, gender:'M'|'F', rarity:'r0'~'r7', description:'' }
  function initCard(config) {
    var scores = config.scores;
    var gender = config.gender || 'F';
    var rarity = config.rarity || (typeof computeRarity === 'function'
      ? computeRarity('' + scores.O + scores.C + scores.E + scores.A + scores.N)
      : 'r1');

    // レアリティクラス
    var card = document.getElementById('card');
    if (card) {
      card.className = 'card rarity-' + rarity;
      // R2: MAX因子色を枠に反映
      if (rarity === 'r2' && typeof isMax === 'function') {
        var FC = { O:'#8b5cf6', C:'#3b82f6', E:'#f97316', A:'#f472b6', N:'#14b8a6' };
        var maxFactors = ['O','C','E','A','N'].filter(function(k){ return isMax(k, scores[k]); });
        if (maxFactors.length === 1) {
          var mc = FC[maxFactors[0]];
          card.style.borderColor = mc + '80';
          card.style.boxShadow = '0 4px 20px rgba(0,0,0,.5), 0 0 35px ' + mc + '60';
        }
      }
    }

    // タイプ名
    var typeNameEl = document.getElementById('typeName');
    if (typeNameEl) {
      typeNameEl.textContent = genTypeName(scores);
      requestAnimationFrame(function(){ setTimeout(shrinkTypeName, 100); });
      window.addEventListener('load', shrinkTypeName);
    }

    // タイプコード
    var typeCodeEl = document.getElementById('typeCode');
    if (typeCodeEl) {
      typeCodeEl.textContent = 'O' + scores.O + ' C' + scores.C + ' E' + scores.E + ' A' + scores.A + ' N' + scores.N;
    }

    // スコアバー
    renderScores(scores);

    // 説明文
    var descEl = document.getElementById('desc');
    if (descEl && config.description != null) {
      descEl.textContent = config.description || '';
    }

    // キャラクター画像
    var charImg = document.getElementById('charImg');
    if (charImg) {
      var imgCode = ['O','C','E','A','N'].map(function(k){
        var n = scores[k]; return n <= 2 ? '1' : n >= 4 ? '5' : '3';
      }).join('');
      charImg.src = 'images/characters/' + gender + '/' + imgCode + '.webp';
      charImg.style.display = '';
      charImg.onerror = function(){ charImg.style.display = 'none'; };
    }
  }

  return { genTypeName: genTypeName, renderScores: renderScores, initCard: initCard };
})();
