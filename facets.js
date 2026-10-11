/* 30項目（ファセット）の定義 ── 共通の正本
 *
 * 2026-08-30新設：もともと facet-report.html の中にだけあったが、
 * result.html でも「30項目の目次」を出すことになったので1か所にまとめた。
 * ★項目名を直すときは、このファイルだけを直せば両方に効く。
 *
 * 読んでいるページ： facet-report.html ／ result.html
 */
var FACET_META = [
  { key:'N1', name:'不安',       factor:'N', desc:'心配事や不安を感じやすいか' },
  { key:'N2', name:'怒り',       factor:'N', desc:'イライラや怒りを感じやすいか' },
  { key:'N3', name:'抑うつ',     factor:'N', desc:'気分が落ち込みやすいか' },
  { key:'N4', name:'自己意識',   factor:'N', desc:'他人の目を気にするか' },
  { key:'N5', name:'無抑制',     factor:'N', desc:'衝動的に行動してしまうか' },
  { key:'N6', name:'脆弱性',     factor:'N', desc:'ストレスに圧倒されやすいか' },
  { key:'E1', name:'友好性',     factor:'E', desc:'友人を作りやすいか' },
  { key:'E2', name:'群居性',     factor:'E', desc:'大勢の中にいるのが好きか' },
  { key:'E3', name:'主張性',     factor:'E', desc:'自分からリードするか' },
  { key:'E4', name:'活動性',     factor:'E', desc:'常に活動的で忙しいか' },
  { key:'E5', name:'刺激追求',   factor:'E', desc:'スリルや興奮を求めるか' },
  { key:'E6', name:'陽気さ',     factor:'E', desc:'明るく楽観的か' },
  { key:'O1', name:'想像力',     factor:'O', desc:'想像力や空想を楽しむか' },
  { key:'O2', name:'芸術的興味', factor:'O', desc:'芸術や美に感応するか' },
  { key:'O3', name:'感情性',     factor:'O', desc:'感情を深く感じるか' },
  { key:'O4', name:'冒険性',     factor:'O', desc:'新しい体験を好むか' },
  { key:'O5', name:'知性',       factor:'O', desc:'知的な探求を好むか' },
  { key:'O6', name:'自由主義',   factor:'O', desc:'既存の価値観を問い直すか' },
  { key:'A1', name:'信頼',       factor:'A', desc:'他人を信用できるか' },
  { key:'A2', name:'道徳性',     factor:'A', desc:'他者を利用しないか' },
  { key:'A3', name:'利他性',     factor:'A', desc:'他者を助けたいと思うか' },
  { key:'A4', name:'協調性',     factor:'A', desc:'争いを避けるか' },
  { key:'A5', name:'謙虚さ',     factor:'A', desc:'自分を控えめにするか' },
  { key:'A6', name:'共感性',     factor:'A', desc:'他人の悲しみに寄り添うか' },
  { key:'C1', name:'有能性',     factor:'C', desc:'効率よく物事をこなせるか' },
  { key:'C2', name:'秩序性',     factor:'C', desc:'整理整頓が好きか' },
  { key:'C3', name:'義務感',     factor:'C', desc:'約束やルールを守るか' },
  { key:'C4', name:'達成努力',   factor:'C', desc:'期待以上の努力をするか' },
  { key:'C5', name:'自己規律',   factor:'C', desc:'計画を実行に移せるか' },
  { key:'C6', name:'慎重さ',     factor:'C', desc:'考慮してから行動するか' }
];
