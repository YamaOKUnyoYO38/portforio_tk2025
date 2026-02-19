/**
 * 高橋茶業店 - お茶販売ページ用
 * 会員登録・ログイン・ログアウト（LocalStorage）、カート追加・削除・数量変更、カートモーダル
 * 本番運用時はサーバーサイド認証・決済システムへの移行を推奨
 */

(function() {
  'use strict';

  var STORAGE_USERS = 'chagyoten_users';
  var STORAGE_CART = 'chagyoten_cart';
  var STORAGE_LOGIN = 'chagyoten_login';

  function getUsers() {
    try {
      var json = localStorage.getItem(STORAGE_USERS);
      return json ? JSON.parse(json) : {};
    } catch (e) {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  }

  function getCart() {
    try {
      var json = localStorage.getItem(STORAGE_CART);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
  }

  function getLogin() {
    try {
      var json = localStorage.getItem(STORAGE_LOGIN);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      return null;
    }
  }

  function setLogin(user) {
    if (user) {
      localStorage.setItem(STORAGE_LOGIN, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_LOGIN);
    }
  }

  function updateCartBadge() {
    var cart = getCart();
    var total = cart.reduce(function(sum, item) { return sum + (item.qty || 0); }, 0);
    var badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = total;
  }

  function renderCart() {
    var cart = getCart();
    var list = document.getElementById('cartList');
    var empty = document.getElementById('cartEmpty');
    var totalEl = document.getElementById('cartTotal');
    if (!list) return;

    list.innerHTML = '';
    if (cart.length === 0) {
      if (empty) empty.style.display = 'block';
      if (totalEl) totalEl.textContent = '¥0';
      return;
    }
    if (empty) empty.style.display = 'none';

    var total = 0;
    cart.forEach(function(item, index) {
      var price = (item.price || 0) * (item.qty || 1);
      total += price;
      var li = document.createElement('li');
      li.style.marginBottom = '8px';
      li.innerHTML = item.name + ' × ' + item.qty + ' = ¥' + price.toLocaleString() + ' ' +
        '<button type="button" class="cart-item-minus" data-index="' + index + '">−</button> ' +
        '<button type="button" class="cart-item-plus" data-index="' + index + '">＋</button> ' +
        '<button type="button" class="cart-item-remove" data-index="' + index + '">削除</button>';
      list.appendChild(li);
    });
    if (totalEl) totalEl.textContent = '¥' + total.toLocaleString();

    list.querySelectorAll('.cart-item-minus').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        var c = getCart();
        if (c[idx] && c[idx].qty > 1) {
          c[idx].qty--;
          saveCart(c);
          renderCart();
          updateCartBadge();
        }
      });
    });
    list.querySelectorAll('.cart-item-plus').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        var c = getCart();
        if (c[idx]) {
          c[idx].qty = (c[idx].qty || 1) + 1;
          saveCart(c);
          renderCart();
          updateCartBadge();
        }
      });
    });
    list.querySelectorAll('.cart-item-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        var c = getCart();
        c.splice(idx, 1);
        saveCart(c);
        renderCart();
        updateCartBadge();
      });
    });
  }

  function updateLoginUI() {
    var user = getLogin();
    var btnLogin = document.getElementById('btnLogin');
    var btnRegister = document.getElementById('btnRegister');
    var btnLogout = document.getElementById('btnLogout');
    var userName = document.getElementById('loginUserName');
    if (user) {
      if (btnLogin) btnLogin.style.display = 'none';
      if (btnRegister) btnRegister.style.display = 'none';
      if (btnLogout) btnLogout.style.display = 'inline-block';
      if (userName) {
        userName.textContent = user.name + ' さん';
        userName.style.display = 'inline-block';
      }
    } else {
      if (btnLogin) btnLogin.style.display = 'inline-block';
      if (btnRegister) btnRegister.style.display = 'inline-block';
      if (btnLogout) btnLogout.style.display = 'none';
      if (userName) userName.style.display = 'none';
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    renderCart();
    updateLoginUI();

    // 会員登録モーダル
    var registerModal = document.getElementById('registerModal');
    var btnRegister = document.getElementById('btnRegister');
    var closeRegister = document.getElementById('closeRegister');
    if (btnRegister) {
      btnRegister.addEventListener('click', function() {
        if (registerModal) registerModal.classList.add('is-open');
      });
    }
    if (closeRegister) {
      closeRegister.addEventListener('click', function() {
        if (registerModal) registerModal.classList.remove('is-open');
      });
    }
    if (registerModal) {
      registerModal.addEventListener('click', function(e) {
        if (e.target === registerModal) registerModal.classList.remove('is-open');
      });
    }

    var registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var name = registerForm.querySelector('input[name="name"]').value.trim();
        var email = registerForm.querySelector('input[name="email"]').value.trim();
        var pass = registerForm.querySelector('input[name="password"]').value;
        var pass2 = registerForm.querySelector('input[name="password_confirm"]').value;
        if (pass !== pass2) {
          alert('パスワードが一致しません。');
          return;
        }
        var users = getUsers();
        if (users[email]) {
          alert('このメールアドレスは既に登録されています。');
          return;
        }
        users[email] = { name: name, password: pass };
        saveUsers(users);
        setLogin({ name: name, email: email });
        updateLoginUI();
        registerModal.classList.remove('is-open');
        registerForm.reset();
        alert('会員登録が完了しました。');
      });
    }

    // ログインモーダル
    var loginModal = document.getElementById('loginModal');
    var btnLogin = document.getElementById('btnLogin');
    var closeLogin = document.getElementById('closeLogin');
    if (btnLogin) {
      btnLogin.addEventListener('click', function() {
        if (loginModal) loginModal.classList.add('is-open');
      });
    }
    if (closeLogin) {
      closeLogin.addEventListener('click', function() {
        if (loginModal) loginModal.classList.remove('is-open');
      });
    }
    if (loginModal) {
      loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) loginModal.classList.remove('is-open');
      });
    }

    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = loginForm.querySelector('input[name="email"]').value.trim();
        var pass = loginForm.querySelector('input[name="password"]').value;
        var users = getUsers();
        var user = users[email];
        if (!user || user.password !== pass) {
          alert('メールアドレスまたはパスワードが正しくありません。');
          return;
        }
        setLogin({ name: user.name, email: email });
        updateLoginUI();
        loginModal.classList.remove('is-open');
        loginForm.reset();
      });
    }

    var btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', function() {
        setLogin(null);
        updateLoginUI();
      });
    }

    // カートに追加
    document.querySelectorAll('.btn-add-cart').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = btn.getAttribute('data-product-id');
        var name = btn.getAttribute('data-name');
        var price = parseInt(btn.getAttribute('data-price'), 10) || 0;
        var qtyInput = document.querySelector('.shop-qty[data-product-id="' + id + '"]');
        var qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
        var cart = getCart();
        var found = cart.find(function(item) { return item.id === id; });
        if (found) {
          found.qty += qty;
        } else {
          cart.push({ id: id, name: name, price: price, qty: qty });
        }
        saveCart(cart);
        updateCartBadge();
        renderCart();
      });
    });

    // カートアイコンでモーダル開く
    var cartIcon = document.getElementById('cartIcon');
    var cartModal = document.getElementById('cartModal');
    var closeCart = document.getElementById('closeCart');
    if (cartIcon) {
      cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        if (cartModal) {
          renderCart();
          cartModal.classList.add('is-open');
        }
      });
    }
    if (closeCart) {
      closeCart.addEventListener('click', function() {
        if (cartModal) cartModal.classList.remove('is-open');
      });
    }
    if (cartModal) {
      cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) cartModal.classList.remove('is-open');
      });
    }

    // 購入手続きへ
    var btnCheckout = document.getElementById('btnCheckout');
    if (btnCheckout) {
      btnCheckout.addEventListener('click', function() {
        alert('準備中です。お問い合わせよりご連絡ください。');
      });
    }
  });
})();
