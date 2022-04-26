const title = document.querySelector('#title');
const image = document.querySelector('#image');
const error_message = document.querySelector('.error-message');
const boardAPI = '/api/board'


async function submit() {
    if(title.value == '') {
        error_message.textContent = '請輸入文字'
    }else if (image.files[0] == null) {
        error_message.textContent = '請選擇圖片'
    }else {
        // let headers = {
        //     'Content-Type': 'multipart/form-data,boundary=MyBoundary',
        // }
        // let body = {
        //     'title': title.value,
        //     'image': image.files[0]
        // }
        let formData = new FormData();
        formData = {
            'title': title.value,
            'image': image.files[0]
        }
        let response = await fetch(boardAPI, {
            method: 'POST',
            // headers: headers,
            body: formData
        });
        console.log(formData)
        let result = await response.json();
        console.log(result)
    }
}