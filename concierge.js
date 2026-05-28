/**
 * 心理コンシェルジュ - 推薦エンジン
 *
 * ビッグファイブのスコアに基づいて、ユーザーに最適な心理テストを提案する。
 * 新テスト追加: CONCIERGE_CONFIG.tests にオブジェクトを1つ追加するだけ。
 */

const CONCIERGE_CONFIG = {
  maxRecommendations: 3,

  tests: [
    {
      key: 'hsp_result',
      title: 'HSP感受性チェック',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c-4-3-8-6-8-12a8 8 0 0116 0c0 6-4 9-8 12z"/></svg>',
      url: 'hsp.html',
      gate: null,
      bgColor: 'rgba(34,211,238,0.15)',
      getResult: (d) => {
        const map = {
          5: { name: '蘭型（最高域）', color: '#22d3ee' },
          4: { name: '蘭型（高め）', color: '#67e8f9' },
          3: { name: 'チューリップ型', color: '#a78bfa' },
          2: { name: 'おだやか感受性', color: '#94a3b8' },
          1: { name: '安定型', color: '#64748b' }
        };
        const lvl = d.scores ? (d.scores.total >= 42 ? 5 : d.scores.total >= 34 ? 4 : d.scores.total >= 28 ? 3 : d.scores.total >= 20 ? 2 : 1) : 0;
        return map[lvl] || { name: '完了', color: '#22d3ee' };
      },
      triggers: [
        {
          condition: (sc) => sc.N >= 5,
          priority: 5,
          message: '人一倍感じるその繊細さは、HSPのサインかもしれません。自分の感じ方を知ると、毎日がもっとラクになります。'
        },
        {
          condition: (sc) => sc.N >= 4,
          priority: 4,
          message: '環境の変化や人の感情を深く受け止めるあなた。HSPの傾向があるか、12問でさくっと確かめてみませんか？'
        },
        {
          condition: (sc) => sc.O >= 4 && sc.E <= 2,
          priority: 4,
          message: '好奇心は旺盛なのに、静かな環境で力を発揮するあなた。音や光への敏感さを知ることで、集中力がさらに上がります。'
        },
        {
          condition: (sc) => sc.E >= 4 && sc.N >= 3,
          priority: 3,
          message: '「楽しんでいるのになぜか疲れる」その感覚、実は外向型HSPの特徴かもしれません。'
        }
      ]
    },
    {
      key: 'attachment_result',
      title: '愛着スタイルチェック',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
      url: 'attachment.html',
      gate: 'attachment',
      bgColor: 'rgba(244,114,182,0.15)',
      getResult: (d) => {
        const map = {
          secure: { name: '安心ベース型', color: '#10b981' },
          anxious: { name: 'つながり重視型', color: '#f97316' },
          avoidant: { name: '自律尊重型', color: '#3b82f6' },
          fearful: { name: '繊細なつながり型', color: '#8b5cf6' }
        };
        return map[d.typeKey] || { name: d.typeKey, color: '#f472b6' };
      },
      triggers: [
        {
          condition: (sc) => sc.N >= 4 && sc.A >= 4,
          priority: 5,
          message: '思いやりが深く、人の気持ちに敏感なあなた。大切な人との「安心感」の育み方を知ると、関係がもっと深まります。'
        },
        {
          condition: (sc) => sc.N >= 4,
          priority: 4,
          message: '人間関係で不安や心配を感じやすいあなた。愛着スタイルを知ることで、安心できる関係の作り方が見えてきます。'
        },
        {
          condition: (sc) => sc.A <= 2,
          priority: 4,
          message: '自立心が強く、自分の意見をしっかり持つあなた。親密な関係に窮屈さを感じたことはありませんか？その理由がわかります。'
        },
        {
          condition: (sc) => sc.E <= 2 && sc.N >= 3,
          priority: 3,
          message: '静かに距離を保つタイプのあなた。人との距離の取り方には、意外なクセが隠れているかもしれません。'
        }
      ]
    },
    {
      key: 'love_result',
      title: '恋愛スタイル診断',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
      url: 'love.html',
      gate: null,
      bgColor: 'rgba(236,72,153,0.15)',
      getResult: (d) => {
        const map = {
          eros: { name: '情熱型', color: '#ec4899' },
          ludus: { name: '遊び型', color: '#f97316' },
          storge: { name: '友情型', color: '#22c55e' },
          pragma: { name: '現実型', color: '#3b82f6' },
          mania: { name: '執着型', color: '#8b5cf6' },
          agape: { name: '献身型', color: '#f59e0b' },
        };
        return map[d.mainStyle] || { name: d.mainStyle, color: '#ec4899' };
      },
      triggers: [
        {
          condition: (sc) => sc.E >= 4,
          priority: 3,
          message: '人との関わりをエネルギーの源にするあなた。恋愛での「愛し方」を知ると、魅力がさらに引き立ちます。'
        },
        {
          condition: (sc) => sc.A >= 4,
          priority: 3,
          message: '相手を大切にするあなた。「相手ファースト」な愛し方が本当に自分を幸せにするか、考えてみませんか？'
        },
        {
          condition: (sc) => sc.N >= 4 && sc.A <= 2,
          priority: 3,
          message: '感情豊かで自己主張が強いあなた。恋愛で不安と愛情のバランスを知ると、より良い関係が築けます。'
        },
        {
          condition: (sc) => sc.O >= 4,
          priority: 2,
          message: '好奇心旺盛なあなた。恋愛観にも新しい発見があるかもしれません。'
        }
      ]
    },
    {
      key: 'schwartz_result',
      title: '価値観診断',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
      url: 'schwartz.html',
      gate: 'schwartz',
      bgColor: 'rgba(245,158,11,0.15)',
      getResult: (d) => {
        const valJa = {
          'self-direction': '自己方向性', 'stimulation': '刺激追求', 'hedonism': '快楽主義',
          'achievement': '達成', 'power': '権力', 'security': '安全',
          'conformity': '同調', 'tradition': '伝統', 'benevolence': '仁愛', 'universalism': '普遍主義'
        };
        const top = d.top3 && d.top3[0] ? valJa[d.top3[0]] || d.top3[0] : '不明';
        const sub = d.top3 && d.top3[1] ? valJa[d.top3[1]] || d.top3[1] : '';
        return { name: sub ? `${top}・${sub}重視` : `${top}重視`, color: '#f59e0b' };
      },
      triggers: [
        {
          condition: (sc) => sc.O >= 4,
          priority: 4,
          message: '新しい価値観にもオープンなあなた。10の価値観の中で「自分の核心」がどこにあるか知ると、人生の優先順位がスッと明確になります。'
        },
        {
          condition: (sc) => sc.C >= 4,
          priority: 3,
          message: '計画的で目標志向のあなた。「達成」や「安全」を重視する傾向があるかもしれません。価値観を知ることで仕事選びに活かせます。'
        },
        {
          condition: (sc) => sc.A >= 4,
          priority: 3,
          message: '他者への思いやりが深いあなた。「仁愛」や「普遍主義」が価値観の中心にあるかもしれません。'
        }
      ]
    },
    {
      key: 'sdt_result',
      title: '動機タイプ診断',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      url: 'sdt.html',
      gate: 'sdt',
      bgColor: 'rgba(59,130,246,0.15)',
      getResult: (d) => {
        const map = {
          autonomy:    { name: '自律駆動型', color: '#3b82f6' },
          competence:  { name: '達成志向型', color: '#f59e0b' },
          relatedness: { name: '関係重視型', color: '#ec4899' },
        };
        return map[d.strongest] || { name: d.strongest, color: '#3b82f6' };
      },
      triggers: [
        {
          condition: (sc) => sc.C >= 4,
          priority: 4,
          message: '目標に向けて着実に努力するあなた。「何が本当に動かすのか」を知ると、モチベーション管理がガラッと変わります。'
        },
        {
          condition: (sc) => sc.E >= 4,
          priority: 3,
          message: 'エネルギッシュで行動力のあるあなた。その原動力は「自律性」「有能感」「関係性」のどれから来ているのでしょうか？'
        },
        {
          condition: (sc) => sc.A >= 4,
          priority: 3,
          message: '人とのつながりを大切にするあなた。関係性が一番のエネルギー源かもしれません。確かめてみましょう。'
        },
        {
          condition: (sc) => sc.N >= 4,
          priority: 3,
          message: '繊細で感受性が高いあなた。ストレスがかかりやすい環境を避けるために、自分の動機タイプを知っておくと役立ちます。'
        }
      ]
    },
    {
      key: 'mindset_result',
      title: 'マインドセット診断',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M20 15h2M9 2v2M9 20v2M2 9h2M20 9h2"/></svg>',
      url: 'mindset.html',
      gate: 'mindset',
      bgColor: 'rgba(16,185,129,0.15)',
      getResult: (d) => {
        const map = {
          growth: { name: '成長マインドセット', color: '#10b981' },
          mixed:  { name: '混合マインドセット', color: '#8b5cf6' },
          fixed:  { name: '固定マインドセット', color: '#f97316' },
        };
        return map[d.type] || { name: d.type, color: '#10b981' };
      },
      triggers: [
        {
          condition: (sc) => sc.C <= 2,
          priority: 4,
          message: '自由な発想を持つあなた。「能力は伸びる」と信じるかどうかで、人生の選択肢が大きく変わります。'
        },
        {
          condition: (sc) => sc.O >= 4,
          priority: 3,
          message: '好奇心が旺盛なあなた。成長マインドセットを持っていると、その好奇心がさらに成果に結びつきます。'
        },
        {
          condition: (sc) => sc.C >= 4,
          priority: 2,
          message: '努力家のあなた。マインドセットを知ることで、「努力の方向性」をさらに最適化できます。'
        }
      ]
    },
    {
      key: 'locus_result',
      title: '統制の所在チェック',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
      url: 'locus.html',
      gate: 'locus',
      bgColor: 'rgba(245,158,11,0.15)',
      getResult: (d) => {
        const map = {
          internal: { name: '内的統制型', color: '#f59e0b' },
          balanced: { name: 'バランス型', color: '#8b5cf6' },
          external: { name: '外的統制型', color: '#64748b' },
        };
        return map[d.type] || { name: d.typeName, color: '#f59e0b' };
      },
      triggers: [
        {
          condition: (sc) => sc.N <= 2,
          priority: 5,
          message: '精神的に安定しているあなたに。自分のコントロール感を科学してみましょう。'
        },
        {
          condition: (sc) => sc.C >= 4,
          priority: 3,
          message: '計画性が高いあなた。その「統制感」の源泉を分析しましょう。'
        }
      ]
    },
    {
      key: 'eq_result',
      title: '感情知能（EQ）チェック',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
      url: 'eq.html',
      gate: 'eq',
      bgColor: 'rgba(249,115,22,0.15)',
      getResult: (d) => {
        const map = {
          very_high: { name: 'EQ非常に高い', color: '#10b981' },
          high: { name: 'EQ高い', color: '#f97316' },
          average: { name: 'EQ標準的', color: '#3b82f6' },
          growth: { name: 'EQ伸びしろあり', color: '#a78bfa' },
        };
        return map[d.level] || { name: d.levelName, color: '#f97316' };
      },
      triggers: [
        {
          condition: (sc) => sc.A >= 5,
          priority: 5,
          message: '相手の気持ちに敏感なあなたに。その共感力の正体を分析しましょう。'
        },
        {
          condition: (sc) => sc.E >= 4 && sc.A >= 4,
          priority: 4,
          message: '社交的で思いやりがあるあなた。感情知能が高い可能性があります。'
        }
      ]
    },
    {
      key: 'impostor_result',
      title: 'インポスター症候群チェック',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
      url: 'impostor.html',
      gate: null,
      bgColor: 'rgba(167,139,250,0.15)',
      getResult: (d) => {
        const sevNames = { low: '低い', moderate: '中程度', high: '高い' };
        return { name: '重症度: ' + (sevNames[d.severityLevel] || d.severityName), color: d.severityLevel === 'high' ? '#ef4444' : '#a78bfa' };
      },
      triggers: [
        {
          condition: (sc) => sc.N >= 5,
          priority: 5,
          message: '感受性が豊かなあなたに。不安の正体がインポスターかどうか確かめてみましょう。'
        },
        {
          condition: (sc) => sc.C >= 4 && sc.N >= 3,
          priority: 4,
          message: '真面目で繊細なあなた。成功しているのに不安になることがあるなら、インポスターかもしれません。'
        }
      ]
    },
    {
      key: 'pgg_result',
      title: 'コイン増やせるかな？（公共財ゲーム）',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/></svg>',
      url: 'pgg.html',
      gate: null,
      bgColor: 'rgba(245,158,11,0.15)',
      getResult: (d) => {
        var map = {
          'cooperator': { name: '協力型', color: '#10b981' },
          'conditional-cooperator': { name: '条件付き協力型', color: '#3b82f6' },
          'balancer': { name: 'バランス型', color: '#f59e0b' },
          'self-protector': { name: '自己保護型', color: '#ef4444' },
          'strategic': { name: '戦略型', color: '#8b5cf6' }
        };
        return map[d.type] || { name: '完了', color: '#f59e0b' };
      },
      triggers: [
        {
          condition: (sc) => sc.A >= 4,
          priority: 3,
          message: '協調性が高いあなたに。コインゲームで自分の協力スタイルを知ると面白いかも。'
        },
        {
          condition: (sc) => sc.A <= 2,
          priority: 3,
          message: '自分の利益を守る傾向があるあなた。ゲームで自分の本当の協力スタイルを確かめてみませんか？'
        }
      ]
    },
    {
      key: 'risk_result',
      title: 'リスク選好ゲーム',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 22h20L12 2z"/></svg>',
      url: 'risk.html',
      gate: null,
      bgColor: 'rgba(239,68,68,0.15)',
      getResult: (d) => {
        var map = {
          'ultra-conservative': { name: '超慎重派', color: '#6366f1' },
          'cautious': { name: '慎重派', color: '#3b82f6' },
          'balanced': { name: 'バランス型', color: '#f59e0b' },
          'challenger': { name: 'チャレンジャー', color: '#f97316' },
          'high-roller': { name: 'ハイローラー', color: '#ef4444' }
        };
        return map[d.type] || { name: '完了', color: '#ef4444' };
      },
      triggers: [
        {
          condition: (sc) => sc.O >= 4,
          priority: 3,
          message: '新しい経験を好むあなた。リスク選好ゲームで自分の冒険心を測ってみませんか？'
        },
        {
          condition: (sc) => sc.N >= 4,
          priority: 2,
          message: '不安を感じやすい傾向があるあなた。リスクに対する本当の態度をゲームで確かめてみましょう。'
        }
      ]
    },
    {
      key: 'trust_result',
      title: '信頼ゲームの返報率',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 17l-3-3a2.83 2.83 0 00-4 4l3 3a2.83 2.83 0 004 0l1-1"/><path d="M13 7l3 3a2.83 2.83 0 004-4l-3-3a2.83 2.83 0 00-4 0l-1 1"/></svg>',
      url: 'trust.html',
      gate: null,
      bgColor: 'rgba(56,189,248,0.15)',
      getResult: (d) => ({ name: d.typeName || '完了', color: '#38bdf8' }),
      triggers: [
        {
          condition: (sc) => sc.A >= 4,
          priority: 3,
          message: '協調性が高いあなたに。信頼されたときの返し方をゲームで見てみませんか？'
        }
      ]
    },
    {
      key: 'ultimatum_result',
      title: '最後通牒ゲームの拒否ライン',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>',
      url: 'ultimatum.html',
      gate: null,
      bgColor: 'rgba(139,92,246,0.15)',
      getResult: (d) => ({ name: d.typeName || '完了', color: '#8b5cf6' }),
      triggers: [
        {
          condition: (sc) => sc.N >= 4 || sc.A >= 4,
          priority: 3,
          message: '不公平さへの反応が気になる方に。最後通牒ゲームで自分の拒否ラインを測れます。'
        }
      ]
    },
    {
      key: 'beauty_result',
      title: 'ビューティーコンテストゲーム',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>',
      url: 'beauty.html',
      gate: null,
      bgColor: 'rgba(245,158,11,0.15)',
      getResult: (d) => ({ name: d.typeName || '完了', color: '#f59e0b' }),
      triggers: [
        {
          condition: (sc) => sc.O >= 4 || sc.C >= 4,
          priority: 3,
          message: '読み合いや戦略が得意かも。ビューティーコンテストゲームで他者視点を試せます。'
        }
      ]
    },
    {
      key: 'delay_result',
      title: '時間割引ゲーム',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      url: 'delay.html',
      gate: null,
      bgColor: 'rgba(56,189,248,0.15)',
      getResult: (d) => ({ name: d.typeName || '完了', color: '#38bdf8' }),
      triggers: [
        {
          condition: (sc) => sc.C >= 4 || sc.N >= 4,
          priority: 3,
          message: '将来のために待てるタイプかも。時間割引ゲームで、今と未来の選び方を見てみませんか？'
        }
      ]
    }
  ]
};

/**
 * スコアに基づいておすすめテストを取得する
 * @param {{O:number,C:number,E:number,A:number,N:number}} sc - ビッグファイブスコア（各1-5）
 * @returns {Array} おすすめテストの配列（最大3個）
 */
function getRecommendations(sc) {
  const candidates = CONCIERGE_CONFIG.tests.filter(test => {
    if (localStorage.getItem(test.key)) return false;
    if (test.gate && typeof isUnlocked === 'function' && !isUnlocked(test.gate)) return false;
    return true;
  });
  if (candidates.length === 0) return [];

  const scored = candidates.map(test => {
    let bestPriority = 0;
    let bestMessage = null;

    for (const trigger of test.triggers) {
      if (trigger.condition(sc) && trigger.priority > bestPriority) {
        bestPriority = trigger.priority;
        bestMessage = trigger.message;
      }
    }

    return { ...test, matched: bestPriority > 0, priority: bestPriority, message: bestMessage };
  });

  scored.sort((a, b) => {
    if (a.matched !== b.matched) return a.matched ? -1 : 1;
    return b.priority - a.priority;
  });

  return scored.slice(0, CONCIERGE_CONFIG.maxRecommendations).map(item => ({
    key: item.key,
    title: item.title,
    icon: item.icon,
    url: item.url,
    message: item.message || `${item.title}でさらに自分を深く知りましょう。`,
    matched: item.matched
  }));
}

/**
 * 完了済みテストの数を取得
 * @returns {number} 完了済みテスト数
 */
function getCompletedTestCount() {
  return CONCIERGE_CONFIG.tests.filter(test => localStorage.getItem(test.key)).length;
}

/**
 * 全テスト完了かどうか
 * @returns {boolean}
 */
function isAllTestsCompleted() {
  return getCompletedTestCount() === CONCIERGE_CONFIG.tests.length;
}
