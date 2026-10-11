/* ===== ビッグファイブ診断 共通接し方アドバイス生成 ===== */

function generateAdvice(rel, scores, name, options) {
  var svgSize = (options && options.svgSize) || 14;
  var includeTitle = !options || options.includeTitle !== false;
  var s = svgSize;
  var items = [];

  if (rel === 'love') {
    items.push({ title: '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> コミュニケーションの取り方', text: scores.E >= 4 ? '社交的でエネルギッシュなタイプです。にぎやかな場所やデート、アクティビティを一緒に楽しむと関係が深まります。' : '一人の時間を大切にするタイプです。静かなカフェやお家デート、落ち着ける環境での過ごし方がおすすめです。' });
    items.push({ title: '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> 感情の受け止め方', text: scores.N >= 4 ? '繊細で感受性が豊かなタイプです。気持ちの変化に寄り添い、否定せずに傾聴してあげることが大切です。' : '精神的に安定したタイプです。些細なことでは動じないので、サッパリとした接し方が相性が良いです。' });
    if (scores.A <= 2) {
      items.push({ title: '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><path d="M4 8l4-5 4 5"/><path d="M16 8l4-5 4 5"/><path d="M2 8h6v4a3 3 0 01-6 0V8zM14 8h6v4a3 3 0 01-6 0V8z"/></svg> 意見の違いへの対応', text: '自己主張がはっきりしているタイプです。正直な意見を交わし合える関係ですが、衝突時は「どちらが正しいか」より「関係を大切にする」視点を持つと良いでしょう。' });
    }
  } else if (rel === 'work') {
    items.push({ title: '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> 仕事の依頼方', text: scores.C >= 4 ? '計画性が高く責任感の強いタイプです。期限と目的を明確に伝えると、確実に成果を出してくれます。' : '柔軟性があり即興力のあるタイプです。大まかな方向性を伝え、やり方を任せると力を発揮します。' });
    items.push({ title: '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> チームワーク', text: scores.A >= 4 ? '協調性が高くチームの和を重視するタイプです。褒めて励ますモチベーションが高まり、チームの潤滑油になれます。' : '率直で建設的な意見を言うタイプです。遠慮なく議論に参加してもらうと、良いアイデアが出てきます。' });
    items.push({ title: '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> コミュニケーション', text: scores.E >= 4 ? 'コミュニケーションが得意なタイプです。対面やオンラインで積極的に関わり、情報共有を促すとスムーズです。' : '一人で集中して作業するのが得意なタイプです。メールやチャットなど、文章でのやり取りを好む傾向があります。' });
  } else if (rel === 'friend') {
    items.push({ title: '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> 遊びの提案', text: scores.O >= 4 ? '新しいことへの好奇心が強いタイプです。新しい店、新しいアクティビティ、興味深いイベントに誘うと喜ばれます。' : '安定を好むタイプです。慣れ親しんだ場所や定番のプラン、予測可能な過ごし方が安心感を与えます。' });
    items.push({ title: '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> 会話のスタイル', text: scores.E >= 4 ? '話すことで活力を得るタイプです。盛り上がる話題や共通の趣味、最新のニュースなどで楽しくお喋りをしましょう。' : '深い話や内省的な話を好むタイプです。落ち着いた環境で、人生観や価値観についての対話が楽しめます。' });
    items.push({ title: '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> ストレス発散', text: scores.N >= 4 ? 'ストレスを感じやすいタイプです。愚痴を聞いてあげたり、リラックスできる時間を作ってあげると感謝されます。' : 'メンタルが強いタイプです。アクティビティや新しいチャレンジなど、一緒に盛り上がる遊びが相性良いです。' });
  }

  // HTML生成
  var itemsHtml = items.map(function(item) {
    return '<div class="advice-item">' +
      '<p class="advice-item-title">' + item.title + '</p>' +
      '<p class="advice-item-text">' + item.text + '</p>' +
      '</div>';
  }).join('');

  if (includeTitle) {
    return '<p class="advice-title"><svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> ' + name + 'さんとの接し方アドバイス</p>' + itemsHtml;
  }
  return itemsHtml;
}
