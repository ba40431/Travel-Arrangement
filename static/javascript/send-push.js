const publicVapidKey = 'BPz-1dnM0gloQaa21grgCAL0kPL7eJNkdQ6AvIX-CvzvfI4vXD4BFPInTtznFPexX40NZW_spBVBQved5gBLPx0';

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
} 

//check if the serveice worker can work in the current browser
if('serviceWorker' in navigator){
  send().catch(err => console.error(err));
}

async function send(){
  //register service worker
  const register = await navigator.serviceWorker.register('/javascript/service-worker.js');

  //register push
  const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,

      //public vapid key
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
 
  //Send push notification
  await fetch('api/subscribe', {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
          "content-type": "application/json"
      }
  });
}

// addEventListener('load', async () => {
//   let serviceWorker = await navigator.serviceWorker.register('/javascript/service-worker.js');
//   console.log(serviceWorker)
// })
// if('serviceWorker' in navigator){
//   navigator.serviceWorker
//       .register('/javascript/service-worker.js')
//       .then(() =>{
//           console.log('Service Worker 註冊成功');
//       }).catch((error) => {
//           console.log('Service worker 註冊失敗:', error);
//       });
// } else {
// console.log('瀏覽器不支援');
// }


// async function alarmItinerary(e) {
//   let serviceWorker = await navigator.serviceWorker.ready;
//   let push = await serviceWorker.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: ''
//   })
//   console.log(JSON.stringify(push))
  // let infoDate = null
  // let infoCity = null
  // let alarmDate = document.querySelector('.alarm-date')
  // let alarmTime = document.querySelector('.alarm-time')
  // if(alarmDate.value && alarmTime.value) {

  // }else {
  //   return false
  // }
  // for(let i = 0; i < itineraryData.result.length; i++) {
  //   if(alarmItineraryId.slice(6,) === itineraryData.result[i][0].itinerary_id) {
  //     console.log(itineraryData.result[i][0].itinerary_id)
  //     alarmItineraryId = itineraryData.result[i][0].itinerary_id
  //     infoDate = `${itineraryData.result[i][0].departure_date.slice(5,7)} / ${itineraryData.result[i][0].departure_date.slice(8,)}`
  //     infoCity = itineraryData.result[i][0].cities
  //     break
  //   }
  // }
  // let notifyConfig = {
  //   body: `提醒你別忘了 ${infoDate} 要去<${infoCity}>的旅程~ 這裡查看行程!👇`, // 設定內容
  //   icon: '/images/favicon.ico', // 設定 icon
  // };

  // // Let's check if the browser supports notifications
  // if (!("Notification" in window)) {
  //   alert("This browser does not support desktop notification");
  // }

  // // Let's check whether notification permissions have already been granted
  // else if (Notification.permission === "granted") {
  //   // If it's okay let's create a notification
  //   let notification = new Notification('Travel-Arrangement', notifyConfig);
  //   notification.onclick = (e) => { // 綁定點擊事件
  //     e.preventDefault(); // prevent the browser from focusing the Notification's tab
  //     window.open('https://travel-arrangement.website/'); // 打開特定網頁
  //   }
  // }
  // // Otherwise, we need to ask the user for permission
  // else if (Notification.permission !== "denied") {
  //   Notification.requestPermission().then(function (permission) {
  //     // If the user accepts, let's create a notification
  //     if (permission === "granted") {
  //       console.log(alarmItineraryId.slice(6,))
  //       let notification = new Notification('Travel-Arrangement', notifyConfig);
  //       notification.onclick = (e) => { // 綁定點擊事件
  //         e.preventDefault(); // prevent the browser from focusing the Notification's tab
  //         window.open('https://travel-arrangement.website/'); // 打開特定網頁
  //       }
  //     }
  //   });
  // }
// }

// function urlBase64ToUint8Array(base64String) {
//   let padding = '='.repeat((4 - base64String.length % 4) % 4);
//   let base64 = (base64String + padding)
//       .replace(/\-/g, '+')
//       .replace(/_/g, '/');

//   let rawData = window.atob(base64);
//   let outputArray = new Uint8Array(rawData.length);

//   for (let i = 0; i < rawData.length; ++i) {
//       outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

// const publicKey = '';
// const subscribeOptions = {
//   userVisibleOnly: true,
//   applicationServerKey: urlBase64ToUint8Array(publicKey)
// };

// function subscribeUserToPush() {
//   return navigator.serviceWorker.register('/javascript/service-worker.js')
//   .then(function(registration) {
//     registration.showNotification('test');
//     return registration.pushManager.subscribe(subscribeOptions);
//   })
//   .then(function(pushSubscription) {
//     console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
//     return pushSubscription;
//   });
// }

// if (Notification && Notification.permission !== "granted") {
//   Notification.requestPermission(function (status) {
//     if (Notification.permission !== status) {
//       Notification.permission = status;
//     }
//   });
// }

// const pushSubscription = subscribeUserToPush();