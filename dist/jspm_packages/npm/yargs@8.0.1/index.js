/* */ 
(function(process) {
  const yargs = require('./yargs');
  Argv(process.argv.slice(2));
  module.exports = Argv;
  function Argv(processArgs, cwd) {
    const argv = yargs(processArgs, cwd, require);
    singletonify(argv);
    return argv;
  }
  function singletonify(inst) {
    Object.keys(inst).forEach(function(key) {
      if (key === 'argv') {
        Argv.__defineGetter__(key, inst.__lookupGetter__(key));
      } else {
        Argv[key] = typeof inst[key] === 'function' ? inst[key].bind(inst) : inst[key];
      }
    });
  }
})(require('process'));
