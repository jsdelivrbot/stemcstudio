
var fs     = require('fs');
var zlib   = require('zlib');
var suckle = require('suckle');

;(function gipFiles() {
  var DIR = __dirname + '/../files/';

  function nonGzipped(file) {
    return !/\.gz$/.test(file);
  };

  function gzip(file) {
    var _file = [DIR, file].join('');
    var name = _file + '.gz';
    console.log('Gzipping', _file, '>', name);
    var ws = fs.createWriteStream(name);

    var gz = zlib.createGzip();
    gz.pipe(ws);

    var rs = fs.createReadStream(_file);
    rs.pipe(gz);
  };

  var files = fs.readdirSync(DIR)
  .filter(nonGzipped)
  .forEach(gzip);

})();
