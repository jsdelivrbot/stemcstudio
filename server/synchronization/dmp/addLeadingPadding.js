"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DIFF_EQUAL_1 = require("../DIFF_EQUAL");
function addLeadingPadding(patches, paddingLength, nullPadding) {
    var patch = patches[0];
    var diffs = patch.diffs;
    if (diffs.length === 0 || diffs[0][0] !== DIFF_EQUAL_1.default) {
        diffs.unshift([DIFF_EQUAL_1.default, nullPadding]);
        patch.start1 -= paddingLength;
        patch.start2 -= paddingLength;
        patch.length1 += paddingLength;
        patch.length2 += paddingLength;
    }
    else if (paddingLength > diffs[0][1].length) {
        var extraLength = paddingLength - diffs[0][1].length;
        diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
        patch.start1 -= extraLength;
        patch.start2 -= extraLength;
        patch.length1 += extraLength;
        patch.length2 += extraLength;
    }
}
exports.default = addLeadingPadding;
