# 無料でサイトを1つのURLで公開する手順

Render で Streamlit アプリを公開したように、**このポートフォリオサイトも無料で1つのURLで公開**できます。  
公開後はパソコンを閉じていても、そのURLを開くだけで誰でもアクセスできます。

---

## 方法1: GitHub Pages（おすすめ・手順が少ない）

### 事前準備
- [GitHub](https://github.com) のアカウント
- このフォルダがすでに Git 管理されている（`git status` が使える状態）

### 手順

1. **GitHub にリポジトリを作る**
   - GitHub にログイン → 右上「+」→「New repository」
   - 名前は何でもOK（例: `portfolio-site`）
   - 「Create repository」をクリック

2. **このフォルダを GitHub に送る（初回だけ）**
   ターミナルで、このサイトのフォルダ（`WebSite`）に移動して実行：
   ```bash
   git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
   git branch -M main
   git add .
   git commit -m "Deploy portfolio site"
   git push -u origin main
   ```
   ※すでに `origin` がある場合は `git remote set-url origin https://github.com/...` でURLを合わせてから `git push -u origin main`

3. **GitHub Pages をオンにする**
   - そのリポジトリの「Settings」→ 左メニュー「Pages」
   - 「Source」で **Deploy from a branch** を選ぶ
   - Branch: **main**、Folder: **/ (root)** のまま「Save」

4. **URLで開く**
   - 数分待つと次のURLで表示されます：
     - **https://あなたのユーザー名.github.io/リポジトリ名/**
   - このURLをブックマークしたり、誰かに送れば、ワンクリックで開けます。  
   - トップ（`/`）を開くと自動で `portfolio_TK.html` に飛ぶようにしてあります。

**更新するとき**: ファイルを直したら  
`git add .` → `git commit -m "更新"` → `git push` で反映されます。

---

## 方法2: Netlify（ドラッグ＆ドロップで公開）

Git を使わず、フォルダをそのままアップロードする方法です。

1. [Netlify](https://www.netlify.com) にアクセス → 「Sign up」で無料アカウント作成（GitHub でログインも可）。

2. ログイン後、**「Add new site」→「Deploy manually」** を選ぶ。

3. **「Drag and drop your site output folder here」** に、**この `WebSite` フォルダの中身**（`index.html` や `portfolio_TK.html`、`p_TK.css` などが入っているフォルダ）をドラッグ＆ドロップ。

4. しばらくすると **https://ランダムな名前.netlify.app** のようなURLが表示されます。これがあなたのサイトのURLです。ワンクリックで開けます。

**更新するとき**: 同じ手順で、更新したフォルダを再度ドラッグ＆ドロップすると上書きされます。  
（Git と連携すれば、push するだけで自動更新もできます。）

---

## 方法3: Render（Static Site）— Streamlit と同じサービス

Render で Streamlit を公開したことがあれば、同じアカウントで「Static Site」として公開できます。

1. [Render](https://render.com) にログイン。

2. **「New +」→「Static Site」** を選ぶ。

3. **Connect a repository** で、このサイトを入れた GitHub リポジトリを選ぶ（先に方法1の手順で GitHub に push しておく）。

4. 設定例：
   - **Name**: 任意（例: `portfolio-tk`）
   - **Branch**: `main`
   - **Publish directory**: 空欄のまま（ルートを公開）

5. **「Create Static Site」** で作成。

6. デプロイが終わると **https://サイト名.onrender.com** のようなURLが発行されます。このURL1つで開けます。

---

## まとめ

| 方法 | 得られるURL例 | 特徴 |
|------|----------------|------|
| **GitHub Pages** | `https://ユーザー名.github.io/リポジトリ名/` | 無料・安定・更新は `git push` だけ |
| **Netlify** | `https://xxx.netlify.app` | ドラッグ＆ドロップで簡単・Git 連携も可 |
| **Render** | `https://xxx.onrender.com` | Streamlit と同じサービスで管理できる |

どれも**無料**で、**1つのURLを開くだけでサイトが表示**され、**パソコンを閉じていてもずっとアクセス可能**です。  
まずは GitHub Pages か Netlify のどちらかから試すのがおすすめです。

---

## Netlify で背景・写真が表示されないとき

- **アップロードするフォルダ**: `index.html`・`portfolio_TK.html`・`p_TK.css`・`pf_tk_effects.js` が**同じ階層**にあり、その中に **`images` フォルダ**がある状態でドラッグ＆ドロップしてください。  
  （親フォルダごとドロップすると、URL が `.../フォルダ名/` になり、背景や画像のパスがずれることがあります。）

- **含めるファイル例**  
  - ルート: `index.html`, `portfolio_TK.html`, `Profile_TK.html`, `Contact.html`, `p_TK.css`, `pf_tk_effects.js`  
  - 写真: `20250612_133318.jpg`, `20250808_104609.jpg`  
  - `images` フォルダ内: `header_back.jpg`, `seamless-texture-natural-wood.png`（body・ヘッダー背景用）

- コード側では、公開URL（`/portfolio_tk` など）でも正しく読めるように、**すべてルート相対パス**（`/p_TK.css`, `/images/...`）に変更済みです。  
  上記の構成で再アップロードすると、背景と写真が表示されるようになります。

---

## AI業務効率化LP（service-ai.html）を Netlify で使うとき

- **Netlify Forms**: `service-ai.html` のお問い合わせフォームは `data-netlify="true"` と `name="ai_consult_form"` を付けてあります。デプロイ後、Netlify の「Forms」タブで送信内容を確認できます。初回送信時にフォームが自動登録されます。
- **Netlify Identity**: 会員ページ（`dashboard.html`）や「ログイン」ボタンで使います。Netlify の「Identity」タブで「Enable Identity」をオンにし、必要なら「Registration preferences」で誰が登録できるかを設定してください。メール確認を有効にすると、本人確認付きのログインができます。
