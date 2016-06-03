"use strict";
var DMP_1 = require('./DMP');
var isChanged_1 = require('./isChanged');
var MwShadow_1 = require('./MwShadow');
var dehydrateMap_1 = require('./ds/dehydrateMap');
var dmp = new DMP_1.default();
var MwLink = (function () {
    function MwLink() {
        this.shadows = {};
        this.backups = {};
        this.edits = [];
    }
    MwLink.prototype.rehydrate = function (value) {
        var mapShadows = function (shadows) {
            var result = {};
            var fileIds = Object.keys(shadows);
            for (var i = 0; i < fileIds.length; i++) {
                var fileId = fileIds[i];
                var value_1 = shadows[fileId];
                var shadow = new MwShadow_1.default();
                shadow.rehydrate(value_1);
                result[fileId] = shadow;
            }
            return result;
        };
        this.shadows = mapShadows(value.s);
        this.backups = mapShadows(value.b);
        this.edits = value.e;
    };
    MwLink.prototype.dehydrate = function () {
        var value = {
            s: dehydrateMap_1.default(this.shadows),
            b: dehydrateMap_1.default(this.backups),
            e: this.edits
        };
        this.shadows = void 0;
        this.backups = void 0;
        this.edits = void 0;
        return value;
    };
    MwLink.prototype.discardActionsLe = function (filename, version) {
        var edits = this.edits;
        for (var i = 0; i < edits.length; i++) {
            var edit = this.edits[i];
            var changes = edit.x;
            for (var j = 0; j < changes.length; j++) {
                var change = changes[j];
                if (change.f === filename) {
                    var action = change.a;
                    if (action && action.n <= version) {
                        changes.splice(j, 1);
                        j--;
                    }
                }
            }
            if (changes.length === 0) {
                edits.splice(i, 1);
                i--;
            }
        }
    };
    MwLink.prototype.discardFileChanges = function (fileId) {
        var edits = this.edits;
        for (var i = 0; i < edits.length; i++) {
            var edit = edits[i];
            var changes = edit.x;
            for (var j = 0; j < changes.length; j++) {
                if (changes[j].f === fileId) {
                    changes.splice(j, 1);
                    j--;
                }
            }
        }
    };
    MwLink.prototype.ensureShadow = function (fileId) {
        var existing = this.shadows[fileId];
        if (!existing) {
            var shadow = new MwShadow_1.default();
            this.shadows[fileId] = shadow;
            var backup = new MwShadow_1.default();
            this.backups[fileId] = backup;
            return shadow;
        }
        else {
            return existing;
        }
    };
    MwLink.prototype.getShadow = function (fileId) {
        var shadow = this.shadows[fileId];
        if (shadow) {
            return shadow;
        }
        else {
            throw new Error("Missing shadow for file '" + fileId + "'.");
        }
    };
    MwLink.prototype.getBackup = function (fileId) {
        var backup = this.backups[fileId];
        if (backup) {
            return backup;
        }
        else {
            return void 0;
        }
    };
    MwLink.prototype.patchDelta = function (fileId, editor, code, delta, localVersion, remoteVersion) {
        var shadow = this.getShadow(fileId);
        var backup = this.getBackup(fileId);
        if (typeof shadow.m !== 'number') {
            shadow.m = remoteVersion;
        }
        if (localVersion !== shadow.n) {
            if (backup && localVersion === backup.n) {
                this.discardFileChanges(fileId);
                shadow.copy(backup);
                shadow.happy = true;
            }
            else {
                shadow.happy = false;
                console.warn("handleDelta(...) this.localVersion=" + shadow.n + ", localVersion=" + localVersion);
            }
        }
        else if (remoteVersion > shadow.m) {
            shadow.happy = false;
            console.warn('Remote version in future.\n' + 'Expected: ' + shadow.m + ' Got: ' + remoteVersion);
        }
        else if (remoteVersion < shadow.m) {
        }
        else {
            var diffs = void 0;
            try {
                diffs = dmp.deltaArrayToDiffs(shadow.text, delta);
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
                        editor.setText(shadow.text);
                        shadow.happy = true;
                    }
                    else {
                        var patches = dmp.computePatches(shadow.text, diffs);
                        var serverResult = dmp.patch_apply(patches, shadow.text);
                        shadow.text = serverResult[0];
                        shadow.happy = true;
                        editor.patch(patches);
                    }
                }
                else {
                    shadow.happy = true;
                }
            }
            else {
            }
        }
    };
    MwLink.prototype.removeFile = function (fileId) {
        var change = {
            f: fileId,
            m: this.getShadow(fileId).m,
            a: {
                c: 'N',
                n: void 0,
                x: void 0
            }
        };
        delete this.shadows[fileId];
        delete this.backups[fileId];
        return change;
    };
    return MwLink;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MwLink;
