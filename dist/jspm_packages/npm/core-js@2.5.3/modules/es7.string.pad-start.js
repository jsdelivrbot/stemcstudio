/* */ 
'use strict';
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {padStart: function padStart(maxLength) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }});
