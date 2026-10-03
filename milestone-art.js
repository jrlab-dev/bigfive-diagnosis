/* 採用済みカード表示の共通部品。build-assets.pyで原画の参照とホロを包装する。 */
(function () {
  'use strict';
  var base = new URL('.', document.currentScript.src).href;
  var catalog = [{"threshold":100,"name":"性格の探究者","description":"性格の違いに気づき、自分を知る一歩を重ねた証。","kind":"silver","motif":null,"finish":"銀箔","alt":"銀髪と眼鏡、観測器具を持つ青銀の探究者","image":"images/characters/milestones/100.webp","rarity":"r8"},{"threshold":200,"name":"心理の研究者","description":"さまざまな心理学に触れ、心の仕組みを学び続けた証。","kind":"ember","motif":null,"finish":"紅金箔","alt":"赤い髪と扇、赤金の羽飾りを持つ研究者","image":"images/characters/milestones/200.webp","rarity":"r8"},{"threshold":300,"name":"五因子の賢者","description":"五つの因子を手がかりに、自分と他者の個性を探究してきた証。","kind":"prism","motif":null,"finish":"五色ホログラム","alt":"五色の宝石を身につけた少年の賢者","image":"images/characters/milestones/300.webp","rarity":"r8"},{"threshold":500,"name":"心理の大賢者","description":"多彩な心理学の学びを重ね、人の心の奥深さに向き合ってきた証。","kind":"pearl","motif":null,"finish":"白金・真珠箔","alt":"五本の尾を持つ白狐の大賢者。尾先の5色化前の原画","image":"images/characters/milestones/500.webp","rarity":"r8"},{"threshold":1000,"name":"自己理解の神","description":"数多くの診断と学びを重ね、自分の心を見つめ続けた探究の証。","kind":"moon","motif":"月","finish":"神域ホログラム · 月","alt":"月の光輪と鏡を持つ銀髪の女神","image":"images/characters/milestones/1000.webp","rarity":"r8"},{"threshold":2000,"name":"他者理解の神","description":"異なる価値観に目を向け、自分とは違う心を理解しようと歩み続けた証。","kind":"feather","motif":"羽根","finish":"神域ホログラム · 羽根","alt":"人の顔と二枚の翼、異なる二つの結晶を持つ天使","image":"images/characters/milestones/2000.webp","rarity":"r8"},{"threshold":3000,"name":"感情理解の神","description":"喜びも不安も心の手がかりとして、感情の働きを学び続けた証。","kind":"water","motif":"水紋","finish":"神域ホログラム · 水紋","alt":"透明なしずくを抱える青い水龍の幼神","image":"images/characters/milestones/3000.webp","rarity":"r8"},{"threshold":4000,"name":"意欲を導く神","description":"人が動き出す理由に目を向け、意欲と選択の仕組みを探究してきた証。","kind":"sun","motif":"太陽","finish":"神域ホログラム · 太陽","alt":"金のたてがみと小さな星灯を持つ幼い獅子の神","image":"images/characters/milestones/4000.webp","rarity":"r8"},{"threshold":5000,"name":"絆を結ぶ神","description":"人と人の関わりに目を向け、つながりの中にある心理を学び続けた証。","kind":"knot","motif":"結び目","finish":"神域ホログラム · 結び目","alt":"六本の腕と金の結び紐を持つ翡翠の女神","image":"images/characters/milestones/5000.webp","rarity":"r8"},{"threshold":6000,"name":"心の成長の神","description":"経験や環境による心の変化に目を向け、人の成長を探究してきた証。","kind":"leaf","motif":"葉脈","finish":"神域ホログラム · 葉脈","alt":"蝶のような葉の翼で小さな芽を包む植物の幼神","image":"images/characters/milestones/6000.webp","rarity":"r8"},{"threshold":7000,"name":"五因子の神","description":"五つの因子を多面的に捉え、その組み合わせが描く個性を学び続けた証。","kind":"stars","motif":"五つ星","finish":"神域ホログラム · 五つ星","alt":"五色の大きな星を冠し、本を抱える梟の神","image":"images/characters/milestones/7000.webp","rarity":"r8"},{"threshold":8000,"name":"心の多様性の神","description":"人を一つの型に閉じ込めず、一人ひとりの違いを探究し続けた大いなる証。","kind":"kaleido","motif":"万華鏡","finish":"神域ホログラム · 万華鏡","alt":"人の顔と六枚の虹色の翼、オパールの神具を持つ万華神","image":"images/characters/milestones/8000.webp","rarity":"r8"}];
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }
  function createCard(item, onOpen) {
    var scene = el('div', 'mc-scene');
    var card = el('button', 'mc-card');
    card.type = 'button';
    card.dataset.count = item.threshold;
    card.dataset.kind = item.kind;
    if (item.motif) card.dataset.divine = item.motif;
    card.setAttribute('aria-label', item.name + '・カード' + item.threshold.toLocaleString() + '枚収集記念・シークレット' + (onOpen ? '。大きく見る' : '。押すと光の角度が変わります'));
    var bg = el('canvas', 'mc-holo'); bg.setAttribute('aria-hidden', 'true');
    var halo = el('span', 'mc-halo'); halo.setAttribute('aria-hidden', 'true');
    var img = el('img', 'mc-art');
    img.src = new URL(item.image, base).href; img.alt = item.alt; img.draggable = false;
    img.loading = onOpen ? 'lazy' : 'eager'; img.decoding = 'async';
    var sparks = el('canvas', 'mc-sparks'); sparks.setAttribute('aria-hidden', 'true');
    var edge = el('span', 'mc-edge'); edge.setAttribute('aria-hidden', 'true');
    card.append(bg, halo, img, sparks, edge, el('span','mc-name',item.name),el('span','mc-code','カード'+item.threshold.toLocaleString()+'枚収集記念'));
    var footer = el('span', 'mc-footer'), band = el('span', 'mc-band'); band.setAttribute('aria-hidden','true');
    for (var i=0;i<5;i++) band.appendChild(el('i'));
    footer.append(band,el('span','mc-note',item.description),el('span','mc-finish',item.finish));
    card.append(footer); scene.append(card);
    if (onOpen) card.addEventListener('click',function(){onOpen(item.threshold);});
    return scene;
  }
  function createSurface(items, onOpen) {
    var root=el('div','bf-milestones');
    var controls=el('div','mc-controls');
    controls.append(el('span','mc-label',onOpen?'シークレット · 収集記念':''));
    var motion=el('button','mc-control','光を止める');motion.type='button';motion.dataset.action='motion';motion.setAttribute('aria-pressed','true');controls.append(motion);
    var grid=el('div','mc-grid');items.forEach(function(item){grid.append(createCard(item,onOpen));});root.append(controls,grid);
    return root;
  }
  function attach(surface) {
    
 const root=surface; let destroyed=false,frameId=0;
 const logo=new Image(),texture=new Image();
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let reduced=preference.matches;
 const state={playing:!reduced,strength:100,logos:100,artScale:132};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),TAU=Math.PI*2;
 const palettes={silver:['#e8f7ff','#8ac1ec','#ffffff','#a0aec5'],ember:['#ffd699','#ff8738','#fff4c2','#d33a30'],prism:['#8b5cf6','#3b82f6','#f97316','#f472b6','#14b8a6'],pearl:['#fff4e5','#d4e8ed','#f4dff3','#d4dedf','#ffffff'],moon:['#9babf5','#e1e8ff','#7485c9'],feather:['#f5c2be','#e9d6f3','#eac58c'],water:['#92ddef','#bebbf2','#dfedf8'],sun:['#ffc077','#f6e0a7','#efa052'],knot:['#80d4b9','#d3eee2','#dfca8b'],leaf:['#c6e09a','#c2afe4','#d7e1c1'],stars:['#a5b8ed','#e6debe','#b7b1e6'],kaleido:['#b9bef0','#f0c4d9','#b3e2d0']};
 const hues={silver:211,ember:25,prism:260,pearl:218,moon:231,feather:333,water:192,sun:37,knot:162,leaf:100,stars:226,kaleido:270};
 let seed=91326;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const cards=[...root.querySelectorAll('.mc-card')].map((el,i)=>{const bg=el.querySelector('.mc-holo'),fg=el.querySelector('.mc-sparks');el.parentElement.append(el.querySelector('.mc-finish'));return{el,bg,fg,ctx:bg.getContext('2d'),fx:fg.getContext('2d'),kind:el.dataset.kind,divine:el.hasAttribute('data-divine'),phase:.7+i*.49,w:0,h:0,x:.5,y:.5,mx:.5,my:.5,active:false,visible:false,dirty:true,tiles:[],dust:[],stamp:null,base:null};});
 function prepare(c){
  const w=c.el.clientWidth,h=c.el.clientHeight;if(!w||!h)return;c.w=w;c.h=h;
  const dpr=Math.min(devicePixelRatio||1,1.5);for(const cv of[c.bg,c.fg]){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);cv.getContext('2d').setTransform(dpr,0,0,dpr,0,0);}
  c.tiles=[];const n=19,pts=[];for(let y=0;y<=n;y++){pts[y]=[];for(let x=0;x<=n;x++)pts[y][x]={x:(x+(x===0||x===n?0:(rand()-.5)*.55))*w/n,y:(y+(y===0||y===n?0:(rand()-.5)*.55))*h/n};}
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)c.tiles.push({a:pts[y][x],b:pts[y][x+1],c:pts[y+1][x],d:pts[y+1][x+1],angle:rand()*TAU,metal:rand(),hue:rand()*360});
  c.dust=Array.from({length:130},()=>({x:rand()*w,y:rand()*h,size:rand()<.1?2+rand()*2:.3+rand()*.8,angle:rand()*TAU}));
  c.base=document.createElement('canvas');c.base.width=Math.round(w*1.5);c.base.height=Math.round(h*1.5);const b=c.base.getContext('2d');b.scale(1.5,1.5);
  b.fillStyle='#101725';b.fillRect(0,0,w,h);
  if(texture.complete&&texture.naturalWidth){b.drawImage(texture,0,0,w,h);b.globalCompositeOperation='color';const g=b.createLinearGradient(0,0,w,h);palettes[c.kind].forEach((v,i,a)=>g.addColorStop(i/(a.length-1),v));b.fillStyle=g;b.fillRect(0,0,w,h);b.globalCompositeOperation='multiply';b.fillStyle=c.divine?'#53586f':c.kind==='pearl'?'#a7a5b6':c.kind==='silver'?'#718497':c.kind==='ember'?'#925a3d':'#9690a6';b.fillRect(0,0,w,h);}
  c.stamp=makeStamp(c);c.dirty=true;draw(c);
 }
 function makeStamp(c){if(!logo.complete||!logo.naturalWidth)return null;const cv=document.createElement('canvas');cv.width=cv.height=240;const x=cv.getContext('2d');x.drawImage(logo,0,0,240,240);x.globalCompositeOperation='source-in';const g=x.createLinearGradient(0,0,240,220);palettes[c.kind].forEach((v,i,a)=>g.addColorStop(i/(a.length-1),v));x.fillStyle=g;x.fillRect(0,0,240,240);return cv;}
 function tri(x,a,b,c,fill){x.fillStyle=fill;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.lineTo(c.x,c.y);x.closePath();x.fill();}
 // These paths are decorative foil motifs, not replacements for the actual logo.
 function foilMotif(x,kind,s){
  x.beginPath();
  if(kind==='moon'){x.arc(0,0,s,.5,5.78);x.quadraticCurveTo(-s*.65,0,s*.88,s*.48);}
  else if(kind==='water'){for(let i=1;i<=3;i++){x.moveTo(s*i/3,0);x.ellipse(0,0,s*i/3,s*i/5,0,0,TAU);}}
  else if(kind==='sun'){x.arc(0,0,s*.45,0,TAU);for(let i=0;i<12;i++){const a=i*TAU/12;x.moveTo(Math.cos(a)*s*.62,Math.sin(a)*s*.62);x.lineTo(Math.cos(a)*s,Math.sin(a)*s);}}
  else if(kind==='knot'){for(let i=0;i<2;i++){x.moveTo((i?1:-1)*s*.45,s*.6);x.ellipse((i?1:-1)*s*.4,0,s*.47,s*.73,(i?1:-1)*.4,0,TAU);}}
  else if(kind==='feather'||kind==='ember'||kind==='leaf'){x.moveTo(0,s);x.quadraticCurveTo(-s*1.1,-s*.25,s*.3,-s);x.quadraticCurveTo(s*1.1,s*.1,0,s);x.moveTo(0,s);x.lineTo(s*.3,-s);for(let i=0;i<5;i++){const y=-s*.55+i*s*.28;x.moveTo(s*.15-y*.1,y);x.lineTo(-s*.38,y-s*.19);x.moveTo(s*.15-y*.1,y);x.lineTo(s*.58,y-s*.35);}}
  else if(kind==='stars'){for(let j=0;j<5;j++){const a=-Math.PI/2+(j-2)*.5,cx=Math.cos(a)*s,cy=Math.sin(a)*s;for(let i=0;i<10;i++){const b=-Math.PI/2+i*Math.PI/5,r=i%2?s*.14:s*.29;i?x.lineTo(cx+Math.cos(b)*r,cy+Math.sin(b)*r):x.moveTo(cx+Math.cos(b)*r,cy+Math.sin(b)*r);}x.closePath();}}
  else if(kind==='kaleido'){for(let i=0;i<8;i++){const a=i*TAU/8,b=a+Math.PI/8;x.moveTo(0,0);x.lineTo(Math.cos(a)*s,Math.sin(a)*s);x.lineTo(Math.cos(b)*s*.55,Math.sin(b)*s*.55);x.closePath();}}
  x.stroke();
 }
 function motifs(c){const{x,y,w,h,kind,phase:p,ctx}=c;ctx.save();ctx.globalCompositeOperation='screen';ctx.lineWidth=.8;ctx.strokeStyle=palettes[kind][1];
  for(let i=0;i<4;i++){const side=i%2,row=Math.floor(i/2);ctx.save();ctx.translate(w*(side?.86:.14)+(x-.5)*7,h*(.26+row*.35)+(y-.5)*7);ctx.rotate((side?1:-1)*.28+Math.sin(p*.22)*.1);ctx.globalAlpha=(.17+.22*Math.pow(Math.max(0,Math.sin(p+i)),2))*state.strength/100;foilMotif(ctx,kind,w*.12);ctx.restore();}
  if(c.divine){ctx.globalAlpha=.12;ctx.lineWidth=.65;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(w*.5+(x-.5)*i*5,h*.49+(y-.5)*i*3,w*(.34+i*.045),h*(.3+i*.055),Math.sin(p*.15)*.1,0,TAU);ctx.stroke();}}
  ctx.restore();
 }
 function draw(c){
  if(!c.w||!c.base)return;const{ctx,fx,w,h,kind,phase:p}=c,st=state.strength/100,angle=c.active?Math.atan2(c.y-.5,c.x-.5)+p*.08:p;
  ctx.clearRect(0,0,w,h);ctx.drawImage(c.base,0,0,w,h);ctx.globalCompositeOperation='screen';
  for(const q of c.tiles){const b=Math.pow(Math.max(0,Math.cos(angle-q.angle)),12),cx=(q.a.x+q.d.x)/2/w,cy=(q.a.y+q.d.y)/2/h,sweep=Math.pow(Math.max(0,1-Math.abs(cx+cy*.4-(.35+.42*Math.sin(p*.4)+c.x*.25))*3),2);let hue=hues[kind]+(q.metal-.5)*26,sat=kind==='silver'?23:kind==='pearl'?16:c.divine?43:72;
   if(kind==='prism')hue=[260,216,25,333,170][Math.floor(q.metal*5)];if(kind==='pearl')hue=(q.hue+c.x*60)%360;if(kind==='kaleido')hue=(q.hue+p*8)%360;if(kind==='ember')hue=q.metal>.52?36:7;
   const light=clamp((kind==='pearl'?25:c.divine?10:15)+(b*41+sweep*15+q.metal*6)*st,5,88);tri(ctx,q.a,q.b,q.c,`hsla(${hue},${sat}%,${light}%,${.06+b*.57})`);tri(ctx,q.b,q.d,q.c,`hsla(${hue+8},${sat}%,${light*.72}%,${.04+b*.4})`);
  }
  ctx.globalCompositeOperation='source-over';
  if(c.divine||kind==='ember')motifs(c);
  // The real image alpha is preserved; no pseudo-V, chevron, or relettering.
  if(c.stamp){const s=w*(c.divine?.205:.235);for(let i=0;i<4;i++){const side=i%2,row=Math.floor(i/2),px=w*(side?.765:.002),py=h*(.37+row*.25);ctx.save();ctx.globalAlpha=clamp((.18+.62*Math.pow(Math.max(0,Math.cos(p*.8+i*1.6)),5))*state.logos/100,0,1);ctx.shadowColor='#000';ctx.shadowBlur=2;ctx.drawImage(c.stamp,px,py,s,s);ctx.globalCompositeOperation='screen';ctx.globalAlpha=.15*Math.max(0,Math.sin(p+i));ctx.drawImage(c.stamp,px+.5,py,s,s);ctx.restore();}}
  // Pearl and divine cards add a broad reflection BEHIND the character.
  if(kind==='pearl'||c.divine){ctx.save();ctx.globalCompositeOperation='screen';const mid=w*(.5+.7*Math.sin(p*.35)),g=ctx.createLinearGradient(mid-w*.3,0,mid+w*.3,h);g.addColorStop(0,'#ffffff00');g.addColorStop(.44,'#addfee12');g.addColorStop(.5,kind==='pearl'?'#ffffff70':'#f1ddbf35');g.addColorStop(.56,'#edb8da12');g.addColorStop(1,'#ffffff00');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.restore();}
  if(kind==='silver'){ctx.save();ctx.globalCompositeOperation='screen';const xx=w*(.5+.7*Math.sin(p*.35));ctx.strokeStyle='#dcf5ff85';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(xx,0);ctx.lineTo(xx-w*.24,h);ctx.stroke();ctx.restore();}
  fx.clearRect(0,0,w,h);for(const s of c.dust){if(s.y<h*.17||s.y>h*.79||Math.abs(s.x/w-.5)<.32)continue;const b=Math.pow(Math.max(0,Math.cos(angle-s.angle)),12);if(b<.15)continue;const r=s.size*(.7+b*.7);fx.fillStyle=`rgba(255,250,232,${b*.8*st})`;fx.beginPath();fx.arc(s.x,s.y,Math.max(.35,r*.25),0,TAU);fx.fill();if(s.size>1.5){fx.strokeStyle=`rgba(255,250,232,${b*.55*st})`;fx.lineWidth=.65;fx.beginPath();fx.moveTo(s.x-r*2,s.y);fx.lineTo(s.x+r*2,s.y);fx.moveTo(s.x,s.y-r*2);fx.lineTo(s.x,s.y+r*2);fx.stroke();}}
  c.el.style.setProperty('--edge-opacity',String(.55+.4*Math.pow(Math.max(0,Math.sin(p)),2)));c.dirty=false;
 }
 function render(){root.style.setProperty('--mc-art-scale',String(state.artScale/100));const b=root.querySelector('[data-action="motion"]');b.textContent=state.playing?'光を止める':'光を動かす';b.setAttribute('aria-pressed',String(state.playing));cards.forEach(c=>{c.dirty=true;if(c.visible)draw(c);});}
 root.querySelector('[data-action="motion"]').addEventListener('click',()=>{state.playing=!state.playing;render();});
 const ro=new ResizeObserver(entries=>entries.forEach(e=>{const c=cards.find(c=>c.el===e.target);if(c)prepare(c);}));
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{const c=cards.find(c=>c.el===e.target);if(c){c.visible=e.isIntersecting;if(c.visible)draw(c);}}),{rootMargin:'100px'});
 for(const c of cards){ro.observe(c.el);io.observe(c.el);c.el.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=c.el.getBoundingClientRect();c.mx=clamp((e.clientX-r.left)/r.width,0,1);c.my=clamp((e.clientY-r.top)/r.height,0,1);c.active=true;c.dirty=true;});const release=()=>{c.active=false;c.mx=c.my=.5;c.dirty=true;};c.el.addEventListener('pointerleave',release);c.el.addEventListener('pointercancel',release);c.el.addEventListener('click',()=>{c.phase+=1.4;c.dirty=true;draw(c);});}
 logo.onload=()=>cards.forEach(c=>{c.stamp=makeStamp(c);c.dirty=true;if(c.visible)draw(c);});texture.onload=()=>cards.forEach(prepare);
 logo.src=new URL('images/ロゴ.webp',base).href;texture.src=new URL('images/holo/random.jpg',base).href;
 const onPreferenceChange=e=>{reduced=e.matches;state.playing=!reduced;cards.forEach(c=>{c.el.style.transform='none';});render();};preference.addEventListener('change',onPreferenceChange);
 let last=0;function frame(now){if(destroyed||!root.isConnected){ro.disconnect();io.disconnect();return;}frameId=requestAnimationFrame(frame);if(now-last<50)return;const dt=Math.min((now-last)/1000,.08);last=now;if(document.hidden)return;for(const c of cards){if(!c.visible)continue;const movement=Math.abs(c.mx-c.x)+Math.abs(c.my-c.y);c.x+=(c.mx-c.x)*.2;c.y+=(c.my-c.y)*.2;if(state.playing)c.phase+=dt*.52;if(!reduced)c.el.style.transform=`rotateX(${-(c.y-.5)*8}deg) rotateY(${(c.x-.5)*10}deg)`;if(state.playing||c.dirty||movement>.002)draw(c);}}
 render();frameId=requestAnimationFrame(frame);

 return function(){destroyed=true;cancelAnimationFrame(frameId);ro.disconnect();io.disconnect();preference.removeEventListener("change",onPreferenceChange);};

  }
  window.MilestoneArt={catalog:catalog,createSurface:createSurface,attach:attach,assetBase:base};
})();
