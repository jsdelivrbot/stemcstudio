"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DMP_1 = require("./DMP");
var INITIAL_VERSION = 1;
var dmp = new DMP_1.default();
var MwShadow = (function () {
    function MwShadow() {
        this.happy = false;
        this.merge = true;
    }
    MwShadow.prototype.copy = function (other) {
        this.n = other.n;
        this.m = other.m;
        this.text = other.text;
        this.happy = other.happy;
        this.merge = other.merge;
    };
    MwShadow.prototype.rehydrate = function (value) {
        this.n = value.n;
        this.m = value.m;
        this.text = value.t;
        this.happy = value.h;
        this.merge = value.g;
        return this;
    };
    MwShadow.prototype.dehydrate = function () {
        var value = {
            n: this.n,
            m: this.m,
            t: this.text,
            h: this.happy,
            g: this.merge
        };
        this.n = void 0;
        this.m = void 0;
        this.text = void 0;
        this.happy = void 0;
        this.merge = void 0;
        return value;
    };
    MwShadow.prototype.createDiffTextChange = function (text) {
        var action = this.diffAndTagWithLocalVersion(text);
        this.updateTextAndIncrementLocalVersion(text);
        return this.createFileChange(action);
    };
    MwShadow.prototype.createFullTextChange = function (text, overwrite) {
        if (typeof text !== 'string') {
            throw new TypeError("text must be a string");
        }
        if (typeof overwrite !== 'boolean') {
            throw new TypeError("overwrite must be a boolean");
        }
        this.updateTextAndIncrementLocalVersion(text);
        var action = this.createRawAction(overwrite);
        return this.createFileChange(action);
    };
    MwShadow.prototype.updateRaw = function (text, remoteVersion) {
        this.updateTextAndIncrementLocalVersion(text);
        this.m = remoteVersion;
        this.happy = true;
    };
    MwShadow.prototype.updateTextAndIncrementLocalVersion = function (text) {
        this.text = text;
        if (typeof this.n === 'number') {
            this.n++;
        }
        else {
            this.n = INITIAL_VERSION;
        }
    };
    MwShadow.prototype.createFileChange = function (action) {
        return { m: this.m, a: action };
    };
    MwShadow.prototype.createRawAction = function (overwrite) {
        return { c: overwrite ? 'R' : 'r', n: this.n, x: encodeURI(this.text).replace(/%20/g, ' ') };
    };
    MwShadow.prototype.diffAndTagWithLocalVersion = function (text) {
        if (this.happy) {
            var diffs = dmp.diff_main(this.text, text, true);
            if (diffs.length > 2) {
                dmp.diff_cleanupSemantic(diffs);
                dmp.diff_cleanupEfficiency(diffs);
            }
            var action = {
                c: this.merge ? 'd' : 'D',
                n: this.n,
                x: dmp.diffsToDeltaArray(diffs)
            };
            return action;
        }
        else {
            throw new Error("Attempting to create diff when the last postback failed.");
        }
    };
    return MwShadow;
}());
exports.default = MwShadow;
