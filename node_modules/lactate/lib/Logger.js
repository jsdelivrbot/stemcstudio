
/* Color-coded logging output */

module.exports.Logger = Logger;

module.exports.createLogger = function() {
  var logger = new Logger();
  return logger.log.bind(logger);
};

module.exports.createDebugger = function() {

 // [status] [msg] [request URL] [file path]

 var STATUS_CODES = this.STATUS_CODES;

  function listen(status) {
    var log = this.log;
    this.on(status, function(request) {
      var status = request.status;
      var msg = request.message || STATUS_CODES[status];
      var url = request.url || request.req.url;
      log(status, msg, url, request.fp);
    });
  };

  var codes = Object.keys(STATUS_CODES);
  codes.forEach(listen.bind(this));
};

function Logger(options) {};

Logger.prototype.log = function(status, msg, url, path) {
  var msg = this.msg(msg);
  var _status = this.status(status);
  var str = [_status, msg, '::', url, '::', path].join(' ');
  console.log(str);
};

Logger.prototype.STATUS_COLORS = {
  '2':'green',
  '3':'yellow',
  '4':'red',
  '5':'red'
};

Logger.prototype.status = function(status) {
  var _status = String(status);
  var firstChar = _status.charAt(0);
  var color = this.STATUS_COLORS[firstChar] || 'clear';
  return this.getColor(color, status);
};

Logger.prototype.msg = function(msg) {
  return this.getColor('gray', msg);
};

Logger.prototype.pad = function(str) {
  var prefix = '\u001b[';
  var suffix = 'm';
  return [prefix, suffix].join(str);
};

Logger.prototype.TERM_COLORS = {
  clear:          '0',

  brightgreen:    '1;32',
  brightcyan:     '1;36',
  brightred:      '1;31',
  brightblue:     '1;34',
  brightmagenta:  '1;35',
  brightyellow:   '1;33',
  white:          '1;37',

  green:          '0;32',
  cyan:           '0;36',
  red:            '0;31',
  blue:           '0;34',
  magenta:        '0;35',
  yellow:         '0;33',
  gray:           '0;37'
};

Logger.prototype.getColor = function(_color) {
  var TERM_COLORS = this.TERM_COLORS;
  var _text = ([]).slice.call(arguments, 1).join(' ');
  var clear = this.pad(TERM_COLORS.clear);
  var color = this.pad(TERM_COLORS[_color] || 0);
  return [color, clear].join(_text);
};
