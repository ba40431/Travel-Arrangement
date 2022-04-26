const S3 = require('aws-sdk/clients/s3')
const AWS = require('aws-sdk');
const fs = require('fs') //用來操作實體檔案，可以同步或非同步存取檔案系統操作
require('dotenv').config()

const bucketName = process.env.AWS_S3_NAME
const region = process.env.AWS_S3_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AES_SECRET_ACCESS_KEY

AWS.config.update({
    region: region,
    apiVersion: 'latest',
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey
    }
  })

const s3 = new S3({
    region,
    accessKey,
    secretAccessKey,
})

//upload file to S3
function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path)  //可以打開文件流並讀取其中的數據
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
    }

    return s3.upload(uploadParams).promise()

}

//download file from S3
function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream()
}


module.exports = uploadFile;
