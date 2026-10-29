(function (root) {
  'use strict';

  function object(value) { return !!value && typeof value === 'object' && !Array.isArray(value); }
  function numberIn(value, min, max) {
    return (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) &&
      Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max;
  }
  function oneOf(value, values) { return values.indexOf(value) !== -1; }
  var values = ['self-direction', 'stimulation', 'hedonism', 'achievement', 'power',
    'security', 'conformity', 'tradition', 'benevolence', 'universalism'];
  var tests = [
    { key: 'attachment_result', name: '愛着スタイル', valid: function (d) {
      return oneOf(d.typeKey, ['secure', 'anxious', 'avoidant', 'fearful']);
    } },
    { key: 'hsp_result', name: 'HSP', valid: function (d) {
      return object(d.scores) && numberIn(d.scores.total, 12, 48);
    } },
    { key: 'impostor_result', name: 'インポスター', valid: function (d) {
      return oneOf(d.severityLevel, ['high', 'moderate', 'mid', 'low']);
    } },
    { key: 'eq_result', name: 'EQ', valid: function (d) {
      return oneOf(d.level, ['very_high', 'vhigh', 'high', 'average', 'growth']);
    } },
    { key: 'dark_triad_result', name: 'ダークトライアド', omitted: true, valid: function (d) {
      return object(d.scores) && ['nPct', 'mPct', 'pPct'].every(function (k) {
        return numberIn(d.scores[k], 0, 100);
      });
    } },
    { key: 'locus_result', name: '統制の所在', valid: function (d) {
      return oneOf(d.type, ['internal', 'balanced', 'external']);
    } },
    { key: 'mindset_result', name: 'マインドセット', valid: function (d) {
      return oneOf(d.type, ['growth', 'mixed', 'fixed']);
    } },
    { key: 'sdt_result', name: '動機', valid: function (d) {
      return oneOf(d.strongest, ['autonomy', 'competence', 'relatedness']);
    } },
    { key: 'love_result', name: '恋愛スタイル', valid: function (d) {
      return oneOf(d.mainStyle, ['eros', 'ludus', 'storge', 'pragma', 'mania', 'agape']);
    } },
    { key: 'schwartz_result', name: '価値観', valid: function (d) {
      return Array.isArray(d.top3) && d.top3.length > 0 && d.top3.length <= 3 &&
        d.top3.every(function (v) { return oneOf(v, values); });
    } },
    { key: 'hexaco_result', name: 'HEXACO', omitted: true, valid: function (d) {
      return object(d.scores) && numberIn(d.scores.H, 1, 5);
    } },
    { key: 'riasec_result', name: 'RIASEC職業興味', omitted: true, valid: function (d) {
      return object(d.scores) && typeof d.scores.code === 'string' && /^[RIASEC]{1,6}$/.test(d.scores.code);
    } }
  ];

  function savedStates(storage) {
    return tests.map(function (test) {
      var state = 'unknown';
      try {
        var raw = storage.getItem(test.key);
        if (raw === null) state = 'absent';
        else {
          var data = JSON.parse(raw);
          if (object(data) && test.valid(data)) state = 'present';
        }
      } catch (e) {}
      return { name: test.name, state: state, omitted: !!test.omitted };
    });
  }

  function buildContext(storage, hasBigFive) {
    var lines = [
      '【データの説明】',
      '上は診断の数値プロフィールで、サイトのクロス分析本文ではありません。未掲載・未確認の点数やタイプは不明です。他の結果から補ったり推測したりしないでください。受診時期が異なる結果を含むことがあります。',
      '【このブラウザの保存状態（コピー時点）】'
    ];
    savedStates(storage).forEach(function (test) {
      var label = test.state === 'present' ? 'このブラウザに結果あり' :
        test.state === 'absent' ? '保存結果なし（受診の有無は不明）' : '保存形式を確認できない';
      if (test.omitted) label += '／この数値プロフィールには未収録';
      lines.push('・' + test.name + '：' + label);
    });
    lines.push('', '【組み合わせと開き直し方】',
      'ビッグファイブと対応する心理診断の保存結果を組み合わせた文章を、総合レポートで読めます。研究で示された相関と、サイト独自の読み合わせは別です。文章全体や個人の行動・原因を実証するものではありません。',
      '必要な診断を追加したら、同じブラウザで総合レポートを開き直すと保存結果が反映されます。結果によって表示内容が変わらない場合もあります。診断やレポートの解放条件は各画面で確認できます。');
    if (!hasBigFive) lines.push('総合レポートの生成には、ビッグファイブの結果も必要です。');
    lines.push(
      '仕組み：https://bigfive.jr-genius.jp/cross.html',
      '追加診断と利用条件：https://bigfive.jr-genius.jp/diagnoses.html',
      '同じブラウザで開き直す総合レポート：https://bigfive.jr-genius.jp/report.html',
      'これらの共通URLだけでは、外部AIはこのブラウザに保存された個人の結果を読めません。内容を確認し、自分でコピーして貼り付けてください。');
    return lines.join('\n');
  }

  function copyText(text, nav, doc) {
    function fallback() {
      var input = null;
      var previous = doc.activeElement;
      try {
        input = doc.createElement('textarea');
        input.value = text;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        doc.body.appendChild(input);
        input.select();
        return doc.execCommand('copy') === true;
      } catch (e) { return false; }
      finally {
        if (input && input.parentNode) input.parentNode.removeChild(input);
        try { if (previous && previous.focus) previous.focus({ preventScroll: true }); } catch (e) {}
      }
    }
    try {
      if (nav.clipboard && typeof nav.clipboard.writeText === 'function') {
        return Promise.resolve(nav.clipboard.writeText(text)).then(function () { return true; }, fallback);
      }
    } catch (e) {}
    return Promise.resolve(fallback());
  }

  root.AICopyUtils = { savedStates: savedStates, buildContext: buildContext, copyText: copyText };
})(window);
