"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DIFF_EQUAL_1 = require("../DIFF_EQUAL");
function addTrailingPadding(patches, paddingLength, nullPadding) {
    var patch = patches[patches.length - 1];
    var diffs = patch.diffs;
    if (diffs.length === 0 || diffs[diffs.length - 1][0] !== DIFF_EQUAL_1.default) {
        diffs.push([DIFF_EQUAL_1.default, nullPadding]);
        patch.length1 += paddingLength;
        patch.length2 += paddingLength;
    }
    else if (paddingLength > diffs[diffs.length - 1][1].length) {
        var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
        diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
        patch.length1 += extraLength;
        patch.length2 += extraLength;
    }
}
exports.default = addTrailingPadding;
