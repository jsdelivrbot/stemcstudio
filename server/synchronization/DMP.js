"use strict";
var addLeadingPadding_1 = require("./dmp/addLeadingPadding");
var addTrailingPadding_1 = require("./dmp/addTrailingPadding");
var Patch_1 = require("./Patch");
var DIFF_DELETE_1 = require("./DIFF_DELETE");
var DIFF_INSERT_1 = require("./DIFF_INSERT");
var DIFF_EQUAL_1 = require("./DIFF_EQUAL");
var nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
var whitespaceRegex_ = /\s/;
var linebreakRegex_ = /[\r\n]/;
var blanklineEndRegex_ = /\n\r?\n$/;
var blanklineStartRegex_ = /^\r?\n\r?\n/;
var DMP = (function () {
    function DMP() {
        this.Diff_Timeout = 1.0;
        this.Diff_EditCost = 4;
        this.Diff_DualThreshold = 32;
        this.Match_Threshold = 0.5;
        this.Match_Distance = 1000;
        this.Patch_DeleteThreshold = 0.5;
        this.Patch_Margin = 4;
        function getMaxBits() {
            var maxbits = 0;
            var oldi = 1;
            var newi = 2;
            while (oldi !== newi) {
                maxbits++;
                oldi = newi;
                newi = newi << 1;
            }
            return maxbits;
        }
        this.Match_MaxBits = getMaxBits();
    }
    DMP.prototype.diff_main = function (text1, text2, opt_checklines, opt_deadline) {
        if (typeof opt_deadline === "undefined") {
            if (this.Diff_Timeout <= 0) {
                opt_deadline = Number.MAX_VALUE;
            }
            else {
                opt_deadline = (new Date()).getTime() + this.Diff_Timeout * 1000;
            }
        }
        var deadline = opt_deadline;
        if (text1 === null || text2 === null) {
            throw new Error("Null input. (diff_main)");
        }
        if (text1 === text2) {
            if (text1) {
                return [[DIFF_EQUAL_1.default, text1]];
            }
            return [];
        }
        if (typeof opt_checklines === "undefined") {
            opt_checklines = true;
        }
        var checklines = opt_checklines;
        var commonlength = this.diff_commonPrefix(text1, text2);
        var commonprefix = text1.substring(0, commonlength);
        text1 = text1.substring(commonlength);
        text2 = text2.substring(commonlength);
        commonlength = this.diff_commonSuffix(text1, text2);
        var commonsuffix = text1.substring(text1.length - commonlength);
        text1 = text1.substring(0, text1.length - commonlength);
        text2 = text2.substring(0, text2.length - commonlength);
        var diffs = this.diff_compute_(text1, text2, checklines, deadline);
        if (commonprefix) {
            diffs.unshift([DIFF_EQUAL_1.default, commonprefix]);
        }
        if (commonsuffix) {
            diffs.push([DIFF_EQUAL_1.default, commonsuffix]);
        }
        this.diff_cleanupMerge(diffs);
        return diffs;
    };
    DMP.prototype.diff_compute_ = function (text1, text2, checklines, deadline) {
        if (!text1) {
            return [[DIFF_INSERT_1.default, text2]];
        }
        if (!text2) {
            return [[DIFF_DELETE_1.default, text1]];
        }
        var longtext = text1.length > text2.length ? text1 : text2;
        var shorttext = text1.length > text2.length ? text2 : text1;
        var i = longtext.indexOf(shorttext);
        if (i !== -1) {
            var diffs = [[DIFF_INSERT_1.default, longtext.substring(0, i)],
                [DIFF_EQUAL_1.default, shorttext],
                [DIFF_INSERT_1.default, longtext.substring(i + shorttext.length)]];
            if (text1.length > text2.length) {
                diffs[0][0] = diffs[2][0] = DIFF_DELETE_1.default;
            }
            return diffs;
        }
        if (shorttext.length === 1) {
            return [[DIFF_DELETE_1.default, text1], [DIFF_INSERT_1.default, text2]];
        }
        var hm = this.diff_halfMatch_(text1, text2);
        var diffs_a;
        var diffs_b;
        if (hm) {
            var text1_a = hm[0];
            var text1_b = hm[1];
            var text2_a = hm[2];
            var text2_b = hm[3];
            var mid_common = hm[4];
            diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
            diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
            return diffs_a.concat([[DIFF_EQUAL_1.default, mid_common]], diffs_b);
        }
        if (checklines && text1.length > 100 && text2.length > 100) {
            return this.diff_lineMode_(text1, text2, deadline);
        }
        return this.diff_bisect_(text1, text2, deadline);
    };
    DMP.prototype.diff_lineMode_ = function (text1, text2, deadline) {
        var a = this.diff_linesToChars_(text1, text2);
        text1 = a.chars1;
        text2 = a.chars2;
        var diffs = this.diff_main(text1, text2, false, deadline);
        this.diff_charsToLines_(diffs, a.lineArray);
        this.diff_cleanupSemantic(diffs);
        diffs.push([DIFF_EQUAL_1.default, ""]);
        var pointer = 0;
        var count_delete = 0;
        var count_insert = 0;
        var text_delete = "";
        var text_insert = "";
        while (pointer < diffs.length) {
            switch (diffs[pointer][0]) {
                case DIFF_INSERT_1.default:
                    count_insert++;
                    text_insert += diffs[pointer][1];
                    break;
                case DIFF_DELETE_1.default:
                    count_delete++;
                    text_delete += diffs[pointer][1];
                    break;
                case DIFF_EQUAL_1.default:
                    if (count_delete >= 1 && count_insert >= 1) {
                        diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert);
                        pointer = pointer - count_delete - count_insert;
                        var a_1 = this.diff_main(text_delete, text_insert, false, deadline);
                        for (var j = a_1.length - 1; j >= 0; j--) {
                            diffs.splice(pointer, 0, a_1[j]);
                        }
                        pointer = pointer + a_1.length;
                    }
                    count_insert = 0;
                    count_delete = 0;
                    text_delete = "";
                    text_insert = "";
                    break;
                default:
                    break;
            }
            pointer++;
        }
        diffs.pop();
        return diffs;
    };
    DMP.prototype.diff_bisect_ = function (text1, text2, deadline) {
        var text1_length = text1.length;
        var text2_length = text2.length;
        var max_d = Math.ceil((text1_length + text2_length) / 2);
        var v_offset = max_d;
        var v_length = 2 * max_d;
        var v1 = new Array(v_length);
        var v2 = new Array(v_length);
        for (var x = 0; x < v_length; x++) {
            v1[x] = -1;
            v2[x] = -1;
        }
        v1[v_offset + 1] = 0;
        v2[v_offset + 1] = 0;
        var delta = text1_length - text2_length;
        var front = (delta % 2 !== 0);
        var k1start = 0;
        var k1end = 0;
        var k2start = 0;
        var k2end = 0;
        for (var d = 0; d < max_d; d++) {
            if ((new Date()).getTime() > deadline) {
                break;
            }
            for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
                var k1_offset = v_offset + k1;
                var x1 = void 0;
                if (k1 === -d || (k1 !== d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
                    x1 = v1[k1_offset + 1];
                }
                else {
                    x1 = v1[k1_offset - 1] + 1;
                }
                var y1 = x1 - k1;
                while (x1 < text1_length && y1 < text2_length &&
                    text1.charAt(x1) === text2.charAt(y1)) {
                    x1++;
                    y1++;
                }
                v1[k1_offset] = x1;
                if (x1 > text1_length) {
                    k1end += 2;
                }
                else if (y1 > text2_length) {
                    k1start += 2;
                }
                else if (front) {
                    var k2_offset = v_offset + delta - k1;
                    if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] !== -1) {
                        var x2 = text1_length - v2[k2_offset];
                        if (x1 >= x2) {
                            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
                        }
                    }
                }
            }
            for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
                var k2_offset = v_offset + k2;
                var x2 = void 0;
                if (k2 === -d || (k2 !== d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
                    x2 = v2[k2_offset + 1];
                }
                else {
                    x2 = v2[k2_offset - 1] + 1;
                }
                var y2 = x2 - k2;
                while (x2 < text1_length && y2 < text2_length &&
                    text1.charAt(text1_length - x2 - 1) ===
                        text2.charAt(text2_length - y2 - 1)) {
                    x2++;
                    y2++;
                }
                v2[k2_offset] = x2;
                if (x2 > text1_length) {
                    k2end += 2;
                }
                else if (y2 > text2_length) {
                    k2start += 2;
                }
                else if (!front) {
                    var k1_offset = v_offset + delta - k2;
                    if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] !== -1) {
                        var x1 = v1[k1_offset];
                        var y1 = v_offset + x1 - k1_offset;
                        x2 = text1_length - x2;
                        if (x1 >= x2) {
                            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
                        }
                    }
                }
            }
        }
        return [[DIFF_DELETE_1.default, text1], [DIFF_INSERT_1.default, text2]];
    };
    DMP.prototype.diff_bisectSplit_ = function (text1, text2, x, y, deadline) {
        var text1a = text1.substring(0, x);
        var text2a = text2.substring(0, y);
        var text1b = text1.substring(x);
        var text2b = text2.substring(y);
        var diffs = this.diff_main(text1a, text2a, false, deadline);
        var diffsb = this.diff_main(text1b, text2b, false, deadline);
        return diffs.concat(diffsb);
    };
    DMP.prototype.diff_linesToChars_ = function (text1, text2) {
        var lineArray = [];
        var lineHash = {};
        lineArray[0] = "";
        function diff_linesToCharsMunge_(text) {
            var chars = "";
            var lineStart = 0;
            var lineEnd = -1;
            var lineArrayLength = lineArray.length;
            while (lineEnd < text.length - 1) {
                lineEnd = text.indexOf("\n", lineStart);
                if (lineEnd === -1) {
                    lineEnd = text.length - 1;
                }
                var line = text.substring(lineStart, lineEnd + 1);
                lineStart = lineEnd + 1;
                if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) :
                    (lineHash[line] !== undefined)) {
                    chars += String.fromCharCode(lineHash[line]);
                }
                else {
                    chars += String.fromCharCode(lineArrayLength);
                    lineHash[line] = lineArrayLength;
                    lineArray[lineArrayLength++] = line;
                }
            }
            return chars;
        }
        return {
            chars1: diff_linesToCharsMunge_(text1),
            chars2: diff_linesToCharsMunge_(text2),
            lineArray: lineArray
        };
    };
    DMP.prototype.diff_charsToLines_ = function (diffs, lineArray) {
        for (var x = 0; x < diffs.length; x++) {
            var chars = diffs[x][1];
            var text = [];
            for (var y = 0; y < chars.length; y++) {
                text[y] = lineArray[chars.charCodeAt(y)];
            }
            diffs[x][1] = text.join('');
        }
    };
    DMP.prototype.diff_map = function (text1, text2) {
        var ms_end = (new Date()).getTime() + this.Diff_Timeout * 1000;
        var text1_length = text1.length;
        var text2_length = text2.length;
        var max_d = text1_length + text2_length - 1;
        var doubleEnd = this.Diff_DualThreshold * 2 < max_d;
        var v_map1 = [];
        var v_map2 = [];
        var v1 = {};
        var v2 = {};
        v1[1] = 0;
        v2[1] = 0;
        var x;
        var y;
        var footstep;
        var footsteps = {};
        var done = false;
        var hasOwnProperty = !!(footsteps.hasOwnProperty);
        var front = (text1_length + text2_length) % 2;
        for (var d = 0; d < max_d; d++) {
            if (this.Diff_Timeout > 0 && (new Date()).getTime() > ms_end) {
                return null;
            }
            v_map1[d] = {};
            for (var k = -d; k <= d; k += 2) {
                if (k === -d || k !== d && v1[k - 1] < v1[k + 1]) {
                    x = v1[k + 1];
                }
                else {
                    x = v1[k - 1] + 1;
                }
                y = x - k;
                if (doubleEnd) {
                    footstep = x + ',' + y;
                    if (front && (hasOwnProperty ? footsteps.hasOwnProperty(footstep) :
                        (footsteps[footstep] !== undefined))) {
                        done = true;
                    }
                    if (!front) {
                        footsteps[footstep] = d;
                    }
                }
                while (!done && x < text1_length && y < text2_length &&
                    text1.charAt(x) === text2.charAt(y)) {
                    x++;
                    y++;
                    if (doubleEnd) {
                        footstep = x + ',' + y;
                        if (front && (hasOwnProperty ? footsteps.hasOwnProperty(footstep) :
                            (footsteps[footstep] !== undefined))) {
                            done = true;
                        }
                        if (!front) {
                            footsteps[footstep] = d;
                        }
                    }
                }
                v1[k] = x;
                v_map1[d][x + ',' + y] = true;
                if (x === text1_length && y === text2_length) {
                    return this.diff_path1(v_map1, text1, text2);
                }
                else if (done) {
                    v_map2 = v_map2.slice(0, footsteps[footstep] + 1);
                    var a = this.diff_path1(v_map1, text1.substring(0, x), text2.substring(0, y));
                    return a.concat(this.diff_path2(v_map2, text1.substring(x), text2.substring(y)));
                }
            }
            if (doubleEnd) {
                v_map2[d] = {};
                for (var k = -d; k <= d; k += 2) {
                    if (k === -d || k !== d && v2[k - 1] < v2[k + 1]) {
                        x = v2[k + 1];
                    }
                    else {
                        x = v2[k - 1] + 1;
                    }
                    y = x - k;
                    footstep = (text1_length - x) + ',' + (text2_length - y);
                    if (!front && (hasOwnProperty ? footsteps.hasOwnProperty(footstep) :
                        (footsteps[footstep] !== undefined))) {
                        done = true;
                    }
                    if (front) {
                        footsteps[footstep] = d;
                    }
                    while (!done && x < text1_length && y < text2_length &&
                        text1.charAt(text1_length - x - 1) ===
                            text2.charAt(text2_length - y - 1)) {
                        x++;
                        y++;
                        footstep = (text1_length - x) + ',' + (text2_length - y);
                        if (!front && (hasOwnProperty ? footsteps.hasOwnProperty(footstep) :
                            (footsteps[footstep] !== undefined))) {
                            done = true;
                        }
                        if (front) {
                            footsteps[footstep] = d;
                        }
                    }
                    v2[k] = x;
                    v_map2[d][x + ',' + y] = true;
                    if (done) {
                        v_map1 = v_map1.slice(0, footsteps[footstep] + 1);
                        var a = this.diff_path1(v_map1, text1.substring(0, text1_length - x), text2.substring(0, text2_length - y));
                        return a.concat(this.diff_path2(v_map2, text1.substring(text1_length - x), text2.substring(text2_length - y)));
                    }
                }
            }
        }
        return null;
    };
    DMP.prototype.diff_path1 = function (v_map, text1, text2) {
        var path = [];
        var x = text1.length;
        var y = text2.length;
        var last_op = null;
        for (var d = v_map.length - 2; d >= 0; d--) {
            while (1) {
                if (v_map[d].hasOwnProperty ? v_map[d].hasOwnProperty((x - 1) + ',' + y) :
                    (v_map[d][(x - 1) + ',' + y] !== undefined)) {
                    x--;
                    if (last_op === DIFF_DELETE_1.default) {
                        path[0][1] = text1.charAt(x) + path[0][1];
                    }
                    else {
                        path.unshift([DIFF_DELETE_1.default, text1.charAt(x)]);
                    }
                    last_op = DIFF_DELETE_1.default;
                    break;
                }
                else if (v_map[d].hasOwnProperty ?
                    v_map[d].hasOwnProperty(x + ',' + (y - 1)) :
                    (v_map[d][x + ',' + (y - 1)] !== undefined)) {
                    y--;
                    if (last_op === DIFF_INSERT_1.default) {
                        path[0][1] = text2.charAt(y) + path[0][1];
                    }
                    else {
                        path.unshift([DIFF_INSERT_1.default, text2.charAt(y)]);
                    }
                    last_op = DIFF_INSERT_1.default;
                    break;
                }
                else {
                    x--;
                    y--;
                    if (last_op === DIFF_EQUAL_1.default) {
                        path[0][1] = text1.charAt(x) + path[0][1];
                    }
                    else {
                        path.unshift([DIFF_EQUAL_1.default, text1.charAt(x)]);
                    }
                    last_op = DIFF_EQUAL_1.default;
                }
            }
        }
        return path;
    };
    DMP.prototype.diff_path2 = function (v_map, text1, text2) {
        var path = [];
        var pathLength = 0;
        var x = text1.length;
        var y = text2.length;
        var last_op = null;
        for (var d = v_map.length - 2; d >= 0; d--) {
            while (1) {
                if (v_map[d].hasOwnProperty ? v_map[d].hasOwnProperty((x - 1) + ',' + y) :
                    (v_map[d][(x - 1) + ',' + y] !== undefined)) {
                    x--;
                    if (last_op === DIFF_DELETE_1.default) {
                        path[pathLength - 1][1] += text1.charAt(text1.length - x - 1);
                    }
                    else {
                        path[pathLength++] =
                            [DIFF_DELETE_1.default, text1.charAt(text1.length - x - 1)];
                    }
                    last_op = DIFF_DELETE_1.default;
                    break;
                }
                else if (v_map[d].hasOwnProperty ?
                    v_map[d].hasOwnProperty(x + ',' + (y - 1)) :
                    (v_map[d][x + ',' + (y - 1)] !== undefined)) {
                    y--;
                    if (last_op === DIFF_INSERT_1.default) {
                        path[pathLength - 1][1] += text2.charAt(text2.length - y - 1);
                    }
                    else {
                        path[pathLength++] =
                            [DIFF_INSERT_1.default, text2.charAt(text2.length - y - 1)];
                    }
                    last_op = DIFF_INSERT_1.default;
                    break;
                }
                else {
                    x--;
                    y--;
                    if (last_op === DIFF_EQUAL_1.default) {
                        path[pathLength - 1][1] += text1.charAt(text1.length - x - 1);
                    }
                    else {
                        path[pathLength++] =
                            [DIFF_EQUAL_1.default, text1.charAt(text1.length - x - 1)];
                    }
                    last_op = DIFF_EQUAL_1.default;
                }
            }
        }
        return path;
    };
    DMP.prototype.diff_commonPrefix = function (text1, text2) {
        if (!text1 || !text2 || text1.charCodeAt(0) !== text2.charCodeAt(0)) {
            return 0;
        }
        var pointermin = 0;
        var pointermax = Math.min(text1.length, text2.length);
        var pointermid = pointermax;
        var pointerstart = 0;
        while (pointermin < pointermid) {
            if (text1.substring(pointerstart, pointermid) ===
                text2.substring(pointerstart, pointermid)) {
                pointermin = pointermid;
                pointerstart = pointermin;
            }
            else {
                pointermax = pointermid;
            }
            pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
        }
        return pointermid;
    };
    DMP.prototype.diff_commonSuffix = function (text1, text2) {
        if (!text1 || !text2 || text1.charCodeAt(text1.length - 1) !==
            text2.charCodeAt(text2.length - 1)) {
            return 0;
        }
        var pointermin = 0;
        var pointermax = Math.min(text1.length, text2.length);
        var pointermid = pointermax;
        var pointerend = 0;
        while (pointermin < pointermid) {
            if (text1.substring(text1.length - pointermid, text1.length - pointerend) ===
                text2.substring(text2.length - pointermid, text2.length - pointerend)) {
                pointermin = pointermid;
                pointerend = pointermin;
            }
            else {
                pointermax = pointermid;
            }
            pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
        }
        return pointermid;
    };
    DMP.prototype.diff_commonOverlap_ = function (text1, text2) {
        var text1_length = text1.length;
        var text2_length = text2.length;
        if (text1_length === 0 || text2_length === 0) {
            return 0;
        }
        if (text1_length > text2_length) {
            text1 = text1.substring(text1_length - text2_length);
        }
        else if (text1_length < text2_length) {
            text2 = text2.substring(0, text1_length);
        }
        var text_length = Math.min(text1_length, text2_length);
        if (text1 === text2) {
            return text_length;
        }
        var best = 0;
        var length = 1;
        while (true) {
            var pattern = text1.substring(text_length - length);
            var found = text2.indexOf(pattern);
            if (found === -1) {
                return best;
            }
            length += found;
            if (found === 0 || text1.substring(text_length - length) ===
                text2.substring(0, length)) {
                best = length;
                length++;
            }
        }
    };
    DMP.prototype.diff_halfMatch_ = function (text1, text2) {
        if (this.Diff_Timeout <= 0) {
            return null;
        }
        var longtext_ = text1.length > text2.length ? text1 : text2;
        var shorttext_ = text1.length > text2.length ? text2 : text1;
        if (longtext_.length < 4 || shorttext_.length * 2 < longtext_.length) {
            return null;
        }
        var self = this;
        function diff_halfMatchI_(longtext, shorttext, i) {
            var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
            var j = -1;
            var best_common = "";
            var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
            while ((j = shorttext.indexOf(seed, j + 1)) !== -1) {
                var prefixLength = self.diff_commonPrefix(longtext.substring(i), shorttext.substring(j));
                var suffixLength = self.diff_commonSuffix(longtext.substring(0, i), shorttext.substring(0, j));
                if (best_common.length < suffixLength + prefixLength) {
                    best_common = shorttext.substring(j - suffixLength, j) +
                        shorttext.substring(j, j + prefixLength);
                    best_longtext_a = longtext.substring(0, i - suffixLength);
                    best_longtext_b = longtext.substring(i + prefixLength);
                    best_shorttext_a = shorttext.substring(0, j - suffixLength);
                    best_shorttext_b = shorttext.substring(j + prefixLength);
                }
            }
            if (best_common.length * 2 >= longtext.length) {
                return [best_longtext_a, best_longtext_b,
                    best_shorttext_a, best_shorttext_b, best_common];
            }
            else {
                return null;
            }
        }
        var hm1 = diff_halfMatchI_(longtext_, shorttext_, Math.ceil(longtext_.length / 4));
        var hm2 = diff_halfMatchI_(longtext_, shorttext_, Math.ceil(longtext_.length / 2));
        var hm;
        if (!hm1 && !hm2) {
            return null;
        }
        else if (!hm2) {
            hm = hm1;
        }
        else if (!hm1) {
            hm = hm2;
        }
        else {
            hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
        }
        var text1_a, text1_b, text2_a, text2_b;
        if (text1.length > text2.length) {
            text1_a = hm[0];
            text1_b = hm[1];
            text2_a = hm[2];
            text2_b = hm[3];
        }
        else {
            text2_a = hm[0];
            text2_b = hm[1];
            text1_a = hm[2];
            text1_b = hm[3];
        }
        var mid_common = hm[4];
        return [text1_a, text1_b, text2_a, text2_b, mid_common];
    };
    DMP.prototype.diff_cleanupSemantic = function (diffs) {
        var changes = false;
        var equalities = [];
        var equalitiesLength = 0;
        var lastequality = null;
        var pointer = 0;
        var length_insertions1 = 0;
        var length_deletions1 = 0;
        var length_insertions2 = 0;
        var length_deletions2 = 0;
        while (pointer < diffs.length) {
            if (diffs[pointer][0] === DIFF_EQUAL_1.default) {
                equalities[equalitiesLength++] = pointer;
                length_insertions1 = length_insertions2;
                length_deletions1 = length_deletions2;
                length_insertions2 = 0;
                length_deletions2 = 0;
                lastequality = diffs[pointer][1];
            }
            else {
                if (diffs[pointer][0] === DIFF_INSERT_1.default) {
                    length_insertions2 += diffs[pointer][1].length;
                }
                else {
                    length_deletions2 += diffs[pointer][1].length;
                }
                if (lastequality && (lastequality.length <=
                    Math.max(length_insertions1, length_deletions1)) &&
                    (lastequality.length <= Math.max(length_insertions2, length_deletions2))) {
                    diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE_1.default, lastequality]);
                    diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT_1.default;
                    equalitiesLength--;
                    equalitiesLength--;
                    pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
                    length_insertions1 = 0;
                    length_deletions1 = 0;
                    length_insertions2 = 0;
                    length_deletions2 = 0;
                    lastequality = null;
                    changes = true;
                }
            }
            pointer++;
        }
        if (changes) {
            this.diff_cleanupMerge(diffs);
        }
        this.diff_cleanupSemanticLossless(diffs);
        pointer = 1;
        while (pointer < diffs.length) {
            if (diffs[pointer - 1][0] === DIFF_DELETE_1.default &&
                diffs[pointer][0] === DIFF_INSERT_1.default) {
                var deletion = diffs[pointer - 1][1];
                var insertion = diffs[pointer][1];
                var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
                var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
                if (overlap_length1 >= overlap_length2) {
                    if (overlap_length1 >= deletion.length / 2 ||
                        overlap_length1 >= insertion.length / 2) {
                        diffs.splice(pointer, 0, [DIFF_EQUAL_1.default, insertion.substring(0, overlap_length1)]);
                        diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length1);
                        diffs[pointer + 1][1] = insertion.substring(overlap_length1);
                        pointer++;
                    }
                }
                else {
                    if (overlap_length2 >= deletion.length / 2 ||
                        overlap_length2 >= insertion.length / 2) {
                        diffs.splice(pointer, 0, [DIFF_EQUAL_1.default, deletion.substring(0, overlap_length2)]);
                        diffs[pointer - 1][0] = DIFF_INSERT_1.default;
                        diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlap_length2);
                        diffs[pointer + 1][0] = DIFF_DELETE_1.default;
                        diffs[pointer + 1][1] = deletion.substring(overlap_length2);
                        pointer++;
                    }
                }
                pointer++;
            }
            pointer++;
        }
    };
    DMP.prototype.diff_cleanupSemanticLossless = function (diffs) {
        function diff_cleanupSemanticScore_(one, two) {
            if (!one || !two) {
                return 6;
            }
            var char1 = one.charAt(one.length - 1);
            var char2 = two.charAt(0);
            var nonAlphaNumeric1 = char1.match(nonAlphaNumericRegex_);
            var nonAlphaNumeric2 = char2.match(nonAlphaNumericRegex_);
            var whitespace1 = nonAlphaNumeric1 && char1.match(whitespaceRegex_);
            var whitespace2 = nonAlphaNumeric2 && char2.match(whitespaceRegex_);
            var lineBreak1 = whitespace1 && char1.match(linebreakRegex_);
            var lineBreak2 = whitespace2 && char2.match(linebreakRegex_);
            var blankLine1 = lineBreak1 && one.match(blanklineEndRegex_);
            var blankLine2 = lineBreak2 && two.match(blanklineStartRegex_);
            if (blankLine1 || blankLine2) {
                return 5;
            }
            else if (lineBreak1 || lineBreak2) {
                return 4;
            }
            else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
                return 3;
            }
            else if (whitespace1 || whitespace2) {
                return 2;
            }
            else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
                return 1;
            }
            return 0;
        }
        var pointer = 1;
        while (pointer < diffs.length - 1) {
            if (diffs[pointer - 1][0] === DIFF_EQUAL_1.default &&
                diffs[pointer + 1][0] === DIFF_EQUAL_1.default) {
                var equality1 = diffs[pointer - 1][1];
                var edit = diffs[pointer][1];
                var equality2 = diffs[pointer + 1][1];
                var commonOffset = this.diff_commonSuffix(equality1, edit);
                if (commonOffset) {
                    var commonString = edit.substring(edit.length - commonOffset);
                    equality1 = equality1.substring(0, equality1.length - commonOffset);
                    edit = commonString + edit.substring(0, edit.length - commonOffset);
                    equality2 = commonString + equality2;
                }
                var bestEquality1 = equality1;
                var bestEdit = edit;
                var bestEquality2 = equality2;
                var bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
                while (edit.charAt(0) === equality2.charAt(0)) {
                    equality1 += edit.charAt(0);
                    edit = edit.substring(1) + equality2.charAt(0);
                    equality2 = equality2.substring(1);
                    var score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
                    if (score >= bestScore) {
                        bestScore = score;
                        bestEquality1 = equality1;
                        bestEdit = edit;
                        bestEquality2 = equality2;
                    }
                }
                if (diffs[pointer - 1][1] !== bestEquality1) {
                    if (bestEquality1) {
                        diffs[pointer - 1][1] = bestEquality1;
                    }
                    else {
                        diffs.splice(pointer - 1, 1);
                        pointer--;
                    }
                    diffs[pointer][1] = bestEdit;
                    if (bestEquality2) {
                        diffs[pointer + 1][1] = bestEquality2;
                    }
                    else {
                        diffs.splice(pointer + 1, 1);
                        pointer--;
                    }
                }
            }
            pointer++;
        }
    };
    DMP.prototype.diff_cleanupEfficiency = function (diffs) {
        var changes = false;
        var equalities = [];
        var equalitiesLength = 0;
        var lastequality = '';
        var pointer = 0;
        var pre_ins = false;
        var pre_del = false;
        var post_ins = false;
        var post_del = false;
        while (pointer < diffs.length) {
            if (diffs[pointer][0] === DIFF_EQUAL_1.default) {
                if (diffs[pointer][1].length < this.Diff_EditCost &&
                    (post_ins || post_del)) {
                    equalities[equalitiesLength++] = pointer;
                    pre_ins = post_ins;
                    pre_del = post_del;
                    lastequality = diffs[pointer][1];
                }
                else {
                    equalitiesLength = 0;
                    lastequality = '';
                }
                post_ins = post_del = false;
            }
            else {
                if (diffs[pointer][0] === DIFF_DELETE_1.default) {
                    post_del = true;
                }
                else {
                    post_ins = true;
                }
                if (lastequality && ((pre_ins && pre_del && post_ins && post_del) ||
                    ((lastequality.length < this.Diff_EditCost / 2) &&
                        (pre_ins + pre_del + post_ins + post_del) === 3))) {
                    diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE_1.default, lastequality]);
                    diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT_1.default;
                    equalitiesLength--;
                    lastequality = '';
                    if (pre_ins && pre_del) {
                        post_ins = post_del = true;
                        equalitiesLength = 0;
                    }
                    else {
                        equalitiesLength--;
                        pointer = equalitiesLength > 0 ?
                            equalities[equalitiesLength - 1] : -1;
                        post_ins = post_del = false;
                    }
                    changes = true;
                }
            }
            pointer++;
        }
        if (changes) {
            this.diff_cleanupMerge(diffs);
        }
    };
    DMP.prototype.diff_cleanupMerge = function (diffs) {
        diffs.push([DIFF_EQUAL_1.default, '']);
        var pointer = 0;
        var count_delete = 0;
        var count_insert = 0;
        var text_delete = '';
        var text_insert = '';
        var commonlength;
        while (pointer < diffs.length) {
            switch (diffs[pointer][0]) {
                case DIFF_INSERT_1.default:
                    count_insert++;
                    text_insert += diffs[pointer][1];
                    pointer++;
                    break;
                case DIFF_DELETE_1.default:
                    count_delete++;
                    text_delete += diffs[pointer][1];
                    pointer++;
                    break;
                case DIFF_EQUAL_1.default:
                    if (count_delete !== 0 || count_insert !== 0) {
                        if (count_delete !== 0 && count_insert !== 0) {
                            commonlength = this.diff_commonPrefix(text_insert, text_delete);
                            if (commonlength !== 0) {
                                if ((pointer - count_delete - count_insert) > 0 &&
                                    diffs[pointer - count_delete - count_insert - 1][0] ===
                                        DIFF_EQUAL_1.default) {
                                    diffs[pointer - count_delete - count_insert - 1][1] +=
                                        text_insert.substring(0, commonlength);
                                }
                                else {
                                    diffs.splice(0, 0, [DIFF_EQUAL_1.default,
                                        text_insert.substring(0, commonlength)]);
                                    pointer++;
                                }
                                text_insert = text_insert.substring(commonlength);
                                text_delete = text_delete.substring(commonlength);
                            }
                            commonlength = this.diff_commonSuffix(text_insert, text_delete);
                            if (commonlength !== 0) {
                                diffs[pointer][1] = text_insert.substring(text_insert.length -
                                    commonlength) + diffs[pointer][1];
                                text_insert = text_insert.substring(0, text_insert.length -
                                    commonlength);
                                text_delete = text_delete.substring(0, text_delete.length -
                                    commonlength);
                            }
                        }
                        if (count_delete === 0) {
                            diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert, [DIFF_INSERT_1.default, text_insert]);
                        }
                        else if (count_insert === 0) {
                            diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert, [DIFF_DELETE_1.default, text_delete]);
                        }
                        else {
                            diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert, [DIFF_DELETE_1.default, text_delete], [DIFF_INSERT_1.default, text_insert]);
                        }
                        pointer = pointer - count_delete - count_insert +
                            (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
                    }
                    else if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL_1.default) {
                        diffs[pointer - 1][1] += diffs[pointer][1];
                        diffs.splice(pointer, 1);
                    }
                    else {
                        pointer++;
                    }
                    count_insert = 0;
                    count_delete = 0;
                    text_delete = '';
                    text_insert = '';
                    break;
            }
        }
        if (diffs[diffs.length - 1][1] === '') {
            diffs.pop();
        }
        var changes = false;
        pointer = 1;
        while (pointer < diffs.length - 1) {
            if (diffs[pointer - 1][0] === DIFF_EQUAL_1.default &&
                diffs[pointer + 1][0] === DIFF_EQUAL_1.default) {
                if (diffs[pointer][1].substring(diffs[pointer][1].length -
                    diffs[pointer - 1][1].length) === diffs[pointer - 1][1]) {
                    diffs[pointer][1] = diffs[pointer - 1][1] +
                        diffs[pointer][1].substring(0, diffs[pointer][1].length -
                            diffs[pointer - 1][1].length);
                    diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
                    diffs.splice(pointer - 1, 1);
                    changes = true;
                }
                else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ===
                    diffs[pointer + 1][1]) {
                    diffs[pointer - 1][1] += diffs[pointer + 1][1];
                    diffs[pointer][1] =
                        diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
                            diffs[pointer + 1][1];
                    diffs.splice(pointer + 1, 1);
                    changes = true;
                }
            }
            pointer++;
        }
        if (changes) {
            this.diff_cleanupMerge(diffs);
        }
    };
    DMP.prototype.diff_xIndex = function (diffs, loc) {
        var chars1 = 0;
        var chars2 = 0;
        var last_chars1 = 0;
        var last_chars2 = 0;
        var x;
        for (x = 0; x < diffs.length; x++) {
            if (diffs[x][0] !== DIFF_INSERT_1.default) {
                chars1 += diffs[x][1].length;
            }
            if (diffs[x][0] !== DIFF_DELETE_1.default) {
                chars2 += diffs[x][1].length;
            }
            if (chars1 > loc) {
                break;
            }
            last_chars1 = chars1;
            last_chars2 = chars2;
        }
        if (diffs.length !== x && diffs[x][0] === DIFF_DELETE_1.default) {
            return last_chars2;
        }
        return last_chars2 + (loc - last_chars1);
    };
    DMP.prototype.diff_prettyHtml = function (diffs) {
        var html = [];
        var pattern_amp = /&/g;
        var pattern_lt = /</g;
        var pattern_gt = />/g;
        var pattern_para = /\n/g;
        for (var x = 0; x < diffs.length; x++) {
            var op = diffs[x][0];
            var data = diffs[x][1];
            var text = data.replace(pattern_amp, "&amp;").replace(pattern_lt, "&lt;")
                .replace(pattern_gt, "&gt;").replace(pattern_para, "&para;<br>");
            switch (op) {
                case DIFF_INSERT_1.default:
                    html[x] = "<ins style=\"background:#e6ffe6;\">" + text + "</ins>";
                    break;
                case DIFF_DELETE_1.default:
                    html[x] = "<del style=\"background:#ffe6e6;\">" + text + "</del>";
                    break;
                case DIFF_EQUAL_1.default:
                    html[x] = "<span>" + text + "</span>";
                    break;
                default:
                    break;
            }
        }
        return html.join("");
    };
    DMP.prototype.sourceText = function (diffs) {
        var texts = [];
        var xLen = diffs.length;
        for (var x = 0; x < xLen; x++) {
            var diff = diffs[x];
            var kind = diff[0];
            var text = diff[1];
            if (kind !== DIFF_INSERT_1.default) {
                texts[x] = text;
            }
        }
        return texts.join('');
    };
    DMP.prototype.resultText = function (diffs) {
        var texts = [];
        var xLen = diffs.length;
        for (var x = 0; x < xLen; x++) {
            var diff = diffs[x];
            var kind = diff[0];
            var text = diff[1];
            if (kind !== DIFF_DELETE_1.default) {
                texts[x] = text;
            }
        }
        return texts.join('');
    };
    DMP.prototype.diff_levenshtein = function (diffs) {
        var levenshtein = 0;
        var insertions = 0;
        var deletions = 0;
        for (var x = 0; x < diffs.length; x++) {
            var op = diffs[x][0];
            var data = diffs[x][1];
            switch (op) {
                case DIFF_INSERT_1.default:
                    insertions += data.length;
                    break;
                case DIFF_DELETE_1.default:
                    deletions += data.length;
                    break;
                case DIFF_EQUAL_1.default:
                    levenshtein += Math.max(insertions, deletions);
                    insertions = 0;
                    deletions = 0;
                    break;
            }
        }
        levenshtein += Math.max(insertions, deletions);
        return levenshtein;
    };
    DMP.prototype.diffsToDeltaArray = function (diffs) {
        var texts = [];
        var xLen = diffs.length;
        for (var x = 0; x < xLen; x++) {
            var diff = diffs[x];
            var kind = diff[0];
            var text = diff[1];
            switch (kind) {
                case DIFF_INSERT_1.default:
                    texts[x] = '+' + encodeURI(text);
                    break;
                case DIFF_DELETE_1.default:
                    texts[x] = '-' + text.length;
                    break;
                case DIFF_EQUAL_1.default:
                    texts[x] = '=' + text.length;
                    break;
            }
        }
        return texts;
    };
    DMP.prototype.diffsToDeltaString = function (diffs) {
        return this.diffsToDeltaArray(diffs).join('\t').replace(/\x00/g, '%00').replace(/%20/g, ' ');
    };
    DMP.prototype.deltaArrayToDiffs = function (baseText, tokens) {
        var diffs = [];
        var diffsLength = 0;
        var pointer = 0;
        var xLen = tokens.length;
        for (var x = 0; x < xLen; x++) {
            var param = tokens[x].substring(1);
            switch (tokens[x].charAt(0)) {
                case '+':
                    try {
                        diffs[diffsLength++] = [DIFF_INSERT_1.default, decodeURI(param)];
                    }
                    catch (ex) {
                        throw new Error('Illegal escape in deltaToDiffs: ' + param);
                    }
                    break;
                case '-':
                case '=':
                    var n = parseInt(param, 10);
                    if (isNaN(n) || n < 0) {
                        throw new Error('Invalid number in deltaToDiffs: ' + param);
                    }
                    var text = baseText.substring(pointer, pointer += n);
                    if (tokens[x].charAt(0) === '=') {
                        diffs[diffsLength++] = [DIFF_EQUAL_1.default, text];
                    }
                    else {
                        diffs[diffsLength++] = [DIFF_DELETE_1.default, text];
                    }
                    break;
                default:
                    if (tokens[x]) {
                        throw new Error('Invalid diff operation in deltaToDiffs: ' +
                            tokens[x]);
                    }
            }
        }
        if (pointer !== baseText.length) {
            throw new Error('Delta length (' + pointer +
                ') does not equal source text length (' + baseText.length + ').');
        }
        return diffs;
    };
    DMP.prototype.deltaStringToDiffs = function (baseText, delta) {
        delta = delta.replace(/%00/g, '\0');
        var tokens = delta.split(/\t/g);
        return this.deltaArrayToDiffs(baseText, tokens);
    };
    DMP.prototype.match_main = function (text, pattern, loc) {
        loc = Math.max(0, Math.min(loc, text.length));
        if (text === pattern) {
            return 0;
        }
        else if (!text.length) {
            return -1;
        }
        else if (text.substring(loc, loc + pattern.length) === pattern) {
            return loc;
        }
        else {
            return this.match_bitap_(text, pattern, loc);
        }
    };
    DMP.prototype.match_bitap_ = function (text, pattern, loc) {
        if (pattern.length > this.Match_MaxBits) {
            throw new Error('Pattern too long for this browser.');
        }
        var s = this.match_alphabet_(pattern);
        var dmp = this;
        function match_bitapScore(e, x) {
            var accuracy = e / pattern.length;
            var proximity = Math.abs(loc - x);
            if (!dmp.Match_Distance) {
                return proximity ? 1.0 : accuracy;
            }
            return accuracy + (proximity / dmp.Match_Distance);
        }
        var score_threshold = this.Match_Threshold;
        var best_loc = text.indexOf(pattern, loc);
        if (best_loc !== -1) {
            score_threshold = Math.min(match_bitapScore(0, best_loc), score_threshold);
        }
        best_loc = text.lastIndexOf(pattern, loc + pattern.length);
        if (best_loc !== -1) {
            score_threshold = Math.min(match_bitapScore(0, best_loc), score_threshold);
        }
        var matchmask = 1 << (pattern.length - 1);
        best_loc = -1;
        var bin_min, bin_mid;
        var bin_max = pattern.length + text.length;
        var last_rd;
        for (var d = 0; d < pattern.length; d++) {
            bin_min = 0;
            bin_mid = bin_max;
            while (bin_min < bin_mid) {
                if (match_bitapScore(d, loc + bin_mid) <= score_threshold) {
                    bin_min = bin_mid;
                }
                else {
                    bin_max = bin_mid;
                }
                bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
            }
            bin_max = bin_mid;
            var start = Math.max(1, loc - bin_mid + 1);
            var finish = Math.min(loc + bin_mid, text.length) + pattern.length;
            var rd = Array(finish + 2);
            rd[finish + 1] = (1 << d) - 1;
            for (var j = finish; j >= start; j--) {
                var charMatch = s[text.charAt(j - 1)];
                if (d === 0) {
                    rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
                }
                else {
                    rd[j] = ((rd[j + 1] << 1) | 1) & charMatch |
                        (((last_rd[j + 1] | last_rd[j]) << 1) | 1) |
                        last_rd[j + 1];
                }
                if (rd[j] & matchmask) {
                    var score = match_bitapScore(d, j - 1);
                    if (score <= score_threshold) {
                        score_threshold = score;
                        best_loc = j - 1;
                        if (best_loc > loc) {
                            start = Math.max(1, 2 * loc - best_loc);
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            if (match_bitapScore(d + 1, loc) > score_threshold) {
                break;
            }
            last_rd = rd;
        }
        return best_loc;
    };
    DMP.prototype.match_alphabet_ = function (pattern) {
        var s = {};
        for (var i = 0; i < pattern.length; i++) {
            s[pattern.charAt(i)] = 0;
        }
        for (var i = 0; i < pattern.length; i++) {
            s[pattern.charAt(i)] |= 1 << (pattern.length - i - 1);
        }
        return s;
    };
    DMP.prototype.patch_addContext_ = function (patch, text) {
        var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
        var padding = 0;
        while (text.indexOf(pattern) !== text.lastIndexOf(pattern) &&
            pattern.length < this.Match_MaxBits - this.Patch_Margin -
                this.Patch_Margin) {
            padding += this.Patch_Margin;
            pattern = text.substring(patch.start2 - padding, patch.start2 + patch.length1 + padding);
        }
        padding += this.Patch_Margin;
        var prefix = text.substring(patch.start2 - padding, patch.start2);
        if (prefix) {
            patch.diffs.unshift([DIFF_EQUAL_1.default, prefix]);
        }
        var suffix = text.substring(patch.start2 + patch.length1, patch.start2 + patch.length1 + padding);
        if (suffix) {
            patch.diffs.push([DIFF_EQUAL_1.default, suffix]);
        }
        patch.start1 -= prefix.length;
        patch.start2 -= prefix.length;
        patch.length1 += prefix.length + suffix.length;
        patch.length2 += prefix.length + suffix.length;
    };
    DMP.prototype.patch_make = function (a, opt_b, opt_c) {
        var text1;
        var diffs;
        if (typeof a === 'string' && typeof opt_b === 'string' &&
            typeof opt_c === 'undefined') {
            text1 = a;
            diffs = this.diff_main(text1, opt_b, true);
            if (diffs.length > 2) {
                this.diff_cleanupSemantic(diffs);
                this.diff_cleanupEfficiency(diffs);
            }
        }
        else if (typeof a === 'object' && typeof opt_b === 'undefined' &&
            typeof opt_c === 'undefined') {
            diffs = a;
            text1 = this.sourceText(diffs);
        }
        else if (typeof a === 'string' && typeof opt_b === 'object' &&
            typeof opt_c === 'undefined') {
            text1 = a;
            diffs = opt_b;
        }
        else if (typeof a === 'string' && typeof opt_b === 'string' &&
            typeof opt_c === 'object') {
            text1 = a;
            diffs = opt_c;
        }
        else {
            throw new Error('Unknown call format to patch_make.');
        }
        if (diffs.length === 0) {
            return [];
        }
        return this.computePatches(text1, diffs);
    };
    DMP.prototype.computePatches = function (text1, diffs) {
        var patches = [];
        var patch = new Patch_1.default();
        var patchDiffLength = 0;
        var char_count1 = 0;
        var char_count2 = 0;
        var prepatch_text = text1;
        var postpatch_text = text1;
        for (var x = 0; x < diffs.length; x++) {
            var diff_type = diffs[x][0];
            var diff_text = diffs[x][1];
            if (!patchDiffLength && diff_type !== DIFF_EQUAL_1.default) {
                patch.start1 = char_count1;
                patch.start2 = char_count2;
            }
            switch (diff_type) {
                case DIFF_INSERT_1.default:
                    patch.diffs[patchDiffLength++] = diffs[x];
                    patch.length2 += diff_text.length;
                    postpatch_text = postpatch_text.substring(0, char_count2) + diff_text +
                        postpatch_text.substring(char_count2);
                    break;
                case DIFF_DELETE_1.default:
                    patch.length1 += diff_text.length;
                    patch.diffs[patchDiffLength++] = diffs[x];
                    postpatch_text = postpatch_text.substring(0, char_count2) +
                        postpatch_text.substring(char_count2 +
                            diff_text.length);
                    break;
                case DIFF_EQUAL_1.default:
                    if (diff_text.length <= 2 * this.Patch_Margin &&
                        patchDiffLength && diffs.length !== x + 1) {
                        patch.diffs[patchDiffLength++] = diffs[x];
                        patch.length1 += diff_text.length;
                        patch.length2 += diff_text.length;
                    }
                    else if (diff_text.length >= 2 * this.Patch_Margin) {
                        if (patchDiffLength) {
                            this.patch_addContext_(patch, prepatch_text);
                            patches.push(patch);
                            patch = new Patch_1.default();
                            patchDiffLength = 0;
                            prepatch_text = postpatch_text;
                            char_count1 = char_count2;
                        }
                    }
                    break;
            }
            if (diff_type !== DIFF_INSERT_1.default) {
                char_count1 += diff_text.length;
            }
            if (diff_type !== DIFF_DELETE_1.default) {
                char_count2 += diff_text.length;
            }
        }
        if (patchDiffLength) {
            this.patch_addContext_(patch, prepatch_text);
            patches.push(patch);
        }
        return patches;
    };
    DMP.prototype.patch_deepCopy = function (patches) {
        var patchesCopy = [];
        for (var x = 0; x < patches.length; x++) {
            var patch = patches[x];
            var patchCopy = new Patch_1.default();
            patchCopy.diffs = [];
            for (var y = 0; y < patch.diffs.length; y++) {
                patchCopy.diffs[y] = patch.diffs[y].slice();
            }
            patchCopy.start1 = patch.start1;
            patchCopy.start2 = patch.start2;
            patchCopy.length1 = patch.length1;
            patchCopy.length2 = patch.length2;
            patchesCopy[x] = patchCopy;
        }
        return patchesCopy;
    };
    DMP.prototype.patch_apply = function (patches, text) {
        if (patches.length === 0) {
            return [text, []];
        }
        patches = this.patch_deepCopy(patches);
        var nullPadding = this.patch_addPadding(patches);
        text = nullPadding + text + nullPadding;
        this.patch_splitMax(patches);
        var delta = 0;
        var results = [];
        for (var x = 0; x < patches.length; x++) {
            var expected_loc = patches[x].start2 + delta;
            var text1 = this.sourceText(patches[x].diffs);
            var start_loc;
            var end_loc = -1;
            if (text1.length > this.Match_MaxBits) {
                start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits), expected_loc);
                if (start_loc !== -1) {
                    end_loc = this.match_main(text, text1.substring(text1.length - this.Match_MaxBits), expected_loc + text1.length - this.Match_MaxBits);
                    if (end_loc === -1 || start_loc >= end_loc) {
                        start_loc = -1;
                    }
                }
            }
            else {
                start_loc = this.match_main(text, text1, expected_loc);
            }
            if (start_loc === -1) {
                results[x] = false;
                delta -= patches[x].length2 - patches[x].length1;
            }
            else {
                results[x] = true;
                delta = start_loc - expected_loc;
                var text2 = void 0;
                if (end_loc === -1) {
                    text2 = text.substring(start_loc, start_loc + text1.length);
                }
                else {
                    text2 = text.substring(start_loc, end_loc + this.Match_MaxBits);
                }
                if (text1 === text2) {
                    text = text.substring(0, start_loc) +
                        this.resultText(patches[x].diffs) +
                        text.substring(start_loc + text1.length);
                }
                else {
                    var diffs = this.diff_main(text1, text2, false);
                    if (text1.length > this.Match_MaxBits &&
                        this.diff_levenshtein(diffs) / text1.length >
                            this.Patch_DeleteThreshold) {
                        results[x] = false;
                    }
                    else {
                        this.diff_cleanupSemanticLossless(diffs);
                        var index1 = 0;
                        var index2;
                        for (var y = 0; y < patches[x].diffs.length; y++) {
                            var mod = patches[x].diffs[y];
                            if (mod[0] !== DIFF_EQUAL_1.default) {
                                index2 = this.diff_xIndex(diffs, index1);
                            }
                            if (mod[0] === DIFF_INSERT_1.default) {
                                text = text.substring(0, start_loc + index2) + mod[1] +
                                    text.substring(start_loc + index2);
                            }
                            else if (mod[0] === DIFF_DELETE_1.default) {
                                text = text.substring(0, start_loc + index2) +
                                    text.substring(start_loc + this.diff_xIndex(diffs, index1 + mod[1].length));
                            }
                            if (mod[0] !== DIFF_DELETE_1.default) {
                                index1 += mod[1].length;
                            }
                        }
                    }
                }
            }
        }
        text = text.substring(nullPadding.length, text.length - nullPadding.length);
        return [text, results];
    };
    DMP.prototype.computeNullPadding = function (paddingLength) {
        var nullPadding = '';
        for (var x = 1; x <= paddingLength; x++) {
            nullPadding += String.fromCharCode(x);
        }
        return nullPadding;
    };
    DMP.prototype.patch_addPadding = function (patches) {
        var paddingLength = this.Patch_Margin;
        var nullPadding = this.computeNullPadding(paddingLength);
        for (var x = 0; x < patches.length; x++) {
            patches[x].start1 += paddingLength;
            patches[x].start2 += paddingLength;
        }
        addLeadingPadding_1.default(patches, paddingLength, nullPadding);
        addTrailingPadding_1.default(patches, paddingLength, nullPadding);
        return nullPadding;
    };
    DMP.prototype.patch_splitMax = function (patches) {
        for (var x = 0; x < patches.length; x++) {
            if (patches[x].length1 > this.Match_MaxBits) {
                var bigpatch = patches[x];
                patches.splice(x--, 1);
                var patch_size = this.Match_MaxBits;
                var start1 = bigpatch.start1;
                var start2 = bigpatch.start2;
                var precontext = '';
                while (bigpatch.diffs.length !== 0) {
                    var patch = new Patch_1.default();
                    var empty = true;
                    patch.start1 = start1 - precontext.length;
                    patch.start2 = start2 - precontext.length;
                    if (precontext !== '') {
                        patch.length1 = patch.length2 = precontext.length;
                        patch.diffs.push([DIFF_EQUAL_1.default, precontext]);
                    }
                    while (bigpatch.diffs.length !== 0 &&
                        patch.length1 < patch_size - this.Patch_Margin) {
                        var diff_type = bigpatch.diffs[0][0];
                        var diff_text = bigpatch.diffs[0][1];
                        if (diff_type === DIFF_INSERT_1.default) {
                            patch.length2 += diff_text.length;
                            start2 += diff_text.length;
                            patch.diffs.push(bigpatch.diffs.shift());
                            empty = false;
                        }
                        else if (diff_type === DIFF_DELETE_1.default && patch.diffs.length === 1 &&
                            patch.diffs[0][0] === DIFF_EQUAL_1.default &&
                            diff_text.length > 2 * patch_size) {
                            patch.length1 += diff_text.length;
                            start1 += diff_text.length;
                            empty = false;
                            patch.diffs.push([diff_type, diff_text]);
                            bigpatch.diffs.shift();
                        }
                        else {
                            diff_text = diff_text.substring(0, patch_size - patch.length1 -
                                this.Patch_Margin);
                            patch.length1 += diff_text.length;
                            start1 += diff_text.length;
                            if (diff_type === DIFF_EQUAL_1.default) {
                                patch.length2 += diff_text.length;
                                start2 += diff_text.length;
                            }
                            else {
                                empty = false;
                            }
                            patch.diffs.push([diff_type, diff_text]);
                            if (diff_text === bigpatch.diffs[0][1]) {
                                bigpatch.diffs.shift();
                            }
                            else {
                                bigpatch.diffs[0][1] =
                                    bigpatch.diffs[0][1].substring(diff_text.length);
                            }
                        }
                    }
                    precontext = this.resultText(patch.diffs);
                    precontext =
                        precontext.substring(precontext.length - this.Patch_Margin);
                    var postcontext = this.sourceText(bigpatch.diffs)
                        .substring(0, this.Patch_Margin);
                    if (postcontext !== '') {
                        patch.length1 += postcontext.length;
                        patch.length2 += postcontext.length;
                        if (patch.diffs.length !== 0 &&
                            patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL_1.default) {
                            patch.diffs[patch.diffs.length - 1][1] += postcontext;
                        }
                        else {
                            patch.diffs.push([DIFF_EQUAL_1.default, postcontext]);
                        }
                    }
                    if (!empty) {
                        patches.splice(++x, 0, patch);
                    }
                }
            }
        }
    };
    DMP.prototype.patch_toText = function (patches) {
        var text = [];
        for (var x = 0; x < patches.length; x++) {
            text[x] = patches[x];
        }
        return text.join('');
    };
    DMP.prototype.patch_fromText = function (textline) {
        var patches = [];
        if (!textline) {
            return patches;
        }
        textline = textline.replace(/%00/g, '\0');
        var text = textline.split('\n');
        var textPointer = 0;
        while (textPointer < text.length) {
            var m = text[textPointer].match(/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/);
            if (!m) {
                throw new Error('Invalid patch string: ' + text[textPointer]);
            }
            var patch = new Patch_1.default();
            patches.push(patch);
            patch.start1 = parseInt(m[1], 10);
            if (m[2] === '') {
                patch.start1--;
                patch.length1 = 1;
            }
            else if (m[2] === '0') {
                patch.length1 = 0;
            }
            else {
                patch.start1--;
                patch.length1 = parseInt(m[2], 10);
            }
            patch.start2 = parseInt(m[3], 10);
            if (m[4] === '') {
                patch.start2--;
                patch.length2 = 1;
            }
            else if (m[4] === '0') {
                patch.length2 = 0;
            }
            else {
                patch.start2--;
                patch.length2 = parseInt(m[4], 10);
            }
            textPointer++;
            while (textPointer < text.length) {
                var sign = text[textPointer].charAt(0);
                try {
                    var line = decodeURI(text[textPointer].substring(1));
                }
                catch (ex) {
                    throw new Error('Illegal escape in patch_fromText: ' + line);
                }
                if (sign === '-') {
                    patch.diffs.push([DIFF_DELETE_1.default, line]);
                }
                else if (sign === '+') {
                    patch.diffs.push([DIFF_INSERT_1.default, line]);
                }
                else if (sign === ' ') {
                    patch.diffs.push([DIFF_EQUAL_1.default, line]);
                }
                else if (sign === '@') {
                    break;
                }
                else if (sign === '') {
                }
                else {
                    throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
                }
                textPointer++;
            }
        }
        return patches;
    };
    return DMP;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DMP;
