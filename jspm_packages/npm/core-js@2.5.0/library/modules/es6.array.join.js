/* */ 
'use strict';
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var arrayJoin = [].join;
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }});
