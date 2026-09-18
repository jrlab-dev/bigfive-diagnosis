/* 完成カードrun6／SNS run8の固定配信版。旧URLは上書きしない。 */
(function (root) {
  'use strict';
  var release = '20260919';
  var origin = 'https://bigfive.jr-genius.jp';
  function build(path, input) {
    var p = new URLSearchParams(input || {});
    p.delete('release');
    p.delete('_t');
    var code = p.get('code') || p.get('type');
    var g = p.get('gender') || 'F';
    var v = p.get('v') || (path === '/share' ? '10' : p.get('rarity') === 'r0' ? '10' : '120');
    var special = p.has('char') || p.has('milestone');
    if (!special) {
      p.set('gender', g);
      p.set('v', v);
      if (v === '10' && !p.has('rarity')) p.set('rarity', 'r0');
    }
    // 量産対象外の旧互換。古い明示r7を新R3画像へ名寄せしない。
    var legacy = !special && (v === 'child' ||
      (v === '10' && !/^[135]{5}$/.test(code || '')) ||
      (v === '30' && g === 'M' && code === '54421' && p.get('rarity') === 'r7'));
    if (!legacy) p.set('release', release);
    return origin + path + '?' + p.toString();
  }
  root.CardDelivery = Object.freeze({
    release: release,
    imageUrl: function (p) { return build('/ogp-image', p); },
    shareUrl: function (p) { return build('/share', p); }
  });
})(window);
