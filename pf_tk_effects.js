let yosoro = 30;
/*console = log = yosoro;*/
console.log(yosoro);

let ok = false;
let maybe = false;
if (ok) {
  console.log('ok!!');
} else if (maybe) {
  console.log('yes!!!');
} else {
  console.log('fack!!');
}

const fruits = ['apple', 'banana', 'grape', 'orange', 'mango'];

for (i = 0; i < fruits.length; i += 1) {
  console.log(fruits[i]);
}

$(function () {
  const $form = $("#contactForm");
  const $message = $("#formMessage");

  // フォーム送信時
  $form.on("submit", function (e) {
    e.preventDefault();

    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const msg = $("#message").val().trim();

    if (name === "" || email === "" || msg === "") {
      $message
        .stop(true, true)
        .hide()
        .text("⚠ 入力漏れがあります。すべての項目を入力してください。")
        .css("color", "red")
        .fadeIn(400)
        .delay(2000)
        .fadeOut(600);
      return;
    }

    // 送信成功アニメーション
    $message
      .stop(true, true)
      .hide()
      .text("✅ 送信ありがとうございます！")
      .css("color", "green")
      .fadeIn(500)
      .delay(2000)
      .fadeOut(800);

    $form[0].reset();
  });

  // 入力欄フォーカス時のアニメーション
  $("input, textarea").on("focus", function () {
    $(this)
      .animate(
        {
          borderColor: "#319b1d",
          boxShadow: "0 0 8px rgba(49,155,29,0.6)",
        },
        200
      );
  });

  $("input, textarea").on("blur", function () {
    $(this)
      .animate(
        {
          borderColor: "#ccc",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
        },
        200
      );
  });
});

// フォーム要素取得
const form = document.getElementById("contactForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // ページリロード防止

  // 入力内容を取得
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("message").value.trim();

  // 簡易バリデーション
  if (name === "" || email === "" || msg === "") {
    message.style.color = "red";
    message.textContent = "⚠ 入力漏れがあります。すべての項目を入力してください。";
    return;
  }

  // 送信成功（実際はここでAjaxやバックエンドに送信する）
  message.style.color = "green";
  message.textContent = "✅ 送信ありがとうございます！";
  form.reset(); // 入力をリセット
});

// 入力中の枠を強調
const inputs = document.querySelectorAll("input, textarea");
inputs.forEach((el) => {
  el.addEventListener("focus", () => {
    el.style.borderColor = "#319b1d";
    el.style.boxShadow = "0 0 5px rgba(49,155,29,0.5)";
  });
  el.addEventListener("blur", () => {
    el.style.borderColor = "#ccc";
    el.style.boxShadow = "none";
  });
});
