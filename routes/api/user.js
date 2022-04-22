const express = require('express');
const bodyParser = require('body-parser')
const userAPI = express.Router();

userAPI.use(bodyParser.json())

userAPI.get('/user', (req, res) => {
  if(JSON.stringify(req.body.data===null)) {throw 'error'};
  let data = {
    // 'id':
    // 'name': 
    // 'email':
  };
  res.send(JSON.stringify(data));
});
userAPI.post('/user', (req, res, next) => {
  res.status(200);
  let data = {
    
  };
  res.send(JSON.stringify(data));
});

module.exports = userAPI;
