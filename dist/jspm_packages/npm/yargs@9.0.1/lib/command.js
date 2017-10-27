/* */ 
'use strict';
const path = require('path');
const inspect = require('util').inspect;
const camelCase = require('camelcase');
const DEFAULT_MARKER = '*';
module.exports = function command(yargs, usage, validation) {
  const self = {};
  let handlers = {};
  let aliasMap = {};
  let defaultCommand;
  self.addHandler = function addHandler(cmd, description, builder, handler) {
    let aliases = [];
    handler = handler || (() => {});
    if (Array.isArray(cmd)) {
      aliases = cmd.slice(1);
      cmd = cmd[0];
    } else if (typeof cmd === 'object') {
      let command = (Array.isArray(cmd.command) || typeof cmd.command === 'string') ? cmd.command : moduleName(cmd);
      if (cmd.aliases)
        command = [].concat(command).concat(cmd.aliases);
      self.addHandler(command, extractDesc(cmd), cmd.builder, cmd.handler);
      return;
    }
    if (typeof builder === 'object' && builder.builder && typeof builder.handler === 'function') {
      self.addHandler([cmd].concat(aliases), description, builder.builder, builder.handler);
      return;
    }
    const parsedCommand = self.parseCommand(cmd);
    aliases = aliases.map((alias) => self.parseCommand(alias).cmd);
    let isDefault = false;
    const parsedAliases = [parsedCommand.cmd].concat(aliases).filter((c) => {
      if (c === DEFAULT_MARKER) {
        isDefault = true;
        return false;
      }
      return true;
    });
    if (isDefault && parsedAliases.length === 0) {
      defaultCommand = {
        original: cmd.replace(DEFAULT_MARKER, '').trim(),
        handler,
        builder: builder || {},
        demanded: parsedCommand.demanded,
        optional: parsedCommand.optional
      };
      return;
    }
    if (isDefault) {
      parsedCommand.cmd = parsedAliases[0];
      aliases = parsedAliases.slice(1);
      cmd = cmd.replace(DEFAULT_MARKER, parsedCommand.cmd);
    }
    aliases.forEach((alias) => {
      aliasMap[alias] = parsedCommand.cmd;
    });
    if (description !== false) {
      usage.command(cmd, description, isDefault, aliases);
    }
    handlers[parsedCommand.cmd] = {
      original: cmd,
      handler,
      builder: builder || {},
      demanded: parsedCommand.demanded,
      optional: parsedCommand.optional
    };
    if (isDefault)
      defaultCommand = handlers[parsedCommand.cmd];
  };
  self.addDirectory = function addDirectory(dir, context, req, callerFile, opts) {
    opts = opts || {};
    if (typeof opts.recurse !== 'boolean')
      opts.recurse = false;
    if (!Array.isArray(opts.extensions))
      opts.extensions = ['js'];
    const parentVisit = typeof opts.visit === 'function' ? opts.visit : (o) => o;
    opts.visit = function visit(obj, joined, filename) {
      const visited = parentVisit(obj, joined, filename);
      if (visited) {
        if (~context.files.indexOf(joined))
          return visited;
        context.files.push(joined);
        self.addHandler(visited);
      }
      return visited;
    };
    require('require-directory')({
      require: req,
      filename: callerFile
    }, dir, opts);
  };
  function moduleName(obj) {
    const mod = require('which-module')(obj);
    if (!mod)
      throw new Error(`No command name given for module: ${inspect(obj)}`);
    return commandFromFilename(mod.filename);
  }
  function commandFromFilename(filename) {
    return path.basename(filename, path.extname(filename));
  }
  function extractDesc(obj) {
    for (let keys = ['describe', 'description', 'desc'],
        i = 0,
        l = keys.length,
        test; i < l; i++) {
      test = obj[keys[i]];
      if (typeof test === 'string' || typeof test === 'boolean')
        return test;
    }
    return false;
  }
  self.parseCommand = function parseCommand(cmd) {
    const extraSpacesStrippedCommand = cmd.replace(/\s{2,}/g, ' ');
    const splitCommand = extraSpacesStrippedCommand.split(/\s+(?![^[]*]|[^<]*>)/);
    const bregex = /\.*[\][<>]/g;
    const parsedCommand = {
      cmd: (splitCommand.shift()).replace(bregex, ''),
      demanded: [],
      optional: []
    };
    splitCommand.forEach((cmd, i) => {
      let variadic = false;
      cmd = cmd.replace(/\s/g, '');
      if (/\.+[\]>]/.test(cmd) && i === splitCommand.length - 1)
        variadic = true;
      if (/^\[/.test(cmd)) {
        parsedCommand.optional.push({
          cmd: cmd.replace(bregex, '').split('|'),
          variadic
        });
      } else {
        parsedCommand.demanded.push({
          cmd: cmd.replace(bregex, '').split('|'),
          variadic
        });
      }
    });
    return parsedCommand;
  };
  self.getCommands = () => Object.keys(handlers).concat(Object.keys(aliasMap));
  self.getCommandHandlers = () => handlers;
  self.hasDefaultCommand = () => !!defaultCommand;
  self.runCommand = function runCommand(command, yargs, parsed, commandIndex) {
    let aliases = parsed.aliases;
    const commandHandler = handlers[command] || handlers[aliasMap[command]] || defaultCommand;
    const currentContext = yargs.getContext();
    let numFiles = currentContext.files.length;
    const parentCommands = currentContext.commands.slice();
    let innerArgv = parsed.argv;
    let innerYargs = null;
    let positionalMap = {};
    if (command)
      currentContext.commands.push(command);
    if (typeof commandHandler.builder === 'function') {
      innerYargs = commandHandler.builder(yargs.reset(parsed.aliases));
      if (yargs.parsed === false) {
        if (typeof yargs.getUsageInstance().getUsage() === 'undefined') {
          yargs.usage(`$0 ${parentCommands.length ? `${parentCommands.join(' ')} ` : ''}${commandHandler.original}`);
        }
        innerArgv = innerYargs ? innerYargs._parseArgs(null, null, true, commandIndex) : yargs._parseArgs(null, null, true, commandIndex);
      } else {
        innerArgv = yargs.parsed.argv;
      }
      if (innerYargs && yargs.parsed === false)
        aliases = innerYargs.parsed.aliases;
      else
        aliases = yargs.parsed.aliases;
    } else if (typeof commandHandler.builder === 'object') {
      innerYargs = yargs.reset(parsed.aliases);
      innerYargs.usage(`$0 ${parentCommands.length ? `${parentCommands.join(' ')} ` : ''}${commandHandler.original}`);
      Object.keys(commandHandler.builder).forEach((key) => {
        innerYargs.option(key, commandHandler.builder[key]);
      });
      innerArgv = innerYargs._parseArgs(null, null, true, commandIndex);
      aliases = innerYargs.parsed.aliases;
    }
    if (!yargs._hasOutput()) {
      positionalMap = populatePositionals(commandHandler, innerArgv, currentContext, yargs);
    }
    if (!yargs._hasOutput())
      yargs._runValidation(innerArgv, aliases, positionalMap, yargs.parsed.error);
    if (commandHandler.handler && !yargs._hasOutput()) {
      yargs._setHasOutput();
      commandHandler.handler(innerArgv);
    }
    if (command)
      currentContext.commands.pop();
    numFiles = currentContext.files.length - numFiles;
    if (numFiles > 0)
      currentContext.files.splice(numFiles * -1, numFiles);
    return innerArgv;
  };
  function populatePositionals(commandHandler, argv, context, yargs) {
    argv._ = argv._.slice(context.commands.length);
    const demanded = commandHandler.demanded.slice(0);
    const optional = commandHandler.optional.slice(0);
    const positionalMap = {};
    validation.positionalCount(demanded.length, argv._.length);
    while (demanded.length) {
      const demand = demanded.shift();
      populatePositional(demand, argv, yargs, positionalMap);
    }
    while (optional.length) {
      const maybe = optional.shift();
      populatePositional(maybe, argv, yargs, positionalMap);
    }
    argv._ = context.commands.concat(argv._);
    return positionalMap;
  }
  function populatePositional(positional, argv, yargs, positionalMap) {
    let variadics = null;
    let value = null;
    for (let i = 0,
        cmd; (cmd = positional.cmd[i]) !== undefined; i++) {
      if (positional.variadic) {
        if (variadics)
          argv[cmd] = variadics.slice(0);
        else
          argv[cmd] = variadics = argv._.splice(0);
      } else {
        if (!value && !argv._.length)
          continue;
        if (value)
          argv[cmd] = value;
        else
          argv[cmd] = value = argv._.shift();
      }
      positionalMap[cmd] = true;
      postProcessPositional(yargs, argv, cmd);
      addCamelCaseExpansions(argv, cmd);
    }
  }
  function postProcessPositional(yargs, argv, key) {
    const coerce = yargs.getOptions().coerce[key];
    if (typeof coerce === 'function') {
      try {
        argv[key] = coerce(argv[key]);
      } catch (err) {
        yargs.getUsageInstance().fail(err.message, err);
      }
    }
  }
  function addCamelCaseExpansions(argv, option) {
    if (/-/.test(option)) {
      const cc = camelCase(option);
      if (typeof argv[option] === 'object')
        argv[cc] = argv[option].slice(0);
      else
        argv[cc] = argv[option];
    }
  }
  self.reset = () => {
    handlers = {};
    aliasMap = {};
    defaultCommand = undefined;
    return self;
  };
  let frozen;
  self.freeze = () => {
    frozen = {};
    frozen.handlers = handlers;
    frozen.aliasMap = aliasMap;
    frozen.defaultCommand = defaultCommand;
  };
  self.unfreeze = () => {
    handlers = frozen.handlers;
    aliasMap = frozen.aliasMap;
    defaultCommand = frozen.defaultCommand;
    frozen = undefined;
  };
  return self;
};
