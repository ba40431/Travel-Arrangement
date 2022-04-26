const express = require('express');
const multer = require('multer');
const uploadFile = require('../../model/s3')
const getFileStream = require('../../model/s3')
const boardAPI = express.Router();

// console.log(uploadFile)

// 初始化設定
const upload = multer({
  // storage: multer.memoryStorage(),
  dest: 'upload/',
  limits: {
    fileSize: 2 * 1024 * 1024,  // 限制 2 MB
  },
  fileFilter (req, file, callback) {  // 限制檔案格式為 image
    if (!file.mimetype.match(/^image/)) {
      callback(new Error().message = '檔案格式錯誤');
    } else {
      callback(null, true);
    }
  }
});

boardAPI.get('/board/:key', (req, res) => {  //download
  const key = req.params.key;
  const readStream = getFileStream(key)

  readStream.pipe(res)
  res.send('ok');
});

boardAPI.post('/board', upload.single('image'), async (req, res, next) => {  //upload
  console.log('file => ', req.file);  // 取得檔案
  console.log('file => ', req.body.title)
  if(req.body.title == null || req.file == null) {
    let data = {
      'data': 'error'
    }
    res.send(data,400);

  }else {
    const result = await uploadFile(req.file)
    console.log(result)
    let data = {
      'data': 'ok'
    }
    res.send(data,200);
  }
});

module.exports = boardAPI;