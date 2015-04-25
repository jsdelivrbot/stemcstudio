
/* HTTP Status Codes */

var http = require('http');

module.exports = function attachStatusCodes() {
  this.STATUS_CODES = {};
  var statusCodes = http.STATUS_CODES;
  var codes = Object.keys(statusCodes);
  codes.forEach(function(code) {
    this[code] = statusCodes[code];
  }, this.STATUS_CODES);
};

