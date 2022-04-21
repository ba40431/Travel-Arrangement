const express = require('express');

const indexPage = express.Router();

indexPage.get('/', (req, res) => {
  res.render('index');
});

module.exports = indexPage;
