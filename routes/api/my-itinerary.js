const express = require('express');
const jwt = require('jsonwebtoken');
const myItineraryAPI = express.Router();
const { searchItinerary, searchAllItinerary } = require('../../model/my-itinerary');

require('dotenv').config({path:'./.env'})

myItineraryAPI.get('/itinerary/:itineraryId', (req, res) => {
    const itineraryId = req.params.itineraryId
    searchItinerary(itineraryId, async (err, result) => {
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

myItineraryAPI.get('/my-itinerary', (req, res) => {
    let userEmail = null
    if(req.session.passport || req.cookies.token) {
        if(req.cookies.token) {
            try {
                const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
                userEmail = decoded.payload.userEmail
            }catch {
                return res.status(403).json({
                    'error': true,
                    'message': '未登入會員，拒絕存取'
                  })
            }     
        }else {
            userEmail = req.session.passport.user.emails[0].value
        }
    }else {
        return res.status(403).json({
            'error': true,
            'message': '未登入會員，拒絕存取'
          })
    }
    searchAllItinerary(userEmail, async (err, result) => {
        if(err) {
        console.log(err)
        return res.status(500).json({
            'error': true,
            'message': '伺服器發生錯誤'
        })
        }
        // console.log(result[0])
        return res.status(200).json({
            result
        })
    })
});

module.exports =  myItineraryAPI;




