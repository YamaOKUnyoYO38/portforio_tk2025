/**
 * deploy.js
 * 高橋宏太朗ポートフォリオサイト → WordPress自動デプロイスクリプト
 *
 * 【事前準備】
 * 1. WordPress管理画面にログイン: https://datenshi417nmz.com/wp-admin/
 * 2. 左メニュー「ユーザー」→「プロフィール」を開く
 * 3. 一番下の「アプリケーションパスワード」で新しいパスワードを発行
 *    （名前は「deploy」など任意）
 * 4. 表示されたパスワードをコピー（スペースを除いて .env に貼り付ける）
 * 5. wp-deploy/.env ファイルを作成して以下を記入:
 *    WP_URL=https://datenshi417nmz.com
 *    WP_USER=（WordPressユーザー名）
 *    WP_APP_PASSWORD=（アプリケーションパスワード）
 * 6. npm install を実行してから npm run deploy を実行
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

// ==============================
// 設定
// ==============================
const WP_URL = (process.env.WP_URL || 'https://datenshi417nmz.com').replace(/\/$/, '');
const WP_USER = process.env.WP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

if (!WP_USER || !WP_APP_PASSWORD) {
  console.error('❌ エラー: wp-deploy/.env に WP_USER と WP_APP_PASSWORD を設定してください。');
  console.error('   .env.example を参考にしてください。');
  process.exit(1);
}

const AUTH_HEADER = 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');

// ==============================
// デプロイ対象ページ定義
// HTMLファイルのパスはリポジトリルートからの相対パスで指定
// ==============================
const PAGES = [
  {
    file: '../portfolio_TK.html',
    slug: 'top',
    title: 'トップ｜Kotaro Takahashi Portfolio',
    menuOrder: 1
  },
  {
    file: '../Profile_TK.html',
    slug: 'profile',
    title: 'Profile｜Kotaro Takahashi',
    menuOrder: 2
  },
  {
    file: '../Contact.html',
    slug: 'contact',
    title: 'Contact｜Kotaro Takahashi',
    menuOrder: 3
  },
  {
    file: '../service-ai.html',
    slug: 'service-ai',
    title: 'AI業務効率化サービス｜Kotaro Takahashi',
    menuOrder: 4
  },
  {
    file: '../dashboard.html',
    slug: 'dashboard',
    title: '会員ページ｜Kotaro Takahashi',
    menuOrder: 5
  },
];

const CSS_FILE = '../p_TK.css';
const JS_FILE = '../pf_tk_effects.js';

// ==============================
// WordPress REST API ヘルパー
// ==============================

async function findPageBySlug(slug) {
  const res = await fetch(
    `${WP_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&status=any`,
    { headers: { Authorization: AUTH_HEADER } }
  );
  if (!res.ok) throw new Error(`findPageBySlug ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

async function createPage(title, slug, content, menuOrder) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/pages`, {
    method: 'POST',
    headers: {
      Authorization: AUTH_HEADER,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      slug,
      content,
      status: 'publish',
      menu_order: menuOrder,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

async function updatePage(id, title, slug, content, menuOrder) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/pages/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: AUTH_HEADER,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      slug,
      content,
      status: 'publish',
      menu_order: menuOrder,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

async function uploadMedia(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);
  const form = new FormData();
  form.append('file', fileBuffer, {
    filename: fileName,
    contentType: fileName.endsWith('.css') ? 'text/css' : 'application/javascript',
  });
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: {
      Authorization: AUTH_HEADER,
      ...form.getHeaders(),
    },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

async function updateCustomCSS(cssContent) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/settings`, {
    method: 'POST',
    headers: {
      Authorization: AUTH_HEADER,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      custom_css: cssContent,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

function extractBodyContent(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();
  return html;
}

function convertLinks(html, jsMediaUrl) {
  const base = WP_URL;
  const jsSrc = jsMediaUrl || `${base}/wp-content/uploads/pf_tk_effects.js`;
  return html
    .replace(/href="\/portfolio_TK\.html"/g, `href="${base}/top/"`)
    .replace(/href="\/Profile_TK\.html"/g, `href="${base}/profile/"`)
    .replace(/href="\/Contact\.html"/g, `href="${base}/contact/"`)
    .replace(/href="\/service-ai\.html"/g, `href="${base}/service-ai/"`)
    .replace(/href="\/dashboard\.html"/g, `href="${base}/dashboard/"`)
    .replace(/src="\/pf_tk_effects\.js"/g, `src="${jsSrc}"`)
    .replace(/href="\/p_TK\.css"/g, '')
    .replace(/href="\.\/p_TK\.css"/g, '')
    .replace(/src="\.\/pf_tk_effects\.js"/g, `src="${jsSrc}"`)
    .replace(/href="\/portfolio_TK\.html#works_title"/g, `href="${base}/top/#works_title"`)
    .replace(/href="\/portfolio_TK\.html#blog"/g, `href="${base}/top/#blog"`)
    .replace(/href="\/portfolio_TK\.html#skill_level"/g, `href="${base}/top/#skill_level"`);
}

// ==============================
// メイン
// ==============================
async function main() {
  const isCheck = process.argv.includes('--check');
  console.log('🚀 WordPress デプロイ開始: ' + WP_URL);
  console.log('='.repeat(50));

  let jsMediaUrl = null;

  // Step 1: カスタムCSS
  console.log('\n📄 Step 1: CSS をWordPressカスタムCSSに登録中...');
  try {
    const cssPath = path.resolve(__dirname, CSS_FILE);
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      if (!isCheck) {
        await updateCustomCSS(cssContent);
        console.log('  ✅ CSS登録完了');
      } else {
        console.log('  ✅ CSS ファイル確認OK:', cssPath);
      }
    } else {
      console.warn('  ⚠️  CSS ファイルが見つかりません:', cssPath);
    }
  } catch (e) {
    console.error('  ❌ CSS 登録エラー:', e.message);
  }

  // Step 2: JS をメディアにアップロード
  console.log('\n📦 Step 2: JS ファイルをWordPressメディアにアップロード中...');
  try {
    const jsPath = path.resolve(__dirname, JS_FILE);
    if (fs.existsSync(jsPath)) {
      if (!isCheck) {
        const jsResult = await uploadMedia(jsPath, 'pf_tk_effects.js');
        jsMediaUrl = jsResult.source_url || (jsResult.guid && jsResult.guid.rendered) || null;
        console.log('  ✅ JS アップロード完了:', jsMediaUrl || jsResult.id);
      } else {
        console.log('  ✅ JS ファイル確認OK:', jsPath);
      }
    } else {
      console.warn('  ⚠️  JS ファイルが見つかりません:', jsPath);
    }
  } catch (e) {
    console.error('  ❌ JS アップロードエラー:', e.message);
  }

  // Step 3: 固定ページ
  console.log('\n📝 Step 3: HTMLファイルを固定ページとして登録中...');
  for (const page of PAGES) {
    const filePath = path.resolve(__dirname, page.file);
    console.log(`\n  処理中: ${page.file} → スラッグ: ${page.slug}`);

    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠️  ファイルが見つかりません: ${filePath}`);
      continue;
    }

    try {
      let html = fs.readFileSync(filePath, 'utf-8');
      html = convertLinks(html, jsMediaUrl);
      const bodyContent = extractBodyContent(html);

      if (isCheck) {
        console.log(`  ✅ ファイル確認OK（${bodyContent.length} 文字）`);
        continue;
      }

      const existing = await findPageBySlug(page.slug);
      let result;
      if (existing) {
        console.log(`  🔄 既存ページを更新（ID: ${existing.id}）`);
        result = await updatePage(existing.id, page.title, page.slug, bodyContent, page.menuOrder);
      } else {
        console.log(`  ➕ 新規ページを作成`);
        result = await createPage(page.title, page.slug, bodyContent, page.menuOrder);
      }

      if (result.id) {
        console.log(`  ✅ 完了: ${result.link}`);
      } else {
        console.error(`  ❌ 失敗:`, JSON.stringify(result).substring(0, 200));
      }
    } catch (e) {
      console.error(`  ❌ エラー (${page.file}):`, e.message);
    }
  }

  console.log('\n' + '='.repeat(50));
  if (!isCheck) {
    console.log('✅ デプロイ完了！以下のURLで確認してください：');
    PAGES.forEach(p => {
      console.log(`  • ${WP_URL}/${p.slug}/`);
    });
    console.log('\n⚠️  注意事項：');
    console.log('  • WordPressテーマのヘッダー/フッターが混在する場合は、');
    console.log('    「Page Builder」プラグインか「全幅テンプレート」の使用を推奨');
    console.log('  • 固定ページのテンプレートを「全幅（Full Width）」に変更すると');
    console.log('    既存デザインが崩れにくくなります');
    console.log(`  • 管理画面: ${WP_URL}/wp-admin/edit.php?post_type=page`);
  } else {
    console.log('✅ チェック完了。npm run deploy でデプロイを実行してください。');
  }
}

main().catch(err => {
  console.error('予期しないエラー:', err);
  process.exit(1);
});
