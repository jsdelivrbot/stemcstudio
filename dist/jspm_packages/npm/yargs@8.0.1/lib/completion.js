/* */ 
(function(process) {
  const fs = require('fs');
  const path = require('path');
  module.exports = function(yargs, usage, command) {
    const self = {completionKey: 'get-yargs-completions'};
    self.getCompletion = function(args, done) {
      const completions = [];
      const current = args.length ? args[args.length - 1] : '';
      const argv = yargs.parse(args, true);
      const aliases = yargs.parsed.aliases;
      if (completionFunction) {
        if (completionFunction.length < 3) {
          var result = completionFunction(current, argv);
          if (typeof result.then === 'function') {
            return result.then(function(list) {
              process.nextTick(function() {
                done(list);
              });
            }).catch(function(err) {
              process.nextTick(function() {
                throw err;
              });
            });
          }
          return done(result);
        } else {
          return completionFunction(current, argv, function(completions) {
            done(completions);
          });
        }
      }
      var handlers = command.getCommandHandlers();
      for (var i = 0,
          ii = args.length; i < ii; ++i) {
        if (handlers[args[i]] && handlers[args[i]].builder) {
          const builder = handlers[args[i]].builder;
          if (typeof builder === 'function') {
            const y = yargs.reset();
            builder(y);
            return y.argv;
          }
        }
      }
      if (!current.match(/^-/)) {
        usage.getCommands().forEach(function(command) {
          if (args.indexOf(command[0]) === -1) {
            completions.push(command[0]);
          }
        });
      }
      if (current.match(/^-/)) {
        Object.keys(yargs.getOptions().key).forEach(function(key) {
          var keyAndAliases = [key].concat(aliases[key] || []);
          var notInArgs = keyAndAliases.every(function(val) {
            return args.indexOf('--' + val) === -1;
          });
          if (notInArgs) {
            completions.push('--' + key);
          }
        });
      }
      done(completions);
    };
    self.generateCompletionScript = function($0) {
      var script = fs.readFileSync(path.resolve(__dirname, '../completion.sh.hbs'), 'utf-8');
      var name = path.basename($0);
      if ($0.match(/\.js$/))
        $0 = './' + $0;
      script = script.replace(/{{app_name}}/g, name);
      return script.replace(/{{app_path}}/g, $0);
    };
    var completionFunction = null;
    self.registerFunction = function(fn) {
      completionFunction = fn;
    };
    return self;
  };
})(require('process'));
