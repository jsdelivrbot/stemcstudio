/* */ 
'use strict';
var escapeArgument = require('./escapeArgument');
function escapeCommand(command) {
  return /^[a-z0-9_-]+$/i.test(command) ? command : escapeArgument(command, true);
}
module.exports = escapeCommand;
