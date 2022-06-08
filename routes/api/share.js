const express = require('express');
const shareAPI = express.Router();
const { shareItinerary } = require('../../model/my-itinerary');
const { checkUser } = require('../../model/user');
const redis = require('redis');


shareAPI.post('/share', (req, res) => {
    checkUser(req.body.shareEmail, async (err, result) => {
        if(err) {
        console.log(err)
        return res.status(500).json({
            'error': true,
            'message': '伺服器發生錯誤'
        })
        }
        console.log(result)
        if(result.length === 0) {
            return res.status(400).json({
                'error': true,
                'message': '查無此使用者'
            })
        }else {
            console.log(result)
            let userId = result[0].id;
            let userName = result[0].name;
            let userEmail = result[0].email;
            let userProfile = result[0].profile
            shareItinerary(userId, userEmail, req.body.itineraryId, async (err, result) => {
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
                    // 連接redis
                    const client = redis.createClient({
                        // url: 'redis://127.0.0.1:6379'
                        url: `redis://${process.env.ELASTICACHE_ENDPOINT}:${process.env.ELASTICACHE_PORT}`
                    })
                    client.on('error', (err) => {
                        console.log(err);
                        return res.status(500).json({
                            'error': true,
                            'message': '伺服器發生錯誤'
                        })
                    })
                    client.connect()
                    const key = req.body.itineraryId
                    const value = client.del(key)
                    value.then((data) => {
                        console.log(data)
                        if(data) {
                            console.log('Deleted Successfully!')
                            return res.status(200).json({
                                'ok': true,
                                'user':{
                                    'id': userId,
                                    'name': userName,
                                    'profile': userProfile
                                }
                            })
                        }
                        return res.status(200).json({
                            'ok': true,
                            'user':{
                                'id': userId,
                                'name': userName,
                                'profile': userProfile
                            }
                        })
                    })
                }
            })
        }
    })
});

module.exports =  shareAPI;