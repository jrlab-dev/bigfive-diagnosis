'use strict';

// ===== 研究員ガイド（心理ゲーム用チュートリアル吹き出し） =====
// 使い方:
//   DoctorGuide.mount(containerEl)            … 表示先にガイドUIを挿入
//   DoctorGuide.say([{text, pose}], opts)     … セリフを順番に表示
//     opts.onDone   … 最後のセリフまで読み終えたときに呼ばれる
//     opts.compact  … true で小さめ表示（質問・結果画面用）
//   ポーズ: speaking(説明) / smile(笑顔) / thinking(考え中) / surprised(驚き)
window.DoctorGuide = (function() {
  var IMAGES = {
    speaking:  'images/doctor_speaking.webp',
    smile:     'images/doctor_smile.webp',
    thinking:  'images/doctor_thinking.webp',
    surprised: 'images/doctor_surprised.webp'
  };

  var wrap = null, img = null, textEl = null, nextBtn = null;
  var lines = [], idx = 0, onDone = null;

  function build() {
    wrap = document.createElement('div');
    wrap.className = 'dg-wrap';
    wrap.innerHTML =
      '<img class="dg-img" alt="研究員">' +
      '<div class="dg-bubble">' +
        '<div class="dg-text"></div>' +
        '<button class="dg-next" type="button">次へ ▶</button>' +
      '</div>';
    img = wrap.querySelector('.dg-img');
    textEl = wrap.querySelector('.dg-text');
    nextBtn = wrap.querySelector('.dg-next');
    nextBtn.addEventListener('click', advance);
    wrap.querySelector('.dg-bubble').addEventListener('click', function(e) {
      if (e.target !== nextBtn && nextBtn.style.display !== 'none') advance();
    });
    // ポーズ画像を先読み（切り替え時のチラつき防止）
    Object.keys(IMAGES).forEach(function(k) { (new Image()).src = IMAGES[k]; });
  }

  function renderLine() {
    var line = lines[idx];
    img.src = IMAGES[line.pose] || IMAGES.speaking;
    textEl.textContent = line.text;
    textEl.classList.remove('dg-pop');
    void textEl.offsetWidth; // アニメ再生のためのreflow
    textEl.classList.add('dg-pop');
    var isLast = idx >= lines.length - 1;
    nextBtn.style.display = isLast ? 'none' : '';
  }

  function advance() {
    if (idx < lines.length - 1) {
      idx++;
      renderLine();
      if (idx === lines.length - 1 && onDone) onDone();
    }
  }

  return {
    mount: function(parent, before) {
      if (!wrap) build();
      parent.insertBefore(wrap, before || parent.firstChild);
    },
    say: function(newLines, opts) {
      if (!wrap) build();
      opts = opts || {};
      lines = newLines.filter(function(l) { return l && l.text; });
      if (!lines.length) return;
      idx = 0;
      onDone = opts.onDone || null;
      wrap.classList.toggle('dg-compact', !!opts.compact);
      renderLine();
      if (lines.length === 1 && onDone) onDone();
    }
  };
})();
