const axios = require('axios').default;
const express = require('express');
require('dotenv').config({path:'./.env'});

const itineraryAPI = express.Router();
const { getHotelData, searchAttraction } = require('../../model/itinerary');


itineraryAPI.post('/itinerary', (req, res) => {
  // console.log(req.body)
  let departureDate = req.body.travelDate.departureDate;
  let returnDate = req.body.travelDate.returnDate;
  let tripLength = req.body.travelDate.tripLength;
  let cityData = req.body.travelRequireData.cities;
  let hotelData = req.body.travelRequireData.hotelList;
  let transportData = req.body.travelRequireData.transportList;
  let preference = req.body.travelRequireData.preference;

  //取得縣市
  let cities = []
  for(let i = 0; i < cityData.length; i++){
    if(cityData[i].city === undefined) {
      break
    }
    cities.push(cityData[i].city);
  }

  //後端驗證
  if(departureDate === null || returnDate === null || cityData === null || tripLength === null) {
    res.status(400).json({
      'error': true,
      'message': '查無旅遊日期或地點'
    })
  }else if(hotelData.length !== tripLength) {
    res.status(400).json({
      'error': true,
      'message': '請選擇住宿飯店'
    })
  }else if(transportData.length === 0) {
    res.status(400).json({
      'error': true,
      'message': '請選擇交通工具'
    })
  }else if(preference === null) {
    res.status(400).json({
      'error': true,
      'message': '請選擇行程安排偏好'
    })
  }else{
    //如果有必去景點資料
    if(req.body.travelRequireData.mustToGoPlace) {
      let mustToGoPlace = req.body.travelRequireData.mustToGoPlace;
      let placeName = req.body.travelRequireData.mustToGoPlace.placeName;
      let placeId = req.body.travelRequireData.mustToGoPlace. placeId;
      let placeAddress = req.body.travelRequireData.mustToGoPlace.placeAddress;
      // let detailsAPI = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=zh-TW&key=${process.env.GOOGLE_API_KEY}`;
      axios.get(detailsAPI)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      // .then(( ) => {
      //   // always executed
      // });
      res.status(200).json({
        'ok': true,
      })
    }else{
      //如果沒有必去景點資料
      getHotelData(hotelData, async (err, result) => {
          if(err) {
            console.log(err)
            return res.status(500).json({
              'error': true,
              'message': '伺服器發生錯誤'
            })
          }
          let hotelDataList = result

          //確認使用的交通工具
          if(transportData[0] === '開車') {
            searchAttraction(hotelDataList, 8, async (err, result) => {
              if(err) {
                console.log(err)
                return res.status(500).json({
                  'error': true,
                  'message': '伺服器發生錯誤'
                })
              }
              let attractionDataList = result
              //確認偏好 
              if(preference === '悠遊輕旅行') {
                let itinerary = []
                for(let i = 0; i < attractionDataList.length; i++) {
                  if(i === (attractionDataList.length - 1)) {
                    itinerary.push(getRandomArrayElements(attractionDataList[i], 8))
                  }else {
                    itinerary.push(getRandomArrayElements(attractionDataList[i], 4))
                  }
                }
                let itineraryList = []
                let hotelName = hotelData
                let dailyItinerary = itinerary
                for(let i = 0; i < itinerary.length + 1; i++) {
                  if(hotelData[i] === undefined) {
                    dailyItinerary = itinerary[i-1].slice(4,8);
                    itineraryList.push({dailyItinerary})
                  }else {
                    hotelName = hotelData[i]
                    dailyItinerary = itinerary[i].slice(0,4)
                    itineraryList.push({hotelName,dailyItinerary})
                  }
                }
                res.status(200).json({
                  'ok': true
                })
              }else {
                let itinerary = []
                for(let i = 0; i < attractionDataList.length; i++) {
                  if(i === (attractionDataList.length - 1)) {
                    itinerary.push(getRandomArrayElements(attractionDataList[i], 12))
                  }else {
                    itinerary.push(getRandomArrayElements(attractionDataList[i], 6))
                  }
                }
                let itineraryList = []
                let hotelName = hotelData
                let dailyItinerary = itinerary
                for(let i = 0; i < itinerary.length + 1; i++) {
                  if(hotelData[i] === undefined) {
                    dailyItinerary = itinerary[i-1].slice(6,12);
                    itineraryList.push({dailyItinerary})
                  }else {
                    hotelName = hotelData[i]
                    dailyItinerary = itinerary[i].slice(0,6)
                    itineraryList.push({hotelName,dailyItinerary})
                  }
                }
                res.status(200).json({
                  'ok': true
                })
              }

            })

          }else if(transportData[0] === '機車' || transportData[0] === '大眾運輸') {
            searchAttraction(hotelDataList, 6, async (err, result) => {
              if(err) {
                console.log(err)
                return res.status(500).json({
                  'error': true,
                  'message': '伺服器發生錯誤'
                })
              }
              let attractionDataList = result
              //確認偏好 
              if(preference === '悠遊輕旅行') {
                let itinerary = []
                for(let i = 0; i < attractionDataList.length; i++) {
                  if(i === (attractionDataList.length - 1)) {
                    itinerary.push(getRandomArrayElements(attractionDataList[i], 8))
                  }else {
                    itinerary.push(getRandomArrayElements(attractionDataList[i], 4))
                  }
                }
                let itineraryList = []
                let hotelName = hotelData
                let dailyItinerary = itinerary
                for(let i = 0; i < itinerary.length + 1; i++) {
                  if(hotelData[i] === undefined) {
                    dailyItinerary = itinerary[i-1].slice(4,8);
                    itineraryList.push({dailyItinerary})
                  }else {
                    hotelName = hotelData[i]
                    dailyItinerary = itinerary[i].slice(0,4)
                    itineraryList.push({hotelName,dailyItinerary})
                  }
                }
                res.status(200).json({
                  'ok': true
                })
              }else {
                let itinerary = []
                for(let i = 0; i < attractionDataList.length; i++) {
                  if(i === (attractionDataList.length - 1)) {
                    itinerary.push(getRandomArrayElements(attractionDataList[i], 12))
                  }else {
                    itinerary.push(getRandomArrayElements(attractionDataList[i], 6))
                  } 
                }
                let itineraryList = []
                let hotelName = hotelData
                let dailyItinerary = itinerary
                for(let i = 0; i < itinerary.length + 1; i++) {
                  if(hotelData[i] === undefined) {
                    dailyItinerary = itinerary[i-1].slice(6,12);
                    itineraryList.push({dailyItinerary})
                  }else {
                    hotelName = hotelData[i]
                    dailyItinerary = itinerary[i].slice(0,6)
                    itineraryList.push({hotelName,dailyItinerary})
                  }
                }
                res.status(200).json({
                  'ok': true
                })
              }
            })

          }else {
            searchAttraction(hotelDataList, 4, async (err, result) => {
              if(err) {
                console.log(err)
                return res.status(500).json({
                  'error': true,
                  'message': '伺服器發生錯誤'
                })
              }
              let attractionDataList = result
              //確認偏好 
              if(preference === '悠遊輕旅行') {
                let itinerary = []
                for(let i = 0; i < attractionDataList.length; i++) {
                  if(i === (attractionDataList.length - 1)) {
                    itinerary.push(getRandomArrayElements(attractionDataList[i], 8))
                  }else {
                    itinerary.push(getRandomArrayElements(attractionDataList[i], 4))
                  }
                }
                let itineraryList = []
                let hotelName = hotelData
                let dailyItinerary = itinerary
                for(let i = 0; i < itinerary.length + 1; i++) {
                  if(hotelData[i] === undefined) {
                    dailyItinerary = itinerary[i-1].slice(4,8);
                    itineraryList.push({dailyItinerary})
                  }else {
                    hotelName = hotelData[i]
                    dailyItinerary = itinerary[i].slice(0,4)
                    itineraryList.push({hotelName,dailyItinerary})
                  }
                }
                res.status(200).json({
                  'ok': true
                })
              }else {
                let itinerary = []
                for(let i = 0; i < attractionDataList.length; i++) {
                  if(i === (attractionDataList.length - 1)) {
                    itinerary.push(getRandomArrayElements(attractionDataList[i], 12))
                  }else {
                    itinerary.push(getRandomArrayElements(attractionDataList[i], 6))
                  }
                };
                let itineraryList = []
                let hotelName = hotelData
                let dailyItinerary = itinerary
                for(let i = 0; i < itinerary.length + 1; i++) {
                  if(hotelData[i] === undefined) {
                    dailyItinerary = itinerary[i-1].slice(6,12);
                    itineraryList.push({dailyItinerary})
                  }else {
                    hotelName = hotelData[i]
                    dailyItinerary = itinerary[i].slice(0,6)
                    itineraryList.push({hotelName,dailyItinerary})
                  }
                }
                // res.status(200).json({
                //   'ok': true
                // })
                res.status(200).json({
                  'travelDate': {
                    'departureDate': departureDate,
                    'returnDate': returnDate,
                    'tripLength': tripLength,
                    'cities': cities,
                  },
                  'itinerary': itineraryList
                })
              }

            })

          }

      })
    }
  }
});

module.exports = itineraryAPI;


//隨機取出
function getRandomArrayElements(arr, count) {
  let shuffled = arr.slice(); //複製陣列
  let i = arr.length; 
  let min = i - count; 
  let temp = null;
  let index = null;
  while (i > min) {
      i = i - 1;
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(min);
}