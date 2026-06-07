(function(){
  function normalizeGender(gender) {
    return gender === 'M' ? 'M' : 'F';
  }

  function normalizeVersion(version) {
    var v = String(version || '10');
    return v === '120' || v === '30' ? v : '10';
  }

  function roundedCode(code) {
    return String(code || '33333').split('').map(function(d) {
      var n = parseInt(d, 10);
      return n <= 2 ? '1' : n >= 4 ? '5' : '3';
    }).join('');
  }

  function getOfficialHiddenImage(code, gender) {
    if (typeof HIDDEN_CHARACTERS === 'undefined') return null;
    code = String(code || '');
    gender = normalizeGender(gender);
    var scores = { o:+code[0], c:+code[1], e:+code[2], a:+code[3], n:+code[4] };
    var ch = HIDDEN_CHARACTERS.find(function(item) {
      return item.o === scores.o && item.c === scores.c && item.e === scores.e &&
        item.a === scores.a && item.n === scores.n && (item.gender === 'any' || item.gender === gender);
    });
    return ch && ch.img ? 'images/characters/hidden/' + ch.img : null;
  }

  function getDisplayImage(code, gender, version) {
    code = String(code || '33333');
    gender = normalizeGender(gender);
    var v = normalizeVersion(version);
    if (v === '10') return 'images/characters/' + gender + '/' + roundedCode(code) + '.webp';
    // 非R0コード（2や4を含む）は隠しキャラの完全一致 → なければ丸めてR0画像
    var hiddenImg = getOfficialHiddenImage(code, gender);
    if (hiddenImg) return hiddenImg;
    return 'images/characters/' + gender + '/' + roundedCode(code) + '.webp';
  }

  function getFallbackImage(code, gender) {
    gender = normalizeGender(gender);
    return 'images/characters/' + gender + '/' + roundedCode(code) + '.webp';
  }

  function getCardUrl(code, gender, version) {
    var rarity = normalizeVersion(version) === '10' ? 'r0' : 'r6';
    return 'https://bigfive.jr-genius.jp/ogp-image?code=' + encodeURIComponent(String(code || '33333')) +
      '&gender=' + normalizeGender(gender) + '&rarity=' + rarity;
  }

  window.CharacterRegistry = {
    getItem: function(code) { return { code: String(code || '33333'), roundedCode: roundedCode(code) }; },
    getGenderData: function(code, gender) {
      return {
        display10: getDisplayImage(code, gender, '10'),
        display30: getDisplayImage(code, gender, '30'),
        display120: getDisplayImage(code, gender, '120'),
        roundedImage: getFallbackImage(code, gender),
        card10: getCardUrl(code, gender, '10'),
        card30: getCardUrl(code, gender, '30'),
        card120: getCardUrl(code, gender, '120')
      };
    },
    getDisplayImage: getDisplayImage,
    getFallbackImage: getFallbackImage,
    getCardUrl: getCardUrl
  };
})();
