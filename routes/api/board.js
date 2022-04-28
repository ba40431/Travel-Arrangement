const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const { insertMessage } = require('../../model/board');
const mysql = require('mysql2');
const pool = require('../../model/connection')
const boardAPI = express.Router();

require('dotenv').config({path:'./.env'})

const bucketName = process.env.AWS_S3_NAME
const region = process.env.AWS_S3_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AES_SECRET_ACCESS_KEY

// 上傳S3設定
const s3 = new aws.S3({ 
  region: region,
  apiVersion: 'latest',
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
 })

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      console.log(file)
      cb(null, {fieldName: file.fieldname, ACL: 'public-read',});
    },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
})
boardAPI.get('/board', async (req, res) => {
  pool.getConnection((err, connection) => {
      if (err) {
        res.send(err,500);
        return console.log(err.message);
      }
      connection.query('SELECT * FROM `message`',
      function (err, result) {
          if (err) {
            res.send(err,400);
            throw err
          };
          connection.release();
          return res.status(200).jsonp(result);
      });
  });
}) 

boardAPI.post('/board', upload.single('image'), async (req, res, next) => { 
  let imageUrl = `https://d92adaktwu3r8.cloudfront.net/${req.file.originalname}`;
  insertMessage(req.body.title,imageUrl);
  let data = {
    'data': 'ok',
    'imageUrl': imageUrl
  };
  res.send(data,200);
});

module.exports = boardAPI;