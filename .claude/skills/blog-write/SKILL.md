---
name: blog-write
description: >
  ビッグファイブ診断サイトのブログ記事を生成する。脳みそファイルを読み込み、
  ユーザーの個人的見解や偏った意見を自然に織り交ぜた記事を作成する。
  使用例: /blog-write HSPの人の恋愛傾向
user-invocable: true
---

# ブログ記事生成スキル

ビッグファイブ診断サイトのブログ記事を生成する。AIっぽさを消し、サイト運営者の個人的見解が自然に混ざった記事を作る。

## 手順

### 1. 脳みそを読む
必ず最初に以下の3ファイルを読む。これらの内容を記事に自然に織り交ぜる。

- `_private/blog_notes/01_自分のこと_性格と背景.md`
- `_private/blog_notes/02_世の中への見解と哲学.md`
- `_private/blog_notes/03_サイトの方向性とブログの理想.md`

### 2. 既存ブログを確認する
`blog/` ディレクトリにある既存記事の一覧を確認し、重複しないか確認する。

### 3. 記事を生成する

## 記事のスタイルルール

### AI感を消す
- 「～でしょう」「～かもしれません」を避け、「～だ」「～と思う」で書く
- 「重要なのは～です」「～を心がけましょう」という指導的トーンを避ける
- 箇条書きの羅列で終わるセクションを作らない
- 対話型で書く——読者に問いかけ、考えさせ、共感させる
- 段落ごとにリズムを作る（説明→具体例→反問→独自の見解）

### ユーザーの個性を反映する
脳みそにある内容をそのまま載せるのではなく、記事の文脈に合わせて自然に混ぜる。例えば：
- 社会批判的な視点が入るべき場面で、サラッと「資本主義を作っている人たち」の話を出す
- ダイエット系の記事で、トレーナー経験からの「本当は痩せたくない人」の話を織り交ぜる
- 気を使いすぎ系の記事で、「電卓の例え」や「感情のマルチタスク」を出す
- 「弱さの再解釈」の哲学をベースに、ネガティブな特性をポジティブに再定義する

### HTMLフォーマット
既存の `blog/*.html` と同じ構造で出力する。
- CSSは既存記事からコピーして使用する
- `<div class="article-body">` 内に本文を書く
- `<div class="keyword-block">` / `<div class="highlight-box">` / `<div class="big-text">` を適切に使う
- 最後にCTA（診断への誘導）を入れる

### SEO要素
- タイトルは「誰かが検索しそうな悩み」を含める（例：「気を使いすぎて疲れる」「完璧主義が原因で始められない」）
- メタディスクリプションを設定する
- 構造化データ（JSON-LD）を含める（Article + BreadcrumbList）

### CTAセクション（記事の最後に必須）
記事の最後、`</article>` の直前にCTAボックスを入れる。因子ごとに文言を変える：

| グループ | CTA見出しの例 |
|---|---|
| 開放性 | 「自分の開放性を測定してみよう」 |
| 勤勉性 | 「自分の勤勉性スコアを知ろう」 |
| 外向性 | 「自分の外向性を知ろう」 |
| 協調性 | 「自分の協調性を知ろう」 |
| 神経症性 | 「自分の感受性を知ろう」 |
| その他 | 「ビッグファイブ診断に挑戦してみる」 |

ボタンリンク先は記事テーマに応じて使い分ける：
- **ビッグファイブ診断に関する記事** → `https://bigfive.jr-genius.jp/`（トップページ。10/30/120問からユーザーが選べる）
- **その他の心理診断（HSP・マインドセット等）の記事** → 各診断ページに直接リンク
- **quiz.html には直接リンクしない**（問題数を選べるトップページを通す）
バッジ（約5分・無料・登録不要・科学的根拠あり）を含める。
デザインは控えめな角丸ボックス。既存記事の `cta-box` クラスをコピーして使用。

### 関連記事セクション（CTAの直後に必須）
CTAの直後に、同じ因子グループの他記事へのリンクを入れる。

```html
<section class="related-articles">
  <h2>関連記事</h2>
  <ul>
    <li><a href="xxx.html">記事タイトル</a></li>
    ...
  </ul>
</section>
```

**因子グループ分類（既存記事）：**
- **開放性**: openness-high, openness-low, diet-openness-high, diet-openness-low
- **勤勉性**: conscientiousness-high, conscientiousness-low, diet-conscientiousness-high, diet-conscientiousness-low, kanpeki-shugi-hajimenai
- **外向性**: extraversion-high, extraversion-low, diet-extraversion-high, diet-extraversion-low
- **協調性**: agreeableness-high, agreeableness-low, diet-agreeableness-high, diet-agreeableness-low, kiwo-tsukaisu, kiwotsukaisugiru-baka-riyu, kiwotsukaisugiru-jikokoteikan
- **神経症性**: neuroticism-high, neuroticism-low, diet-neuroticism-high, diet-neuroticism-low, love-neuroticism-high, hsp-toha-kiso-chishiki
- **ダイエット（まとめ）**: diet-seikaku-type-guide（5因子×高低の全10パターンハブ記事。ダイエット系記事すべての関連記事に必ずリンクする）
- **その他**: aichaku-style-toha, ano-hito-yosoku-aishindan, chatgpt-seikaku-data, kachikan-no-kagaku, mbti-kekka-kawaru, mbti-vs-bigfive, mindset-toha, moteru-seikaku-shinjitsu, rennai-style-6-shurui, seikaku-kaereru, shigoto-muki-fumuki, yaruki-no-seitai

新記事がどのグループに属するか判断し、同グループの既存記事をリンクする。
「その他」グループの記事は、テーマ的に近い記事を4〜5本選ぶ。

CSS（`.related-articles`）は既存記事のインラインスタイルからコピー。

### 新記事作成後の必須作業
1. `blog/index.html` にカードを追加（タブUI形式、下記フォーマット参照）
2. `sitemap.xml` にURLを追記
3. **同じ因子グループの既存記事の「関連記事」セクションにも新記事へのリンクを追加する**（相互リンク）
4. 該当する因子の場合、`science.html` の因子カードにもリンクを追加する
5. **ヒーロー画像の生成**（DALL-E 3で自動生成可能、クレジットあり）
   - `_private/ブログ画像生成プロンプトリスト.md` の共通スタイルに従いプロンプトを作成
   - プロンプトを同ファイルに追記する
   - `_private/generate_blog_image.py` で画像を生成し `images/blog/<ファイル名>.webp` に保存
6. **サムネイル画像の生成**
   - `_private/generate_thumbnails.py` を実行して `images/blog/thumb/<ファイル名>.webp` を生成
   - 新規画像のみ自動生成される（既存分はスキップ）

### blog/index.html カード追加フォーマット

`blog/index.html` はタブUI。カードは `<div class="card-grid" id="cardGrid">` 内に追加する。

```html
<a href="<ファイル名>.html" class="card" data-cat="<カテゴリ>" data-job="1">
  <img class="card-img" data-src="../images/blog/thumb/<ファイル名>.webp" alt="<alt文>" loading="lazy" width="600" height="400">
  <div class="card-body">
    <span class="card-tag"><タグラベル></span>
    <p class="card-title"><カードタイトル></p>
  </div>
</a>
```

**data-cat の値（カテゴリ別）:**
| カテゴリ | data-cat | 備考 |
|---|---|---|
| ダイエット × 性格 | `diet` | |
| 性格の悩み | `worry` | |
| 恋愛 × 性格 | `love` | |
| 仕事・キャリア | `work` | 職種シリーズは `data-job="1"` も追加 |
| 性格診断の知識 | `knowledge` | |
| 深掘り（ファセット） | `facet` | |
| AI × 性格データ | `ai` | |

**職種シリーズ（job-*）のカードのみ `data-job="1"` を追加する。**
これらは「新着」タブの表示対象外となり、「仕事・キャリア」タブにのみ表示される。

カードは該当カテゴリの既存カード群の末尾に追加する。

## 出力
完成したHTMLファイルを `blog/<ファイル名>.html` に保存する。ファイル名は英語のハイフン繋ぎ（例：`hsp-renai-keikou.html`）。
