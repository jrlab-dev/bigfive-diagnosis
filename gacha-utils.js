'use strict';

(function() {

  var COINS_KEY   = 'bigfive_coins';
  var LAST_KEY    = 'bigfive_login_last';
  var STREAK_KEY  = 'bigfive_login_streak';
  var TOTAL_KEY   = 'bigfive_login_bonus_total';

  // ===== コイン管理 =====

  function getCoins() {
    var v = localStorage.getItem(COINS_KEY);
    if (v === null) { localStorage.setItem(COINS_KEY, '3'); return 3; }
    return parseInt(v, 10) || 0;
  }

  function addCoins(n) {
    localStorage.setItem(COINS_KEY, String(getCoins() + n));
  }

  function spendCoins(n) {
    var cur = getCoins();
    if (cur < n) return false;
    localStorage.setItem(COINS_KEY, String(cur - n));
    return true;
  }

  // ===== ログインボーナス =====

  function getTodayJST() {
    var now = new Date();
    var jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return jst.toISOString().slice(0, 10);
  }

  function checkLoginBonus() {
    var today = getTodayJST();
    var last  = localStorage.getItem(LAST_KEY) || '';
    return today !== last;
  }

  function claimLoginBonus() {
    var today  = getTodayJST();
    var last   = localStorage.getItem(LAST_KEY) || '';
    var streak = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10);

    // 前回から2日以上空いたらストリーク1にリセット
    if (last) {
      var lastDate  = new Date(last + 'T00:00:00+09:00');
      var todayDate = new Date(today + 'T00:00:00+09:00');
      var diffDays  = Math.round((todayDate - lastDate) / 86400000);
      streak = diffDays <= 1 ? streak + 1 : 1;
    } else {
      streak = 1;
    }

    var earned = (streak % 7 === 0) ? 3 : 1;
    addCoins(earned);
    localStorage.setItem(LAST_KEY, today);
    localStorage.setItem(STREAK_KEY, String(streak));
    var total = parseInt(localStorage.getItem(TOTAL_KEY) || '0', 10) + 1;
    localStorage.setItem(TOTAL_KEY, String(total));
    return { earned: earned, streak: streak };
  }

  // ===== カード生成 =====

  function randomGender() {
    return Math.random() < 0.5 ? 'M' : 'F';
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function maxValFor(factor) {
    if (factor === 'E' || factor === 'A') return Math.random() < 0.5 ? 1 : 5;
    if (factor === 'N') return 1;
    return 5; // O, C
  }

  function nonMaxValFor(factor) {
    if (factor === 'O' || factor === 'C') return randInt(1, 4);
    if (factor === 'E' || factor === 'A') return randInt(2, 4);
    return randInt(2, 5); // N
  }

  function genCardR0() {
    var code = '';
    for (var i = 0; i < 5; i++) code += randInt(1, 5);
    return { code: code, gender: randomGender(), version: '10', rarity: 'r0' };
  }

  function genCardR1() {
    var factors = ['O', 'C', 'E', 'A', 'N'];
    var code = factors.map(function(f) { return nonMaxValFor(f); }).join('');
    return { code: code, gender: randomGender(), version: '30', rarity: 'r1' };
  }

  function genCardByMaxCount(n) {
    var factors = ['O', 'C', 'E', 'A', 'N'];
    var vals = factors.map(function(f) { return nonMaxValFor(f); });
    // ランダムにn個をMAXに変更
    var indices = [0, 1, 2, 3, 4].sort(function() { return Math.random() - 0.5; }).slice(0, n);
    indices.forEach(function(i) { vals[i] = maxValFor(factors[i]); });
    var rarity = 'r' + (n + 1); // n=1→r2, n=2→r3, n=3→r4, n=4→r5, n=5→r5
    if (n >= 4) rarity = 'r5';
    return { code: vals.join(''), gender: randomGender(), version: '30', rarity: rarity };
  }

  function pickSecretCard() {
    if (typeof HIDDEN_CHARACTERS === 'undefined' || !HIDDEN_CHARACTERS.length) {
      return genCardByMaxCount(4); // フォールバック
    }
    var hc = HIDDEN_CHARACTERS[Math.floor(Math.random() * HIDDEN_CHARACTERS.length)];
    var gender = hc.gender === 'any' ? randomGender() : hc.gender;
    var rarity = (hc.a === 1) ? 'r7' : 'r6';
    return {
      code:     '' + hc.o + hc.c + hc.e + hc.a + hc.n,
      gender:   gender,
      version:  '120',
      rarity:   rarity,
      isHidden: true,
      hiddenId: hc.id,
      typeName: hc.name
    };
  }

  // ===== ガチャ抽選 =====

  function drawNormal() {
    return genCardR0();
  }

  function drawRare() {
    return genCardR1();
  }

  function drawSuper() {
    var r = Math.random() * 100;
    if (r < 0.1)  return pickSecretCard();
    if (r < 1.0)  return genCardByMaxCount(randInt(4, 5)); // r5: 0.9%
    if (r < 8.0)  return genCardByMaxCount(3);             // r4: 7%
    if (r < 35.0) return genCardByMaxCount(2);             // r3: 27%
    return genCardByMaxCount(1);                           // r2: 65%
  }

  // ===== 公開 =====

  window.GachaUtils = {
    getCoins:          getCoins,
    addCoins:          addCoins,
    spendCoins:        spendCoins,
    checkLoginBonus:   checkLoginBonus,
    claimLoginBonus:   claimLoginBonus,
    drawNormal:        drawNormal,
    drawRare:          drawRare,
    drawSuper:         drawSuper,
    getTodayJST:       getTodayJST,
  };

})();
