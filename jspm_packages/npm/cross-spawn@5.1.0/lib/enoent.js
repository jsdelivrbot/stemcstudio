/* */ 
(function(process) {
  'use strict';
  var isWin = process.platform === 'win32';
  var resolveCommand = require('./util/resolveCommand');
  var isNode10 = process.version.indexOf('v0.10.') === 0;
  function notFoundError(command, syscall) {
    var err;
    err = new Error(syscall + ' ' + command + ' ENOENT');
    err.code = err.errno = 'ENOENT';
    err.syscall = syscall + ' ' + command;
    return err;
  }
  function hookChildProcess(cp, parsed) {
    var originalEmit;
    if (!isWin) {
      return;
    }
    originalEmit = cp.emit;
    cp.emit = function(name, arg1) {
      var err;
      if (name === 'exit') {
        err = verifyENOENT(arg1, parsed, 'spawn');
        if (err) {
          return originalEmit.call(cp, 'error', err);
        }
      }
      return originalEmit.apply(cp, arguments);
    };
  }
  function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
      return notFoundError(parsed.original, 'spawn');
    }
    return null;
  }
  function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
      return notFoundError(parsed.original, 'spawnSync');
    }
    if (isNode10 && status === -1) {
      parsed.file = isWin ? parsed.file : resolveCommand(parsed.original);
      if (!parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
      }
    }
    return null;
  }
  module.exports.hookChildProcess = hookChildProcess;
  module.exports.verifyENOENT = verifyENOENT;
  module.exports.verifyENOENTSync = verifyENOENTSync;
  module.exports.notFoundError = notFoundError;
})(require('process'));
