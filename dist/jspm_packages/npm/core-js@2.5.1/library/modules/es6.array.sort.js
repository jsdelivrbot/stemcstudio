/* */ 
'use strict';
var $export = require('./_export');
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var fails = require('./_fails');
var $sort = [].sort;
var test = [1, 2, 3];
$export($export.P + $export.F * (fails(function() {
  test.sort(undefined);
}) || !fails(function() {
  test.sort(null);
}) || !require('./_strict-method')($sort)), 'Array', {sort: function sort(comparefn) {
    return comparefn === undefined ? $sort.call(toObject(this)) : $sort.call(toObject(this), aFunction(comparefn));
  }});
