/* */ 
'use strict';
var $export = require('./_export');
var createProperty = require('./_create-property');
$export($export.S + $export.F * require('./_fails')(function() {
  function F() {}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {of: function of() {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index)
      createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }});
