/* */ 
var $export = require('./_export');
var $parseInt = require('./_parse-int');
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {parseInt: $parseInt});
