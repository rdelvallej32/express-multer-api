'use strict';

require('dotenv').config();

const fs = require('fs');

////THIS IS ALL A SCRIPT TO TEST HOW TO UPLOAD, SIMILAR TO WHAT I DID WITH TWILLIO
/////NOW WE HAVE THE BLUEPRINT TO USE IN OUR EXPRESS CONTROLLER

//if a path is not provided pass a string. Its for testing
let filename = process.argv[2] || '';

let title = process.argv[3] || 'No Title';

///file-type returns an object that returns ext and mime: npm module/node
const fileType = require('file-type');

//require the aws upload function
const awsS3Upload = require('../lib/aws-s3-upload.js');

//require mongoose from the middleware to use the mongoose library
const mongoose = require('../app/middleware/mongoose');
const Upload = require('../app/models/upload');
///creation of the mimetype which returns an object with ext and mime
//always return object with extension and mime.
//FileType returns null when no match
const mimeType = (data) =>
///Object assign is a way to show something versus null
  Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  }, fileType(data));

//function to read a file
const readFile = (filename) =>
  new Promise((resolve, reject) => {

    fs.readFile(filename,(err, data) => {
      if (err) {
        //log the error to see if it is an error
        reject(err);
      } else {
        //pass that data in to resolve
        resolve(data);
      }
    });
  });

///readfile returns a file and then passes the data, which get turned into
///
  readFile(filename)
  .then((data) => {
    let file = mimeType(data);
    file.data = data;
    return file;
  })
  .then(awsS3Upload)
  ///
  .then((s3response) => {
    let upload = {
      location: s3response.Location,
      title: title,
    };
    return Upload.create(upload);
  })
  .then(console.log)
  ///handles the error
  .catch(console.error)
  .then(() => mongoose.connection.close());


// //success will log the filename along with the data length bytes
