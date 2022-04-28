const express = require('express');

const boardPage = express.Router();

boardPage.get('/board', (req, res) => {
  res.render('board');
});

module.exports = boardPage;