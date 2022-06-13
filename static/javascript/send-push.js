const notificationDate = document.querySelector('.notification-date');
const notificationTime = document.querySelector('.notification-time');
const today = new Date(+new Date() + 8 * 3600 * 1000); // 加入相差八小時
notificationDate.setAttribute('min', today.toISOString().split('T')[0]); 

const publicVapidKey =
  'BPz-1dnM0gloQaa21grgCAL0kPL7eJNkdQ6AvIX-CvzvfI4vXD4BFPInTtznFPexX40NZW_spBVBQved5gBLPx0';

addEventListener('load', async () => {
  let serviceWorker = await navigator.serviceWorker.register(
    '/javascript/service-worker.js'
  );
  // console.log(serviceWorker)
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/javascript/service-worker.js')
    .then(() => {
      console.log('Service Worker 註冊成功');
    })
    .catch((error) => {
      console.log('Service worker 註冊失敗:', error);
    });
} else {
  console.log('瀏覽器不支援');
}

function openNotification(e) {
  cover.style.display = 'block';
  notificationWindow.style.display = 'block';
  notificationItineraryId = e.id;
}
function closeWindow() {
  cover.style.display = 'none';
  notificationWindow.style.display = 'none';
  // let notificationDate = document.querySelector('.notification-date');
  // let notificationTime = document.querySelector('.notification-time');
  notificationDate.value = '';
  notificationTime.value = ''
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function notificationItinerary(e) {
  // console.log(itineraryData.result);
  let infoDate = null;
  let infoCity = null;
  // let notificationDate = document.querySelector('.notification-date');
  // let notificationTime = document.querySelector('.notification-time');
  if (notificationDate.value && notificationTime.value) {
    for (let i = 0; i < itineraryData.result.length; i++) {
      if (
        notificationItineraryId.slice(13) ===
        itineraryData.result[i].itinerary_id
      ) {
        // console.log(itineraryData.result[i][0].itinerary_id)
        notificationItineraryId = itineraryData.result[i].itinerary_id;
        infoDate = `${itineraryData.result[i].departure_date.slice(
          5,
          7
        )} / ${itineraryData.result[i].departure_date.slice(8)}`;
        infoCity = itineraryData.result[i].cities;
        break;
      }
    }
  } else {
    return false;
  }

  //register service worker
  const register = await navigator.serviceWorker.register(
    '/javascript/service-worker.js'
  );

  //register push
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,

    //public vapid key
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  let subDate = new Date(
    `${notificationDate.value} ${notificationTime.value}:00`
  );
  const notification = {
    date: subDate.toISOString().slice(0, 10),
    time: subDate.toISOString().slice(11, 16),
    itineraryId: notificationItineraryId,
  };
  // const notification = {
  //   date: notificationDate.value,
  //   time: notificationTime.value,
  //   itineraryId: notificationItineraryId
  // }
  // console.log(subDate.toISOString().slice(0,10))
  // console.log(subDate.toISOString().slice(11,16))

  //Send push notification
  await fetch('api/subscribe', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      subscription,
      infoDate: infoDate,
      infoCity: infoCity,
      notification,
    }),
  });

  cover.style.display = 'none';
  notificationWindow.style.display = 'none';
  notificationDate.value = '';
  notificationTime.value = ''
}
