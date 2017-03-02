var fs = require('fs'),
  request = require('request');

var url = process.argv[2],
	outputPath = process.argv[3];

request
  .get(url)
  .on('error', function(err) {
    // handle error
  })
  .pipe(fs.createWriteStream(outputPath));

