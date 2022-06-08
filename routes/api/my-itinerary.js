const express = require('express');
const jwt = require('jsonwebtoken');
const myItineraryAPI = express.Router();
const {
  searchItinerary,
  searchAllItinerary,
  deleteItinerary,
} = require('../../model/my-itinerary');
const redis = require('redis');

require('dotenv').config({ path: './.env' });

myItineraryAPI.get('/itinerary/:itineraryId', (req, res) => {
  const itineraryId = req.params.itineraryId;

  // 連接redis
  const client = redis.createClient({
    // url: `redis://${process.env.ELASTICACHE_ENDPOINT}:${process.env.ELASTICACHE_PORT}`,
    url: 'redis://127.0.0.1:6379'
  });
  client.on('error', (err) => {
    console.log(err);
    return res.status(500).json({
      error: true,
      message: '伺服器發生錯誤',
    });
  });
  client.connect();
  const key = itineraryId;
  const expire = 60 * 15;
  const value = client.get(key, redis.print);
  value.then((data) => {
    if (data) {
      console.log('Use Redis');
      const result = JSON.parse(data);
      return res.status(200).json({
        result,
      });
    }
    searchItinerary(itineraryId, async (err, result) => {
      console.log('Use Database');
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          message: '伺服器發生錯誤',
        });
      }
      if (result[0].length === 0) {
        return res.status(200).json({
          data: null,
        });
      } else {
        client.set(key, JSON.stringify(result), (err) => {
          if (err) {
            console.log(err);
          }
        });
        client.expire(key, expire);
        return res.status(200).json({
          result,
        });
      }
    });
  });
});

myItineraryAPI.get('/my-itinerary', (req, res) => {
  let userEmail = null;
  if (req.session.passport || req.cookies.token) {
    if (req.cookies.token) {
      try {
        const decoded = jwt.verify(
          req.cookies.token,
          process.env.JWT_SECRET_KEY
        );
        userEmail = decoded.payload.userEmail;
      } catch {
        return res.status(403).json({
          error: true,
          message: '未登入會員，拒絕存取',
        });
      }
    } else {
      userEmail = req.session.passport.user.emails[0].value;
    }
  } else {
    return res.status(403).json({
      error: true,
      message: '未登入會員，拒絕存取',
    });
  }
  searchAllItinerary(userEmail, async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: true,
        message: '伺服器發生錯誤',
      });
    }
    return res.status(200).json({
      result,
    });
  });
});

myItineraryAPI.delete('/itinerary/:itineraryId', (req, res) => {
  // console.log(req.body)
  const itineraryId = req.params.itineraryId;
  deleteItinerary(req.body.userEmail, itineraryId, async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: true,
        message: '伺服器發生錯誤',
      });
    }
    // 連接redis
    const client = redis.createClient({
      url: 'redis://127.0.0.1:6379'
      // url: `redis://${process.env.ELASTICACHE_ENDPOINT}:${process.env.ELASTICACHE_PORT}`,
    });
    client.on('error', (err) => {
      console.log(err);
      return res.status(500).json({
        error: true,
        message: '伺服器發生錯誤',
      });
    });
    client.connect();
    const key = itineraryId;
    const value = client.del(key);
    value.then((data) => {
      console.log(data);
      if (data) {
        console.log('Deleted Successfully!');
        return res.status(200).json({
          ok: true,
        });
      }
      return res.status(200).json({
        ok: true,
      });
    });
  });
});

module.exports = myItineraryAPI;
