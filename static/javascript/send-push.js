const publicVapidKey = 'BPz-1dnM0gloQaa21grgCAL0kPL7eJNkdQ6AvIX-CvzvfI4vXD4BFPInTtznFPexX40NZW_spBVBQved5gBLPx0';

addEventListener('load', async () => {
  let serviceWorker = await navigator.serviceWorker.register('/javascript/service-worker.js');
  console.log(serviceWorker)
})
if('serviceWorker' in navigator){
  navigator.serviceWorker
      .register('/javascript/service-worker.js')
      .then(() =>{
          console.log('Service Worker 註冊成功');
      }).catch((error) => {
          console.log('Service worker 註冊失敗:', error);
      });
} else {
console.log('瀏覽器不支援');
}

function openNotification(e) {
  cover.style.display = 'block'
  notificationWindow.style.display = 'block'
  notificationItineraryId = e.id
}
function closeWindow() {
  cover.style.display = 'none'
  notificationWindow.style.display = 'none'
}

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

async function notificationItinerary(e) {
  let infoDate = null
  let infoCity = null
  let notificationDate = document.querySelector('.notification-date')
  let notificationTime = document.querySelector('.notification-time')
  if(notificationDate.value && notificationTime.value) {
    for(let i = 0; i < itineraryData.result.length; i++) {
      if(notificationItineraryId.slice(13,) === itineraryData.result[i][0].itinerary_id) {
        console.log(itineraryData.result[i][0].itinerary_id)
        notificationItineraryId = itineraryData.result[i][0].itinerary_id
        infoDate = `${itineraryData.result[i][0].departure_date.slice(5,7)} / ${itineraryData.result[i][0].departure_date.slice(8,)}`
        infoCity = itineraryData.result[i][0].cities
        break
      }
    }
  }else {
    return false
  }

  //register service worker
  const register = await navigator.serviceWorker.register('/javascript/service-worker.js');

  //register push
  const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,

      //public vapid key
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  const notification = {
    date: notificationDate.value,
    time: notificationTime.value
  }

 
  //Send push notification
  await fetch('api/subscribe', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({subscription, 'infoDate': infoDate, 'infoCity': infoCity, notification})
  });

  cover.style.display = 'none'
  notificationWindow.style.display = 'none'
}