const express = require('express');
const { attractionDetail, hotelDetail } = require('../../model/location');
const locationAPI = express.Router();

locationAPI.get('/location/:attractionId', async(req, res) => {
  const attractionId = req.params.attractionId;
  try {
    const isattractionDetail = await attractionDetail(attractionId);
    if(isattractionDetail) {
      return res.status(200).json({
        isattractionDetail,
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
  // attractionDetail(attractionId, async (err, result) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).json({
  //       error: true,
  //       message: '伺服器發生錯誤',
  //     });
  //   }
  //   res.status(200).json({
  //     result,
  //   });
  // });
});

locationAPI.get('/hotel/:hotelId', async(req, res) => {
  const hotelId = req.params.hotelId;
  try {
    const ishotelDetail = await hotelDetail(hotelId);
    if(ishotelDetail) {
    return res.status(200).json({
      ishotelDetail,
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
  // hotelDetail(hotelId, async (err, result) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).json({
  //       error: true,
  //       message: '伺服器發生錯誤',
  //     });
  //   }
  //   res.status(200).json({
  //     result,
  //   });
  // });
});

module.exports = locationAPI;
