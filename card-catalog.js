/* カードの種類数。所持記録数（同じ型の版違いを含む）とは分ける。 */
(function (root) {
  'use strict';
  var ADULT = 5 ** 5 * 2;
  var NORMAL = 3 ** 5 * 2;
  var HIDDEN = 28;
  var MILESTONE = 12;
  var KID = 3 ** 3 * 2;
  function isKid(code, version) {
    return version === 'kid3' && /^[123]{3}$/.test(String(code || ''));
  }
  function kidImage(code, gender) {
    if (!isKid(code, 'kid3') || (gender !== 'M' && gender !== 'F')) return '';
    return 'images/kid-cards/' + gender + '/' + code + '.webp?v=20260927h';
  }
  function kidResult(code, gender) {
    if (!isKid(code, 'kid3') || (gender !== 'M' && gender !== 'F')) return '';
    return 'kodomo.html?group=kid_t3&code=' + code + '&gender=' + gender;
  }
  root.CardCatalog = Object.freeze({
    ADULT: ADULT, NORMAL: NORMAL, HIDDEN: HIDDEN, MILESTONE: MILESTONE,
    KID: KID, TOTAL: ADULT + NORMAL + HIDDEN + MILESTONE + KID,
    isKid: isKid, kidImage: kidImage, kidResult: kidResult
  });
})(window);
