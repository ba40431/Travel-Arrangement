const express = require('express');

const myItineraryAPI = express.Router();
const { searchItinerary } = require('../../model/my-itinerary');

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

module.exports =  myItineraryAPI;




