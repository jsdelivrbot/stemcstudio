"use strict";
var DIFF_EQUAL_1 = require('./DIFF_EQUAL');
function isChanged(diffs) {
    return diffs.length !== 1 || diffs[0][0] !== DIFF_EQUAL_1.default;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isChanged;
