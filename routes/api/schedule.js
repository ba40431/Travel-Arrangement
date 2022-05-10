const express = require('express');

const scheduleAPI = express.Router();

scheduleAPI.post('/schedule', (req, res) => {
  res.send('ok');
});

module.exports = scheduleAPI;
