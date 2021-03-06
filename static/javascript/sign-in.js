let resData = null;
const signInBox = document.querySelector('.sign-in-content');
const signUpBox = document.querySelector('.sign-up-content');
const signInEmail = document.querySelector('.sign-in-email');
const signInPassword = document.querySelector('.sign-in-password');
const signUpName = document.querySelector('.sign-up-name');
const signUpEmail = document.querySelector('.sign-up-email');
const signUpPassword = document.querySelector('.sign-up-password');
const signUpFailed = document.querySelector('.sign-up-failed');
const signInFailed = document.querySelector('.sign-in-failed');
const oauthBlock = document.querySelector('.oauth-block');
const signUpText = document.querySelector('.sign-up-text');

function signUp() {
  signInBox.style.display = 'none';
  signUpBox.style.display = 'block';
}

function signIn() {
  signInBox.style.display = 'block';
  signUpBox.style.display = 'none';
}

function checkSignIn() {
  if (signInEmail.value && signInPassword.value) {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      email: signInEmail.value,
      password: signInPassword.value,
    };
    fetch('api/user', {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((result) => {
        resData = result;
        if (resData.error === true) {
          oauthBlock.style.marginTop = '30px';
          signInFailed.textContent = resData.message;
        } else {
          location.href = '/';
        }
      });
  } else {
    oauthBlock.style.marginTop = '30px';
    signInFailed.textContent = '請輸入電子信箱和密碼';
  }
}

function checkSignUp() {
  if (
    signUpEmail.value.match(/^([\w\.\-]){1,64}\@([\w\.\-]){1,64}$/) &&
    signUpPassword.value.match(/^[0-9a-zA-Z_]+$/)
  ) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const body = {
      name: signUpName.value,
      email: signUpEmail.value,
      password: signUpPassword.value,
    };
    fetch('api/user', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((result) => {
        resData = result;
        if (resData.error === true) {
          signUpText.style.marginTop = '20px';
          signUpFailed.textContent = resData.message;
        } else {
          signUpText.style.marginTop = '20px';
          signUpFailed.textContent = '註冊成功，將於 2 秒後返回登入畫面';
          setTimeout(() => {
            window.location.replace(location.href);
          }, 2000);
        }
      });
  } else if (
    signUpName.value == '' ||
    signUpEmail.value == '' ||
    signUpPassword.value == ''
  ) {
    signUpFailed.textContent = '請輸入姓名、電子郵件和密碼';
    signUpText.style.marginTop = '20px';
  } else if (!signUpEmail.value.match(/^([\w\.\-]){1,64}\@([\w\.\-]){1,64}$/)) {
    signUpFailed.textContent = '電子信箱格式須包含「@」';
    signUpText.style.marginTop = '20px';
  } else {
    signUpFailed.textContent = '請勿在密碼輸入特殊符號';
    signUpText.style.marginTop = '20px';
  }
}
// let data = null;

// const signUpContent = document.querySelector('.sign-up-content');
// const signInContent = document.querySelector('.sign-in-content');
// const userApi = '/api/user';
// const signInDisplay = document.querySelector('.sign-in-display');
// const signOutDisplay = document.querySelector('.sign-out-display');
// const signUpDisplay = document.querySelector('.itinerary-display');
// signInEmail.addEventListener('input', emailInput);
// signInPassword.addEventListener('input', passwordInput);
// signUpName.addEventListener('input', input);
// signUpEmail.addEventListener('input', emailInput);
// signUpPassword.addEventListener('input', passwordInput);

// function signIn() {
//   signInBox.style.display = 'block';
//   cover.style.display = 'block';
//   signUpBox.style.display = 'none';
//   remove();
// }

// function signUp() {
//   signInBox.style.display = 'none';
//   signUpBox.style.display = 'block';
//   cover.style.display = 'block';
//   remove();
// }

// function checkSignIn() {
//   if (signInEmail.value && signInPassword.value) {
//     const headers = { 'Content-Type': 'application/json' };
//     const body = {
//       email: signInEmail.value,
//       password: signInPassword.value,
//     };
//     fetch(userApi, {
//       method: 'PATCH',
//       headers,
//       body: JSON.stringify(body),
//     })
//       .then((response) => response.json())
//       .then((result) => {
//         data = result;
//         if (data.error === true) {
//           signInContent.style.height = '285px';
//           signInFailed.textContent = data.message;
//         } else {
//           window.location.replace(location.href); // 不可以通過「後退」退回到原頁面
//         }
//       });
//   } else {
//     signInContent.style.height = '285px';
//     signInFailed.textContent = '請輸入電子信箱和密碼';
//   }
// }
// function signOut() {
//   const headers = {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   };
//   fetch(userApi, {
//     method: 'DELETE',
//     headers,
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       data = result;
//       window.location.replace(location.href);
//     });
// }
// function getItinerary() {
//   getLogin(userApi).then((data) => {
//     if (data.data) {
//       signInDisplay.style.display = 'none';
//       signOutDisplay.style.display = 'block';
//       signUpDisplay.style.display = 'block';
//       location.href = '/my-itinerary';
//     } else if (data.data == null) {
//       signInDisplay.style.display = 'block';
//       signOutDisplay.style.display = 'none';
//       signUpDisplay.style.display = 'block';
//       signIn();
//     }
//   });
// }
// function emailInput(e) {
//   if (e.target.value.match(/^([\w\.\-]){1,64}\@([\w\.\-]){1,64}$/)) {
//     e.target.classList.remove('invalid');
//     e.target.classList.add('valid');
//   } else {
//     e.target.classList.add('invalid');
//   }
// }
// function passwordInput(e) {
//   if (e.target.value.match(/^[0-9a-zA-Z_]+$/)) {
//     e.target.classList.remove('invalid');
//     e.target.classList.add('valid');
//   } else {
//     e.target.classList.add('invalid');
//   }
// }
// function input(e) {
//   if (e.target.value) {
//     e.target.classList.remove('invalid');
//     e.target.classList.add('valid');
//   } else {
//     e.target.classList.add('invalid');
//   }
// }
// function remove() {
//   signInEmail.value = '';
//   signInPassword.value = '';
//   signInEmail.classList.remove('invalid');
//   signInPassword.classList.remove('invalid');
//   signInEmail.classList.remove('valid');
//   signInPassword.classList.remove('valid');
//   signUpName.value = '';
//   signUpEmail.value = '';
//   signUpPassword.value = '';
//   signUpName.classList.remove('invalid');
//   signUpEmail.classList.remove('invalid');
//   signUpPassword.classList.remove('invalid');
//   signUpName.classList.remove('valid');
//   signUpEmail.classList.remove('valid');
//   signUpPassword.classList.remove('valid');
//   logInFailed.textContent = '';
//   signUpFailed.textContent = '';
//   signInContent.style.height = '250px';
//   signUpContent.style.height = '307px';
// }
