const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const subscribeAPI = express.Router();

require('dotenv').config({path:'./.env'});

subscribeAPI.use(bodyParser.json())

//storing the keys in variables
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

//setting vapid keys details
webpush.setVapidDetails('mailto:test@test.com', publicVapidKey,privateVapidKey);

//subscribe route
subscribeAPI.post('/subscribe', (req, res)=>{
    //get push subscription object from the request
    const subscription = req.body;
  
    //send status 201 for the request
    res.status(201).json({})
  
    //create paylod: specified the detals of the push notification
    const payload = JSON.stringify({title: 'Hello Test' });
  
    //pass the object into sendNotification fucntion and catch any error
    webpush.sendNotification(subscription, payload).catch(err=> console.error(err));
})

module.exports = subscribeAPI;


// const webpush = require('web-push');

// const vapidKeys = {
//   publicKey: ,
//   privateKey: 
// };

// webpush.setVapidDetails(
//   'mailto:ba40431@yahoo.com.tw',
//   vapidKeys.publicKey,
//   vapidKeys.privateKey
// );

// let sub = {
//     endpoint:"https://fcm.googleapis.com/fcm/send/eLEqZ7VnOoA:APA91bFqKWQ4-9__WXR0ps4zrKJqkrkHRC767_eLnB2tKLsvOVctJBGqzlvD_MwaZQnIqA1INpfVWp53MZVbdZ5u4726ESTxMQDpYH2jcqvULqCmL4wRb5jMHskVb-Nufry3MaOVC8R6",
//     expirationTime:null,
//     keys:{"p256dh":"BPKz8cbGrddEDT413-9h93A2FAF0TwEhqklIXzX0XPQR-4gK36AZpjHR_CUfZRHLgBv9Icz_hZLb1GJP8XvcSJc","auth":"-RPJC9ouRO09gcIiL3Gbbw"}
// }

// webpush.sendNotification(sub, 'test message')

// const subscription = 'https://fcm.googleapis.com/fcm/send/eLEqZ7VnOoA:APA91bFqKWQ4-9__WXR0ps4zrKJqkrkHRC767_eLnB2tKLsvOVctJBGqzlvD_MwaZQnIqA1INpfVWp53MZVbdZ5u4726ESTxMQDpYH2jcqvULqCmL4wRb5jMHskVb-Nufry3MaOVC8R6'
// const dataToSend = {
//   title: 'Credit Card',
//   option: {
//     body: "Did you make a $1,000,000 purchase at Dr. Evil...",
//     actions: [
//       { "action": "yes", "title": "Yes", "icon": "images/yes.png" },
//       { "action": "no", "title": "No", "icon": "images/no.png" }
//     ]
//   }
// }

// const triggerPushMsg = function(subscription, dataToSend) {
//   return webpush.sendNotification(subscription, JSON.stringify(dataToSend))
//   .catch((err) => {
//     if (err.statusCode === 404 || err.statusCode === 410) {
//       console.log('Subscription has expired or is no longer valid: ', err);
//     } else {
//       throw err;
//     }
//   });
// };

// triggerPushMsg(subscription, dataToSend).then(data =>{
//   console.log("success:")
//   console.log(JSON.stringify(data,null,2));
// }).catch(error => {
//   console.log("fail:")
//   console.log(JSON.stringify(error,null,2));
// });