const express = require('express');

const dashboardPage = express.Router();

dashboardPage.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

module.exports = dashboardPage;
