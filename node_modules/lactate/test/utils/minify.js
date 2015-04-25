

var fs = require('fs');
var path = require('path');

var abridge = require('../../node_modules/abridge');

var basePath = path.resolve('../files');

var fileIn = path.join(basePath, 'script.js');
var fileOut = path.join(basePath, 'script.min.js');

abridge.minify(fs.createReadStream(fileIn)).pipe(fs.createWriteStream(fileOut));


