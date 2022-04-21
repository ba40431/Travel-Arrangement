const express = require('express');

const scheduleAPI = express.Router();

scheduleAPI.get('/schedule', (req, res) => {
  res.send('ok');
});

module.exports = scheduleAPI;
