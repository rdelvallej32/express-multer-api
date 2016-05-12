'use strict';

///crypto Generates cryptographically strong pseudo-random data: npm module/node
const crypto = require('crypto');

//require AWS
const AWS = require('aws-sdk');

//constructor that makes a new AWS to upload does
const s3 = new AWS.S3();

//generates a randomhexstring and returns it as a promise
const randomHexString = (length) =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf.toString('hex'));
      }
    });
  });

  //this is the function that uploads a file
    const awsS3Upload = (file) =>

      randomHexString(16)
      .then((filename) => {
        //sets directory to current date
        let dir = new Date().toISOString().split('T')[0];
        ///creates aws params
        return {
          ACL: 'public-read',
          ///the body is the actual data that is being streamed
          Body: file.data,
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          ///what type of file it is
          ContentType: file.mime,
          ///path that gets set up, make sure you are not using a path that already exists
          ///because it will overwrite it!
          ////add file ext to the string from filetype method
          /// add date as the beginning for directory to name by the date it was uploaded
          Key: `${dir}/${filename}.${file.ext}`,
        };

      }).then(params =>
         new Promise((resolve, reject) => {
          s3.upload(params, (err, data) => {
            if(err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        })
      );


module.exports = awsS3Upload;
