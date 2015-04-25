
var fs  = require('fs');

module.exports = (function getFiles() {
  var DIR = __dirname + '/../files/';

  function gzipped(file) {
    return /\.gz$/.test(file);
  };

  var map = {};
  var files = [
    'index.html.gz',
    'landing page.html.gz',
    'script.js.gz',
    'script.min.js.gz',
    'style.css.gz',
    'test.png'
  ];
  
  files.forEach(function(file) {
    var fileName = file.replace(/\.gz$/, '');
    var file = fs.readFileSync(DIR + file);
    map[fileName] = file.length;
  })

  return map;
})();

//console.log(Object.keys(module.exports).map(function(k){return [k, module.exports[k]];}));
