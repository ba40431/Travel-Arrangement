const express = require('express');
const shareAPI = express.Router();
const { shareItinerary } = require('../../model/my-itinerary');
const { checkUser } = require('../../model/user');


shareAPI.post('/share', (req, res) => {
    checkUser(req.body.shareEmail, async (err, result) => {
        if(err) {
        console.log(err)
        return res.status(500).json({
            'error': true,
            'message': '伺服器發生錯誤'
        })
        }
        if(result.length === 0) {
            res.status(400).json({
                'error': true,
                'message': '查無此使用者'
            })
        }else {
            shareItinerary(result[0].id, result[0].email, req.body.itineraryId, async (err, result) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        'error': true,
                        'message': '伺服器發生錯誤'
                    })
                }
                else if(result > 0) {
                    return res.status(400).json({
                        'error': true,
                        'message': '此使用者已可查看此行程'
                    })
                }else {
                    return res.status(200).json({
                        'ok': true
                    })
                }
            })
        }
    })
});

module.exports =  shareAPI;