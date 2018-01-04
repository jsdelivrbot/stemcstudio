/* */ 
(function(process) {
  'use strict';
  const fs = require('fs');
  const path = require('path');
  module.exports = function completion(yargs, usage, command) {
    const self = {completionKey: 'get-yargs-completions'};
    self.getCompletion = function getCompletion(args, done) {
      const completions = [];
      const current = args.length ? args[args.length - 1] : '';
      const argv = yargs.parse(args, true);
      const aliases = yargs.parsed.aliases;
      if (completionFunction) {
        if (completionFunction.length < 3) {
          const result = completionFunction(current, argv);
          if (typeof result.then === 'function') {
            return result.then((list) => {
              process.nextTick(() => {
                done(list);
              });
            }).catch((err) => {
              process.nextTick(() => {
                throw err;
              });
            });
          }
          return done(result);
        } else {
          return completionFunction(current, argv, (completions) => {
            done(completions);
          });
        }
      }
      const handlers = command.getCommandHandlers();
      for (let i = 0,
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
        usage.getCommands().forEach((usageCommand) => {
          const commandName = command.parseCommand(usageCommand[0]).cmd;
          if (args.indexOf(commandName) === -1) {
            completions.push(commandName);
          }
        });
      }
      if (current.match(/^-/)) {
        Object.keys(yargs.getOptions().key).forEach((key) => {
          const keyAndAliases = [key].concat(aliases[key] || []);
          const notInArgs = keyAndAliases.every((val) => args.indexOf(`--${val}`) === -1);
          if (notInArgs) {
            completions.push(`--${key}`);
          }
        });
      }
      done(completions);
    };
    self.generateCompletionScript = function generateCompletionScript($0, cmd) {
      let script = fs.readFileSync(path.resolve(__dirname, '../completion.sh.hbs'), 'utf-8');
      const name = path.basename($0);
      if ($0.match(/\.js$/))
        $0 = `./${$0}`;
      script = script.replace(/{{app_name}}/g, name);
      script = script.replace(/{{completion_command}}/g, cmd);
      return script.replace(/{{app_path}}/g, $0);
    };
    let completionFunction = null;
    self.registerFunction = (fn) => {
      completionFunction = fn;
    };
    return self;
  };
})(require('process'));
