// 子どもの結果一覧。幼児と中高生本人だけが独立した端末専用キーを使う。
(function(global) {
  'use strict';

  var SOURCES = [
    { key: 'child_temperament_results_v1', relation: 'kid_t3', model: 'temperament-v1', label: '3〜6歳・3つの気質（保護者が回答）', code: /^[123]{3}$/ },
    { key: 'bigfive_other_results', relation: 'kid_e1', model: 'bigfive-child-v1', label: '小学1〜3年（保護者が回答）', code: /^[135]{5}$/, mirrored: true },
    { key: 'bigfive_other_results', relation: 'kid_e2', model: 'bigfive-child-v1', label: '小学4〜6年（保護者が回答）', code: /^[135]{5}$/, mirrored: true },
    { key: 'bigfive_other_results', relation: 'kid_jh', model: 'bigfive-child-v1', label: '中学生（保護者が回答）', code: /^[135]{5}$/, mirrored: true },
    { key: 'youth_self_results_v1', relation: 'kid_self', model: 'bigfive-youth-v1', label: '中高生本人（本人が回答）', code: /^[135]{5}$/ },
    { key: 'bigfive_other_results', relation: 'child46', label: '旧版・4〜6歳（保護者が回答）', code: /^[1-5]{5}$/, mirrored: true, legacy: true },
    { key: 'bigfive_other_results', relation: 'child79', label: '旧版・7〜9歳（保護者が回答）', code: /^[1-5]{5}$/, mirrored: true, legacy: true }
  ];

  function read(source) {
    var raw;
    try {
      raw = localStorage.getItem(source.key);
      var parsed = raw == null ? [] : JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(function(record, index) { return { record: record, index: index }; })
        .filter(function(item) {
          var record = item.record;
          return record && typeof record === 'object' &&
            (source.legacy || (typeof record.id === 'string' && record.id.length > 0)) &&
            record.relation === source.relation && (source.legacy || record.model === source.model) &&
            typeof record.code === 'string' && source.code.test(record.code) &&
            (record.gender === 'M' || record.gender === 'F');
        });
    } catch (error) {
      // 破損した専用キーだけを空扱いにする。元データも他の履歴も変更しない。
      return [];
    }
  }

  function element(tag, className, content) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (content != null) node.textContent = String(content);
    return node;
  }

  function encode(value) {
    // 保存値に不正なサロゲートが混じっても、ほかの履歴の表示を止めない。
    var safe = Array.from(value, function(ch) { return /^[\uD800-\uDFFF]$/.test(ch) ? '\uFFFD' : ch; }).join('');
    return encodeURIComponent(safe);
  }

  function dateLabel(value) {
    if (typeof value !== 'string' || !value) return '';
    var date = new Date(value);
    if (!Number.isFinite(date.getTime())) return '';
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
  }

  function removeOne(source, id) {
    if (!global.confirm('この子どもの結果を1件削除しますか？')) return false;
    try {
      var parsed = JSON.parse(localStorage.getItem(source.key) || '[]');
      if (!Array.isArray(parsed)) return false;
      var index = parsed.findIndex(function(record) {
        return record && record.id === id && record.relation === source.relation && record.model === source.model;
      });
      if (index < 0) return false;
      parsed.splice(index, 1);
      localStorage.setItem(source.key, JSON.stringify(parsed));
      return true;
    } catch (error) {
      return false;
    }
  }

  function render(container) {
    if (!container) return;
    container.replaceChildren();
    var note = element('p', '', '幼児と中高生本人の結果は、この端末だけに保存され、相性診断には使いません。保護者が答えた5因子の結果と旧版は「あの人の結果」にも表示されます。');
    note.style.cssText = 'font-size:12px;color:var(--dim);line-height:1.7;margin:0 0 8px;';
    container.appendChild(note);

    var count = 0;
    SOURCES.forEach(function(source) {
      var items = read(source);
      if (!items.length) return;
      count += items.length;
      var section = element('section', 'kid-history-section');
      section.appendChild(element('h2', '', source.label));
      items.forEach(function(item) {
        var record = item.record;
        var name = typeof record.name === 'string' && record.name ? record.name : '名前なし';
        var card = element('div', 'result-card');
        var link = element('a');
        link.href = source.legacy
          ? 'kodomo-legacy.html?type=' + encode(record.code) + '&gender=' + encode(record.gender) + '&name=' + encode(typeof record.name === 'string' ? record.name : '') + '&rel=' + encode(source.relation)
          : 'kodomo.html?saved=' + encode(record.id) + '&group=' + encode(source.relation);
        link.style.cssText = 'display:flex;flex-direction:column;gap:5px;flex:1;min-width:0;text-decoration:none;color:inherit;';
        var kind = source.relation === 'kid_t3' && global.KidCardData ? KidCardData.entries.find(function(r){return r.id===record.code;}) : null;
        var typeName = kind ? kind.name : global.PersonalityTypes ? PersonalityTypes.getName(record.code,record.typeName||record.code) : record.code;
        var thumb = element('img', 'kid-history-thumb');
        var candidates = !kind && global.ImageResolver ? ImageResolver.getCandidates(record.code,record.gender,record.version||'30').map(function(c){return c.path;}) : [];
        thumb.src = kind ? 'images/kid-art/'+record.gender+'/'+record.code+'.webp' : candidates.shift() || '';
        thumb.onerror=function(){if(candidates.length)thumb.src=candidates.shift();};
        thumb.alt = typeName;
        thumb.loading = 'lazy';
        thumb.style.cssText='width:64px;height:72px;object-fit:contain;flex:none;';
        card.appendChild(thumb);
        link.appendChild(element('span', 'result-card-name', typeName));
        if (name !== '名前なし') link.appendChild(element('span', 'result-card-date', name));
        link.appendChild(element('span', 'result-card-code', record.code));
        var date = dateLabel(record.date);
        if (date) link.appendChild(element('span', 'result-card-date', date));
        card.appendChild(link);
        if (!source.mirrored) {
          var button = element('button', 'delete-btn', '削除');
          button.type = 'button';
          button.setAttribute('aria-label', name + 'の結果を削除');
          button.addEventListener('click', function() {
            if (removeOne(source, record.id)) render(container);
          });
          card.appendChild(button);
        }
        section.appendChild(card);
      });
      container.appendChild(section);
    });

    if (!count) {
      var empty = element('div', 'empty-state');
      empty.appendChild(element('p', '', 'まだ子どもの結果はありません'));
      var entry = element('a', '', '子どもの診断を受ける →');
      entry.href = 'kodomo.html';
      empty.appendChild(entry);
      container.appendChild(empty);
    }
  }

  global.KidHistory = { render: render, read: read };
})(window);
