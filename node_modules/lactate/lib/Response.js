/* Response handlers */

var fs = require('fs');
var path = require('path');
var FileRequest = require('./FileRequest');

module.exports = function Responses() {

  var pubPath = path.join.bind(this, __dirname, '../public');
  var exists = fs.existsSync || path.existsSync;

  function makePageHandler(status, page) {
    var page = page || pubPath(status + '.html');
    var pageExists = exists(page);

    return function pageHandler(request) {
      var servePage = pageExists
      && this._get('error_pages');

      request.fp = page;
      request.status = status;

      if (!servePage) {
        var res = request.res;
        res.writeHead(status);
        res.end();
        this.emit(status, request);
        return;
      } else {
        this.serveFile(request);
      };

    }.bind(this);
  };

  var makePageHandler = makePageHandler.bind(this);
  var attr = { enumerable:false };

  attr.value = makePageHandler;
  Object.defineProperty(this, 'makePageHandler', attr);

  attr.value = makePageHandler(400);
  Object.defineProperty(this, '_400', attr);

  attr.value = makePageHandler(403);
  Object.defineProperty(this, '_403', attr);

  attr.value = makePageHandler(405);
  Object.defineProperty(this, '_405', attr);

  attr.value = makePageHandler(500);
  Object.defineProperty(this, '_500', attr);

  attr.value = function _304Handler(request) {
    var res = request.res;
    var status = 304;

    request.status = status;

    res.writeHead(status);
    res.end();

    this.emit(status, request);
  };

  Object.defineProperty(this, '_304', attr);

  var default404 = makePageHandler(404);

  attr.value = function _404Handler(request) {
    var handler = this._get('not_found');
    var status = 404;
    switch (typeof handler) {
      case 'string':
        makePageHandler(status, handler)(request);
        break;
      case 'function':
        var req = request.req;
        var res = request.res;
        handler.call(this, req, res);
        request.status = status;
        this.emit(status, request);
        break;
      default:
        default404(request);
        break;
    };
  };

  Object.defineProperty(this, '_404', attr);

};
