/* */ 
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {parseFloat: $parseFloat});
