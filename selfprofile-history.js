/* 根拠・選定方針: plans/【設計】自己プロフィール_根拠つき質問_2026-09-19.html */
(function (root) {
  'use strict';
  const sources = {
    adversity: {url:'https://doi.org/10.1016/j.paid.2022.111868', title:'幼少期の逆境と性格：メタ分析（2023）', note:'複数研究の統合で、幼少期の逆境と性格特性の関連が示されています。経験の種類・特性によって関連の強さは異なり、特に感情面の虐待・ネグレクトの関連が大きいと報告されています。回想や他の要因の影響があり、個人の性格の原因を確定できません。'},
    warmth: {url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC12353836/', title:'幼少期の養育と成人初期の性格：双生児追跡研究（2025）', note:'英国の双生児研究で、幼少期の母親の愛情と18歳時の開放性・誠実性・協調性に小さな関連が示されました。他の養育者や国へそのまま当てはめられるかは未確定です。'},
    school: {url:'https://pubmed.ncbi.nlm.nih.gov/40715985/', title:'子どものいじめとBig Five：メタ分析（2025）', note:'複数研究の統合で、いじめ被害と一部の性格特性の関連が示されています。関連の向きや、被害が性格を変えたかは別の問題です。追跡研究では変化が確認されない結果もあり、被害の責任を本人の性格に求めるものではありません。', extra:'https://doi.org/10.1016/j.paid.2024.112842'},
    workplace: {url:'https://doi.org/10.1080/02678373.2025.2551489', title:'職場のいじめと性格変化：4年追跡研究（2025）', note:'スイスの追跡研究で、職場のいじめと一部のBig Five特性の変化に関連が示されました。観察研究であり、他の要因や影響の向きは確定できません。'},
    transition: {url:'https://doi.org/10.1177/08902070231190219', title:'人生の出来事と性格変化：メタ分析（2024）', note:'就職・失業・交際・結婚・離婚などを扱う追跡研究の統合です。Big Fiveの変化は平均的に小さく、出来事によって研究数や結果の一貫性が異なります。自尊心・生活満足度の結果も含む論文ですが、それらを性格変化と同一視しません。'}
  };
  const eventOptions = [['yes','ある'],['no','ない'],['unsure','覚えていない・判断できない'],['skip','答えない']];
  const frequencyOptions = [['often','よくあった'],['sometimes','ときどきあった'],['rarely','ほとんどなかった'],['not_applicable','該当する養育者がいなかった'],['unsure','覚えていない・判断できない'],['skip','答えない']];
  const groups = [
    {id:'care',label:'育った環境・温かい関わり', questions:[
      {id:'v2_maternal_warmth', text:'子どもの頃、母親から愛情を言葉や態度で示されることはありましたか？', level:'medium', source:'warmth', frequency:true}
    ]},
    {id:'transitions',label:'仕事・人間関係の転機',questions:[
      {id:'v2_employment',text:'初めて就職した、または仕事のない期間を経て働き始めた経験はありますか？',level:'medium',source:'transition'},
      {id:'v2_unemployment',text:'仕事を失い、働きたくても仕事がない時期を経験しましたか？',level:'medium',source:'transition'},
      {id:'v2_relationship',text:'恋人・パートナーとの交際を始めた経験はありますか？',level:'medium',source:'transition'},
      {id:'v2_marriage',text:'結婚した経験はありますか？',level:'medium',source:'transition'},
      {id:'v2_divorce',text:'離婚した経験はありますか？',level:'medium',source:'transition'}
    ]},
    {id:'peer',label:'学校・職場でのつらい経験（任意）',questions:[
      {id:'v2_school_bullying',text:'学校で、繰り返しからかわれる、仲間外れにされる、暴力を受けるなどのいじめ被害を経験しましたか？',level:'high',source:'school'},
      {id:'v2_work_bullying',text:'職場で、繰り返し侮辱される、孤立させられるなどの嫌がらせを受けた経験はありますか？',level:'medium',source:'workplace'}
    ]},
    {id:'adversity',label:'幼少期のつらい経験（答えたい方だけ）',sensitive:true,questions:[
      {id:'v2_emotional_abuse',text:'子どもの頃、養育者から繰り返し侮辱されたり、脅されたりすることはありましたか？',level:'high',source:'adversity'},
      {id:'v2_emotional_neglect',text:'子どもの頃、悲しいときや困ったときに、養育者に気持ちを受け止めてもらえないことが続きましたか？',level:'high',source:'adversity'},
      {id:'v2_physical_abuse',text:'子どもの頃、養育者から叩かれる、蹴られるなどの暴力を受けたことはありますか？',level:'high',source:'adversity'},
      {id:'v2_physical_neglect',text:'子どもの頃、必要な食事や身の回りの世話を受けられないことはありましたか？',level:'high',source:'adversity'},
      {id:'v2_sexual_abuse',text:'子どもの頃、望まない性的な接触や行為を受けた経験はありますか？',level:'high',source:'adversity'}
    ]}
  ];
  const questions = groups.flatMap(g => g.questions);
  const legacyLabels = {
    childhood_ace:'幼少期のつらい経験', childhood_parenting:'養育者の育て方', school_bullying:'いじめに関わる経験', school_birthmonth:'学年内の誕生月', career_jobloss:'失業・雇用不安', career_firstjob:'初めての就職', loss_bereavement:'近親者との死別', loss_illness:'病気・けが', love_marriage:'結婚・離婚・別れ', env_change:'環境の変化', label_bloodtype:'血液型について言われた言葉', label_role:'期待された役割', label_sibling:'きょうだいとの比較', label_freeform:'言われ続けた言葉', era_economy:'社会人になった時代背景'
  };
  const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  const string = x => typeof x === 'string' ? x : '';
  const options = q => q.frequency ? frequencyOptions : eventOptions;
  const known = new Set(questions.map(q => q.id));
  const levelText = level => level === 'high' ? '関連の根拠：高め' : '関連の根拠：中程度';
  function answerLabel(q, answer) { return (options(q).find(o => o[0] === answer) || [,''])[1]; }
  function buildText(history) {
    if (!object(history)) return '';
    const lines = [];
    questions.forEach(q => {
      const e = history[q.id];
      if (!object(e) || e.share !== true || e.answer === 'skip') return;
      const label = answerLabel(q,e.answer);
      if (!label) return;
      lines.push('・' + q.text + '\n　回答：' + label + (string(e.detail).trim() ? '\n　補足：' + e.detail.trim() : ''));
    });
    Object.keys(history).filter(id => Object.prototype.hasOwnProperty.call(legacyLabels,id)).forEach(id => {
      const e = history[id];
      if (!object(e) || e.share !== true || e.answer !== 'yes' || !string(e.detail).trim()) return;
      lines.push('・以前の記録：' + (legacyLabels[id] || '自由記録') + '\n　' + e.detail.trim());
    });
    return lines.length ? '本人が記録し、共有を選んだ経験です。診断結果とは区別し、相談の背景として扱ってください。性格の原因・診断・点数をこの記録から推定しないでください。書かれていない経験は、不明であり「なかった」という意味ではありません。\n' + lines.join('\n') : '';
  }
  const api = {groups,questions,sources,options,answerLabel,buildText};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.ProfileHistory = api;
  if (!root.document) return;
  let original = {};
  let legacyRows = [];
  const byId = id => document.getElementById(id);
  const esc = value => string(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function eligible(select) { return !!select.value && select.value !== 'skip'; }
  function syncQuestion(q, resetShare) {
    const select = byId('lh_answer_'+q.id), share = byId('lh_share_'+q.id), detail = byId('lh_detail_'+q.id);
    if (resetShare || !eligible(select)) share.checked = false;
    share.disabled = !eligible(select);
    detail.disabled = !eligible(select);
    if (resetShare) root.refreshHistorySharing();
  }
  root.renderLifeHistoryUI = function () {
    const target = byId('lifehistTabPanels');
    target.replaceChildren();
    groups.forEach(group => {
      const container = document.createElement('details');
      container.className = 'lh-group';
      const summary = document.createElement('summary'); summary.textContent = group.label; container.append(summary);
      const body = document.createElement('div'); body.className = 'lh-group-body'; container.append(body);
      if (group.sensitive) { const p = document.createElement('p'); p.className='lifehist-note'; p.textContent='具体的な状況を詳しく書く必要はありません。思い出せないことを無理に思い出そうとせず、答えたい項目だけ選んでください。'; body.append(p); }
      group.questions.forEach(q => {
        const source = sources[q.source], field = document.createElement('fieldset'); field.className = 'lh-question';
        field.innerHTML = '<legend>'+esc(q.text)+'</legend><span class="lh-evidence">'+levelText(q.level)+'</span>'+
          '<details class="lh-research"><summary>この質問の理由・研究を見る</summary><p>'+esc(source.note)+'</p><a href="'+source.url+'" target="_blank" rel="noopener noreferrer">'+esc(source.title)+'</a>'+(source.extra ? '<br><a href="'+source.extra+'" target="_blank" rel="noopener noreferrer">変化が確認されなかった追跡研究</a>' : '')+'</details>'+
          '<label for="lh_answer_'+q.id+'">回答</label><select id="lh_answer_'+q.id+'"><option value="">選んでください（任意）</option>'+options(q).map(o => '<option value="'+o[0]+'">'+esc(o[1])+'</option>').join('')+'</select>'+
          '<label for="lh_detail_'+q.id+'">補足（任意・短くて大丈夫です）</label><textarea id="lh_detail_'+q.id+'" rows="2" disabled placeholder="書かなくても、選択した回答だけで保存できます"></textarea>'+
          '<label class="lh-share"><input type="checkbox" id="lh_share_'+q.id+'" disabled><span id="lh_share_label_'+q.id+'">この回答と補足をAIに渡す</span></label>';
        body.append(field);
      });
      target.append(container);
    });
    const old = document.createElement('details'); old.id='lh_legacy'; old.className='lh-group'; old.hidden=true;
    old.innerHTML='<summary>以前に保存した記録</summary><div class="lh-group-body"><p class="lifehist-note">以前の質問への回答をそのまま残しています。新しい質問への回答とは読み替えていません。研究の根拠を確認した新しい質問とは別の記録です。</p><div id="lh_legacy_rows"></div></div>';
    target.append(old);
    questions.forEach(q => byId('lh_answer_'+q.id).addEventListener('change', () => syncQuestion(q,true)));
    root.refreshHistorySharing();
  };
  root.restoreLifeHistory = function (history) {
    original = object(history) ? JSON.parse(JSON.stringify(history)) : {};
    if (byId('profileLegacyShare')) byId('profileLegacyShare').replaceChildren();
    questions.forEach(q => {
      const e = object(original[q.id]) ? original[q.id] : {};
      byId('lh_answer_'+q.id).value = answerLabel(q,e.answer) ? e.answer : '';
      byId('lh_detail_'+q.id).value = string(e.detail);
      byId('lh_share_'+q.id).checked = e.share === true;
      syncQuestion(q,false);
    });
    legacyRows = Object.keys(original).filter(id => Object.prototype.hasOwnProperty.call(legacyLabels,id) && object(original[id]));
    const list = byId('lh_legacy_rows'); list.replaceChildren();
    legacyRows.forEach((id,index) => {
      const e = original[id], row = document.createElement('fieldset'); row.className='lh-question';
      const status = ({yes:'ある',no:'ない',skip:'答えない'})[e.answer] || '以前の回答';
      row.innerHTML='<legend>'+esc(legacyLabels[id] || '自由記録')+'</legend><p>'+status+'</p><label for="lh_old_detail_'+index+'">以前の補足</label><textarea id="lh_old_detail_'+index+'" rows="2"></textarea><label class="lh-share"><input type="checkbox" id="lh_old_share_'+index+'"> この記録をAIに渡す</label>';
      list.append(row);
      byId('lh_old_detail_'+index).value=string(e.detail);
      byId('lh_old_share_'+index).checked=e.share===true && e.answer==='yes';
      byId('lh_old_share_'+index).disabled=e.answer!=='yes';
    });
    byId('lh_legacy').hidden=legacyRows.length===0;
    root.refreshHistorySharing();
  };
  root.refreshHistorySharing = function () {
    const target=byId('profileHistoryShare'),oldTarget=byId('profileLegacyShare');
    if (!target || !oldTarget) return;
    let visible=0;
    questions.forEach(q=>{
      const select=byId('lh_answer_'+q.id),share=byId('lh_share_'+q.id);
      if (!select || !share) return;
      const label=share.closest('label');target.append(label);
      label.hidden=!eligible(select);if(!label.hidden)visible++;
      byId('lh_share_label_'+q.id).textContent=q.text+' — '+answerLabel(q,select.value);
    });
    legacyRows.forEach((id,index)=>{
      const share=byId('lh_old_share_'+index);if(!share)return;
      const label=share.closest('label');oldTarget.append(label);
      label.hidden=original[id].answer!=='yes';if(!label.hidden)visible++;
      let span=label.querySelector('span');
      if(!span){[...label.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.remove());span=document.createElement('span');label.append(span);}
      span.textContent='以前の記録：'+(legacyLabels[id]||'自由記録');
    });
    byId('profileHistoryEmpty').hidden=visible>0;
  };
  root.collectLifeHistory = function () {
    const out = JSON.parse(JSON.stringify(original));
    questions.forEach(q => {
      const select=byId('lh_answer_'+q.id), detail=byId('lh_detail_'+q.id).value;
      if (!select.value && !detail && !Object.prototype.hasOwnProperty.call(original,q.id)) return;
      out[q.id]={...(object(original[q.id]) ? original[q.id] : {}), answer:select.value, detail, share:eligible(select) && byId('lh_share_'+q.id).checked};
    });
    legacyRows.forEach((id,index) => {
      out[id]={...original[id], detail:byId('lh_old_detail_'+index).value, share:original[id].answer==='yes' && byId('lh_old_share_'+index).checked};
    });
    return out;
  };
  root.buildLifeHistoryText = buildText;
  root.toggleLifeHistoryPanel = function () {
    const panel=byId('lifehistPanel'), button=byId('lifehistToggle');
    const opening=panel.hidden; panel.hidden=!opening; button.setAttribute('aria-expanded',String(opening));
    byId('lifehistArrow').classList.toggle('open',opening);
  };
})(typeof window !== 'undefined' ? window : globalThis);
