
var Suckle = require('suckle')
var http = require('http')
var port = 7279
var _server = null

module.exports.stopServer = function(cb) {
  _server ? _server.close(cb) : cb();
};

module.exports.server = function(cb) {
  _server = new http.Server;
  _server = http.createServer(cb);
  _server.listen(port);
};

module.exports.client = function(path, times, method, range) {
  var args = Array.prototype.slice.call(arguments), cb;
  var path = args.shift();
  var lastArg = args[args.length-1];

  if (typeof(lastArg) === 'function') {
    cb = args.pop();
  };

  var times = args.shift() || 1;
  var method = args.shift() || 'GET';
  var headers = args.shift() || {};

  headers['accept-encoding'] = 'gzip';

  var options = {
    host:'localhost',
    port:port,
    path:path,
    method:method,
    headers:headers
  };

  ;(function next(i) {
    var req = http.request(options, function(res) {

      var suckle = new Suckle(function(data) {
        if (--i) {
          next(i);
        } else {
          cb(null, res, data);
        };
      })

      res.pipe(suckle);
      res.on('error', cb);
    });
    req.end();
  })(times);
};
