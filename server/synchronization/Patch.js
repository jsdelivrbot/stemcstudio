"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DIFF_DELETE_1 = require("./DIFF_DELETE");
var DIFF_INSERT_1 = require("./DIFF_INSERT");
var DIFF_EQUAL_1 = require("./DIFF_EQUAL");
var Patch = (function () {
    function Patch() {
        this.diffs = [];
        this.start1 = null;
        this.start2 = null;
        this.length1 = 0;
        this.length2 = 0;
    }
    Patch.prototype.toString = function () {
        var coords1;
        var coords2;
        if (this.length1 === 0) {
            coords1 = this.start1 + ',0';
        }
        else if (this.length1 === 1) {
            coords1 = (this.start1 + 1).toString();
        }
        else {
            coords1 = (this.start1 + 1) + ',' + this.length1;
        }
        if (this.length2 === 0) {
            coords2 = this.start2 + ',0';
        }
        else if (this.length2 === 1) {
            coords2 = (this.start2 + 1).toString();
        }
        else {
            coords2 = (this.start2 + 1) + ',' + this.length2;
        }
        var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
        var op;
        for (var x = 0; x < this.diffs.length; x++) {
            switch (this.diffs[x][0]) {
                case DIFF_INSERT_1.default:
                    op = '+';
                    break;
                case DIFF_DELETE_1.default:
                    op = '-';
                    break;
                case DIFF_EQUAL_1.default:
                    op = ' ';
                    break;
                default: {
                }
            }
            text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
        }
        return text.join('').replace(/\x00/g, '%00').replace(/%20/g, ' ');
    };
    return Patch;
}());
exports.default = Patch;
