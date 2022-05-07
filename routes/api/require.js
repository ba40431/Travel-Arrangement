const express = require('express');
const { checkTown } = require('../../model/require');
const requireAPI = express.Router();

let departureDate = null;
let returnDate = null;
let checkedCities = null;

//POST router
requireAPI.post('/require', (req, res) => {
  departureDate = req.body.departureDate;
  returnDate = req.body.returnDate;
  checkedCities = req.body.checkedCities;
  if(departureDate === '' || returnDate === '') {
    res.status(400).json({
      'error': true,
      'message': '請輸入出發和回程日期'
    })
  }else if(checkedCities[0] === undefined) {
    res.status(400).json({
      'error': true,
      'message': '請至少選擇一個縣市'
    })
  }else if(departureDate > returnDate) {
    res.status(400).json({
      'error': true,
      'message': '回程日期須大於出發日期'
    })
  }else {
    res.status(200).json({
      'ok': true,
    })
  }
});

//GET router
requireAPI.get('/require', async (req, res) => {
  checkTown(checkedCities[0], checkedCities[1], checkedCities[2], async (err, result) => {
    if(err) {
      console.log(err)
      return res.status(500).json({
        'error': true,
        'message': '伺服器發生錯誤'
      })
    }

    //取得縣市區域
    let regionList_1 = [];
    let regionList_2 = [];
    let regionList_3 = [];
    for(let i = 0; i < result.length; i++) {
      if(checkedCities[0] !== undefined && checkedCities[0] === result[i].region) {
        let town = result[i].town;
        regionList_1.push(town);
      }else if(checkedCities[1] !== undefined && checkedCities[1] === result[i].region) {
        let town = result[i].town;
        regionList_2.push(town);
      }else if(checkedCities[2] !== undefined && checkedCities[2] === result[i].region) {
        let town = result[i].town;
        regionList_3.push(town)
      }else {
        return
      }
    }
    let data = [{
        'city': checkedCities[0],
        'region': regionList_1
      },{
        'city': checkedCities[1],
        'region': regionList_2
      },{
        'city': checkedCities[2],
        'region': regionList_3
      }]


    res.status(200).json({
      'departureDate':departureDate,
      'returnDate': returnDate,
      'tripLength': Math.abs(new Date(returnDate)-new Date(departureDate))/(1000 * 3600 * 24), 
      'checkedCities': data
    })
  });
})

//GET :town router
requireAPI.get('/require/:town', (req, res) => {
  res.status(200).json({

  })
})

module.exports = requireAPI;
