const util = require('util');
const Store = require('./Store');
const redis = require('redis').createClient();

module.exports = RedisStore;

function RedisStore(options) { 
  Store.call(this, options);

  this.prefix = 'Lactate:';
  this.keys = [];

  var cleanup = this.cleanup.bind(this);
  process.on('exit', cleanup);
  process.on('SIGINT',  cleanup);
};

util.inherits(RedisStore, Store);

RedisStore.prototype.cleanup = function() {
  var keys = this.keys;
  var prefix = this.prefix;

  keys.push({name:prefix + '_size'});
  keys.push({name:prefix + '_keys'});

  ;(function next() {
    if (keys.length) {
      var key = keys.shift();
      redis.hdel(key.name, 'headers', 'data', 'size', 'keys', next);
    } else {
      process.exit(0);
    };
  })();
};

RedisStore.prototype.set = function(filePath, headers, data, fn) { 
  fn = fn || function(){};

  var self = this;

  var max_size = this.max_size;
  var expire = this.expire;

  var key = this.prefix + filePath;
  var _size = this.prefix + '_size';
  var _keys = this.prefix + '_keys';

  var len = data.length;
  var keys = this.keys;

  function complete() {
    var _headers = JSON.stringify(headers);
    var _data = data.toString('binary');
    var incrCount = self.incrCount.bind(self);

    redis.hmset(key, 'headers', _headers, 'data', _data, fn)
    redis.expire(key, expire)
    redis.hincrby(_keys, 'keys', 1, incrCount);

    keys.push({name:key, size:len});
  };


  redis.hincrby(_size, 'size', len, function(err, size) {
    if (err || size > max_size)
      fn && process.nextTick(fn);
    else complete();
  });
};

RedisStore.prototype.incrCount = function(err, count) {
  if (count > this.max_keys) {
    var prune = this.prune.bind(this);
    process.nextTick(prune);
  };
};

RedisStore.prototype.get = function(filePath, fn) { 
  var key = this.prefix + filePath;

  function redisGetCB(err, data) {
    if (err || !data) {
      fn(new Error('No key exists'));
    } else {
      var _headers = JSON.parse(data.headers);
      var _data = new Buffer(data.data, 'binary');
      var item = new this.item(_headers, _data);
      fn(null, item);
      redis.expire(key, this.expire);
    };
  };

  redis.hgetall(key, redisGetCB.bind(this));
};

RedisStore.prototype.remove = function(filePath, ind) { 

  var key   = this.prefix + filePath;
  var _size = this.prefix + '_size';
  var _keys = this.prefix + '_keys';

  var keys = this.keys;

  if (typeof ind === 'undefined') {
    for (var i=0, len=this.keys.length;i<len;i++) {
      if (keys[i].name === filePath) ind = i;
    };
  };

  var size = keys[ind].size;
  redis.hdel(key, 'headers', 'data', fn);
  redis.hincrby(_size, 'size', 0-size);
  redis.hincrby(_keys, 'keys', -1);

  keys.splice(ind, 1);
};

RedisStore.prototype.prune = function() {
  var rand = ~~(Math.random() * this.keys.length);
  var key = this.keys[rand];
  this.remove(key.name, rand);
};

