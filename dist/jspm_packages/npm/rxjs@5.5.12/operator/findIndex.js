/* */ 
"use strict";
var findIndex_1 = require('../operators/findIndex');
function findIndex(predicate, thisArg) {
  return findIndex_1.findIndex(predicate, thisArg)(this);
}
exports.findIndex = findIndex;
