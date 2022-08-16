const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const { insertMessage, checkMessage } = require('../../model/board');
const boardAPI = express.Router();

require('dotenv').config({ path: './.env' });

const bucketName = process.env.AWS_S3_NAME;
const region = process.env.AWS_S3_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// 上傳S3設定
const s3 = new aws.S3({
  region: region,
  apiVersion: 'latest',
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      // console.log(file);
      cb(null, { fieldName: file.fieldname, ACL: 'public-read' });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
boardAPI.get('/board', async (req, res) => {
  const boardData = await checkMessage();
  const result = boardData[0]
  return res.status(200).json(result);
});

boardAPI.post('/board', upload.single('image'), async (req, res, next) => {
  let imageUrl = `https://d92adaktwu3r8.cloudfront.net/${req.file.originalname}`;
  await insertMessage(req.body.title, imageUrl);
  return res.status(200).json({
    data: 'ok',
    imageUrl: imageUrl,
  });
});

module.exports = boardAPI;
