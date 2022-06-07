let itineraryId = null

self.addEventListener('push', e => {
    const data = e.data.json();
    itineraryId = data.itineraryId
    self.registration.showNotification(
        data.title, // title of the notification
        {
            body: `٩(๑❛ᴗ❛๑)۶別忘了 ${data.infoDate} 要去 ❮${data.infoCity}❯ 哦~這裡看行程👇`, //the body of the push notification
            // image: ,
            // icon: " // icon 
        }
    );
});
self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
    //   clients.openWindow('http://localhost:3000/dashboard')
    //   clients.openWindow('https://www.travel-arrangement.website/dashboard')
    // clients.openWindow(`http://localhost:3000/itinerary/${itineraryId}`)
    clients.openWindow(`https://www.travel-arrangement.website/itinerary/${itineraryId}`)
    );
  })

// // install
// self.addEventListener('install', event => {
//     console.log('installing…');
// });

// // activate
// self.addEventListener('activate', event => {
//     console.log('now ready to handle fetches!');
// });

// // fetch
// self.addEventListener('fetch', event => {
//     console.log('now fetch!');
// });