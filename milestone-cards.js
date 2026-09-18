/* 収集記念のシークレット：付与はalbum.js、ここは閲覧と一度だけの発見演出。 */
(function () {
  'use strict';
  if (window.CollectionMilestones || !window.AlbumUtils) return;
  var base = new URL('.', document.currentScript.src).href;
  var album = window.AlbumUtils;
  var active = null, opening = false, timer = null, failed = false;
  var galleries = [];

  function node(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function resource(name, style) {
    return new Promise(function(resolve, reject) {
      var n = document.createElement(style ? 'link' : 'script');
      if (style) { n.rel = 'stylesheet'; n.href = base + name + '?v=20260919'; }
      else n.src = base + name + '?v=20260919';
      var timeout = setTimeout(function() { reject(new Error('記念カードの読み込み時間超過')); }, 10000);
      n.onload = function() { clearTimeout(timeout); resolve(); };
      n.onerror = function() { clearTimeout(timeout); reject(new Error('記念カードの読み込み失敗')); };
      document.head.appendChild(n);
    });
  }
  var ready = Promise.all([resource('milestone-art.css', true), resource('milestone-cards.css', true), resource('milestone-art.js', false), window.CardDelivery ? Promise.resolve() : resource('card-delivery.js', false)]).then(function() {
    return new Promise(function(resolve) {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resolve, { once: true });
      else resolve();
    });
  });

  function ownedItems() {
    var owned = album.getCollectionRewards().map(function(r) { return r.threshold; });
    return MilestoneArt.catalog.filter(function(item) { return owned.indexOf(item.threshold) >= 0; });
  }
  function renderGalleries() {
    if (!window.MilestoneArt) return;
    galleries.forEach(function(g) { g.destroy(); }); galleries = [];
    var items = ownedItems();
    document.querySelectorAll('[data-milestone-collection]').forEach(function(section) {
      var filter=section.dataset.collectionFilter;
      var visible=!filter || filter==='all' || filter==='r6' || filter==='r8'; // r8=収集記念（2026-09-17新設・Secretタブでの表示は従来どおり）
      section.replaceChildren(); section.hidden = !items.length || !visible;
      if (!items.length || !visible) return;
      section.classList.add('cm-collection');
      section.append(node('h2', 'cm-collection-title', '収集記念のシークレット'));
      section.append(node('p', 'cm-collection-count', items.length + '枚の特別なカード'));
      var surface = MilestoneArt.createSurface(items, open);
      section.append(surface);
      galleries.push({ destroy: MilestoneArt.attach(surface) });
    });
  }
  function isOtherDialogOpen() {
    if (document.querySelector('#carddasOverlay.active, dialog[open]')) return true;
    var banner = document.getElementById('unlockBannerOverlay');
    return !!banner && getComputedStyle(banner).display !== 'none';
  }
  function schedule() {
    if (timer !== null) return;
    timer = setTimeout(function() { timer = null; pump(); }, 300);
  }
  function pump() {
    if (failed || opening || active) return;
    var pending = album.getPendingCollectionRewards();
    if (!pending.length) return;
    if (document.hidden || isOtherDialogOpen()) { schedule(); return; }
    var item = ownedItems().find(function(x) { return x.threshold === pending[0]; });
    if (item) show(item, true);
  }
  function open(threshold) {
    return ready.then(function() {
      if (active || opening || isOtherDialogOpen()) return false;
      var item = ownedItems().find(function(x) { return x.threshold === Number(threshold); });
      return item ? show(item, false) : false;
    });
  }
  function waitForArt(surface) {
    var images = Array.from(surface.querySelectorAll('img'));
    return Promise.race([
      Promise.all(images.map(function(img) { return img.decode ? img.decode().catch(function(){}) : Promise.resolve(); })),
      new Promise(function(resolve) { setTimeout(resolve, 2500); })
    ]);
  }
  function show(item, celebrate) {
    if (opening || active) return Promise.resolve(false);
    opening = true;
    var surface = MilestoneArt.createSurface([item]);
    return waitForArt(surface).then(function() {
      opening = false;
      if (isOtherDialogOpen()) { schedule(); return false; }
      if (celebrate && album.getPendingCollectionRewards().indexOf(item.threshold) < 0) { schedule(); return false; }
      var previousFocus = document.activeElement;
      var previousOverflow = document.body.style.overflow;
      var dialog = node('dialog', 'bf-milestone-dialog' + (celebrate ? ' cm-reveal' : ''));
      dialog.dataset.threshold = item.threshold;
      if (celebrate) dialog.dataset.celebration = 'true';
      dialog.dataset.kind = item.kind;
      dialog.setAttribute('aria-labelledby', 'cm-discovery-title');
      dialog.setAttribute('aria-describedby', 'cm-discovery-description');

      var backdrop = node('div', 'cm-atmosphere'); backdrop.setAttribute('aria-hidden','true');
      backdrop.append(node('div','cm-orbit'), node('div','cm-orbit cm-orbit-two'), node('div','cm-bloom'));
      for (var i=0;i<30;i++) {
        var star = node('i','cm-particle');
        var angle = i * Math.PI * 2 / 30;
        star.style.setProperty('--px', Math.round(Math.cos(angle)*180) + 'px');
        star.style.setProperty('--py', Math.round(Math.sin(angle)*200) + 'px');
        star.style.setProperty('--delay', ((i%7)*.045).toFixed(3) + 's');
        backdrop.append(star);
      }
      var close = node('button','cm-close','×'); close.type='button'; close.setAttribute('aria-label','閉じる');
      var inner = node('div','cm-modal-inner');
      var header = node('header','cm-introduction');
      header.append(node('p','cm-eyebrow',celebrate ? 'SECRET DISCOVERED' : 'SECRET COLLECTION'));
      var title = node('h1','cm-discovery-title',celebrate ? '新たなシークレット' : '探究の証'); title.id='cm-discovery-title';
      header.append(title);
      var lead = node('p','cm-lead',celebrate ? '積み重ねた探究が、特別な一枚に。' : 'あなたが手にした、特別な一枚。'); header.append(lead);
      surface.classList.add('cm-hero-card');
      var ending = node('div','cm-ending');
      var description = node('p','cm-discovery-description','カード'+item.threshold.toLocaleString()+'枚の収集を記念して'); description.id='cm-discovery-description';
      var status = node('p','cm-saved',celebrate ? 'シークレットに加わりました' : '収集記念 · 獲得済み');
      var actions = node('div','cm-actions');
      var done = node('button','cm-continue',celebrate ? '続ける' : '閉じる'); done.type='button';
      var visit = node('a','cm-visit','図鑑で見る');visit.href=new URL('zukan.html?milestone='+item.threshold,base).href;
      var share = node('a','cm-visit','Xでシェア');
      share.href = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(CardDelivery.shareUrl({milestone:String(item.threshold)}));
      share.target = '_blank'; share.rel = 'noopener noreferrer';
      actions.append(done); if (celebrate) actions.append(visit); actions.append(share);
      ending.append(description,status,actions);
      inner.append(header,surface,ending);
      dialog.append(backdrop,close,inner);
      var skip;
      if (celebrate) {
        skip=node('button','cm-skip-button','演出をスキップ');skip.type='button';
        skip.addEventListener('click',function(){dialog.classList.add('cm-skip');skip.hidden=true;done.focus();});
        dialog.append(skip);
      }
      active = dialog;
      document.body.append(dialog);
      document.body.style.overflow='hidden';
      var destroyArt;
      function closeDialog() {
        if (active !== dialog) return;
        if (destroyArt) destroyArt();
        if (typeof dialog.close === 'function' && dialog.open) dialog.close();
        dialog.remove(); active=null;
        document.body.style.overflow=previousOverflow;
        if (previousFocus && previousFocus.isConnected && previousFocus.focus) previousFocus.focus({preventScroll:true});
        window.dispatchEvent(new CustomEvent('bigfive:collection-rewards-finished'));
        schedule();
      }
      close.addEventListener('click',closeDialog);done.addEventListener('click',closeDialog);
      visit.addEventListener('click',closeDialog);
      dialog.addEventListener('cancel',function(e){e.preventDefault();closeDialog();});
      dialog.addEventListener('keydown',function(e){
        if (e.key==='Escape') {e.preventDefault();closeDialog();}
        if (e.key==='Tab') {
          var buttons=Array.from(dialog.querySelectorAll('button,a[href]')).filter(function(b){return !b.hidden && b.getClientRects().length;});
          var first=buttons[0],last=buttons[buttons.length-1];
          if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
          else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
        }
      });
      try {
        if (dialog.showModal) dialog.showModal();
        else { dialog.setAttribute('open',''); dialog.setAttribute('role','dialog'); dialog.setAttribute('aria-modal','true'); }
        destroyArt=MilestoneArt.attach(surface);
        if (celebrate) album.consumeCollectionReward(item.threshold);
        close.focus({preventScroll:true});
        return true;
      } catch(e) { closeDialog(); fail(); return false; }
    }).catch(function(){opening=false;fail();return false;});
  }
  function fail() {
    failed=true;
    album.markCollectionRewardUIFailed();
    document.querySelectorAll('[data-milestone-collection]').forEach(function(section) {
      if (!album.getCollectionRewards().length) return;
      section.hidden=false;
      section.textContent='収集記念カードは保存されています。表示を読み込めませんでした。ページを再読み込みしてください。';
    });
  }
  window.CollectionMilestones={open:open,ready:ready,isOpen:function(){return !!active;}};
  ready.then(function(){
    renderGalleries();
    var requested=new URLSearchParams(location.search).get('milestone');
    if(requested) open(Number(requested));
    schedule();
  }).catch(fail);
  window.addEventListener('bigfive:collection-rewards-changed',function(){
    ready.then(function(){renderGalleries();schedule();}).catch(function(){});
  });
  window.addEventListener('bigfive:collection-filter-changed',function(){ready.then(renderGalleries).catch(function(){});});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule();});
})();
