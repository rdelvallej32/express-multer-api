'use strict';

const fs = require('fs');

//if a path is not provided pass a string. Its for testing
let filename = process.argv[2] || '';

const fileType = require('file-type');

///creation of the mimetype which returns an object with ext and mime
const mimeType = (data) =>
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

  const awsUpload = (file) => {
    ///creates aws options
    const options = {
      ACL: 'public-read',
      ///the body is the actual data that is being streamed
      Body: file.data,
      Bucket: 'rdjbucket',
      ///what type of file it is
      ContentType: file.mime,
      ///path that gets set up, make sure you are not using a path that already exists
      ///because it will overwrite it!
      Key: `test/test.${file.ext}`,
    };
    return Promise.resolve(options);


  };


///readfile returns a file and then passes the data, which get turned into
///
  readFile(filename)
  .then((data) => {
    let file = mimeType(data);
    file.data = data;
    return file;
  })
  .then(awsUpload)
  ///
  .then((options) => console.log(options))
  ///handles the error
  .catch(console.error);


//success will log the filename along with the data length bytes
