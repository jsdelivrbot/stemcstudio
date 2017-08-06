/* */ 
'use strict';
var $export = require('./_export');
var $find = require('./_array-methods')(6);
var KEY = 'findIndex';
var forced = true;
if (KEY in [])
  Array(1)[KEY](function() {
    forced = false;
  });
$export($export.P + $export.F * forced, 'Array', {findIndex: function findIndex(callbackfn) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }});
require('./_add-to-unscopables')(KEY);
