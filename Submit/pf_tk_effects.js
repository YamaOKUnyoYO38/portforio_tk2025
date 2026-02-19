// Node.js 側（例：Expressやサーバレス関数内）
// const nodemailer = require('nodemailer');
// async function sendContactEmail(formData) {
//   let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'you@example.com',
//       pass: process.env.GMAIL_APP_PASSWORD, // Gmailの「アプリパスワード」等
//     },
//   });
//   let info = await transporter.sendMail({
//     from: '"Portfolio Contact" <you@example.com>',
//     to: 'datenshi777veynaze33@gmail.com',
//     subject: 'サイトからのお問い合わせ',
//     text: formData.message,
//     html: `<p>${formData.message}</p>`,
//   });
//   console.log('Email sent:', info.messageId);
// }

function over(x) {
  x.style.backgroundColor = '#f0f0f0';
}

// Contact: フォーム検証（メール・名前・メッセージ必須）
function validateContactForm(event) {
  var form = document.getElementById('contact_form');
  if (!form) return true;
  var name = form.querySelector('input[name="name"]');
  var email = form.querySelector('input[name="_replyto"]');
  var message = form.querySelector('textarea[name="message"]');
  var radios = form.querySelectorAll('input[name="category"]');
  var hasCategory = false;
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) { hasCategory = true; break; }
  }
  if (!name || !name.value.trim()) {
    alert('お名前を入力してください。');
    if (name) name.focus();
    return false;
  }
  if (!email || !email.value.trim()) {
    alert('メールアドレスを入力してください。');
    if (email) email.focus();
    return false;
  }
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    alert('正しいメールアドレスを入力してください。');
    email.focus();
    return false;
  }
  if (!message || !message.value.trim()) {
    alert('メッセージを入力してください。');
    if (message) message.focus();
    return false;
  }
  return true;
}

// Works: ホバー時にiframeへURLを読み込み（アプリプレビュー表示）
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.work').forEach(function(work) {
    var link = work.querySelector('.work-link');
    var iframe = work.querySelector('.work-preview');
    if (!link || !iframe) return;
    work.addEventListener('mouseenter', function() {
      var url = link.getAttribute('href');
      if (url && url !== '#' && url !== 'about:blank') {
        iframe.src = url;
      }
    });
  });
});
