const express = require('express');

const userAPI = express.Router();

userAPI.get('/user', (req, res) => {
  res.send('ok');
});

module.exports = userAPI;
