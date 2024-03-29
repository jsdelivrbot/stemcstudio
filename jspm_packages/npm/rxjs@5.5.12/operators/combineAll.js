/* */ 
"use strict";
var combineLatest_1 = require('./combineLatest');
function combineAll(project) {
  return function(source) {
    return source.lift(new combineLatest_1.CombineLatestOperator(project));
  };
}
exports.combineAll = combineAll;
