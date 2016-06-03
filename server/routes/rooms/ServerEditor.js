"use strict";
var DMP_1 = require('../../synchronization/DMP');
var dmp = new DMP_1.default();
var ServerEditor = (function () {
    function ServerEditor() {
        this._text = "";
    }
    ServerEditor.prototype.getText = function () {
        return this._text;
    };
    ServerEditor.prototype.setText = function (text) {
        this._text = text;
    };
    ServerEditor.prototype.patch = function (patches) {
        var oldText = this.getText();
        var result = dmp.patch_apply(patches, oldText);
        var newText = result[0];
        var flags = result[1];
        if (oldText !== newText) {
            this.setText(newText);
        }
        return flags;
    };
    ServerEditor.prototype.onSentDiff = function (diffs) {
    };
    ServerEditor.prototype.release = function () {
        return 0;
    };
    return ServerEditor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServerEditor;
