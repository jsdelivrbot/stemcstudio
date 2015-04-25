var util = require('util');
var events = require('events');

/**
 * File request
 *
 * @constructor FileRequest
 * @param {String} filePath
 * @param {HTTPRequest} req
 * @param {HTTPResponse} res
 * @param {Number} status
 * @param {String} url
 * @param {String} dir
 */

function FileRequest(fp, req, res, status, url, dir) {
  this.req = req;
  this.res = res;
  this.fp = fp;
  this.url = url;
  this.dir = dir;
  this.method = req.method;
  this.status = status || 200;
};

util.inherits(FileRequest, events.EventEmitter);

module.exports = FileRequest;
