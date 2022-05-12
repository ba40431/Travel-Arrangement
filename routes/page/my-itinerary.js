const express = require('express');

const myItineraryPage = express.Router();

myItineraryPage.get('/my-itinerary', (req, res) => {
  res.render('my-itinerary');
});

module.exports = myItineraryPage;
