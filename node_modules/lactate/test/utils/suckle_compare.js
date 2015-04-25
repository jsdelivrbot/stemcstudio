
var files = require('./get_files');
var suckle = require('../../node_modules/suckle');

var fs = require('fs');
var zlib = require('zlib');

;(function suckleTest() {
  var base = __dirname + '/../files/';

  Object.keys(files).forEach(function(file) {
    var fLen = files[file];
    var mux = new suckle(function(data, len) {
      console.log(file, len, fLen, len === fLen);
    });

    var gz = zlib.createGzip()
    gz.pipe(mux);

    var rs = fs.createReadStream(base + file)
    rs.pipe(gz);
  });
})();
