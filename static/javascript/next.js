let requireData = null;
let hotelData = null;

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
    const tripLength = data.tripLength;
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
        towns[i].addEventListener('input', handleSelect);
    }
}

function handleSelect(e) {
    let selectDay = e.target.id
    let selectTown = e.target.value;
    console.log(selectDay.slice(12,))
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
        option.value = data.result[i].name;
        option.innerHTML = data.result[i].name;
        document.querySelector(`#hotel-select-${num}`).appendChild(option);
    }
}

