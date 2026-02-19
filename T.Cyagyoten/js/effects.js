/**
 * 高橋茶業店 - 共通エフェクト
 * スムーズスクロール / Coming Soon フェードイン / お問い合わせバリデーション / ヘッダー固定
 */

(function() {
  'use strict';

  // ナビゲーションのスムーズスクロール（アンカーリンク用）
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    var href = anchor.getAttribute('href');
    if (href === '#') return;
    var target = document.querySelector(href);
    if (target) {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });

  // .coming-soon 要素へのフェードイン（IntersectionObserver）
  var observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.coming-soon').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // お問い合わせフォームのバリデーション（名前・電話番号・種別・内容を必須）
  function validateContactForm(event) {
    var form = document.getElementById('contact_form');
    if (!form) return true;

    var name = form.querySelector('input[name="name"]');
    var phone = form.querySelector('input[name="phone"]');
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
    if (!phone || !phone.value.trim()) {
      alert('電話番号を入力してください。');
      if (phone) phone.focus();
      return false;
    }
    if (!hasCategory) {
      alert('お問い合わせ種別を選択してください。');
      if (radios.length) radios[0].focus();
      return false;
    }
    if (!message || !message.value.trim()) {
      alert('お問い合わせ内容を入力してください。');
      if (message) message.focus();
      return false;
    }
    return true;
  }

  var contactForm = document.getElementById('contact_form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      if (!validateContactForm(e)) {
        e.preventDefault();
      }
    });
  }

  // ヘッダーはCSSで position: sticky によりスクロール時固定済み（effects.js側で追加制御は不要）
})();
