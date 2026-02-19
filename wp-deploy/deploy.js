/**
 * deploy.js（修正版）
 *
 * 変更点：
 * - 高橋茶業店ページをdraftに変更する処理を追加
 * - portfolio_TK.html をトップページとして正しく登録
 * - WordPressのフロントページ設定を自動変更
 * - 画像ファイルのメディアアップロードを追加
 * - パス変換処理を portfolio_TK.html 用に修正
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

const WP_URL = (process.env.WP_URL || 'https://datenshi417nmz.com').replace(/\/$/, '');
const WP_USER = process.env.WP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

if (!WP_USER || !WP_APP_PASSWORD) {
  console.error('❌ .env に WP_USER と WP_APP_PASSWORD を設定してください。');
  process.exit(1);
}

const AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');
const HEADERS_JSON = { Authorization: AUTH, 'Content-Type': 'application/json' };

// ----------------------------
// ユーティリティ関数
// ----------------------------

async function wpGet(endpoint) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/${endpoint}`, {
    headers: { Authorization: AUTH }
  });
  return res.json();
}

async function wpPost(endpoint, body) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/${endpoint}`, {
    method: 'POST',
    headers: HEADERS_JSON,
    body: JSON.stringify(body)
  });
  return res.json();
}

async function wpPut(endpoint, id, body) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/${endpoint}/${id}`, {
    method: 'PUT',
    headers: HEADERS_JSON,
    body: JSON.stringify(body)
  });
  return res.json();
}

async function findBySlug(slug) {
  const data = await wpGet(`pages?slug=${encodeURIComponent(slug)}&status=any&per_page=5`);
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function uploadFile(filePath, mimeType) {
  const buffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const form = new FormData();
  form.append('file', buffer, { filename: fileName, contentType: mimeType });
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: { Authorization: AUTH, ...form.getHeaders() },
    body: form
  });
  return res.json();
}

function extractBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return m ? m[1].trim() : html;
}

function convertLinks(html, jsUrl, img1Url, img2Url) {
  return html
    .replace(/<link[^>]*p_TK\.css[^>]*>/gi, '')
    .replace(/src="[./]*pf_tk_effects\.js"/g, `src="${jsUrl}"`)
    .replace(/src="\/pf_tk_effects\.js"/g, `src="${jsUrl}"`)
    .replace(/src="[./]*20250612_133318\.jpg"/g, `src="${img1Url}"`)
    .replace(/src="[./]*20250808_104609\.jpg"/g, `src="${img2Url}"`)
    .replace(/href="[./]*Profile_TK\.html"/g, `href="${WP_URL}/profile/"`)
    .replace(/href="\/Profile_TK\.html"/g, `href="${WP_URL}/profile/"`)
    .replace(/href="[./]*Contact\.html"/g, `href="${WP_URL}/contact/"`)
    .replace(/href="\/Contact\.html"/g, `href="${WP_URL}/contact/"`)
    .replace(/href="[./]*service-ai\.html"/g, `href="${WP_URL}/service-ai/"`)
    .replace(/href="\/service-ai\.html"/g, `href="${WP_URL}/service-ai/"`)
    .replace(/href="[./]*portfolio_TK\.html"/g, `href="${WP_URL}/"`)
    .replace(/href="\/portfolio_TK\.html"/g, `href="${WP_URL}/"`)
    .replace(/href="\/dashboard\.html"/g, `href="${WP_URL}/dashboard/"`)
    .replace(/href="[./]*dashboard\.html"/g, `href="${WP_URL}/dashboard/"`);
}

// ----------------------------
// メイン処理
// ----------------------------
async function main() {
  console.log('🚀 修正デプロイ開始:', WP_URL);
  console.log('='.repeat(50));

  // ========================================
  // Step 1: 高橋茶業店ページをdraftに変更
  // ========================================
  console.log('\n📋 Step 1: 高橋茶業店ページを非表示（draft）に変更...');
  const chagyotenSlugs = ['top', 'repair', 'electric', 'shop', 'dashboard', 'service-ai', 'profile-chagyoten'];
  for (const slug of chagyotenSlugs) {
    try {
      const page = await findBySlug(slug);
      if (page) {
        await wpPut('pages', page.id, { status: 'draft' });
        console.log(`  ✅ draft化完了: ${slug} (ID: ${page.id})`);
      } else {
        console.log(`  - スキップ（存在しない）: ${slug}`);
      }
    } catch (e) {
      console.warn(`  ⚠️  ${slug} 処理でエラー:`, e.message);
    }
  }

  // ========================================
  // Step 2: 画像・JSをWordPressメディアにアップロード
  // ========================================
  console.log('\n📦 Step 2: メディアファイルをアップロード...');

  let jsUrl = `${WP_URL}/wp-content/uploads/pf_tk_effects.js`;
  const jsPath = path.resolve(__dirname, '../pf_tk_effects.js');
  if (fs.existsSync(jsPath)) {
    try {
      const jsResult = await uploadFile(jsPath, 'application/javascript');
      if (jsResult.source_url) {
        jsUrl = jsResult.source_url;
        console.log('  ✅ JS アップロード完了:', jsUrl);
      } else if (jsResult.code) {
        console.warn('  ⚠️  JS アップロード失敗:', jsResult.message || jsResult.code);
      }
    } catch (e) {
      console.warn('  ⚠️  JS アップロードエラー:', e.message);
    }
  } else {
    console.warn('  ⚠️  pf_tk_effects.js が見つかりません。デフォルトURLを使用。');
  }

  let img1Url = `${WP_URL}/wp-content/uploads/20250612_133318.jpg`;
  const img1Path = path.resolve(__dirname, '../20250612_133318.jpg');
  if (fs.existsSync(img1Path)) {
    try {
      const r = await uploadFile(img1Path, 'image/jpeg');
      if (r.source_url) {
        img1Url = r.source_url;
        console.log('  ✅ 画像1 アップロード完了:', img1Url);
      }
    } catch (e) {
      console.warn('  ⚠️  画像1 アップロードエラー:', e.message);
    }
  } else {
    console.warn('  ⚠️  20250612_133318.jpg が見つかりません。');
  }

  let img2Url = `${WP_URL}/wp-content/uploads/20250808_104609.jpg`;
  const img2Path = path.resolve(__dirname, '../20250808_104609.jpg');
  if (fs.existsSync(img2Path)) {
    try {
      const r = await uploadFile(img2Path, 'image/jpeg');
      if (r.source_url) {
        img2Url = r.source_url;
        console.log('  ✅ 画像2 アップロード完了:', img2Url);
      }
    } catch (e) {
      console.warn('  ⚠️  画像2 アップロードエラー:', e.message);
    }
  } else {
    console.warn('  ⚠️  20250808_104609.jpg が見つかりません。');
  }

  // ========================================
  // Step 3: p_TK.css をカスタムCSSに登録
  // ========================================
  console.log('\n🎨 Step 3: p_TK.css をWordPressカスタムCSSに登録...');
  const cssPath = path.resolve(__dirname, '../p_TK.css');
  if (fs.existsSync(cssPath)) {
    try {
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      const settingsRes = await fetch(`${WP_URL}/wp-json/wp/v2/settings`, {
        method: 'POST',
        headers: HEADERS_JSON,
        body: JSON.stringify({ custom_css: cssContent })
      });
      if (settingsRes.ok) {
        console.log('  ✅ CSS登録完了');
      } else {
        const err = await settingsRes.json().catch(() => ({}));
        console.warn('  ⚠️  カスタムCSS API 失敗（テーマにより未対応の可能性）:', err.message || settingsRes.status);
      }
    } catch (e) {
      console.warn('  ⚠️  CSS登録エラー:', e.message);
    }
  } else {
    console.warn('  ⚠️  p_TK.css が見つかりません。');
  }

  // ========================================
  // Step 4: portfolio_TK.html を固定ページとして登録
  // ========================================
  console.log('\n📝 Step 4: portfolio_TK.html をトップ固定ページとして登録...');
  const htmlPath = path.resolve(__dirname, '../portfolio_TK.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('  ❌ portfolio_TK.html が見つかりません。処理を中断します。');
    process.exit(1);
  }

  let html = fs.readFileSync(htmlPath, 'utf-8');
  html = convertLinks(html, jsUrl, img1Url, img2Url);
  const content = extractBody(html);

  const existingPortfolio = await findBySlug('portfolio-top');
  let portfolioPage;
  const pageData = {
    title: '高橋宏太朗 Portfolio',
    slug: 'portfolio-top',
    content,
    status: 'publish',
    template: 'blank',
    menu_order: 0
  };

  if (existingPortfolio) {
    console.log(`  🔄 既存ページを更新（ID: ${existingPortfolio.id}）`);
    portfolioPage = await wpPut('pages', existingPortfolio.id, pageData);
  } else {
    console.log('  ➕ 新規ページを作成');
    portfolioPage = await wpPost('pages', pageData);
  }

  if (!portfolioPage.id) {
    console.error('  ❌ ページ作成失敗:', JSON.stringify(portfolioPage).substring(0, 300));
    process.exit(1);
  }
  console.log('  ✅ ページ作成完了（ID:', portfolioPage.id, '）:', portfolioPage.link);

  // ========================================
  // Step 5: WordPressのフロントページをportfolio-topに設定
  // ========================================
  console.log('\n⚙️  Step 5: WordPressトップページ設定を変更...');
  try {
    const settingsRes = await fetch(`${WP_URL}/wp-json/wp/v2/settings`, {
      method: 'POST',
      headers: HEADERS_JSON,
      body: JSON.stringify({
        page_on_front: portfolioPage.id,
        show_on_front: 'page'
      })
    });
    if (settingsRes.ok) {
      console.log('  ✅ トップページ設定完了');
    } else {
      const err = await settingsRes.json().catch(() => ({}));
      console.warn('  ⚠️  設定API失敗（手動設定が必要）:', err.message || settingsRes.status);
      console.warn('     管理画面: 設定 → 表示設定 → ホームページを「高橋宏太朗 Portfolio」に設定');
    }
  } catch (e) {
    console.warn('  ⚠️  設定API失敗（手動設定が必要）:', e.message);
    console.warn('     管理画面: 設定 → 表示設定 → ホームページを「高橋宏太朗 Portfolio」に設定');
  }

  // ========================================
  // 完了サマリー
  // ========================================
  console.log('\n' + '='.repeat(50));
  console.log('✅ 完了！確認してください：');
  console.log(`  トップページ: ${WP_URL}/`);
  console.log(`  ポートフォリオ直接URL: ${WP_URL}/portfolio-top/`);
  console.log('');
  console.log('⚠️  もしWordPressテーマのヘッダーが二重表示される場合：');
  console.log('   管理画面 → 固定ページ →「高橋宏太朗 Portfolio」を編集');
  console.log('   右サイドバー「テンプレート」を「全幅」または「Blank」に変更');
  console.log('');
  console.log('⚠️  トップページが変わっていない場合（設定API非対応のテーマ）：');
  console.log('   管理画面 → 設定 → 表示設定');
  console.log('   「ホームページの表示」→「固定ページ」');
  console.log('   「ホームページ」→「高橋宏太朗 Portfolio」を選択して保存');
}

main().catch(e => {
  console.error('予期しないエラー:', e);
  process.exit(1);
});
