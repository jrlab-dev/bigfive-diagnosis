(function(root){
  'use strict';
  function entry(code){return root.KidCardData&&KidCardData.entries.find(function(r){return r.id===code;});}
  function name(record){var e=record.version==='kid3'?entry(record.code):null;return e?e.name:root.PersonalityTypes?PersonalityTypes.getName(record.code,record.typeName||record.code):record.code;}
  function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;}
  function render(host,record,options){
    options=options||{};
    if(host._stopCardEffects)host._stopCardEffects();
    host.replaceChildren();
    var kid=record.version==='kid3',e=kid?entry(record.code):null;
    if(kid&&(!e||!e.art||!e.art[record.gender]))return;
    var rarity=kid?'kid':(root.computeRarity?computeRarity(record.code,record.gender):'r1');
    var card=el('div','kr-card '+(kid?'kr-kid ':'')+'rarity-'+rarity+(options.static?' kr-static':''));
    card.setAttribute('aria-label',name(record)+'のカード');
    if(kid)card.style.setProperty('--kid-name-color',record.gender==='F'?'#c9364e':'#1765bb');
    if(kid){card.style.setProperty('--kid-tint',record.gender==='M'?'#b9e6fb':'#f7c5dc');card.appendChild(el('div','kr-holo'));card.appendChild(el('div','kr-tint'));card.appendChild(el('div','kr-light'));}
    else card.appendChild(el('div','kr-bg card-bg'));
    ['holo-cv','foil-cv','glitter-cv'].forEach(function(c){var cv=el('canvas',c);cv.setAttribute('aria-hidden','true');card.appendChild(cv);});
    card.appendChild(el('h2','kr-name',name(record)));
    var factors=kid?['S','N','EC']:['O','C','E','A','N'];
    if(!kid)card.appendChild(el('div','kr-code',factors.map(function(f,i){return f+record.code[i];}).join('  ')));
    var figure=el('img','kr-character');figure.alt=name(record);figure.decoding='sync';
    if(kid){figure.src='images/kid-art/'+record.gender+'/'+record.code+'.webp';var a=e.art[record.gender];['width','height','left','top'].forEach(function(k){figure.style[k]=a[k]+'%';});}
    else {var candidates=root.ImageResolver?ImageResolver.getCandidates(record.code,record.gender,'30').map(function(c){return c.path;}):[];figure.src=candidates.shift()||'';figure.onerror=function(){if(candidates.length)figure.src=candidates.shift();};}
    card.appendChild(figure);
    var bottom=el('div','kr-bottom'),scores=el('div','kr-scores');
    var colors={S:'#155e8d',N:kid?'#934a75':'#14b8a6',EC:'#27614b',O:'#a477fc',C:'#60a5fa',E:'#fb923c',A:'#f472b6'};
    var kidLabels=['元気さ','気持ちの\n出やすさ','自分を\nととのえる力'];
    var kidLevels=[['控えめ','ほどほど','活発'],['穏やか','ほどほど','はっきり'],['気が移りやすい','時と場合による','じっくり集中']];
    factors.forEach(function(f,i){var row=el('div','kr-score');row.style.setProperty('--factor',colors[f]);
      if(kid){row.appendChild(el('span','kr-score-label',kidLabels[i]));row.appendChild(el('span','kr-score-word',kidLevels[i][Number(record.code[i])-1]));}
      else{row.appendChild(el('span','kr-score-label',f));var bar=el('span','kr-bar'),fill=el('i');fill.style.width=(Number(record.code[i])/5*100)+'%';bar.appendChild(fill);row.appendChild(bar);row.appendChild(el('span','',record.code[i]));}
      scores.appendChild(row);});
    bottom.appendChild(scores);
    bottom.appendChild(el('p','kr-description',kid?e.text:root.PersonalityTypes?PersonalityTypes.getDescription(record.code,''):''));
    card.appendChild(bottom);host.appendChild(card);
    if(!options.static&&root.ChildCardEffects)host._stopCardEffects=ChildCardEffects(card,record);
    return card;
  }
  root.KidResultCard=Object.freeze({render:render,name:name,entry:entry});
})(window);
