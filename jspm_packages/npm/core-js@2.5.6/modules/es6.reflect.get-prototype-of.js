/* */ 
var $export = require('./_export');
var getProto = require('./_object-gpo');
var anObject = require('./_an-object');
$export($export.S, 'Reflect', {getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }});
