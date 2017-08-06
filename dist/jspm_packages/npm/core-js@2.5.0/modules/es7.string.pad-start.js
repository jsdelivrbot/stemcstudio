/* */ 
'use strict';
var $export = require('./_export');
var $pad = require('./_string-pad');
$export($export.P, 'String', {padStart: function padStart(maxLength) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }});
