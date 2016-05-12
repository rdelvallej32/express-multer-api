'use strict';

const fs = require('fs');

//if a path is not provided pass a string. Its for testing
let filename = process.argv[2] || '';

const readFile = (filename) =>
  new Promise((resolve, reject) => {

    fs.readFile(filename, {encoding: 'utf8'}, (err, data) => {
      if (err) {
        //log the error to see if it is an error
        reject(err);
      } else {
        //pass that data in to resolve
        resolve(data);
      }
    });
  });

  readFile(filename)
  .then((data) => console.log(`${filename} is ${data.length} bytes long`))
  .catch(console.error);


//success will log the filename along with the data length bytes
