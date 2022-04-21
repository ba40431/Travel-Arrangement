const express = require('express');

const mySchedulePage = express.Router();

mySchedulePage.get('/my-schedule', (req, res) => {
  res.render('my-schedule');
});

module.exports = mySchedulePage;
