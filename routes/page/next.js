const express = require('express');

const nextPage = express.Router();

nextPage.get('/next', (req, res) => {
  res.render('next');
});

module.exports = nextPage;
