/* */ 
(function(process) {
  'use strict';
  var path = require('path');
  var which = require('which');
  var LRU = require('lru-cache');
  var commandCache = new LRU({
    max: 50,
    maxAge: 30 * 1000
  });
  function resolveCommand(command, noExtension) {
    var resolved;
    noExtension = !!noExtension;
    resolved = commandCache.get(command + '!' + noExtension);
    if (commandCache.has(command)) {
      return commandCache.get(command);
    }
    try {
      resolved = !noExtension ? which.sync(command) : which.sync(command, {pathExt: path.delimiter + (process.env.PATHEXT || '')});
    } catch (e) {}
    commandCache.set(command + '!' + noExtension, resolved);
    return resolved;
  }
  module.exports = resolveCommand;
})(require('process'));
