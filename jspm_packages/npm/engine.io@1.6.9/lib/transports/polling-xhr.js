/* */ 
var Polling = require('./polling');
var Transport = require('../transport');
var debug = require('debug')('engine:polling-xhr');
module.exports = XHR;
function XHR(req) {
  Polling.call(this, req);
}
XHR.prototype.__proto__ = Polling.prototype;
XHR.prototype.onRequest = function(req) {
  if ('OPTIONS' == req.method) {
    var res = req.res;
    var headers = this.headers(req);
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    res.writeHead(200, headers);
    res.end();
  } else {
    Polling.prototype.onRequest.call(this, req);
  }
};
XHR.prototype.headers = function(req, headers) {
  headers = headers || {};
  if (req.headers.origin) {
    headers['Access-Control-Allow-Credentials'] = 'true';
    headers['Access-Control-Allow-Origin'] = req.headers.origin;
  } else {
    headers['Access-Control-Allow-Origin'] = '*';
  }
  return Polling.prototype.headers.call(this, req, headers);
};
