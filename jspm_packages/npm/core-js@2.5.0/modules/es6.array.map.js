/* */ 
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);
$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {map: function map(callbackfn) {
    return $map(this, callbackfn, arguments[1]);
  }});
