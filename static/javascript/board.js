const title = document.querySelector('#title');
const image = document.querySelector('#image');
const error_message = document.querySelector('.error-message');
const boardAPI = '/api/board'


init()

async function init() {
    let response = await fetch(boardAPI);
    let result = await response.json();
    render(result)
}
function render(data) {
    for(let i=0; i<data.length; i++){
        const img = document.createElement('img');
        const div = document.createElement('div');
        const title_div = document.createElement('div');
        const hr = document.createElement('hr');
        const board_block = document.querySelector('.board-block');
        let title = data[i].title;
        let imageUrl = data[i].image_url;
        board_block.prepend(div);
        div.setAttribute('id', 'item-'+ i);
        let item = document.getElementById('item-'+ i);
        title_div.textContent = title;
        img.src = imageUrl;
        item.appendChild(title_div);
        item.appendChild(img);
        item.appendChild(hr);
        img.setAttribute('class', 'image');
    }
}

async function submit() {
    if(title.value == '') {
        error_message.textContent = '請輸入文字';
    }else if (image.files[0] == null) {
        error_message.textContent = '請選擇圖片';
    }else {
        let formData = new FormData();
        formData.append('title', title.value);
        formData.append('image', image.files[0]);
        let response = await fetch(boardAPI, {
            method: 'POST',
            body: formData
        });
        let result = await response.json();
        if(result.data == 'ok') {
            window.location.replace(location.href)
        }
        console.log(result);
    }
}