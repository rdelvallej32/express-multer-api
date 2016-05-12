'use strict';

const fs = require('fs');

//if a path is not provided pass a string. Its for testing
let filename = process.argv[2] || '';

fs.readFile(filename, {encoding: 'utf8'}, (err, data) => {
  if (err) {
    //log the error to see if it is an error
    return console.error(err);
  }

  //success will log the filename along with the data length bytes
  console.log(`${filename} is ${data.length} bytes long`);
});
