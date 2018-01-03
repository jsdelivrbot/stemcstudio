/* */ 
"use strict";
var concat_1 = require('../observable/concat');
var concat_2 = require('../observable/concat');
exports.concatStatic = concat_2.concat;
function concat() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i - 0] = arguments[_i];
  }
  return function(source) {
    return source.lift.call(concat_1.concat.apply(void 0, [source].concat(observables)));
  };
}
exports.concat = concat;
