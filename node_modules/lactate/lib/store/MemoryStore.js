var util = require('util');
var Store = require('./Store');

module.exports = MemoryStore;

function MemoryStore(options) { 
  Store.call(this, options);
};

util.inherits(MemoryStore, Store);

MemoryStore.prototype.set = function(filePath, headers, data, fn) { 
  var len = data.length;

  if (this.size + len > this.max_size) {
    return fn && process.nextTick(fn);
  } else {
    this.size += len;
  };

  var expire = this.expire;
  var item = this.newItem(headers, data, expire);
  var remove = this.remove.bind(this, filePath);
  item.on('expire', remove);

  this._cache[filePath] = item;

  typeof fn === 'function'
  && process.nextTick(fn);

  if (++this.count > this.max_keys) {
    var prune = this.prune.bind(this);
    process.nextTick(prune);
  };
};

MemoryStore.prototype.get = function(filePath, fn) { 
  var item = this._cache[filePath];
  if (!!item) {
    fn(null, item);
    item.touch();
  } else {
    fn(new Error('File not in cache'));
  };
};

MemoryStore.prototype.remove = function(filePath, fn) { 
  var item = this._cache[filePath];
  if (!!item ) {
    this.size -= item.data.length;
    this.count -= 1;
    this._cache[filePath] = null;
    fn && process.nextTick(fn);
  } else {
    fn && fn();
  };
};

MemoryStore.prototype.prune = function() {
  var key = Object.keys(this._cache)[0];
  this.remove(key);
};

