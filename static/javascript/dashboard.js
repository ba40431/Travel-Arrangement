// let userData = null
let itineraryData = null;
let cover = document.querySelector('.cover');
let notificationWindow = document.querySelector('.notification-window');
let notificationItineraryId = null;
let loaderContent = document.querySelector('.loader-content');

document.body.style.display = 'none';
window.onload = () => {
  init();
};

async function init() {
  userData = await getUserData();
  if (userData.data === null) {
    location.href = '/sign-in';
  } else if (userData.error) {
    location.href = '/sign-in';
  } else {
    if (userData.data.profile !== null) {
      let profilePhoto = document.querySelector('.profile-photo > img');
      profilePhoto.src = userData.data.profile;
    }
    renderUserData(userData);
    document.body.style.display = 'block';
    itineraryData = await getItineraryData();
    // if(itineraryData.length === 0) {
    // let footer = document.querySelector('footer')
    // footer.style.width = '100%'
    // footer.style.position = 'absolute'
    // footer.style.bottom = '0'
    // }
    renderItinerary(itineraryData);
    loaderContent.style.display = 'none';
  }
}

function getUserData() {
  return fetch('api/user')
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    });
}

function getItineraryData() {
  return fetch('api/my-itinerary')
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    });
}

function renderItinerary(data) {
  // console.log(data)
  for (let i = 0; i < data.result.length; i++) {
    let departureDate = `${data.result[i].departure_date.slice(
      5,
      7
    )}/${data.result[i].departure_date.slice(8)}`;
    let returnDate = `${data.result[i].return_date.slice(5, 7)}/${data.result[
      i
    ].return_date.slice(8)}`;
    let itineraryBlock = document.querySelector('.itinerary-block');
    let contentDiv = document.createElement('div');
    // let hr = document.createElement('hr')
    contentDiv.setAttribute('class', 'itinerary-content');
    contentDiv.setAttribute('id', `itinerary-${data.result[i].itinerary_id}`);
    itineraryBlock.appendChild(contentDiv);
    // itineraryBlock.appendChild(hr)
    let infoDiv = document.createElement('div');
    infoDiv.setAttribute('class', 'itinerary-info');
    let itineraryContent = document.querySelector(
      `#itinerary-${data.result[i].itinerary_id}`
    );
    itineraryContent.appendChild(infoDiv);
    let itineraryInfo = document.querySelector(
      `#itinerary-${data.result[i].itinerary_id} > .itinerary-info`
    );
    let dateDiv = document.createElement('div');
    dateDiv.textContent = '旅遊日期 ： ';
    dateDiv.setAttribute('class', 'itinerary-date');
    itineraryInfo.appendChild(dateDiv);
    let dateSpan = document.createElement('span');
    let itineraryDate = document.querySelector(
      `#itinerary-${data.result[i].itinerary_id} > .itinerary-info >.itinerary-date`
    );
    dateSpan.textContent = `${departureDate} - ${returnDate}`;
    itineraryDate.appendChild(dateSpan);
    let locationDiv = document.createElement('div');
    locationDiv.textContent = '旅遊地點 ： ';
    locationDiv.setAttribute('class', 'itinerary-location');
    itineraryInfo.appendChild(locationDiv);
    let locationSpan = document.createElement('span');
    locationSpan.textContent = data.result[i].cities;
    locationDiv.appendChild(locationSpan);
    let mustToGoDiv = document.createElement('div');
    mustToGoDiv.textContent = '必去景點 ： ';
    mustToGoDiv.setAttribute('class', 'must-to-go-place');
    itineraryInfo.appendChild(mustToGoDiv);
    let mustToGoPlace = document.querySelector(
      `#itinerary-${data.result[i].itinerary_id} > .itinerary-info > .must-to-go-place`
    );
    let mustToGoSpan = document.createElement('span');
    if (data.result[i].must_to_go_place_name === '') {
      mustToGoPlace.style.display = 'none';
    }
    mustToGoSpan.textContent = data.result[i].must_to_go_place_name;
    mustToGoDiv.setAttribute(
      'id',
      `place-id-${data.result[i].must_to_go_place_id}`
    );
    mustToGoPlace.appendChild(mustToGoSpan);
    let ownerDiv = document.createElement('div');
    ownerDiv.setAttribute('class', 'owner-text');
    ownerDiv.textContent = `${data.result[i].name}`;
    itineraryInfo.appendChild(ownerDiv);
    let imgA = document.createElement('a');
    imgA.href = `/itinerary/${data.result[i].itinerary_id}`;
    imgA.setAttribute('id', `getItinerary-${data.result[i].itinerary_id}`);
    imgA.setAttribute('class', 'more-button');
    itineraryInfo.appendChild(imgA);
    let moreImg = document.createElement('img');
    moreImg.src = 'pic/icons8-double-right-48.png';
    let moreButton = document.querySelector(
      `#getItinerary-${data.result[i].itinerary_id}`
    );
    moreButton.appendChild(moreImg);
    let notificationSpan = document.createElement('span');
    notificationSpan.setAttribute(
      'id',
      `notification-${data.result[i].itinerary_id}`
    );
    notificationSpan.setAttribute('class', 'notification-button');
    notificationSpan.setAttribute('onclick', 'openNotification(this)');
    itineraryInfo.appendChild(notificationSpan);
    let notificationButton = document.querySelector(
      `#notification-${data.result[i].itinerary_id}`
    );
    let notificationImg = document.createElement('img');
    notificationImg.src = 'pic/icons8-alarm-64.png';
    notificationButton.appendChild(notificationImg);
    let deleteSpan = document.createElement('span');
    deleteSpan.setAttribute('id', `delete-${data.result[i].itinerary_id}`);
    deleteSpan.setAttribute('class', 'delete-button');
    deleteSpan.setAttribute('onclick', 'deleteItinerary(this)');
    itineraryInfo.appendChild(deleteSpan);
    let deleteButton = document.querySelector(
      `#delete-${data.result[i].itinerary_id}`
    );
    let deleteImg = document.createElement('img');
    deleteImg.src = 'pic/icons8-trash-64.png';
    deleteButton.appendChild(deleteImg);
  }
}

function deleteItinerary(e) {
  fetch(`api/itinerary/${e.id.slice(7)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      itineraryId: e.id.slice(7),
      userEmail: userData.data.email,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      // console.log(result)
      if (result.ok) {
        window.location.replace(location.href);
      }
    });
}

function renderUserData(data) {
  let nameText = document.querySelector('#name-text');
  nameText.innerHTML = data.data.name;
  let emailText = document.querySelector('#email-text');
  emailText.innerHTML = data.data.email;
  if (data.data.profile !== null) {
    let userPhoto = document.querySelector('.user-photo > img');
    userPhoto.src = data.data.profile;
  }
}

let update = document
  .querySelector('#update-photo')
  .addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    //檔案上傳
    let formData = new FormData();
    formData.append('title', userData.data.id);
    formData.append('image', e.target.files[0]);

    fetch('api/dashboard', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        // console.log(result)
        if (result.ok) {
          window.location.replace(location.href);
        }
      });

    // 上傳後將檔案清除
    // e.target.value = '';
  });
