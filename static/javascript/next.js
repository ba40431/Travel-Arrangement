let requireData = null;


init()


async function init() {
    document.body.style.display = 'none';
    requireData = await initData();
    console.log(requireData);
    renderCityInput(requireData);
    document.body.style.display = 'block';
}
function initData() {
    return fetch('api/require').then((response) => {
        return response.json();
    }).then((result) => {
        return result;
    })
}

function renderCityInput(data) {
    const hotel_block = document.querySelector('.hotel-block');
    const departureDate = data.departureDate;
    const tripLength = data.tripLength;
    for(let i = 0; i < tripLength; i++) {
        //取得住宿日期
        const div = document.createElement('div');
        let date = new Date(departureDate);
        date = date.setDate(date.getDate() + i);
        date = new Date(date);
        div.textContent = date.toLocaleDateString().slice(5,);
        hotel_block.appendChild(div);
        div.setAttribute('id', `city-${i}`);

        //取得縣市區域
        let regionSelect = document.querySelector(`#city-${i}`);
        const select = document.createElement('select');
        select.setAttribute('class', 'city-select');
        select.setAttribute('id', `city-select-${i}`);
        regionSelect.appendChild(select);
        renderSelect(requireData, i)
    }
}

function renderSelect(data, num) {
    let checkedCitiesList = [];
    for(let i = 0; i < data.checkedCities.length; i++) {
        if(data.checkedCities[i].city == undefined) {
            break
        }
        let groupName = data.checkedCities[i].city;
        let optionName = data.checkedCities[i].region;
        checkedCitiesList.push({groupName,optionName});
    }
    
    let checkedCities = {
        'checkedCitiesList': checkedCitiesList
    }
    console.log(checkedCities)

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

