const express = require('express');
const { attractionDetail, hotelDetail } = require('../../model/location');
const locationAPI = express.Router();

locationAPI.get('/location/:attractionId', (req, res) => {
  const attractionId = req.params.attractionId
  attractionDetail(attractionId, async (err, result) => {
    if(err) {
    console.log(err)
    return res.status(500).json({
        'error': true,
        'message': '伺服器發生錯誤'
    })
    }
    res.status(200).json({
        result
    })
  })
});

locationAPI.get('/hotel/:hotelId', (req, res) => {
  const hotelId = req.params.hotelId
  hotelDetail(hotelId, async (err, result) => {
    if(err) {
    console.log(err)
    return res.status(500).json({
        'error': true,
        'message': '伺服器發生錯誤'
    })
    }
    res.status(200).json({
        result
    })
  })
});

module.exports = locationAPI;
