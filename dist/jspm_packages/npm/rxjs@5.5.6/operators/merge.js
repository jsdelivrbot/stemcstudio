/* */ 
"use strict";
var merge_1 = require('../observable/merge');
var merge_2 = require('../observable/merge');
exports.mergeStatic = merge_2.merge;
function merge() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i - 0] = arguments[_i];
  }
  return function(source) {
    return source.lift.call(merge_1.merge.apply(void 0, [source].concat(observables)));
  };
}
exports.merge = merge;
