const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const subscribeAPI = express.Router();

require('dotenv').config({ path: './.env' });

subscribeAPI.use(bodyParser.json());

//storing the keys in variables
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

//setting vapid keys details
webpush.setVapidDetails(
  'mailto:ba40431@gmail.com',
  publicVapidKey,
  privateVapidKey
);

//subscribe route
subscribeAPI.post('/subscribe', (req, res) => {
  const year = req.body.notification.date.slice(0, 4);
  const month = req.body.notification.date.slice(5, 7);
  const day = req.body.notification.date.slice(8);
  const hour = req.body.notification.time.slice(0, 2);
  const minute = req.body.notification.time.slice(3);
  const date = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    0
  );
  console.log(date, new Date());

  //get push subscription object from the request
  // console.log(req.body)
  const subscription = req.body.subscription;

  //send status 201 for the request
  res.status(201).json({});

  //create paylod: specified the detals of the push notification
  const payload = JSON.stringify({
    title: 'Travel-Arrangement',
    infoDate: `${req.body.infoDate}`,
    infoCity: `${req.body.infoCity}`,
    itineraryId: req.body.notification.itineraryId,
  });

  const job = schedule.scheduleJob(date, () => {
    console.log('push notification');
    //pass the object into sendNotification function and catch any error
    webpush
      .sendNotification(subscription, payload)
      .catch((err) => console.error(err));
  });
});

module.exports = subscribeAPI;
