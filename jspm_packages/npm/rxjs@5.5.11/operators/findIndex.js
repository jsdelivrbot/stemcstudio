/* */ 
"use strict";
var find_1 = require('./find');
function findIndex(predicate, thisArg) {
  return function(source) {
    return source.lift(new find_1.FindValueOperator(predicate, source, true, thisArg));
  };
}
exports.findIndex = findIndex;
