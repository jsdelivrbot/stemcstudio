/* */ 
var $export = require('./_export');
var $values = require('./_object-to-array')(false);
$export($export.S, 'Object', {values: function values(it) {
    return $values(it);
  }});
