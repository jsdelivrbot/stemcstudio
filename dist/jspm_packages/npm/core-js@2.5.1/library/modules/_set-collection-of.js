/* */ 
'use strict';
var $export = require('./_export');
module.exports = function(COLLECTION) {
  $export($export.S, COLLECTION, {of: function of() {
      var length = arguments.length;
      var A = Array(length);
      while (length--)
        A[length] = arguments[length];
      return new this(A);
    }});
};
