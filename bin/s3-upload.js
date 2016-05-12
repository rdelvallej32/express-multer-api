// 'use strict';
//
// require('dotenv').config();
//
// const fs = require('fs');
//
// //if a path is not provided pass a string. Its for testing
// let filename = process.argv[2] || '';
//
// ///file-type returns an object that returns ext and mime: npm module/node
// const fileType = require('file-type');
//
// ///crypto Generates cryptographically strong pseudo-random data: npm module/node
// const crypto = require('crypto');
//
// //require AWS
// const AWS = require('aws-sdk');
//
// //constructor that makes a new AWS to upload does
// const s3 = new AWS.S3();
//
// ///creation of the mimetype which returns an object with ext and mime
// //always return object with extension and mime.
// //FileType returns null when no match
// const mimeType = (data) =>
// ///Object assign is a way to show something versus null
//   Object.assign({
//     ext: 'bin',
//     mime: 'application/octet-stream',
//   }, fileType(data));
//
// //function to read a file
// const readFile = (filename) =>
//   new Promise((resolve, reject) => {
//
//     fs.readFile(filename,(err, data) => {
//       if (err) {
//         //log the error to see if it is an error
//         reject(err);
//       } else {
//         //pass that data in to resolve
//         resolve(data);
//       }
//     });
//   });
//
//   const randomHexString = (length) =>
//     new Promise((resolve, reject) => {
//       crypto.randomBytes(length, (err, buf) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(buf.toString('hex'));
//         }
//       });
//     });
//
// //this is the function that uploads a file
//   const awsUpload = (file) => {
//
//     randomHexString(16)
//     .then((filename) => {
//       //sets directory to current date
//       let dir = new Date().toISOString().split('T')[0];
//       ///creates aws params
//       return {
//         ACL: 'public-read',
//         ///the body is the actual data that is being streamed
//         Body: file.data,
//         Bucket: 'rdjbucket',
//         ///what type of file it is
//         ContentType: file.mime,
//         ///path that gets set up, make sure you are not using a path that already exists
//         ///because it will overwrite it!
//         ////add file ext to the string from filetype method
//         /// add date as the beginning for directory to name by the date it was uploaded
//         Key: `${dir}/${filename}.${file.ext}`,
//       };
//
//     }).then(params =>
//        new Promise((resolve, reject) => {
//         s3.upload(params, (err, data) => {
//           if(err) {
//             reject(err);
//           } else {
//             resolve(data);
//           }
//         });
//       })
//     );
//   };
//
// ///readfile returns a file and then passes the data, which get turned into
// ///
//   readFile(filename)
//   .then((data) => {
//     let file = mimeType(data);
//     file.data = data;
//     return file;
//   })
//   .then(awsUpload)
//   ///
//   .then((s3response) => console.log(s3response))
//   ///handles the error
//   .catch(console.error);
//
//
// //success will log the filename along with the data length bytes

'use strict';

require('dotenv').config();

const fs = require('fs');
const crypto = require('crypto');

const fileType = require('file-type');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

// always return object with extension and mime.
// fileType returns null when no match
const mimeType = (data) =>
  Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  }, fileType(data));

let filename = process.argv[2] || '';

const readFile = (filename) =>
  new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

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


const awsUpload = (file) =>
  randomHexString(16)
  .then((filename) => {
    let dir = new Date().toISOString().split('T')[0];
    return {
      ACL: 'public-read',
      Body: file.data,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      ContentType: file.mime,
      Key: `${dir}/${filename}.${file.ext}`,
    };
  }).then(params =>
    new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  );

readFile(filename)
.then((data) => {
  let file = mimeType(data);
  file.data = data;
  return file;
})
.then(awsUpload)
.then((s3response) =>
  console.log(s3response))
.catch(console.error);
