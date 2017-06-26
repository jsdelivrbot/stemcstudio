/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var Position_1 = require('./Position');
function range(start, end) {
  return {
    start: start,
    end: end
  };
}
exports.range = range;
function isEmptyRange(range) {
  return Position_1.equalPositions(range.start, range.end);
}
exports.isEmptyRange = isEmptyRange;
