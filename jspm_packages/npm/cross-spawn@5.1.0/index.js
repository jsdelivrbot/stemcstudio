/* */ 
(function(process) {
  'use strict';
  var cp = require('child_process');
  var parse = require('./lib/parse');
  var enoent = require('./lib/enoent');
  var cpSpawnSync = cp.spawnSync;
  function spawn(command, args, options) {
    var parsed;
    var spawned;
    parsed = parse(command, args, options);
    spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
    enoent.hookChildProcess(spawned, parsed);
    return spawned;
  }
  function spawnSync(command, args, options) {
    var parsed;
    var result;
    if (!cpSpawnSync) {
      try {
        cpSpawnSync = require('spawn-sync');
      } catch (ex) {
        throw new Error('In order to use spawnSync on node 0.10 or older, you must ' + 'install spawn-sync:\n\n' + '  npm install spawn-sync --save');
      }
    }
    parsed = parse(command, args, options);
    result = cpSpawnSync(parsed.command, parsed.args, parsed.options);
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
    return result;
  }
  module.exports = spawn;
  module.exports.spawn = spawn;
  module.exports.sync = spawnSync;
  module.exports._parse = parse;
  module.exports._enoent = enoent;
})(require('process'));
