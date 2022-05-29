
function getLocation(e) {
    fetch(`/api/location/${e.id.slice(13,)}`
        ).then((response) => {
          return response.json();
        }).then((result) => {
          for(let i = 0 ; i < result.result.length; i++) {
            if(result.result[i].itinerary_id === itineraryId) {
              renderAttraction(result)
              break
            }
          }
        })
}
function getHotel(e) {
  fetch(`/api/hotel/${e.id.slice(8,)}`
  ).then((response) => {
    return response.json();
  }).then((result) => {
    renderHotel(result)
  })
}

function renderAttraction(data) {
    let attractionContainer = document.querySelector('.attraction-container')
    attractionContainer.innerHTML = ''
    let titleDiv = document.createElement('div');
    titleDiv.textContent = '景點介紹';
    titleDiv.setAttribute('class', 'title');
    attractionContainer.appendChild(titleDiv);
    let contentDiv = document.createElement('div');
    contentDiv.setAttribute('class', 'attraction-content');
    attractionContainer.appendChild(contentDiv);
    let attractionContent = document.querySelector('.attraction-content');
    let imageDiv = document.createElement('div');
    imageDiv.setAttribute('class', 'attraction-image');
    attractionContent.appendChild(imageDiv);
    let attractionDiv = document.createElement('div');
    attractionDiv.setAttribute('class', 'attraction-block');
    attractionContent.appendChild(attractionDiv);
    let img = document.createElement('img');
    img.src = data.result[0].picture;
    if(data.result[0].picture === '') {
      img.src = '/pic/AdobeStock_299429587.jpeg'
    }
    let attractionImage = document.querySelector('.attraction-image');
    attractionImage.appendChild(img);
    let attractionBlock = document.querySelector('.attraction-block');
    let nameDiv = document.createElement('div');
    let distanceDiv = document.createElement('div');
    let phoneDiv = document.createElement('div');
    let addressDiv = document.createElement('div');
    let opentmeDiv = document.createElement('div');
    let webDiv = document.createElement('div');
    let descriptionDiv = document.createElement('div');
    nameDiv.textContent = '景點 ： ';
    nameDiv.setAttribute('id', 'attraction-name');
    attractionBlock.appendChild(nameDiv);
    distanceDiv.textContent = '距離住宿飯店 ： ';
    distanceDiv.setAttribute('id', 'attraction-distance');
    phoneDiv.textContent = '電話 ： ';
    phoneDiv.setAttribute('id', 'attraction-phone');
    addressDiv.textContent = '地址 ： ';
    addressDiv.setAttribute('id', 'attraction-address');
    opentmeDiv.textContent = '開放時間 ： ';
    opentmeDiv.setAttribute('id', 'attraction-opentime');
    webDiv.textContent = '網站 ： ';
    webDiv.setAttribute('id', 'attraction-web');
    descriptionDiv.textContent = '簡介 ： ';
    descriptionDiv.setAttribute('id', 'attraction-description');
    attractionBlock.appendChild(distanceDiv);
    attractionBlock.appendChild(phoneDiv);
    attractionBlock.appendChild(addressDiv);
    attractionBlock.appendChild(opentmeDiv);
    attractionBlock.appendChild(webDiv);
    attractionBlock.appendChild(descriptionDiv);
    let nameSpan = document.createElement('span');
    let distanceSpan = document.createElement('span');
    let phoneSpan = document.createElement('span');
    let addressSpan = document.createElement('span');
    let opentimeSpan = document.createElement('span');
    let webSpan = document.createElement('span');
    let descriptionSpan = document.createElement('span');
    nameSpan.textContent = data.result[0].name;
    distanceSpan.textContent = `${data.result[0].attraction_distance} KM`;
    phoneSpan.textContent = data.result[0].phone;
    addressSpan.textContent = data.result[0].address;
    opentimeSpan.textContent = data.result[0].opentime;
    webSpan.textContent = data.result[0].website;
    descriptionSpan.textContent = data.result[0].description;
    let attractionName = document.querySelector('#attraction-name');
    let attractionDistance = document.querySelector('#attraction-distance');
    let attractionPhone = document.querySelector('#attraction-phone');
    let attractionAddress = document.querySelector('#attraction-address');
    let attractionOpentime = document.querySelector('#attraction-opentime');
    let attractionWeb = document.querySelector('#attraction-web');
    let attractionDescription = document.querySelector('#attraction-description');
    attractionName.appendChild(nameSpan);
    attractionDistance.appendChild(distanceSpan);
    attractionPhone.appendChild(phoneSpan);
    attractionAddress.appendChild(addressSpan);
    attractionOpentime.appendChild(opentimeSpan);
    attractionWeb.appendChild(webSpan);
    attractionDescription.appendChild(descriptionSpan);
}
function renderHotel(data) {
  let attractionContainer = document.querySelector('.attraction-container')
  attractionContainer.innerHTML = ''
  let titleDiv = document.createElement('div');
  titleDiv.textContent = '飯店介紹';
  titleDiv.setAttribute('class', 'title');
  attractionContainer.appendChild(titleDiv);
  let contentDiv = document.createElement('div');
  contentDiv.setAttribute('class', 'hotel-content');
  attractionContainer.appendChild(contentDiv);
  let hotelContent = document.querySelector('.hotel-content');
  let imageDiv = document.createElement('div');
  imageDiv.setAttribute('class', 'hotel-image');
  hotelContent.appendChild(imageDiv);
  let hotelDiv = document.createElement('div');
  hotelDiv.setAttribute('class', 'hotel-block');
  hotelContent.appendChild(hotelDiv);
  let img = document.createElement('img');
  img.src = data.result[0].picture;
  if(data.result[0].picture === '') {
    img.src = '/pic/AdobeStock_269968323.jpeg'
  }
  let hotelImage = document.querySelector('.hotel-image');
  hotelImage.appendChild(img);
  let hotelBlock = document.querySelector('.hotel-block');
  let nameDiv = document.createElement('div');
  let phoneDiv = document.createElement('div');
  let addressDiv = document.createElement('div');
  let parkinginfoDiv = document.createElement('div');
  let descriptionDiv = document.createElement('div');
  nameDiv.textContent = '景點 ： ';
  nameDiv.setAttribute('id', 'hotel-name');
  hotelBlock.appendChild(nameDiv);
  phoneDiv.textContent = '電話 ： ';
  phoneDiv.setAttribute('id', 'hotel-phone');
  addressDiv.textContent = '地址 ： ';
  addressDiv.setAttribute('id', 'hotel-address');
  parkinginfoDiv.textContent = '停車資訊 ： ';
  parkinginfoDiv.setAttribute('id', 'hotel-opentime');
  descriptionDiv.textContent = '簡介 ： ';
  descriptionDiv.setAttribute('id', 'hotel-description');
  hotelBlock.appendChild(phoneDiv);
  hotelBlock.appendChild(addressDiv);
  hotelBlock.appendChild(parkinginfoDiv);
  hotelBlock.appendChild(descriptionDiv);
  let nameSpan = document.createElement('span');
  let phoneSpan = document.createElement('span');
  let addressSpan = document.createElement('span');
  let parkinginfoSpan = document.createElement('span');
  let descriptionSpan = document.createElement('span');
  nameSpan.textContent = data.result[0].name;
  phoneSpan.textContent = data.result[0].phone;
  addressSpan.textContent = data.result[0].address;
  parkinginfoSpan.textContent = data.result[0].parkinginfo;
  descriptionSpan.textContent = data.result[0].description;
  let hotelName = document.querySelector('#hotel-name');
  let hotelPhone = document.querySelector('#hotel-phone');
  let hotelAddress = document.querySelector('#hotel-address');
  let hotelParkinginfo = document.querySelector('#hotel-opentime');
  let hotelDescription = document.querySelector('#hotel-description');
  hotelName.appendChild(nameSpan);
  hotelPhone.appendChild(phoneSpan);
  hotelAddress.appendChild(addressSpan);
  hotelParkinginfo.appendChild(parkinginfoSpan);
  hotelDescription.appendChild(descriptionSpan);
}