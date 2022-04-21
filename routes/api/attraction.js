const express = require('express');

const attractionAPI = express.Router();

attractionAPI.get('/attraction', (req, res) => {
  res.send('ok');
});

module.exports = attractionAPI;
