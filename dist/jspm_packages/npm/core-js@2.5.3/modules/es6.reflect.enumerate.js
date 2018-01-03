/* */ 
'use strict';
var $export = require('./_export');
var anObject = require('./_an-object');
var Enumerate = function(iterated) {
  this._t = anObject(iterated);
  this._i = 0;
  var keys = this._k = [];
  var key;
  for (key in iterated)
    keys.push(key);
};
require('./_iter-create')(Enumerate, 'Object', function() {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length)
      return {
        value: undefined,
        done: true
      };
  } while (!((key = keys[that._i++]) in that._t));
  return {
    value: key,
    done: false
  };
});
$export($export.S, 'Reflect', {enumerate: function enumerate(target) {
    return new Enumerate(target);
  }});
