const axios = require('axios').default;
const express = require('express');
require('dotenv').config({path:'./.env'});

const itineraryAPI = express.Router();
const { getHotelData, searchAttraction, insertItinerary } = require('../../model/itinerary');


itineraryAPI.post('/itinerary', (req, res) => {
  // console.log(req.body)
  let departureDate = req.body.travelDate.departureDate;
  let returnDate = req.body.travelDate.returnDate;
  let tripLength = req.body.travelDate.tripLength;
  let cityData = req.body.travelRequireData.cities;
  let hotelData = req.body.travelRequireData.hotelList;
  let transportData = req.body.travelRequireData.transportList;
  let preference = req.body.travelRequireData.preference;
  let userId = req.body.travelDate.userId;
  let userEmail = req.body.travelDate.userEmail;

  //行程編號
  let itineraryId = Date.now().toString(); //數字轉字串

  //取得縣市
  let cities = ''
  let citiesList = []
  for(let i = 0; i < cityData.length; i++){
    if(cityData[i].city === undefined) {
      break
    }
    cities = `${cities} , ${cityData[i].city}`
    citiesList.push(cityData[i].city)
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
    let mustToGoPlace = null;
    let placeName = null;
    let placeId = null;
    let placeAddress = null;
    //如果有必去景點資料
    if(req.body.travelRequireData.mustToGoPlace) {
      mustToGoPlace = req.body.travelRequireData.mustToGoPlace;
      placeName = req.body.travelRequireData.mustToGoPlace.placeName;
      placeId = req.body.travelRequireData.mustToGoPlace. placeId;
      placeAddress = req.body.travelRequireData.mustToGoPlace.placeAddress;
      let count = null;
      let placeRegion = null;

      if(placeAddress.indexOf('市') !== -1) {
        count = placeAddress.indexOf('市')
        placeRegion = placeAddress.slice(count-2, count+1)
        if(placeRegion.indexOf('台')) {
          placeRegion.replace('台', '臺');
          if(citiesList.indexOf(placeRegion) === -1) {
            return res.status(400).json({
              'error': true,
              'message': '必去景點可能不在所選縣市的範圍'
            })
          }
        }
      }else if(placeAddress.indexOf('縣') !== -1) {
        count = placeAddress.indexOf('縣')
        placeRegion = placeAddress.slice(count-2, count+1)
        if(placeRegion.indexOf('台')) {
          placeRegion.replace('台', '臺');
          if(citiesList.indexOf(placeRegion) === -1) {
            return res.status(400).json({
              'error': true,
              'message': '必去景點可能不在所選縣市的範圍'
            })
          }
        }
      }else {
        return res.status(400).json({
          'error': true,
          'message': '必去景點可能不在所選縣市的範圍'
        })
      }
      // let detailsAPI = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=zh-TW&key=${process.env.GOOGLE_API_KEY}`;
      // axios.get(detailsAPI)
      // .then((response) => {
      //   placeData = response
      //   console.log(placeData.data.result.adr_address)
      // })
      // .catch((error) => {
      //   console.log(error);
      //   res.status(500).json({
      //     'error': true,
      //     'message': '伺服器發生錯誤'
      //   })
      // })

    }else{
      placeId = '';
      placeName = '';
    }

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
          let itinerary = [] //取得景點資料列表
          let itineraryList = [] //將景點資料列表分成N天

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
                checkPreference(attractionDataList, itinerary, itineraryList, hotelData, 4)
                insertItinerary(itineraryId, itineraryList,
                  departureDate, returnDate, tripLength, cities.slice(2,), preference, placeId, placeName, userId, userEmail,
                   async (err, result) => {
                    if(err) {
                      console.log(err)
                      return res.status(500).json({
                        'error': true,
                        'message': '伺服器發生錯誤'
                      })
                    }
                    res.status(200).json({
                      'ok': true,
                      'itineraryId': itineraryId
                    })
                })
              }else {
                checkPreference(attractionDataList, itinerary, itineraryList, hotelData, 6)
                insertItinerary(itineraryId, itineraryList,
                  departureDate, returnDate, tripLength, cities.slice(2,), preference, placeId, placeName, userId, userEmail,
                   async (err, result) => {
                    if(err) {
                      console.log(err)
                      return res.status(500).json({
                        'error': true,
                        'message': '伺服器發生錯誤'
                      })
                    }
                    res.status(200).json({
                      'ok': true,
                      'itineraryId': itineraryId
                    })
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
                checkPreference(attractionDataList, itinerary, itineraryList, hotelData, 4)
                insertItinerary(itineraryId, itineraryList,
                  departureDate, returnDate, tripLength, cities.slice(2,), preference, placeId, placeName, userId, userEmail,
                   async (err, result) => {
                    if(err) {
                      console.log(err)
                      return res.status(500).json({
                        'error': true,
                        'message': '伺服器發生錯誤'
                      })
                    }
                    res.status(200).json({
                      'ok': true,
                      'itineraryId': itineraryId
                    })
                })
              }else {
                checkPreference(attractionDataList, itinerary, itineraryList, hotelData, 6)
                insertItinerary(itineraryId, itineraryList,
                  departureDate, returnDate, tripLength, cities.slice(2,), preference, placeId, placeName, userId, userEmail,
                   async (err, result) => {
                    if(err) {
                      console.log(err)
                      return res.status(500).json({
                        'error': true,
                        'message': '伺服器發生錯誤'
                      })
                    }
                    res.status(200).json({
                      'ok': true,
                      'itineraryId': itineraryId
                    })
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
                checkPreference(attractionDataList, itinerary, itineraryList, hotelData, 4)


                insertItinerary(itineraryId, itineraryList,
                  departureDate, returnDate, tripLength, cities.slice(2,), preference, placeId, placeName, userId, userEmail,
                   async (err, result) => {
                    if(err) {
                      console.log(err)
                      return res.status(500).json({
                        'error': true,
                        'message': '伺服器發生錯誤'
                      })
                    }
                    res.status(200).json({
                      'ok': true,
                      'itineraryId': itineraryId
                    })
                })
              }else {
                checkPreference(attractionDataList, itinerary, itineraryList, hotelData, 6)

                insertItinerary(itineraryId, itineraryList,
                  departureDate, returnDate, tripLength, cities.slice(2,), preference, placeId, placeName, userId, userEmail,
                   async (err, result) => {
                    if(err) {
                      console.log(err)
                      return res.status(500).json({
                        'error': true,
                        'message': '伺服器發生錯誤'
                      })
                    }
                    res.status(200).json({
                      'ok': true,
                      'itineraryId': itineraryId
                    })
                })
              }
            })

          }

      })
  }
});

module.exports = itineraryAPI;


//確認偏好
function checkPreference(data, itinerary, itineraryList, hotelData, num) {
  for(let i = 0; i < data.length; i++) {
    if(i === (data.length - 1)) {
      itinerary.push(getRandomArrayElements(data[i], 2*num))
    }else {
      itinerary.push(getRandomArrayElements(data[i], num))
    }
  }
  let hotelName = hotelData
  let dailyItinerary = itinerary
  for(let i = 0; i < itinerary.length + 1; i++) {
    if(hotelData[i] === undefined) {
      dailyItinerary = itinerary[i-1].slice(num, 2*num);
      itineraryList.push({dailyItinerary})
    }else {
      hotelName = hotelData[i]
      dailyItinerary = itinerary[i].slice(0, num)
      itineraryList.push({hotelName, dailyItinerary})
    }
  }
}

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