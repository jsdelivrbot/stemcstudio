/* */ 
var $export = require('./_export');
var toISOString = require('./_date-to-iso-string');
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {toISOString: toISOString});
