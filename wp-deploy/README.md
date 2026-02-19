# WordPress デプロイスクリプト

高橋宏太朗ポートフォリオサイトをWordPressに自動アップロードします。

## セットアップ手順

### 1. WordPressアプリケーションパスワードの発行

1. https://datenshi417nmz.com/wp-admin/ にログイン
2. 左メニュー「ユーザー」→「プロフィール」
3. 一番下「アプリケーションパスワード」→ 名前を入力（例: deploy）
4. 「新しいアプリケーションパスワードを追加」をクリック
5. 表示されたパスワードをコピー（この画面を閉じると再表示不可）

### 2. .env ファイルの作成

wp-deploy/ フォルダ内に `.env` ファイルを作成：

```
WP_URL=https://datenshi417nmz.com
WP_USER=（WordPressのユーザー名）
WP_APP_PASSWORD=（発行したパスワード・スペースは除いて貼り付け）
```

### 3. 実行

```bash
cd wp-deploy
npm install
npm run check   # ファイル確認のみ（テスト実行）
npm run deploy  # 本番デプロイ
```

## デプロイされるページ

| URL | 内容 |
|-----|------|
| https://datenshi417nmz.com/top/ | トップページ |
| https://datenshi417nmz.com/profile/ | プロフィール |
| https://datenshi417nmz.com/contact/ | お問い合わせ |
| https://datenshi417nmz.com/service-ai/ | AI業務効率化 |
| https://datenshi417nmz.com/dashboard/ | 会員ページ |

## デプロイ後の推奨設定

WordPressの管理画面で以下を確認してください。

1. **固定ページのテンプレート変更**  
   各固定ページ編集画面 → 右サイドバー「テンプレート」→「全幅」または「Blank」を選択  
   （テーマによって名称が異なります）

2. **パーマリンク設定**  
   設定 → パーマリンク → 「投稿名」を選択して保存

3. **トップページの設定**  
   設定 → 表示設定 → 「ホームページの表示」→「固定ページ」→ 「top」を選択
