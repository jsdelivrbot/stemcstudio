# Lactate

`npm install -g lactate`

An exceedingly fast static file handler, with a few electives.

### Features

* In-memory caching
* Redis caching
* Robust cache-control setting
* Automatic gzipping
* Automatic minification
* Custom 404 pages
* Custom response headers
* Custom / automatic charset headers
* Custom gzip patterns
* Asset bundling and minification
* Middleware export
* Default error pages
* on(status) listeners
* Colored log output
* Global executable
* Directory indexing
* Express.static API compatibility
* node-static API compatibility

## Using Lactate

### Global executable

If installed globally with `npm install -g lactate`, you will have the `lactate` command at your disposal. This will run lactate static file server in the current working directory, utilizing the `cluster` module for multiple CPU cores. All [options](https://github.com/Weltschmerz/Lactate#options) are available.

```code
$ lactate --help
Usage: lactate [options]

Options:
--root, -r          Local path                          [default: ""]
--from, -f          Public path                         [default: ""]
--subdirs, -s       Serve subdirectories                [default: true]
--hidden, -h        Serve hidden files                  [default: false]
--error-pages       Serve error pages                   [default: true]
--autoindex, -a     Automatically index directories     [default: true]
--cache, -c         Store assets in-memory              [default: true]
--watch-files       Watch files for cache update        [default: true]
--client-cache      Client-side caching max-age         [default: 172800]
--gzip, -g          Gzip text assets                    [default: true]
--minify, -m        Minify text assets                  [default: false]
--bundle, -b        Bundle text assets                  [default: false]
--rebundle, --rb    Rebundle assets if modified         [default: true]
--headers, -H       Custom response headers             [default: ""]
--debug, -d         Log HTTP info                       [default: true]
--quiet, -q         Prevent all log output              [default: false]

```

### Programmatic lactating

Lactate can be used with either plain node, or with Express. With Express, Lactate is a drop-in replacement for `static` middleware, but with far more ability. The examples below use Express 2.x API for simplicity. See the [examples](https://github.com/Weltschmerz/Lactate/tree/master/example) for various examples.

```js
var lactate = require('lactate');
var express = require('express');

var app = express();
app.use(lactate.static(__dirname + '/files'));
```

## Testing Lactate

If installed locally (without -g flag to npm install):

1. `cd` into `~/node_modules/lactate`
2. `npm install ./` to install devDependencies
3. `make test` to run mocha test

##The varieties of Lactate experience

###Creating a Lactate server

```js
var lactate = require('lactate'); 
var options = {root:'files'}; 
var server = lactate.createServer(options); 

server.listen(8080);
```

###Creating a directory handler

```js
var lactate = require('lactate');
var options = {from:'public/path/to/files'};
var files = lactate.dir('files', options);

var http = require('http');
var server = new http.Server;

server.addListener('request', function(req, res) {
  files.serve(req, res);
});

server.listen(8080);
```

###Using directory middleware

```js
var lactate = require('lactate');
var files = lactate.dir('files', options);

var http = require('http');
var server = new http.Server;

server.addListener('request', files.toMiddleware());
server.listen(8080);
```

###Integrating with Express

```js
var lactate = require('lactate');
var files = lactate.dir('files', options);

var express = require('express');
var app = express();

app.use(files.toMiddleware());
app.listen(8080);
```

###Using Express.static API

```js
var lactate = require('lactate');
var express = require('express');
var app = express();

app.use(lactate.static(__dirname + '/files'));
app.listen(8000);
```

###Using node-static API

```js
var lactate = require('lactate');
var files = new(lactate.Server)('./files');

var http = require('http');
var server = new http.Server;

// You could also pass a .toMiddleware()'d function

server.addListener('request', function(req, res) {
  files.serve(req, res);
});

server.listen(8000);
```

###Serving individual files

```js
var lactate = require('lactate');

var fileOptions = {from:'public/directory'};
var files = lactate.dir('files', fileOptions);

var pageOptions = {};
var pages = lactate.dir('pages');

var http = require('http');
var server = new http.Server;

server.addListener('request', function(req, res) {
  if (req.url === '/') {
    pages.serve('index.html', req, res);
  } else {
    files.serve(req, res);
  };
});
server.listen(8000);
```

###Setting options

```js
var lactate = require('lactate');

var fileOptions = {
  from:'public'
};

var files = lactate.dir('files', fileOptions);

files.set('cache', false);
files.disable('gzip');
files.maxAge('ten days');

var express = require('express');
var app = express():
  
app.get('/public/*', files.toMiddleware());
app.listen(8080);
```

###Bundling assets

```js
var lactate = require('lactate');
var options = {
  from:'files'
};

var files = lactate.dir('files', options);

// Combine and minify all scripts to 'common.js'
files.bundle('js', 'common.js', function(err, data) {
// Handle errors
});

// Combine and minify all CSS to 'common.css'
files.bundleCSS('common.css');

var express = require('express');
var app = express();

app.use(files.toMiddleware());
app.listen(8000);
```

###Using custom 404 pages

```js
var lactate = require('lactate');
var files = lactate.dir('files');

files.notFound('path/to/404/page.html');

files.notFound(function(req, res) {
  res.writeHead(404);
  res.end('Woops, 404');
});

var express = require('express');
var app = express();

app.use(files.toMiddleware());
app.listen(8000);
```

###Using custom response headers

```js
var lactate = require('lactate');
var files = lactate.dir('files');

files.setHeader('x-powered-by', 'Lactate');
files.header('x-timestamp', function(req, res) {
  return new Date().toUTCString();
});

var headers = {};
files.headers(headers);
```

###Status listeners

Lactate extends EventEmitter for emitting status code events.

```js
var files = lactate.dir('files');
files.on('404', function(req) {
  console.log('404', req.url);
});
```

##Options

### Setting options

Boolean options may be set using `enable` and `disable` methods. Other options may be set using `set` method with either key/value or an options object.

**Passing to initialization function**

```js
var lactate = require('lactate').Lactate({
  max_age:'two days'
})
```

**Using `set` method**

```js
lactate.set('hidden', true)
```

**Using enable/disable:**

```js
lactate.disable('gzip');
lactate.enable('minify');
```

**Special options methods**

Lactate has some special methods to reduce visual clutter. For setting client-side expiration use `maxAge`

```js
lactate.maxAge('two days');
```

is equivalent to:

```js
lactate.set('max age', 'two days');
```

For setting `custom headers` you may use `setHeader`

```js
lactate.setHeader('x-powered-by', 'Rodent exercise');
```

You can also use a function with `setHeader` for added variance:

```js
lactate.setHeader('x-id', function(req, res) {
  return Math.random().toString(36).substring(2);
}):
```

For defining `charsets`, you may use `Lactate.define`

```js
lactate.define('js', 'application/javascript');
```

or with an object

```js
lactate.define({
  'html': 'text/html; charset=utf-8',
  'js': 'application/javascript'
});
```

**Underscores or spaces**

Use spaces instead of underscores if you prefer:

```js
lactate.disable('max age');
lactate.enable('watch files');
```

### Options available

+ `root` **string**

Local directory from which to serve files. By default, the current working directory.

+ `from` **string**

Public directory exposed to clients. If set, only requests from /*directory* will complete. Contrast this with the `root` option which is the location of files on the serving machine, not necessarily the requested path.

+ `subdirs` **boolean**

By default subdirectories are served. To disable this, set `subdirs` to false.

+ `hidden` **boolean**

Whether or not to serve hidden files. Default is false.

+ `error pages` **boolean**

Enabled by default. When disabled, Lactate will not serve error pages for 404 resposes, etc..

+ `autoindex` **boolean**

Automatically display directory indexes. Disabled by default.

+ `cache` **boolean** or **object**

Keep files in-memory. Enabled by default. For caching options and more information about caching strategy, see [Caching Options](https://github.com/Weltschmerz/Lactate#caching-options).

+ `gzip` **boolean**

If false, disables automatic gzipping for text files (HTML, JS, CSS). Enabled by default.

+ `minify` **boolean**

If true, will automatically minify JavaScript and CSS using [Abridge](https://github.com/Weltschmerz/Abridge). Disabled by default.

+ `watch files` **boolean**

Determines whether Lactate will watch files to update its cache. If this is disabled, then your file cache will not update automatically as files are modified on the server.

+ `headers` **object** or **function**

Sets custom response headers. If the option value is a function, it is a callback which is give (req, res) arguments. This function should return the header value; it is a mapping function.

+ `max age` **number** or **string**

Pass this function a number (of seconds) or a string and appropriate headers will be set for client-side caching. Lactate comes with expiration defaults, such as 'two days' or '5 years and sixteen days' See [Expire](https://github.com/Weltschmerz/Expire) for details.

```js
lactate.set('max_age', 87500)
//87500 seconds
lactate.set('max_age', 'two days')
//172800 seconds
lactate.set'max_age', 'five weeks and one minute and ten seconds')
//3024070 seconds
lactate.set('max_age', 'one year and 2 months and seven weeks and 16 seconds')
//41050028 seconds
```

+ `not found` **string** or **function**

For custom 404 handling. Functions are supplied the response for 100% custom response handling. Otherwise, if set to a string, this option will be treated as an ordinary file path and abide rules for gzipping / in-memory cache.

+ `gzip patterns` **array**

Set custom gzip RegExp patterns. The patterns are matched with mime types. E.g. `/(\+|\/)xml$/` may be used for matching XML documents for gzipping. You may either use:

```js
lactate.set('gzip patterns', []);
```

Or perhaps more conveniently:

```js
//Accepts RegExp or String
lactate.gzip(/pattern/, ...);
```

+ `charset` **boolean** or **string**

Set custom response charset, or automatically detect charset using `node-mime`.

```js
lactate.enable('charset');
// Content-Type: text/html; charset=UTF-8
```

```js
lactate.set('charset', 'utf-8');
// Content-Type: text/html; charset=UTF-8
```

+ `debug` **boolean**

Colored status / msg / path logging, for debugging purposes.

###Caching options

Pass an object to the `cache` option setting. The following fields are accepted and optional:

* `expire` Seconds expiration for cache keys. Keys expire after they are untouched for x-seconds. Default is `15min`.
* `max keys` Maximum number of keys to keep in memory. Default is `Infinity`.
* `max size` Maximum size in MB to keep in cache. Default is `100mb`.
* `segment` Determines the threshold after which to segment a file for streaming instead of traditional writing. Default is `200kb`.

```js
  var options = {};
  
  options.cache = {
    expire:5,
    max_keys:200,
    max_size:2,
    segment:100
  };

  var files = lactate.static('files', options);

  // Or use a string representation. Same as setting for max-age.
  options.cache.expire = 'fifteen minutes';
  files.set('cache', options.cache);
```


## License

MIT

