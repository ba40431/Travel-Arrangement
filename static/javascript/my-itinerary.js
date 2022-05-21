// let userData = null


document.body.style.display = 'none';
window.onload = () => {
  init();
}

async function init() {
    userData = await getUserData();
    if(userData.data === null) {
      location.href = '/sign-in'
    }else if(userData.error) {
      location.href = '/sign-in'
    }else {
      document.body.style.display = 'block';
    }
}
  
function getUserData() {
    return fetch('api/user').then((response) => {
        return response.json();
    }).then((result) => {
        return result;
    })
}