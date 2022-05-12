const warningText = document.querySelector('.warning-text');
let requireData = null;
let hotelData = null;
let tripLength = null;

window.onload = () => {
    init();
}


async function init() {
    document.body.style.display = 'none';
    requireData = await initData();
    console.log(requireData);
    renderCityInput(requireData);
    document.body.style.display = 'block';
    selectTowns()
}

function initData() {
    return fetch('api/require').then((response) => {
        return response.json();
    }).then((result) => {
        return result;
    })
}

function renderCityInput(data) {
    const hotelBlock = document.querySelector('.hotel-block');
    const departureDate = data.departureDate;
    tripLength = data.tripLength;
    for(let i = 0; i < tripLength; i++) {
        //取得住宿日期
        const div = document.createElement('div');
        let date = new Date(departureDate);
        date = date.setDate(date.getDate() + i);
        date = new Date(date);
        div.textContent = date.toLocaleDateString().slice(5,);
        hotelBlock.appendChild(div);
        div.setAttribute('id', `city-${i}`);

        //取得縣市區域
        let selectRegion = document.querySelector(`#city-${i}`);
        const selectCity = document.createElement('select');
        const selectHotel = document.createElement('select');
        selectCity.setAttribute('class', 'city-select');
        selectCity.setAttribute('id', `city-select-${i}`);
        selectRegion.appendChild(selectCity);
        renderSelect(requireData, i);
        selectHotel.setAttribute('class', 'hotel-select');
        selectHotel.setAttribute('id', `hotel-select-${i}`);
        selectRegion.appendChild(selectHotel);
    }
}

//畫出下拉選單縣市
function renderSelect(data, num) {
    let checkedCitiesList = [];
    for(let i = 0; i < data.checkedCities.length; i++) {
        if(data.checkedCities[i].city === undefined) {
            break
        }
        let groupName = data.checkedCities[i].city;
        let optionName = data.checkedCities[i].region;
        checkedCitiesList.push({groupName,optionName});
    }
    
    let checkedCities = {
        'checkedCitiesList': checkedCitiesList
    }

    let index = 0;
    for (obj of checkedCities.checkedCitiesList) {
        let optgroup = document.createElement('optgroup');
        optgroup.label = obj.groupName;
        optgroup.id = `optgroupId-${num}-${index}`;
        document.querySelector(`#city-select-${num}`).appendChild(optgroup);
        for (let n = 0; n < obj.optionName.length; n++) {
            let option = document.createElement('option');
            option.value = obj.optionName[n];
            option.innerHTML = obj.optionName[n];
            document.querySelector(`#optgroupId-${num}-${index}`).appendChild(option);
        }
        index += 1; 
    }
}

//選取區域
function selectTowns() {
    let towns = document.querySelectorAll('.city-select');
    for(let i = 0; i < towns.length; i++) {
        towns[i].addEventListener('input', handleCitySelect);
    }
}

function handleCitySelect(e) {
    let selectDay = e.target.id
    let selectTown = e.target.value;
    fetch('api/hotels', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'selectTown': selectTown
        })
    }).then((response) => {
        return response.json();
    }).then((result) => {
        hotelData = result
        renderHotel(hotelData, selectDay.slice(12,))
    })
}

//畫出下拉選取縣市飯店
function renderHotel(data, num) {
    document.querySelector(`#hotel-select-${num}`).innerHTML = '';
    for(let i = 0; i < data.result.length; i++) {
        let option = document.createElement('option');
        option.id = `hotel-number-${data.result[i].id}`
        option.value = data.result[i].name;
        option.innerHTML = data.result[i].name;
        document.querySelector(`#hotel-select-${num}`).appendChild(option);
    }
}

//行程規劃按鈕
function getSchedule() {
    //取得飯店資料
    let selectHotel = document.querySelectorAll('.hotel-select'); 
    let selectHotelOption = document.querySelectorAll('.hotel-select > option'); 
    let selectHotelList = [];
    let hotelId = null;
    for(let i = 0; i < selectHotel.length; i++) {
        if(selectHotel[i].value === '') {
            break
        }
        for(let j = 0; j < selectHotelOption.length; j++) {
            if (selectHotel[i].value === selectHotelOption[j].value) {
                hotelId = selectHotelOption[j].id.slice(13,); 
                break
            }
        }
        let hotelName = selectHotel[i].value;
        selectHotelList.push({hotelId,hotelName})
    }
    //取得交通工具資料
    let selectTransport = document.querySelectorAll('.transport'); 
    let selectTransportList = [];
    for(let i = 0; i < selectTransport.length; i++) {
        if(selectTransport[i].checked) {
            selectTransportList.push(selectTransport[i].id)
        }
    }
    //取得安排偏好
    let selectPreference = document.querySelector('input[type = radio]:checked')
    //取得必去景點
    let placeName = document.querySelector('#place-name').innerHTML;
    let placeId = document.querySelector('#place-id').innerHTML;
    let placeAddress = document.querySelector('#place-address').innerHTML;

    if(selectHotelList.length !==  tripLength) {
        warningText.textContent = '請選擇住宿飯店';
    }else if(selectTransportList.length === 0) {
        warningText.textContent = '請選擇交通工具';
    }else if(selectPreference === null) {
        warningText.textContent = '請選擇行程安排偏好';
    }else if(placeId === '') {
        fetch('api/schedule', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'travelDate':{
                    'departureDate': requireData.departureDate,
                    'returnDate': requireData.returnDate,
                    'tripLength': requireData.tripLength,
                },
                'travelRequireData':{
                    'cities': requireData.checkedCities,
                    'hotelList': selectHotelList,
                    'transportList': selectTransportList,
                    'preference': selectPreference.id,
                }
            })
          }).then((response) => {
            return response.json()
          }).then((result) => {
            result.ok ? location.href = '/schedule' : warningText.textContent = '伺服器發生錯誤';
          })
    }else {
        fetch('api/schedule', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'travelDate':{
                    'departureDate': requireData.departureDate,
                    'returnDate': requireData.returnDate,
                    'tripLength': requireData.tripLength,
                },
                'travelRequireData':{
                    'cities': requireData.checkedCities,
                    'hotelList': selectHotelList,
                    'transportList': selectTransportList,
                    'preference': selectPreference.id,
                    'mustToGoPlace':{
                        'placeName': placeName,
                        'placeId': placeId,
                        'placeAddress': placeAddress
                    }
                }
            })
          }).then((response) => {
            return response.json()
          }).then((result) => {
            result.ok ? location.href = '/schedule' : warningText.textContent = '伺服器發生錯誤';
          })
    }
}