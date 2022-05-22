const express = require('express');

const itineraryPage = express.Router();

itineraryPage.get('/itinerary/:itineraryId', (req, res) => {
  res.render('itinerary');
});

module.exports = itineraryPage;
