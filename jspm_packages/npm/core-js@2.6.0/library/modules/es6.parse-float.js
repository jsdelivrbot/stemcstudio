/* */ 
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
$export($export.G + $export.F * (parseFloat != $parseFloat), {parseFloat: $parseFloat});
