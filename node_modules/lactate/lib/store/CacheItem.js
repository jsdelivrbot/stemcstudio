// Cache item

var util = require('util');
var Emitter = require('events').EventEmitter;

function CacheItem(headers, data, expire) {
  this.headers = headers;
  this.data = data;
  this.lastAccess = Date.now();
  if (expire) {
    this.expire = expire;
    this.setInterval();
  };
};

util.inherits(CacheItem, Emitter);

CacheItem.prototype.now = function() {
  return Date.now();
};

CacheItem.prototype.touch = function() {
  this.lastAccess = this.now();
};

CacheItem.prototype.setInterval = function() {
  var interval = this.interval.bind(this);
  var expire = this.expire;
  Object.defineProperty(this, '_interval', {
    enumerable:false,
    value:setInterval(interval, expire)
  });
};

CacheItem.prototype.interval = function() {
  if (this.now() - this.lastAccess > this.expire) {
    clearInterval(this._interval);
    this._interval = null;
    this.emit('expire');
  };
};

CacheItem.prototype.read = function(options) {
  if (!!options) {
    var data = this.data;
    var start = options.start || 0;
    var end = options.end 
      ? options.end + 1 
      : data.length;
    return data.slice(start, end);
  } else {
    return this.data;
  };
};

module.exports = CacheItem;
