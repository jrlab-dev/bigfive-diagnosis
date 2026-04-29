/**
 * カード図鑑 Stage 1 — アルバム（15枚）
 *
 * album.js は hidden_characters.js の後に読み込むこと。
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'bigfive_album';
  var META_KEY = 'bigfive_album_meta';
  var MY_KEY = 'bigfive_my_results';
  var OTHER_KEY = 'bigfive_other_results';
  var MAX_CARDS = 15;

  var RARITY_RANK = { r0: 1, r1: 2, r2: 3, r3: 4, r4: 5, r5: 6, r6: 7, r7: 8, common: 1, rare: 2, legendary: 3, secret: 4 };

  // --- ユーティリティ ---

  function getAlbumCards() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch(e) { return []; }
  }

  function saveAlbumCards(cards) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }

  function getAlbumMeta() {
    try {
      var meta = JSON.parse(localStorage.getItem(META_KEY));
      return meta || { migrated: false, milestones: {} };
    } catch(e) {
      return { migrated: false, milestones: {} };
    }
  }

  function saveAlbumMeta(meta) {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  }

  // --- レアリティ計算（旧データ移行用・決定的） ---

  function toScale(v) { return v <= 2 ? 1 : v >= 4 ? 5 : 3; }

  function findHiddenCharForAlbum(scores, gender) {
    if (typeof HIDDEN_CHARACTERS === 'undefined') return null;
    var os = toScale(scores.O), cs = toScale(scores.C);
    var es = toScale(scores.E), as = toScale(scores.A), ns = toScale(scores.N);
    return HIDDEN_CHARACTERS.find(function(c) {
      return c.o === os && c.c === cs && c.e === es && c.a === as && c.n === ns &&
        (c.gender === 'any' || c.gender === gender);
    }) || null;
  }

  function computeRarityForAlbum(code, version, gender) {
    // 10問版：r0固定
    if (version === '10') return 'r0';

    // MAX因子判定ヘルパー
    function isMax(factor, value) {
      if (factor === 'N') return value === 1;
      if (factor === 'E' || factor === 'A') return value === 1 || value === 5;
      return value === 5;
    }

    // 120問版のみ隠しキャラ判定
    if (version === '120') {
      var scores = { O: +code[0], C: +code[1], E: +code[2], A: +code[3], N: +code[4] };
      var hc = findHiddenCharForAlbum(scores, gender);
      if (hc) {
        return hc.a === 1 ? 'r7' : 'r6';
      }
    }

    // MAX因子カウント方式でレア度判定
    var maxCount = 0;
    if (isMax('O', +code[0])) maxCount++;
    if (isMax('C', +code[1])) maxCount++;
    if (isMax('E', +code[2])) maxCount++;
    if (isMax('A', +code[3])) maxCount++;
    if (isMax('N', +code[4])) maxCount++;

    // R1: MAX 0個 → R1
    if (maxCount === 0) return 'r1';
    // R2: MAX 1個 → R2
    if (maxCount === 1) return 'r2';
    // R3: MAX 2個 → R3
    if (maxCount === 2) return 'r3';
    // R4: MAX 3個 → R4
    if (maxCount === 3) return 'r4';
    // R5: MAX 4-5個 → R5
    return 'r5';
  }

  // --- タイプ名取得 ---

  function getTypeName(code, scores) {
    if (typeof mainLabels === 'undefined' || typeof subLabels === 'undefined') {
      return code;
    }
    var O = scores.O, C = scores.C, E = scores.E, A = scores.A, N = scores.N;
    var mainIdx = Math.max(O, C, E, A, N);
    var subIdx = 0, subMax = 0;
    [O, C, E, A, N].forEach(function(v, i) {
      if (i !== mainIdx - 1 && v >= subMax) { subMax = v; subIdx = i + 1; }
    });
    // mainIdx is 1-5 but subIdx calculation differs; use simple fallback
    return (mainLabels[mainIdx - 1] || '') + '・' + (subLabels[subIdx - 1] || '');
  }

  // --- アルバム追加 ---

  function addToAlbum(cardData) {
    if (!cardData || !cardData.code || !cardData.gender) return false;

    var cards = getAlbumCards();
    var dedupeKey = cardData.code + '_' + cardData.gender;
    var existingIdx = -1;

    for (var i = 0; i < cards.length; i++) {
      // versionも含めて判定（10問版と30問版の同じコードは別カードとして扱う）
      if (cards[i].code === cardData.code && cards[i].gender === cardData.gender && cards[i].version === (cardData.version || '30')) {
        existingIdx = i;
        break;
      }
    }

    if (existingIdx >= 0) {
      // レアリティが高い方を保持
      var existing = cards[existingIdx];
      var newRank = RARITY_RANK[cardData.rarity] || 1;
      var oldRank = RARITY_RANK[existing.rarity] || 1;
      if (newRank > oldRank) {
        cards[existingIdx].rarity = cardData.rarity;
        cards[existingIdx].date = cardData.date || new Date().toISOString();
        if (cardData.isHidden) {
          cards[existingIdx].isHidden = true;
          cards[existingIdx].hiddenId = cardData.hiddenId;
        }
        saveAlbumCards(cards);
        checkMilestones(cards.length);
        return true;
      }
      return false;
    }

    if (cards.length >= MAX_CARDS) return false;

    cards.push({
      code: cardData.code,
      gender: cardData.gender,
      typeName: cardData.typeName || cardData.code,
      version: cardData.version || '30',
      rarity: cardData.rarity || 'common',
      isHidden: !!cardData.isHidden,
      hiddenId: cardData.hiddenId || null,
      date: cardData.date || new Date().toISOString(),
      source: cardData.source || 'my'
    });

    saveAlbumCards(cards);
    checkMilestones(cards.length);
    return true;
  }

  // --- 実績チェック ---

  function checkMilestones(count) {
    var meta = getAlbumMeta();
    var thresholds = [5, 10, 15, 20];
    var changed = false;

    thresholds.forEach(function(t) {
      if (count >= t && !meta.milestones[t]) {
        meta.milestones[t] = { unlocked: true, date: new Date().toISOString() };
        changed = true;
        showMilestoneToast(t);
      }
    });

    if (changed) saveAlbumMeta(meta);
  }

  function showMilestoneToast(milestone) {
    var messages = {
      5: '5枚コレクト！ ブロンズ取得',
      10: '10枚コレクト！ シルバー取得',
      15: '15枚コレクト！ ゴールド取得',
      20: '20枚コレクト！ ダイヤモンド取得'
    };
    var toast = document.getElementById('albumToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'albumToast';
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-100px);' +
        'background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;padding:12px 24px;border-radius:12px;' +
        'font-weight:bold;z-index:10000;transition:transform 0.4s ease;box-shadow:0 4px 20px rgba(139,92,246,0.4);' +
        'font-size:14px;white-space:nowrap;';
      document.body.appendChild(toast);
    }
    toast.textContent = messages[milestone] || milestone + '枚コレクト！';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(function() {
      toast.style.transform = 'translateX(-50%) translateY(-100px)';
    }, 2500);
  }

  // --- 既存データ移行 ---

  function migrateExistingResults() {
    var meta = getAlbumMeta();
    if (meta.migrated) return;

    var myResults = [];
    var otherResults = [];
    try { myResults = JSON.parse(localStorage.getItem(MY_KEY)) || []; } catch(e) {}
    try { otherResults = JSON.parse(localStorage.getItem(OTHER_KEY)) || []; } catch(e) {}

    myResults.forEach(function(r) {
      if (!r.code || !r.gender) return;
      var rarity = r.rarity || computeRarityForAlbum(r.code, r.version, r.gender);
      var scores = r.scores || { O: +r.code[0], C: +r.code[1], E: +r.code[2], A: +r.code[3], N: +r.code[4] };
      var hc = findHiddenCharForAlbum(scores, r.gender);
      addToAlbum({
        code: r.code,
        gender: r.gender,
        typeName: r.typeName || r.code,
        version: r.version || '30',
        rarity: rarity,
        isHidden: !!hc,
        hiddenId: hc ? hc.id : null,
        date: r.date || new Date().toISOString(),
        source: 'my'
      });
    });

    otherResults.forEach(function(r) {
      if (!r.code || r.isChild) return;
      var gender = r.gender || 'F';
      var version = r.version || '30';
      var rarity = r.rarity || computeRarityForAlbum(r.code, version, gender);
      var scores = r.scores || { O: +r.code[0], C: +r.code[1], E: +r.code[2], A: +r.code[3], N: +r.code[4] };
      var hc = findHiddenCharForAlbum(scores, gender);
      addToAlbum({
        code: r.code,
        gender: gender,
        typeName: r.typeName || r.code,
        version: version,
        rarity: rarity,
        isHidden: !!hc,
        hiddenId: hc ? hc.id : null,
        date: r.date || new Date().toISOString(),
        source: 'other'
      });
    });

    meta.migrated = true;
    saveAlbumMeta(meta);
  }

  // --- 画像パス取得 ---

  function getCardImagePath(card) {
    if (card.isHidden && card.hiddenId) {
      var hc = null;
      if (typeof HIDDEN_CHARACTERS !== 'undefined') {
        hc = HIDDEN_CHARACTERS.find(function(c) { return c.id === card.hiddenId; });
      }
      if (hc) return 'images/characters/hidden/' + hc.img;
    }
    // 1/3/5丸めで画像コードを取得
    var code = card.code;
    var imgCode = toScale(+code[0]).toString() + toScale(+code[1]).toString() +
      toScale(+code[2]).toString() + toScale(+code[3]).toString() + toScale(+code[4]).toString();
    return 'images/characters/' + card.gender + '/' + imgCode + '.webp';
  }

  // --- グローバル公開 ---
  window.AlbumUtils = {
    getAlbumCards: getAlbumCards,
    addToAlbum: addToAlbum,
    computeRarityForAlbum: computeRarityForAlbum,
    migrateExistingResults: migrateExistingResults,
    getAlbumMeta: getAlbumMeta,
    checkMilestones: checkMilestones,
    getCardImagePath: getCardImagePath,
    MAX_CARDS: MAX_CARDS,
    RARITY_RANK: RARITY_RANK,
    STORAGE_KEY: STORAGE_KEY,
    META_KEY: META_KEY
  };

})();
