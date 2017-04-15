"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DMP_1 = require("./DMP");
var isChanged_1 = require("./isChanged");
var MwShadow_1 = require("./MwShadow");
var dmp = new DMP_1.default();
var MwRemote = (function () {
    function MwRemote() {
        this.edits = {};
    }
    MwRemote.prototype.getEdits = function (nodeId) {
        return this.edits[nodeId];
    };
    MwRemote.prototype.addChange = function (nodeId, change) {
        var edit = this.edits[nodeId];
        if (!edit) {
            this.edits[nodeId] = { x: [] };
        }
        this.edits[nodeId].x.push(change);
    };
    MwRemote.prototype.containsRawAction = function (nodeId, text) {
        var edits = this.getEdits(nodeId);
        var changes = edits.x;
        if (changes.length === 1) {
            var change = changes[0];
            var action = change.a;
            if (action && action.c === 'R' && action.x === text) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    MwRemote.prototype.dehydrate = function () {
        var value = {
            s: this.shadow ? this.shadow.dehydrate() : void 0,
            b: this.backup ? this.backup.dehydrate() : void 0,
            e: this.edits
        };
        return value;
    };
    MwRemote.prototype.rehydrate = function (value) {
        this.shadow = value.s ? new MwShadow_1.default().rehydrate(value.s) : void 0;
        this.backup = value.b ? new MwShadow_1.default().rehydrate(value.b) : void 0;
        this.edits = value.e;
    };
    MwRemote.prototype.ensureShadow = function () {
        if (!this.shadow) {
            this.shadow = new MwShadow_1.default();
            this.backup = new MwShadow_1.default();
        }
        return this.shadow;
    };
    MwRemote.prototype.discardActionsLe = function (nodeId, version) {
        var edits = this.edits[nodeId];
        if (edits) {
            var changes = edits.x;
            for (var j = 0; j < changes.length; j++) {
                var change = changes[j];
                var action = change.a;
                if (action && action.n <= version) {
                    changes.splice(j, 1);
                    j--;
                }
            }
            if (changes.length === 0) {
                delete this.edits[nodeId];
            }
        }
    };
    MwRemote.prototype.discardChanges = function (nodeId) {
        delete this.edits[nodeId];
    };
    MwRemote.prototype.patchDelta = function (nodeId, editor, code, delta, localVersion, remoteVersion, callback) {
        var shadow = this.shadow;
        var backup = this.backup;
        if (typeof shadow.m !== 'number') {
            shadow.m = remoteVersion;
        }
        if (localVersion !== shadow.n) {
            if (backup && localVersion === backup.n) {
                this.discardChanges(nodeId);
                shadow.copy(backup);
                shadow.happy = true;
                callback(void 0);
            }
            else {
                shadow.happy = false;
                callback(new Error("Can't apply a delta on a mismatched version: shadow.n=" + shadow.n + ", localVersion=" + localVersion));
            }
        }
        else if (remoteVersion > shadow.m) {
            shadow.happy = false;
            callback(new Error('Remote version in future.\n' + 'Expected: ' + shadow.m + ' Got: ' + remoteVersion));
        }
        else if (remoteVersion < shadow.m) {
            callback(void 0);
        }
        else {
            var diffs = void 0;
            try {
                diffs = dmp.deltaArrayToDiffs(shadow.text, delta);
                var m = shadow.m;
                console.log("Incrementing shadow version number (m) from " + m + " to " + (m + 1));
                shadow.m++;
            }
            catch (e) {
                diffs = null;
                shadow.happy = false;
                console.warn('Delta mismatch.\n' + encodeURI(shadow.text));
            }
            if (diffs) {
                if (isChanged_1.default(diffs)) {
                    if (code === 'D') {
                        shadow.text = dmp.resultText(diffs);
                        editor.setText(shadow.text, function (err) {
                            if (!err) {
                                shadow.happy = true;
                                callback(void 0);
                            }
                            else {
                                callback(err);
                            }
                        });
                    }
                    else {
                        var patches = dmp.computePatches(shadow.text, diffs);
                        var serverResult = dmp.patch_apply(patches, shadow.text);
                        shadow.text = serverResult[0];
                        shadow.happy = true;
                        editor.patch(patches, function (err, flags) {
                            callback(err);
                        });
                    }
                }
                else {
                    shadow.happy = true;
                    callback(void 0);
                }
            }
            else {
                callback(void 0);
            }
        }
    };
    MwRemote.prototype.removeFile = function () {
        var change = {
            m: this.shadow.m,
            a: {
                c: 'N',
                n: void 0,
                x: void 0
            }
        };
        this.shadow = void 0;
        this.backup = void 0;
        return change;
    };
    return MwRemote;
}());
exports.default = MwRemote;
//# sourceMappingURL=MwRemote.js.map