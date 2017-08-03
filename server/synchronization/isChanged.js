"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DIFF_EQUAL_1 = require("./DIFF_EQUAL");
function isChanged(diffs) {
    return diffs.length !== 1 || diffs[0][0] !== DIFF_EQUAL_1.DIFF_EQUAL;
}
exports.isChanged = isChanged;
//# sourceMappingURL=isChanged.js.map