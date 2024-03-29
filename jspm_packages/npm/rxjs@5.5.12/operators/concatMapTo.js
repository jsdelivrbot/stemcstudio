/* */ 
"use strict";
var concatMap_1 = require('./concatMap');
function concatMapTo(innerObservable, resultSelector) {
  return concatMap_1.concatMap(function() {
    return innerObservable;
  }, resultSelector);
}
exports.concatMapTo = concatMapTo;
