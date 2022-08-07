const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { checkTown, searchHotel } = require('../../model/require');
require('dotenv').config({ path: './.env' });

const requireAPI = express.Router();

// let departureDate = null;
// let returnDate = null;
let checkedCities = null;
let cityData = null;

requireAPI.use(cookieParser());

//POST router
requireAPI.post('/require', (req, res) => {
  let departureDate = req.body.departureDate;
  let returnDate = req.body.returnDate;
  checkedCities = req.body.checkedCities;
  const payload = {
    departureDate: departureDate,
    returnDate: returnDate,
    // checkedCities: checkedCities
  };
  // console.log(payload)
  const token = jwt.sign(
    { payload, exp: Math.floor(Date.now() / 1000) + 60 * 10 },
    process.env.JWT_SECRET_KEY
  ); //exp 10分鐘
  if (departureDate === '' || returnDate === '') {
    res.status(400).json({
      error: true,
      message: '請輸入出發和回程日期',
    });
  } else if (checkedCities[0] === undefined) {
    res.status(400).json({
      error: true,
      message: '請至少選擇一個縣市',
    });
  } else if (departureDate > returnDate) {
    res.status(400).json({
      error: true,
      message: '回程日期須大於出發日期',
    });
  } else {
    res.cookie('require', token, { maxAge: 900000, httpOnly: true });
    res.status(200).json({
      ok: true,
    });
  }
});

//GET router
requireAPI.get('/require', async (req, res) => {
  let token = req.cookies.require;
  let departureDate = null;
  let returnDate = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      departureDate = decoded.payload.departureDate;
      returnDate = decoded.payload.returnDate;
    } catch {
      return res.status(500).json({
        error: true,
        message: '伺服器發生錯誤',
      });
    }
  }
  try {
    const checkedTown = await checkTown(
      checkedCities[0],
      checkedCities[1],
      checkedCities[2]);

      // async (err, result) => {
      //   if (err) {
      //     console.log(err);
      //     return res.status(500).json({
      //       error: true,
      //       message: '伺服器發生錯誤',
      //     });
      //   }
      
      if(checkedTown) {
        //取得縣市區域
        cityData = result;
        let regionList1 = [];
        let regionList2 = [];
        let regionList3 = [];
        for (let i = 0; i < cityData.length; i++) {
          if (
            checkedCities[0] !== undefined &&
            checkedCities[0] === cityData[i].region
          ) {
            let town = `${cityData[i].town}`;
            regionList1.push(town);
          } else if (
            checkedCities[1] !== undefined &&
            checkedCities[1] === cityData[i].region
          ) {
            let town = `${cityData[i].town}`;
            regionList2.push(town);
          } else if (
            checkedCities[2] !== undefined &&
            checkedCities[2] === cityData[i].region
          ) {
            let town = `${cityData[i].town}`;
            regionList3.push(town);
          } else {
            return;
          }
        }
        let data = [
          {
            city: checkedCities[0],
            region: regionList1,
          },
          {
            city: checkedCities[1],
            region: regionList2,
          },
          {
            city: checkedCities[2],
            region: regionList3,
          },
        ];

        res.status(200).json({
          departureDate: departureDate,
          returnDate: returnDate,
          tripLength:
            Math.abs(new Date(returnDate) - new Date(departureDate)) /
            (1000 * 3600 * 24),
          checkedCities: data,
        });
      }
  } catch {
    return res.status(500).json({
      error: true,
      message: '伺服器發生錯誤',
    });
  }
});

//POST Hotels router
requireAPI.post('/hotels', async (req, res) => {
  let selectTown = req.body.selectTown;
  let townId = null;
  for (let i = 0; i < cityData.length; i++) {
    if (selectTown === cityData[i].town) {
      townId = cityData[i].zipcode;
    }
  }
  try {
    const searchedHotel = await searchHotel(townId);
    if(searchedHotel) {
      return  res.status(200).json({
        searchedHotel,
      });
    }
  }catch {
    return res.status(500).json({
      error: true,
      message: '伺服器發生錯誤',
    });
  }
  
  // searchHotel(townId, async (err, result) => {
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

module.exports = requireAPI;
