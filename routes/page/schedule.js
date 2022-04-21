const express = require('express');

const schedulePage = express.Router();

schedulePage.get('/schedule', (req, res) => {
  res.render('schedule');
});

module.exports = schedulePage;
