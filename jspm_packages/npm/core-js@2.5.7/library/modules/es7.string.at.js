/* */ 
'use strict';
var $export = require('./_export');
var $at = require('./_string-at')(true);
$export($export.P, 'String', {at: function at(pos) {
    return $at(this, pos);
  }});
