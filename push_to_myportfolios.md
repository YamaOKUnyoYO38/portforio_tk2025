# MyPortfolios リポジトリへコミット＆プッシュ手順

以下のコマンドを **ターミナル（PowerShell または Git Bash）** で、**この WebSite フォルダを開いた状態**で実行してください。

## 1. ウェブサイト関連ファイルを追加

```bash
git add index.html portfolio_TK.html p_TK.css Profile_TK.html Contact.html pf_tk_effects.js DEPLOY.md SETUP_GUIDE.md Submit/
```

削除されたファイルも含めてすべて反映する場合：

```bash
git add -A
```

## 2. コミット

```bash
git commit -m "Update portfolio: p_TK.css, portfolio_TK.html, Contact, index, Submit, DEPLOY guide"
```

## 3. リモートを MyPortfolios に合わせる

いまのリモートが別リポジトリ（portforio_tk2025）の場合、MyPortfolios のURLに変更：

```bash
git remote set-url origin https://github.com/YamaOKUnyoYO38/MyPortfolios.git
```

※ GitHub のユーザー名が違う場合は `YamaOKUnyoYO38` を自分のユーザー名に変えてください。  
※ リポジトリ名が違う場合も URL を合わせてください。

## 4. プッシュして反映

```bash
git push -u origin master
```

リモートのブランチが `main` の場合は：

```bash
git branch -M main
git push -u origin main
```

---

プッシュが成功すると、GitHub の MyPortfolios リポジトリに反映されます。  
GitHub Pages を有効にしている場合は、数分でサイトのURLにも反映されます。
