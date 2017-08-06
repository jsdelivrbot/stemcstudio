/* */ 
var $export = require('./_export');
$export($export.S, 'Math', {signbit: function signbit(x) {
    return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
  }});
