let citiesCount = 0;
let citiesName = null;
let userData = null;

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

// 限制只能選今天以後的日期
const departureDate = document.querySelector('#departure-date');
const returnDate = document.querySelector('#return-date');
const today = new Date(+new Date() + 8 * 3600 * 1000); // 加入相差八小時
departureDate.setAttribute('min', today.toISOString().split('T')[0]); // toISOString()方法使用ISO標準將Date對象轉換為字符串
returnDate.setAttribute('min', today.toISOString().split('T')[0]);


//限制回程日期範圍
function handler(e){
  let date = new Date(e.value);
  let minDate = date.setDate(date.getDate());
  let maxDate = date.setDate(date.getDate() + 4);
  minDate = new Date(minDate);
  maxDate = new Date(maxDate);
  returnDate.setAttribute('min', minDate.toISOString().split('T')[0]);
  returnDate.setAttribute('max', maxDate.toISOString().split('T')[0]);
}

// checkbox數量限制
const cities = document.querySelectorAll('.city');
const checkedMax = 3;

for (let i = 0; i < cities.length; i++) {
   cities[i].onclick = selectiveCheck;
}
function selectiveCheck(e) {
  const checkedCities = document.querySelectorAll('.city:checked');
  const cities = document.querySelectorAll('.city');
  if (checkedCities.length > checkedMax) { return false; }
  else {
    citiesCount = checkedCities.length;
    citiesName = checkedCities;
  }

  for(let i = 0; i < cities.length; i++) {
    let pin = document.querySelector('.pin-'+ cities[i].value);
    cities[i].checked ? pin.style.display = 'block' : pin.style.display = 'none';
  }
}

//下一頁按鈕
const warningText = document.querySelector('.warning-text');
function next() {
  if(departureDate.value === '' || returnDate.value === '') {
    warningText.textContent = '請輸入出發和回程日期';
  }else if(citiesCount === 0) {
    warningText.textContent = '請至少選擇一個縣市';
  }else if(departureDate.value > returnDate.value) {
    warningText.textContent = '回程日期須大於出發日期';
  }else {
    let citiesList = [];
    for(let i = 0; i < citiesCount; i++){
      let checkedCitiesName = citiesName[i].id;
      citiesList.push(checkedCitiesName)
    };
    fetch('api/require', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'departureDate': departureDate.value,
        'returnDate': returnDate.value,
        'checkedCities': citiesList
      })
    }).then((response) => {
      return response.json()
    }).then((result) => {
      result.ok ? location.href = '/next' : warningText.textContent = '伺服器發生錯誤';
    })
  }
}


