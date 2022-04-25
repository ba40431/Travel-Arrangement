const express = require('express');
const multer = require('multer');


const boardAPI = express.Router();

boardAPI.get('/board', (req, res) => {  //download
  res.send('ok');
});

boardAPI.post('/board', (req, res) => { //upload
  console.log(req.body)
  let data = {
    'data': 'ok'
  }
  res.send(data,200);
});

module.exports = boardAPI;