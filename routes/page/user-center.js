const express = require('express');

const userCenterPage = express.Router();

userCenterPage.get('/user-center', (req, res) => {
  res.render('user-center');
});

module.exports = userCenterPage;
