/* */ 
(function(Buffer) {
  'use strict';
  var fs = require('fs');
  var LRU = require('lru-cache');
  var shebangCommand = require('shebang-command');
  var shebangCache = new LRU({
    max: 50,
    maxAge: 30 * 1000
  });
  function readShebang(command) {
    var buffer;
    var fd;
    var shebang;
    if (shebangCache.has(command)) {
      return shebangCache.get(command);
    }
    buffer = new Buffer(150);
    try {
      fd = fs.openSync(command, 'r');
      fs.readSync(fd, buffer, 0, 150, 0);
      fs.closeSync(fd);
    } catch (e) {}
    shebang = shebangCommand(buffer.toString());
    shebangCache.set(command, shebang);
    return shebang;
  }
  module.exports = readShebang;
})(require('buffer').Buffer);
