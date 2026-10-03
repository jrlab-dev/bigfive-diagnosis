/**
 * character-registry.js — 画像検索を image-resolver.js に委譲
 *
 * 後方互換のため旧APIを維持。新コードは直接 ImageResolver を使用すること。
 * image-resolver.js が先に読み込まれている必要がある。
 */
(function(){
  // ImageResolver が未読み込みの場合のフォールバック
  var IR = window.ImageResolver;

  function getDisplayImage(code, gender, version) {
    if (IR) return IR.getDisplayImage(code, gender, version);
    // フォールバック: image-resolver がない場合も版別の通常fallbackを維持
    return getFallbackImage(code, gender, version);
  }

  function getFallbackImage(code, gender, version) {
    if (IR) return IR.getFallbackImage(code, gender, version);
    var g = gender === 'M' ? 'M' : 'F';
    var rCode = String(code || '33333').split('').map(function(d) {
      var n = parseInt(d, 10);
      return n <= 2 ? '1' : n >= 4 ? '5' : '3';
    }).join('');
    var v = String(version || '10');
    var directory = (v === '30' || v === '60' || v === '120') ? 'renewal243' : 'marume243';
    return 'images/characters/' + directory + '/' + g + '/' + rCode + '.webp';
  }

  function getCardUrl(code, gender, version) {
    if (IR) return IR.getCardUrl(code, gender, version);
    var v = String(version || '10');
    var q = {code:String(code || '33333'),gender:gender === 'M' ? 'M' : 'F',v:v};
    if (q.v === '10') q.rarity = 'r0';
    if (window.CardDelivery) return CardDelivery.imageUrl(q);
    return 'https://bigfive.jr-genius.jp/ogp-image?' + new URLSearchParams(q).toString();
  }

  function roundedCode(code) {
    if (IR) return IR.roundedCode(code);
    return String(code || '33333').split('').map(function(d) {
      var n = parseInt(d, 10);
      return n <= 2 ? '1' : n >= 4 ? '5' : '3';
    }).join('');
  }

  window.CharacterRegistry = {
    getItem: function(code) { return { code: String(code || '33333'), roundedCode: roundedCode(code) }; },
    getGenderData: function(code, gender) {
      return {
        display10: getDisplayImage(code, gender, '10'),
        display30: getDisplayImage(code, gender, '30'),
        display60: getDisplayImage(code, gender, '60'),
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
