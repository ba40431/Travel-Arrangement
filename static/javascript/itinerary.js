const url = new URL(window.location.href)
let string = url.pathname;
let itineraryId = string.replace('/itinerary/','');

let itineraryData = null;
// let userData = null;

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
        itineraryData = await initData();
        if(itineraryData.error) {
            location.href = '/'
        }
        renderItinerary(itineraryData)
        document.body.style.display = 'block';
    }
}

function getUserData() {
    return fetch('/api/user').then((response) => {
        return response.json();
    }).then((result) => {
        return result;
    })
}

function initData() {
    return fetch(`/api/itinerary/${itineraryId}`).then((response) => {
        return response.json();
    }).then((result) => {
        return result;
    })
}

function renderItinerary(data) {
    let day1 = []
    let day2 = []
    let day3 = []
    let day4 = []
    let day5 = []
    let departureDate = `${data.result[0][0].departure_date.slice(5,7)}/${data.result[0][0].departure_date.slice(8,)}`
    let returnDate = `${data.result[0][0].return_date.slice(5,7)}/${data.result[0][0].return_date.slice(8,)}`
    let placeDate = data.result[0][0].must_to_go_place_date
    let date = ((new Date(placeDate) - new Date(data.result[0][0].departure_date)) / 86400000) + 1
    for(let i = 0; i < data.result[1].length; i++) {
        if(data.result[1][i].days === 1){
            day1.push(data.result[1][i])
        }else if(data.result[1][i].days === 2) {
            day2.push(data.result[1][i])
        }else if(data.result[1][i].days === 3) {
            day3.push(data.result[1][i])
        }else if( data.result[1][i].days === 4) {
            day4.push(data.result[1][i])
        }else {
            day5.push(data.result[1][i])
        }
    }
    let itineraryList = [day1, day2, day3, day4, day5]
    let itineraryContent = document.querySelector('.itinerary-content')
    
    //itinerary-info
    let infoDiv = document.createElement('div')
    infoDiv.setAttribute('class', 'itinerary-info')
    itineraryContent.appendChild(infoDiv)
    let itineraryInfo = document.querySelector('.itinerary-info')
    let dateDiv = document.createElement('div')
    dateDiv.textContent = '旅遊日期 ： '
    dateDiv.setAttribute('class', 'itinerary-date')
    itineraryInfo.appendChild(dateDiv)
    let dateSpan = document.createElement('span')
    let itineraryDate = document.querySelector('.itinerary-date')
    dateSpan.textContent = `${departureDate} - ${returnDate}`
    itineraryDate.appendChild(dateSpan)
    let locationDiv = document.createElement('div')
    locationDiv.textContent = '旅遊地點 ： '
    locationDiv.setAttribute('class', 'itinerary-location')
    itineraryInfo.appendChild(locationDiv)
    let locationSpan = document.createElement('span')
    locationSpan.textContent = data.result[0][0].cities
    locationDiv.appendChild(locationSpan)

    //daily-container
    let dailyContainerDiv = document.createElement('div')
    dailyContainerDiv.setAttribute('class', 'daily-container')
    itineraryContent.appendChild(dailyContainerDiv)
    for(let i = 0; i < data.result[0][0].trip_length; i++) {
        let text = ['行程一 ： ', '行程二 ： ', '行程三 ： ', '行程四 ： ', '行程五 ： ', '行程六 ： ', '行程七 ： ', '行程八 ： ']
        let dailyDiv = document.createElement('div')
        dailyDiv.setAttribute('class', 'daily')
        dailyDiv.setAttribute('id', `itinerary-${(i+1)}`)
        dailyContainerDiv.appendChild(dailyDiv)
        let dailyItinerary = document.querySelector(`#itinerary-${(i+1)}`)

        for(let j = 0; j < itineraryList[i].length; j++) {
            let div = document.createElement('div')
            div.textContent = text[j]
            div.setAttribute('id', `itinerary-${(i+1)}-${(j+1)}`)
            dailyItinerary.appendChild(div)
            let attraction = document.querySelector(`#itinerary-${(i+1)}-${(j+1)}`)
            let span = document.createElement('span')
            span.textContent = itineraryList[i][j].attraction_name
            span.setAttribute('id', `attractionId-${itineraryList[i][j].attraction_id}`)
            span.setAttribute('class', 'attraction-span')
            span.setAttribute('onclick', 'getLocation(this)')
            attraction.appendChild(span)
        }

        if(itineraryList[i][0] !== undefined) {
            if(itineraryList[i][0].hotel_name !== '') {
                let hotelDiv = document.createElement('div')
                hotelDiv.textContent = '住宿飯店 ： '
                hotelDiv.setAttribute('class', 'hotel')
                hotelDiv.setAttribute('id', `hotelId-${itineraryList[i][0].hotel_id}`)
                hotelDiv.setAttribute('onclick', 'getHotel(this)')
                dailyItinerary.appendChild(hotelDiv)
                let hotelSpan = document.createElement('span')
                let hotel = document.querySelector(`#hotelId-${itineraryList[i][0].hotel_id}`)
                hotelSpan.textContent = itineraryList[i][0].hotel_name
                hotelSpan.setAttribute('class', 'hotel-text')
                hotel.appendChild(hotelSpan)
            }else {
                continue
            }
        }
    }

    //必去景點
    if(data.result[0][0].must_to_go_place_name !== '') {
        let mustToGoDiv = document.createElement('div')
        let mustToGoDate = document.querySelector(`#itinerary-${date}`)
        mustToGoDiv.textContent = '必去景點 ： '
        mustToGoDiv.setAttribute('class', 'must-to-go-place')
        mustToGoDate.appendChild(mustToGoDiv)
        let mustToGoSpan = document.createElement('span')
        let mustToGoPlace = document.querySelector('.must-to-go-place')
        mustToGoSpan.textContent = data.result[0][0].must_to_go_place_name
        mustToGoDiv.setAttribute('id', `place-id-${data.result[0][0].must_to_go_place_id}`)
        mustToGoPlace.appendChild(mustToGoSpan)
    }



    if(data.result[0][0].prefer === '排好排滿') {
        let dailyCss = document.querySelectorAll('.daily')
        for(let j = 0; j < dailyCss.length; j++) {
            dailyCss[j].style.height = '255px'
        }
    }


}