const express = require('express');
const { attractionDetail, hotelDetail } = require('../../model/location');
const locationAPI = express.Router();

locationAPI.get('/location/:attractionId', async(req, res) => {
  const attractionId = req.params.attractionId;
  try {
    const isattractionDetail = await attractionDetail(attractionId);
    const result = isattractionDetail[0]
    if(isattractionDetail) {
      return res.status(200).json({
        result
      });
    }
  }catch (error) {
    if(error) {
      return res.status(500).json({
        error: true,
        message: '伺服器發生錯誤',
      });
    }
  }  
});

locationAPI.get('/hotel/:hotelId', async(req, res) => {
  const hotelId = req.params.hotelId;
  try {
    const ishotelDetail = await hotelDetail(hotelId);
    const result = ishotelDetail[0]
    if(ishotelDetail) {
    return res.status(200).json({
      result
    });
    }
  }catch (error) {
    if(error) {
      return res.status(500).json({
        error: true,
        message: '伺服器發生錯誤',
      });
    }
  }
});

module.exports = locationAPI;
