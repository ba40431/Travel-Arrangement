const express = require('express');

const loaderio = express.Router();

loaderio.get('/loaderio-28938aa7012ea132b95cbc31e4fe7e87', (req, res) => {
  res.send('loaderio-28938aa7012ea132b95cbc31e4fe7e87');
});

module.exports = loaderio;
