const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const { updateProfile } = require('../../model/dashboard');
const dashboardAPI = express.Router();

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
    bucket: `${bucketName}/profile`,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname, ACL: 'public-read' });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

dashboardAPI.post(
  '/dashboard',
  upload.single('image'),
  async (req, res) => {
    let imageUrl = `https://d92adaktwu3r8.cloudfront.net/profile/${req.file.originalname}`;
    try {
      const updatedProfile = await updateProfile(req.body.title, imageUrl);
      if(updatedProfile) {
        return res.status(200).json({
          ok: true,
          imageUrl: imageUrl,
        });
      }
    }catch (error) {
        if(error) {
          return res.status(500).json({
            error: true,
            message: '伺服器發生錯誤',
          });
        }
    }
  }
);

module.exports = dashboardAPI;
