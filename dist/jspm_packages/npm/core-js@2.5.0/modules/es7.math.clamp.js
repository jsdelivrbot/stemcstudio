/* */ 
var $export = require('./_export');
$export($export.S, 'Math', {clamp: function clamp(x, lower, upper) {
    return Math.min(upper, Math.max(lower, x));
  }});
