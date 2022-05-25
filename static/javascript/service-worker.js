self.addEventListener("push", e => {
    const data = e.data.json();
    self.registration.showNotification(
        data.title, // title of the notification
        {
            body: "Push notification from section.io", //the body of the push notification
            image: "https://pixabay.com/vectors/bell-notification-communication-1096280/",
            icon: "https://pixabay.com/vectors/bell-notification-communication-1096280/" // icon 
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

// self.addEventListener('push', (event) => {
//     const data = event.data.json();
//     const promiseChain = self.registration.showNotification(data.title, data.option).then(()=>{
//       console.log('push success');
//     }).catch(() => {
//       console.log('push fail');
//     });
//     event.waitUntil(promiseChain);
//   });

// const page = 'http://localhost:3000';

// self.addEventListener('push', function(event) {
// const data = event.data.json();
// const promiseChain = self.registration.showNotification(data.title, data.option).then(()=>{
//     console.log('push success');
// }).catch(() => {
//     console.log('push fail');
// });
// event.waitUntil(promiseChain);
// });

// self.addEventListener('notificationclick', function(event) {
// if (event.action) {
//     console.log(`Action clicked: '${event.action}'`);
// }else{
//     console.log('Notification Click.');
// }

// const promiseChain = clients.openWindow(page);
// event.waitUntil(promiseChain);

// });

// self.addEventListener('notificationclose', function(event) {
// console.log('Notification Close.');

// const promiseChain = clients.openWindow(page);
// event.waitUntil(promiseChain);
// });

// self.addEventListener('push', function(e) {
//     var options = {
//       body: 'This notification was generated from a push!',
//       icon: 'images/example.png',
//       vibrate: [100, 50, 100],
//       data: {
//         dateOfArrival: Date.now(),
//         primaryKey: '2'
//       },
//       actions: [
//         {action: 'explore', title: 'Explore this new world',
//           icon: 'images/checkmark.png'},
//         {action: 'close', title: 'Close',
//           icon: 'images/xmark.png'},
//       ]
//     };
//     e.waitUntil(
//       self.registration.showNotification('Hello world!', options)
//     );
//   });