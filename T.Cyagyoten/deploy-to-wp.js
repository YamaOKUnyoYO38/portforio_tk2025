/**
 * deploy-to-wp.js
 * WordPress REST API を使用して高橋茶業店サイトを自動デプロイ
 *
 * 使用方法:
 *   node deploy-to-wp.js
 *   または: npm run deploy
 *
 * 事前準備:
 *   1. WordPressにアプリケーションパスワードを発行
 *      (WP管理画面 → ユーザー → プロフィール → アプリケーションパスワード)
 *   2. .env ファイルを作成して認証情報を設定（.env.example をコピー）
 *
 * WordPressアプリケーションパスワードの発行手順:
 *   1. https://datenshi417nmz.com/wp-admin/ にログイン
 *   2. 左メニュー「ユーザー」→「プロフィール」を開く
 *   3. 下部「アプリケーションパスワード」セクションで名前を入力（例: deploy）
 *   4. 「新しいアプリケーションパスワードを追加」をクリック
 *   5. 表示されたパスワード（スペース含む）をコピー
 *   6. .envファイルのWP_APP_PASSWORDにスペースを除いて貼り付ける
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const WP_URL = (process.env.WP_URL || 'https://datenshi417nmz.com').replace(/\/$/, '');
const WP_USER = process.env.WP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

if (!WP_USER || !WP_APP_PASSWORD) {
  console.error('エラー: .envファイルにWP_USERとWP_APP_PASSWORDを設定してください。');
  console.error('  .env.example をコピーして .env を作成し、値を入力してください。');
  process.exit(1);
}

const AUTH = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD.replace(/\s/g, '')}`).toString('base64');
const API_BASE = `${WP_URL}/wp-json/wp/v2`;

const PAGES = [
  { file: 'index.html', slug: 'top', title: 'トップ | 高橋茶業店' },
  { file: 'repair.html', slug: 'repair', title: '修理・重機・工業系依頼 | 高橋茶業店' },
  { file: 'electric.html', slug: 'electric', title: '電気工事 | 高橋茶業店' },
  { file: 'shop.html', slug: 'shop', title: 'お茶販売 | 高橋茶業店' },
  { file: 'profile.html', slug: 'profile', title: 'プロフィール | 高橋茶業店' },
  { file: 'contact.html', slug: 'contact', title: 'お問い合わせ | 高橋茶業店' },
];

const headers = {
  'Authorization': 'Basic ' + AUTH,
  'Content-Type': 'application/json',
};

function readHtml(file) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

function wpRequest(method, path, body) {
  const url = path.startsWith('http') ? path : API_BASE + path;
  const opt = { method, headers };
  if (body && (method === 'POST' || method === 'PUT')) {
    opt.body = JSON.stringify(body);
  }
  return fetch(url, opt);
}

async function getPageIdBySlug(slug) {
  const res = await wpRequest('GET', `/pages?slug=${encodeURIComponent(slug)}`);
  if (!res.ok) return null;
  const json = await res.json();
  return json.length > 0 ? json[0].id : null;
}

async function deployPage(item) {
  const html = readHtml(item.file);
  if (!html) {
    console.error(`  [失敗] ${item.file} が見つかりません。`);
    return;
  }

  const content = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const body = {
    title: item.title,
    content: content,
    status: 'publish',
    slug: item.slug,
  };

  const existingId = await getPageIdBySlug(item.slug);
  let res;
  if (existingId) {
    res = await wpRequest('PUT', `/pages/${existingId}`, body);
    if (res.ok) {
      console.log(`  [更新] ${item.file} → スラッグ: ${item.slug} (ID: ${existingId})`);
    } else {
      const err = await res.text();
      console.error(`  [失敗] ${item.file} の更新に失敗しました: ${res.status} ${err}`);
    }
  } else {
    res = await wpRequest('POST', '/pages', body);
    if (res.ok) {
      const data = await res.json();
      console.log(`  [新規] ${item.file} → スラッグ: ${item.slug} (ID: ${data.id})`);
    } else {
      const err = await res.text();
      console.error(`  [失敗] ${item.file} の作成に失敗しました: ${res.status} ${err}`);
    }
  }
}

async function main() {
  console.log('WordPress デプロイを開始します: ' + WP_URL);
  for (const item of PAGES) {
    await deployPage(item);
  }
  console.log('デプロイ処理が完了しました。');
  console.log('CSS（style.css）はWordPressの「外観 → カスタマイズ → 追加CSS」または子テーマでご登録ください。');
}

main().catch(function (err) {
  console.error('エラー:', err.message);
  process.exit(1);
});
