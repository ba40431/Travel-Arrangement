self.addEventListener("push", e => {
    const data = e.data.json();
    self.registration.showNotification(
        data.title, // title of the notification
        {
            body: `٩(๑❛ᴗ❛๑)۶別忘了 ${data.infoDate} 要去 ❮${data.infoCity}❯ 哦~這裡看行程👇`, //the body of the push notification
            // image: "https://pixabay.com/vectors/bell-notification-communication-1096280/",
            // icon: "https://pixabay.com/vectors/bell-notification-communication-1096280/" // icon 
        }
    );
});

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