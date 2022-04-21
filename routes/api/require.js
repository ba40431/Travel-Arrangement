const express = require('express');

const requireAPI = express.Router();

requireAPI.get('/require', (req, res) => {
  res.send('ok');
});

module.exports = requireAPI;
