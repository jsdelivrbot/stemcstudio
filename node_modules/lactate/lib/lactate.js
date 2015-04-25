// MIT License
// 
// Copyright 2012 Brandon Wilson
// 
// Permission is hereby granted, free of charge, to any person 
// obtaining a copy of this software and associated documentation 
// files (the "Software"), to deal in the Software without 
// restriction, including without limitation the rights to use, 
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software
// is furnished to do so, subject to the following conditions: 
// 
// The above copyright notice and this permission notice shall be 
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

var fs          = require('fs');
var URL         = require('url');
var path        = require('path');
var util        = require('util');
var events      = require('events');
var zlib        = require('zlib');
var Suckle      = require('suckle');
var abridge     = require('abridge');
var fraction    = require('fraction');
var expire      = require('expire');

var Cache       = require('./Cache');
var Directory   = require('./Directory');
var Logger      = require('./Logger');
var Responses   = require('./Response');
var FileRequest = require('./FileRequest');

/**
 * Lactate
 *
 * @constructor Lactate
 * @param {Object} options
 */

function Lactate(options) { 

  Responses.apply(this);

  this.log = Logger.createLogger();

  this.cache = Cache.createCache();

  this.opts = {
      debug:             false
    , root:              process.cwd()
    , from:              '/'
    , hidden:            false
    , not_found:         false
    , error_pages:       true

    //Directory options
    , subdirs:           true
    , autoindex:         false
    , autoindex_filter:  false
    , bundle:            false
    , rebundle:          true

    //Caching options
    , cache:             true
    , redis_cache:       false
    , watch_files:       true
    , client_cache:      86400 * 2

    //Response options
    , headers:           {}
    , dynamic_headers:   {}
    , gzip:              true
    , gzip_patterns:     []
    , minify:            false
    , charset:           true
  };

  // max_age alias for client_cache
  this.opts.max_age = this.opts.client_cache;

  if (options) this.set(options);

};

util.inherits(Lactate, events.EventEmitter);

//Extend Lactate prototype with HTTP status codes
require('./status_codes').apply(Lactate.prototype);

//Extend Lactate prototype with mime types
require('./mime_types').apply(Lactate.prototype);

/**
 * Get file extension
 *
 * @param {String} filePath
 * @return String
 */

Lactate.prototype.extension = function(filePath) {
  return path.extname(filePath);
};

/**
 * Parse a URL's pathname and wrap
 * it in a call to decodeURI. This
 * takes care of URL queries and 
 * encoded URLs
 *
 * @param {String} url
 * @return String
 */

Lactate.prototype.parseURL = function(url) {
  if (url.charCodeAt(0) !== 0x2F) {
    url = '/' + url;
  };

  return decodeURI(URL.parse(url).pathname);
};

/**
 * Lactate only cares about GET and 
 * HEAD methods
 *
 * @param {String} method
 * @return Boolean
 */

Lactate.prototype.isValidMethod = function(method) {
  return method === 'GET' || method === 'HEAD';
};

/**
 * Determines if a file path points
 * to a hidden file (prefixed with
 * a dot)
 *
 * @param {String} filePath
 * @return Boolean
 */

Lactate.prototype.isHidden = function(filePath) {
  var basename = path.basename(filePath);
  return basename.charCodeAt(0) === 0x2E;
};

/**
 * Determines if a mime type is
 * textual, and hence should be
 * gzipped
 *
 * @param {String} contentType
 * @return Boolean
 */

Lactate.prototype.isEncodable = function(contentType) {
  var patterns = this._get('gzip_patterns');

  var patternMatch = patterns.length 
  && patterns.some(function(pattern) {
    return pattern.test(contentType)
  });

  return patternMatch || /^text/.test(contentType);
};

/**
 * Determines if a content type
 * is minifiable (compressible)
 *
 * @param {String} contentType
 * @return Boolean
 */

Lactate.prototype.isCompressible = function(contentType) {
  var re = /^(text|application)\/(css|javascript)/i;
  return re.test(contentType);
};

/**
 * Determines if a request has a
 * fresh version of the file, 
 * indicated by if-modified-since
 * header
 *
 * @param {HTTPRequest} req
 * @param {Number} mtime
 * @return Boolean
 */

Lactate.prototype.isCached = function(req, mtime) {
  var ims = req.headers['if-modified-since'];
  return ims === mtime;
};

/**
 * Main entry into file serving. 
 * It all begins here.
 *
 * @param {String, HTTPRequest} url
 * @param {HTTPRequest, HTTPResponse} req
 * @param {HTTPResponse} res
 * @param {Function} [next]
 */

Lactate.prototype.serve = function(url, req, res, next) {
  var root = this._get('root');
  var from = this._get('from');
  var dir  = from, fp;

  // Discern request path relative
  // to root and public options

  if (typeof url === 'string') {
    url = this.parseURL(url);
    fp = path.join(root, url);
  } else {
    var len = from.length;

    next = res;
    res = req;
    req = url;

    url = this.parseURL(req.url);
    dir = path.dirname(url);
    fp  = path.join(root, url.substring(len));
  };

  var request = new FileRequest(
    fp, req, res, null, url, dir
  );

  var error, hasNext = typeof next === 'function';

  if (hasNext) {
    error = next.bind(this, null);
  } else {
    error = errorHandler.bind(this, request);
    function errorHandler(request, status) {
      this['_' + status](request);
    };
  };

  if (!this.isValidMethod(req.method)) {
    // Prevent invalid request methods
    error(405);
  }
  else if (!this._get('hidden') && this.isHidden(fp)) {
    // Prevent serving hidden files
    error(403);
  }
  else if (url.indexOf(from) !== 0) {
    // Prevent invalid directory
    error(403);
  }
  else if (!this._get('subdirs') && dir !== from) {
    // Prevent disabled subdirectories
    error(403);
  }
  else {
    // Serve file
    request.once('error', error);
    this.serveFile(request);
  };
};

/**
 * Intermediary between #serve and #complete,
 * retrieves an item from the cache if it
 * exists, otherwise does an fs#stat to get
 * file mtime.
 *
 * @param {FileRequest} request
 */

Lactate.prototype.serveFile = function(request) {
  var self = this;

  this.getCache(request, getCacheCallback);

  function getCacheCallback(err, cached) {
    if (!err && cached) {
      var headers = cached.headers;
      request.cached = cached;
      request.headers = headers;
      request.mtime = headers['Last-Modified'];
      self.complete.call(self, request);
    } else { 
      self.stat(request);
    };
  };
};

/**
 * Stat a file path, emit an error event
 * on the condition that the file does 
 * not exist.
 *
 * @param {FileRequest} request
 * @param {Function} fn
 */

Lactate.prototype.stat = function(request) {
  var self = this;
  var fp   = request.fp;
  var req  = request.req;
  var res  = request.res;

  fs.lstat(fp, statCallback);

  function statCallback(err, stat) {
    if (err) {
      request.emit('error', 404);
    } else if (stat.isDirectory()) {
      if (self._get('autoindex')) {
        self.serveIndex(fp, req, res);
      } else {
        request.emit('error', 404);
      };
    } else {
      request.mtime = stat.mtime.toUTCString();

      self.complete.call(self, request);

      // Watch file for updates
      if (self._get('watch_files')) {
        self.watchFile(request.fp);
      };
    };
  };
};

/**
 * Conditionallly watch files for changes.
 * On change, simply remove from the cache
 * and allow the next request to pick it up.
 *
 * @param {String} filePath
 */

Lactate.prototype.watchFile = function(filePath) {
  if (!this._get('cache')) return;

  var self = this;

  fs.watch(filePath, function fileWatcher(ev) {
    if (ev === 'change') {
      self.cache.remove(filePath);
      self.emit('cache change', filePath);
    };
  });
};

/**
 * Complete a file request, check
 * mtimes for conditionally sending
 * not-modified response. Otherwise,
 * if the file is cached, serve it.
 * Lastly, read and serve the file.
 *
 * @param {FileRequest} request
 * @param {Object} cached
 * @param {Number} mtime
 */

Lactate.prototype.complete = function(request) {
  var self = this;
  var req    = request.req;
  var res    = request.res;
  var cached = request.cached;
  var mtime  = request.mtime;

  var clientCached = mtime
    && this._get('client_cache')
    && this.isCached(req, mtime);

  if (clientCached) {
    this._304(request);
  } else if (cached) {
    var status   = request.status;
    var method   = request.method;
    var max_size = this.cache.segment;
    var data     = cached.read();
    var headers  = cached.headers;

    this.attachHeaders(headers, request);

    res.writeHead(request.status, headers);

    if (method === 'HEAD') {
      res.end();
      this.emit(status, request);
      return;
    };

    // Stream the cached file in
    // segments if its length 
    // exceeds segment threshold
    if (data.length < max_size) {
      res.end(data);
    } else {
      var stream = fraction.createStream(data);
      stream.on('error', console.error);
      stream.pipe(res);
    };

    if (status === 200) {
      request.message = 'OK cached';
    };

    this.emit(status, request);
  } else { 
    this.buildHeaders(request);
    this.send(request);
  };
};

/**
 * Build a headers object for 
 * the response
 *
 * @param {FileRequest} request
 * @param {Function} fn
 */

Lactate.prototype.buildHeaders = function(request) {
  var filePath = request.fp;
  var req = request.req;

  // Look up file type
  var mimeType = this.mime.lookup(filePath);

  var charset = this._get('charset');

  // Conditionally set charset
  if (charset) {
    var prefix = '; charset=';
    switch (typeof charset) {
      case 'boolean':
        var charsets = this.mime.charsets;
        if (charset = charsets.lookup(mimeType))
          mimeType += prefix + charset;
      break;
      case 'string':
        mimeType += prefix + charset;
      break;
    };
  };

  // Default headers
  var headers = { 'Content-Type': mimeType };

  var encode = this._get('gzip')
  && this.isEncodable(mimeType);

  if (encode) {
    headers['Content-Encoding'] = 'gzip';
  };

  // Headers for 'success'
  // status codes only
  if (request.status < 300) {
    // Use no-store, no-cache, 
    // for non-cached requests,
    // otherwise set max-age
    var maxAge = this._get('client_cache');
    var cacheControl = maxAge
    ? 'public, max-age=' + maxAge
    : 'no-store, no-cache';

    // Always set must-revalidate

    cacheControl += ', must-revalidate';

    headers['Last-Modified'] = request.mtime;
    headers['Cache-Control'] = cacheControl;
  };

  // Extend response headers
  // with `headers` option.
  this.attachHeaders(headers);
  this.attachHeaders(headers, request);

  request.headers = headers;
};

/**
 * Attach headers, static or 
 * request-variant
 *
 * @param {Object} headers
 * @param {FileRequest} request
 */

Lactate.prototype.attachHeaders = function(headers, request) {
  var dynamic = !!request;
  var type = dynamic 
    ? 'dynamic_headers' 
    : 'headers';

  var ext = this._get(type);
  var keys = Object.keys(ext);
  var len = keys.length;
  var attach;

  if (len < 1) return;

  if (dynamic) {
    attach = function(header) { 
      var req = request.req;
      var res = request.res;
      return header(req, res); 
    }
  } else {
    attach = function(header) {
      return header; 
    };
  };

  while (len--) {
    var header = keys[len];
    headers[header] = attach(ext[header]);
  };
};

/**
 * Send the file and cache it
 * for future requests
 *
 * @param {FileRequest} request
 * @param {Object} headers
 */

Lactate.prototype.send = function(request) {
  var self    = this;
  var fp      = request.fp;
  var req     = request.req;
  var res     = request.res;
  var status  = request.status;
  var headers = request.headers;

  var mux = new Suckle(res);

  if (this._get('cache')) {
    // After file is streamed,
    // set in-memory cache
    function muxCallback(data, length) {
      headers['Content-Length'] = length;
      self.setCache(request, data);
    };
    mux.onComplete(muxCallback);
  };

  // On error, respond with
  // 500 internal error
  var error = function error() {
    request.emit('error', 500);
  };

  // On open, write headers
  var open = function open() {
    res.writeHead(status, headers);
    process.nextTick(function() {
      self.emit(status, request);
    });
  };

  // Open file readstream
  var rs = fs.createReadStream(fp);
  rs.once('error', error);
  rs.once('open', open);

  // Detect content-type for
  // automatic minification
  // of text files, if enabled
  var cType = headers['Content-Type'];

  var encode = !!headers['Content-Encoding'];

  var compress = this._get('minify')
  && this.isCompressible(cType);

  if (!encode && !compress) { 
    // Pipe directly to response
    return rs.pipe(mux); 
  };

  // Minification
  rs = compress ? abridge.minify(rs) : rs;

  // Gzip
  if (!encode) {
    rs.pipe(mux);
  } else {
    rs.pipe(zlib.createGzip()).pipe(mux);
  };
};

/**
 * Set cache
 *
 * @param {String} filePath
 * @param {Object} headers
 * @param {Buffer} data
 */

Lactate.prototype.setCache = function(request, data) {
  if (!this._get('cache')) return;
  var filePath = request.fp;
  var headers = request.headers;
  this.cache.set(filePath, headers, data);
};

/**
 * Get cache
 *
 * @param {String} filePath
 * @param {Function} fn
 */

Lactate.prototype.getCache = function(request, fn) {
  if (!this._get('cache')) return fn();
  var filePath = request.fp;
  this.cache.get(filePath, fn);
};

/**
 * Safe get option, replaces spaces
 * with underscores for enhanced 
 * presentation
 *
 * @param {String} key
 * @return option
 */

Lactate.prototype.get = function(key) {
  return this._get(key.replace(/\s/g, '_'));
};

/**
 * Unsafe get, used internally for 
 * enhanced performance
 *
 * @param {String} key
 * @return option
 */

Lactate.prototype._get = function(key) {
  return this.opts[key];
};

/**
 * Set option
 *
 * @param {String} key
 * @param val
 */

Lactate.prototype.set = function(key, val) {

  if (typeof key === 'object') {
    var keys = Object.keys(key);
    return keys.forEach(function(opt) {
      this.set(opt, key[opt]);
    }, this);
  };

  key = key.replace(/\s/g, '_');

  if (!this.opts.hasOwnProperty(key)) {
    return;
  };

  var valType = typeof val;

  switch (key) {
    case 'root':
      val = path.resolve(val);
      break;
    case 'from':
      if (val[0] !== '/') val = '/' + val;
      break;
    case 'header':
    case 'dynamic_header':
      return this.setHeader(key, val);
      break;
    case 'client_cache':
      if (!val) break;
      if (valType === 'boolean') val = 'two weeks';
      val = valType === 'string' ? expire.getSeconds(val) : val
      // Vestige
      this.opts['max_age'] = val;
      break;
    case 'max_age':
      return this.set('client_cache', val);
      break;
    case 'cache':
      if (!val) break;

      var opts = valType  === 'object' ? val: {};
      this.cache = Cache.createCache(opts);

      val = true;
      break;
    case 'redis_cache':
      if (!val) break;

      var opts = valType  === 'object' ? val : {};
      opts.redis = true;
      this.cache = Cache.createCache(opts);

      val = true;
      break;
    case 'debug':
      if (!val) break;
      Logger.createDebugger.call(this);
      break;
  };

  this.opts[key] = val;
};

// Set boolean option to true
Lactate.prototype.enable = function(key) {
  this.set(key, true);
};

// Set boolean option to false
Lactate.prototype.disable = function(key) {
  this.set(key, false);
};

// Setter for 'root'
Lactate.prototype.root = function(val) {
  this.set('root', val);
};

// Setter for 'from'
Lactate.prototype.from = function(val) {
  this.set('from', val);
};

// Special setter for 'max_age'
Lactate.prototype.max_age = 
Lactate.prototype.maxAge = function(val) {
  this.set('max_age', val);
};

// Special setter for 'not_found'
Lactate.prototype.notFound = function(val) {
  this.set('not_found', val);
};

// Special setter for 'headers'
Lactate.prototype.header = 
Lactate.prototype.headers = 
Lactate.prototype.setHeader = function(key, val) {
  // Recurse
  if (typeof key === 'object') {
    var headers = Object.keys(key);
    headers.forEach(function(header) {
      this.setHeader(header, key[header]);
    }, this);
    return;
  };

  var map = {
    'string':'headers',
    'function':'dynamic_headers' 
  };

  var type = map[typeof val];

  if (!!type) this.get(type)[key] = val;
};

// Setter for gzip_patterns
Lactate.prototype.gzip = function() {
  var args = Array.prototype.slice.call(arguments);

  args = args.map(function(pattern) {
    if (typeof pattern === 'string') {
      return new RegExp(pattern);
    } else {
      return pattern;
    };
  });

  var opts = this.opts;
  opts.gzip_patterns = opts.gzip_patterns.concat(args);
};

// Define custom mime types
Lactate.prototype.define = function(extension, mimeType) {
  if (typeof extension === 'object') {
    var types = Object.keys(extension);
    types.forEach(function(type) {
      this.define(type, extension[type]);
    }, this);
  } else {
    extension = extension.replace(/^\./, '');
    var defineObj = {};
    defineObj[mimeType] = [extension];
    this.mime.define(defineObj);
  };
};

module.exports.Lactate = function(options) {
  return new Lactate(options);
};

module.exports.file = function(path, req, res, options) {
  var lactate = new Lactate(options);
  return lactate.serve(path, req, res);
};

module.exports.dir = function(directory, options) {
  if (typeof directory === 'string') {
    options = options || {};
    options.root = directory;
  } else {
    options = directory || {};
    options.root = options.root || process.cwd();
  };

  var lactate = new Lactate(options);
  Directory.apply(lactate);
  return lactate;
};

// Replacement for Express.static
module.exports.static = function(dir, from, options) {
  options = options || {};

  if (typeof dir === 'object') {
    options = dir;
    dir = options.root || process.cwd();
  } else {
    switch(typeof from) {
      case 'string':
        options.from = from;
        break;
      case 'object':
        options = from;
        break;
    };
  };

  var lactate = module.exports.dir(dir, options);
  return lactate.toMiddleware();
};

// Adaptors for node-static API
module.exports.serveFile = module.exports.file;
module.exports.Server    = module.exports.dir;

// Create a server
module.exports.createServer = function(options) {
  var handler = module.exports.static(options);
  var server = require('http').createServer(handler);
  return server;
};
