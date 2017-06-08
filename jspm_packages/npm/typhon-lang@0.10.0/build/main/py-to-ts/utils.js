/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var types_1 = require('../pytools/types');
function isClassNameByConvention(name) {
  var id = name.id;
  if (id instanceof types_1.RangeAnnotated && typeof id.value === 'string') {
    var N = id.value.length;
    if (N > 0) {
      var firstChar = id.value[0];
      return firstChar.toUpperCase() === firstChar;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
exports.isClassNameByConvention = isClassNameByConvention;
function isMethod(functionDef) {
  for (var i = 0; i < functionDef.args.args.length; i++) {
    if (i === 0) {
      var arg = functionDef.args.args[i];
      if (arg.id.value === 'self') {
        return true;
      }
    } else {
      return false;
    }
  }
  return false;
}
exports.isMethod = isMethod;
