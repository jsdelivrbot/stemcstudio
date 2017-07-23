/* */ 
(function(process) {
  'use strict';
  var resolveCommand = require('./util/resolveCommand');
  var hasEmptyArgumentBug = require('./util/hasEmptyArgumentBug');
  var escapeArgument = require('./util/escapeArgument');
  var escapeCommand = require('./util/escapeCommand');
  var readShebang = require('./util/readShebang');
  var isWin = process.platform === 'win32';
  var skipShellRegExp = /\.(?:com|exe)$/i;
  var supportsShellOption = parseInt(process.version.substr(1).split('.')[0], 10) >= 6 || parseInt(process.version.substr(1).split('.')[0], 10) === 4 && parseInt(process.version.substr(1).split('.')[1], 10) >= 8;
  function parseNonShell(parsed) {
    var shebang;
    var needsShell;
    var applyQuotes;
    if (!isWin) {
      return parsed;
    }
    parsed.file = resolveCommand(parsed.command);
    parsed.file = parsed.file || resolveCommand(parsed.command, true);
    shebang = parsed.file && readShebang(parsed.file);
    if (shebang) {
      parsed.args.unshift(parsed.file);
      parsed.command = shebang;
      needsShell = hasEmptyArgumentBug || !skipShellRegExp.test(resolveCommand(shebang) || resolveCommand(shebang, true));
    } else {
      needsShell = hasEmptyArgumentBug || !skipShellRegExp.test(parsed.file);
    }
    if (needsShell) {
      applyQuotes = (parsed.command !== 'echo');
      parsed.command = escapeCommand(parsed.command);
      parsed.args = parsed.args.map(function(arg) {
        return escapeArgument(arg, applyQuotes);
      });
      parsed.args = ['/d', '/s', '/c', '"' + parsed.command + (parsed.args.length ? ' ' + parsed.args.join(' ') : '') + '"'];
      parsed.command = process.env.comspec || 'cmd.exe';
      parsed.options.windowsVerbatimArguments = true;
    }
    return parsed;
  }
  function parseShell(parsed) {
    var shellCommand;
    if (supportsShellOption) {
      return parsed;
    }
    shellCommand = [parsed.command].concat(parsed.args).join(' ');
    if (isWin) {
      parsed.command = typeof parsed.options.shell === 'string' ? parsed.options.shell : process.env.comspec || 'cmd.exe';
      parsed.args = ['/d', '/s', '/c', '"' + shellCommand + '"'];
      parsed.options.windowsVerbatimArguments = true;
    } else {
      if (typeof parsed.options.shell === 'string') {
        parsed.command = parsed.options.shell;
      } else if (process.platform === 'android') {
        parsed.command = '/system/bin/sh';
      } else {
        parsed.command = '/bin/sh';
      }
      parsed.args = ['-c', shellCommand];
    }
    return parsed;
  }
  function parse(command, args, options) {
    var parsed;
    if (args && !Array.isArray(args)) {
      options = args;
      args = null;
    }
    args = args ? args.slice(0) : [];
    options = options || {};
    parsed = {
      command: command,
      args: args,
      options: options,
      file: undefined,
      original: command
    };
    return options.shell ? parseShell(parsed) : parseNonShell(parsed);
  }
  module.exports = parse;
})(require('process'));
