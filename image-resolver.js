/**
 * image-resolver.js — 統一キャラクター画像検索モジュール
 *
 * 全てのコンポーネント（result.html, album.js, character-registry.js, ogp等）から
 * 参照される唯一の画像検索ロジック。
 *
 * 新フォルダ構成:
 *   images/characters/
 *   ├── marume243/{M,F}/   — 243パターン丸めキャラ（{1,3,5}コード）
 *   ├── only/{M,F}/        — パラメータードンピシャのオリジナルキャラ
 *   └── secret/{M,F}/      — 著作権アニメキャラ
 *
 * 検索順序（バージョン別）:
 *   1. secret/{gender}/{rawCode}.webp     （'60'/'120'のみ）
 *   2. only/{gender}/{rawCode}.webp       （'30'/'60'/'120'/'child'）
 *   3. marume243/{gender}/{roundedCode}.webp （全バージョン・フォールバック）
 *
 * 設計方針: ファイルを置くだけで反映。コード変更・設定更新不要。
 */
(function () {
  'use strict';

  // ── ヘルパー ──────────────────────────────────────────

  function normalizeGender(gender) {
    return gender === 'M' ? 'M' : 'F';
  }

  /** バージョンコード正規化。未知は'10'にフォールバック。 */
  function normalizeVersion(version) {
    var v = String(version || '10');
    if (v === '10' || v === '30' || v === '60' || v === '120' || v === 'child') return v;
    return '10';
  }

  /** 各桁を {1,3,5} に丸める。1,2→1 / 3→3 / 4,5→5 */
  function roundedCode(code) {
    return String(code || '33333').split('').map(function (d) {
      var n = parseInt(d, 10);
      return n <= 2 ? '1' : n >= 4 ? '5' : '3';
    }).join('');
  }

  /** シークレット（著作権キャラ）を表示できるバージョンか */
  function canShowSecret(version) {
    var v = normalizeVersion(version);
    return v === '60' || v === '120';
  }

  /** オンリー（オリジナルドンピシャ）を表示できるバージョンか */
  function canShowOnly(version) {
    var v = normalizeVersion(version);
    return v === '30' || v === '60' || v === '120' || v === 'child';
  }

  // ── コア: 統一画像検索 ────────────────────────────────

  /**
   * キャラクター画像パスを解決する。
   * @param {string} code    - 5桁のビッグファイブスコア（例: '43521'）
   * @param {string} gender  - 'M' or 'F'
   * @param {string} version - '10'|'30'|'60'|'120'|'child'
   * @returns {{ path: string, tier: 'secret'|'only'|'marume243' }}
   */
  function resolveCharacterImage(code, gender, version) {
    code = String(code || '33333');
    gender = normalizeGender(gender);
    var rCode = roundedCode(code);

    // ステップ1: secret（'60'/'120'のみ・rawCode完全一致）
    if (canShowSecret(version)) {
      return { path: 'images/characters/secret/' + gender + '/' + code + '.webp', tier: 'secret' };
    }

    // ステップ2: only（'30'/'60'/'120'/'child'・rawCode完全一致）
    if (canShowOnly(version)) {
      return { path: 'images/characters/only/' + gender + '/' + code + '.webp', tier: 'only' };
    }

    // ステップ3: marume243（全バージョン・フォールバック）
    return { path: 'images/characters/marume243/' + gender + '/' + rCode + '.webp', tier: 'marume243' };
  }

  /**
   * 候補パス一覧を優先順位で返す。
   * ブラウザの onerror チェーンで順次試すために使用。
   * @param {string} code
   * @param {string} gender
   * @param {string} version
   * @returns {Array<{path: string, tier: string}>}
   */
  function getCandidates(code, gender, version) {
    code = String(code || '33333');
    gender = normalizeGender(gender);
    version = normalizeVersion(version);
    var rCode = roundedCode(code);
    var candidates = [];

    if (canShowSecret(version)) {
      candidates.push({ path: 'images/characters/secret/' + gender + '/' + code + '.webp', tier: 'secret' });
    }
    if (canShowOnly(version)) {
      candidates.push({ path: 'images/characters/only/' + gender + '/' + code + '.webp', tier: 'only' });
    }
    candidates.push({ path: 'images/characters/marume243/' + gender + '/' + rCode + '.webp', tier: 'marume243' });

    return candidates;
  }

  /**
   * 同期版: 最も可能性の高いパスを1つ返す（旧コード互換用）。
   * ブラウザでは画像の実際の存在確認は onerror で行う前提。
   */
  function getDisplayImage(code, gender, version) {
    var c = getCandidates(code, gender, version);
    return c.length > 0 ? c[0].path : null;
  }

  /**
   * フォールバック画像（常に marume243 の丸めコード）。
   * onerror 時の最終保険。
   */
  function getFallbackImage(code, gender) {
    gender = normalizeGender(gender);
    return 'images/characters/marume243/' + gender + '/' + roundedCode(code) + '.webp';
  }

  /**
   * OGPカードURL生成。
   */
  function getCardUrl(code, gender, version) {
    var rarity = normalizeVersion(version) === '10' ? 'r0' : 'r6';
    return 'https://bigfive.jr-genius.jp/ogp-image?code=' + encodeURIComponent(String(code || '33333')) +
      '&gender=' + normalizeGender(gender) + '&rarity=' + rarity;
  }

  /**
   * 旧 CharacterRegistry 互換: 全バージョンの画像パス一括取得。
   * Phase 4の移行期間中に使用。
   */
  function getGenderData(code, gender) {
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
  }

  // ── 公開API ───────────────────────────────────────────

  window.ImageResolver = {
    // コア
    resolve: resolveCharacterImage,
    getCandidates: getCandidates,
    getDisplayImage: getDisplayImage,
    getFallbackImage: getFallbackImage,
    getCardUrl: getCardUrl,
    getGenderData: getGenderData,

    // ヘルパー（他モジュールからも参照される可能性あり）
    normalizeGender: normalizeGender,
    normalizeVersion: normalizeVersion,
    roundedCode: roundedCode,
    canShowSecret: canShowSecret,
    canShowOnly: canShowOnly
  };
})();
