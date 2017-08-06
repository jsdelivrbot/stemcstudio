/* */ 
'use strict';
var $export = require('./_export');
var $fails = require('./_fails');
var aNumberValue = require('./_a-number-value');
var $toPrecision = 1.0.toPrecision;
$export($export.P + $export.F * ($fails(function() {
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function() {
  $toPrecision.call({});
})), 'Number', {toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }});
