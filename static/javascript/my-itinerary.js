// let userData = null
let itineraryData = null
let cover = document.querySelector('.cover')
let alarmWindow = document.querySelector('.alarm-window')
let alarmItineraryId = null

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
      itineraryData = await getItineraryData()
      if(itineraryData.length === 0) {
        // let footer = document.querySelector('footer')
        // footer.style.width = '100%'
        // footer.style.position = 'absolute'
        // footer.style.bottom = '0'
      }
      renderItinerary(itineraryData)
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

function getItineraryData() {
  return fetch('api/my-itinerary').then((response) => {
      return response.json();
  }).then((result) => {
      return result;
  })
}

function renderItinerary(data) {
  for(let i = 0; i < data.result.length; i++) {
    let departureDate = `${data.result[i][0].departure_date.slice(5,7)}/${data.result[i][0].departure_date.slice(8,)}`
    let returnDate = `${data.result[i][0].return_date.slice(5,7)}/${data.result[i][0].return_date.slice(8,)}`
    let itineraryContainer = document.querySelector('.itinerary-container')
    let contentDiv = document.createElement('div')
    let hr = document.createElement('hr')
    contentDiv.setAttribute('class', 'itinerary-content')
    contentDiv.setAttribute('id', `itinerary-${data.result[i][0].itinerary_id}`)
    itineraryContainer.appendChild(contentDiv)
    itineraryContainer.appendChild(hr)
    let infoDiv = document.createElement('div')
    infoDiv.setAttribute('class', 'itinerary-info')
    let itineraryContent = document.querySelector(`#itinerary-${data.result[i][0].itinerary_id}`)
    itineraryContent.appendChild(infoDiv)
    let itineraryInfo = document.querySelector(`#itinerary-${data.result[i][0].itinerary_id} > .itinerary-info`)
    let dateDiv = document.createElement('div')
    dateDiv.textContent = '旅遊日期 ： '
    dateDiv.setAttribute('class', 'itinerary-date')
    itineraryInfo.appendChild(dateDiv)
    let dateSpan = document.createElement('span')
    let itineraryDate = document.querySelector(`#itinerary-${data.result[i][0].itinerary_id} > .itinerary-info >.itinerary-date`)
    dateSpan.textContent = `${departureDate} - ${returnDate}`
    itineraryDate.appendChild(dateSpan)
    let locationDiv = document.createElement('div')
    locationDiv.textContent = '旅遊地點 ： '
    locationDiv.setAttribute('class', 'itinerary-location')
    itineraryInfo.appendChild(locationDiv)
    let locationSpan = document.createElement('span')
    locationSpan.textContent = data.result[i][0].cities
    locationDiv.appendChild(locationSpan)
    let mustToGoDiv = document.createElement('div')
    mustToGoDiv.textContent = '必去景點 ： '
    mustToGoDiv.setAttribute('class', 'must-to-go-place')
    itineraryInfo.appendChild(mustToGoDiv)
    let mustToGoPlace = document.querySelector(`#itinerary-${data.result[i][0].itinerary_id} > .itinerary-info > .must-to-go-place`)
    let mustToGoSpan = document.createElement('span')
    if(data.result[i][0].must_to_go_place_name === '') {
        mustToGoPlace.style.display = 'none'
    }
    mustToGoSpan.textContent = data.result[i][0].must_to_go_place_name
    mustToGoDiv.setAttribute('id', `place-id-${data.result[i][0].must_to_go_place_id}`)
    mustToGoPlace.appendChild(mustToGoSpan)
    let imgA = document.createElement('a')
    imgA.href = `/itinerary/${data.result[i][0].itinerary_id}`
    imgA.setAttribute('id', `getItinerary-${data.result[i][0].itinerary_id}`)
    imgA.setAttribute('class', 'more-button')
    itineraryInfo.appendChild(imgA)
    let moreImg = document.createElement('img')
    moreImg.src = 'pic/icons8-double-right-48.png'
    let moreButton = document.querySelector(`#getItinerary-${data.result[i][0].itinerary_id}`)
    moreButton.appendChild(moreImg)
    let alarmSpan = document.createElement('span')
    alarmSpan.setAttribute('id', `alarm-${data.result[i][0].itinerary_id}`)
    alarmSpan.setAttribute('class', 'alarm-button')
    alarmSpan.setAttribute('onclick', 'openAlarm(this)')
    itineraryInfo.appendChild(alarmSpan)
    let alarmButton = document.querySelector(`#alarm-${data.result[i][0].itinerary_id}`)
    let alarmImg = document.createElement('img')
    alarmImg.src = 'pic/icons8-alarm-64.png'
    alarmButton.appendChild(alarmImg)
    let deleteSpan = document.createElement('span')
    deleteSpan.setAttribute('id', `delete-${data.result[i][0].itinerary_id}`)
    deleteSpan.setAttribute('class', 'delete-button')
    deleteSpan.setAttribute('onclick', 'deleteItinerary(this)')
    itineraryInfo.appendChild(deleteSpan)
    let deleteButton = document.querySelector(`#delete-${data.result[i][0].itinerary_id}`)
    let deleteImg = document.createElement('img')
    deleteImg.src = 'pic/icons8-trash-64.png'
    deleteButton.appendChild(deleteImg)
  }
}

function deleteItinerary(e) {
  fetch(`api/itinerary/${e.id.slice(7,)}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  }).then((response) => {
      return response.json();
  }).then((result) => {
      console.log(result)
      if(result.ok) {
        window.location.replace(location.href)
      }
  })
}

function openAlarm(e) {
  cover.style.display = 'block'
  alarmWindow.style.display = 'block'
  alarmItineraryId = e.id
}
function closeWindow() {
  cover.style.display = 'none'
  alarmWindow.style.display = 'none'
}
