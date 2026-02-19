# ポートフォリオサイト セットアップガイド

## 1. Contact フォーム（Formspree 無料連携）

### 手順
1. [Formspree.io](https://formspree.io) にアクセスし、無料アカウント作成
2. 「New Form」で新規フォーム作成
3. 届け先メールアドレス（datenshi777verynaze33@gmail.com 等）を設定
4. 発行されたフォームID（例：`xyzwabcd`）をコピー
5. `Contact.html` のフォームタグ内の `YOUR_FORM_ID` をそのIDに置き換え：
   ```html
   action="https://formspree.io/f/xyzwabcd"
   ```

### 機能
- **メール受信**: 送信内容が指定メールアドレスへ直接届く
- **データ保存**: Formspreeのダッシュボードで送信履歴を閲覧可能（無料枠：月50件）
- **個人情報**: Formspree側で管理。利用規約を確認してください

---

## 2. Works（ポートフォリオ）各マスの設定

各 `.work` の `<li>` 内で以下を編集：

- **URL**: `<a class="work-link" href="ここにアプリのURL">` の `href` を変更
- **タイトル**: `<span class="work-title">アプリ名</span>` のテキストを変更

ホバーで白い半透明の長方形が表示され、URLが有効な場合はiframeでアプリ画面をプレビューします。  
※X-Frame-Optionsで埋め込み禁止のサイトはプレビューできません。

---

## 3. フッター SNS リンク

`footer` 内の `.footer-social` の各 `<a href="...">` を自分のアカウントURLに変更：
- X: `https://x.com/あなたのユーザー名`
- Instagram: `https://instagram.com/あなたのユーザー名`
- Threads: `https://www.threads.net/@あなたのユーザー名`
- Facebook: `https://facebook.com/あなたのユーザー名`

---

## 4. 無料ホスティングで公開

### GitHub Pages（推奨）
1. [GitHub](https://github.com) でリポジトリ作成
2. このサイトのファイルを push
3. リポジトリの「Settings」→「Pages」→「Source」で「main」ブランチを選択
4. 数分後に `https://ユーザー名.github.io/リポジトリ名/` で公開

### Netlify
1. [Netlify](https://www.netlify.com) にサインアップ
2. サイトをドラッグ＆ドロップでアップロード、または GitHub と連携
3. 無料の独自ドメイン（*.netlify.app）が自動発行

### Vercel
1. [Vercel](https://vercel.com) にサインアップ
2. GitHub リポジトリを連携してデプロイ
3. 無料の独自ドメイン（*.vercel.app）が自動発行

**注意**: ルートに `index.html` を用意してあり、トップ（`/`）を開くと自動で `portfolio_TK.html` にリダイレクトされます。そのままデプロイして問題ありません。
