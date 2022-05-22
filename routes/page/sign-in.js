const express = require('express');

const signInPage = express.Router();

signInPage.get('/sign-in', (req, res) => {
  res.render('sign-in');
});

module.exports = signInPage;