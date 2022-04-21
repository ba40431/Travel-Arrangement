// 限制只能選今天以後的日期
const departureDate = document.querySelector('#departure-date');
const returnDate = document.querySelector('#return-date');
const today = new Date(+new Date() + 8 * 3600 * 1000); // 加入相差八小時
departureDate.setAttribute('min', today.toISOString().split('T')[0]); // toISOString()方法使用ISO標準將Date對象轉換為字符串
returnDate.setAttribute('min', today.toISOString().split('T')[0]);

// checkbox數量限制
const cities = document.querySelectorAll('.city');
const checkedMax = 3;
for (let i = 0; i < cities.length; i++) { cities[i].onclick = selectiveCheck; }
function selectiveCheck(e) {
  const checkedCities = document.querySelectorAll('.city:checked');
  if (checkedCities.length >= checkedMax + 1) { return false; }
}

function next() {}
