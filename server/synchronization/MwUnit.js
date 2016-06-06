"use strict";
var MwRemote_1 = require('./MwRemote');
var dehydrateMap_1 = require('./ds/dehydrateMap');
var MwUnit = (function () {
    function MwUnit(workspace) {
        this.workspace = workspace;
        this.remotes = {};
    }
    MwUnit.prototype.dehydrate = function () {
        var unit = {
            e: this.editor ? { t: this.editor.getText() } : void 0,
            k: dehydrateMap_1.default(this.remotes)
        };
        return unit;
    };
    MwUnit.prototype.rehydrate = function (value) {
        var mapLinks = function (links) {
            var result = {};
            var nodeIds = Object.keys(links);
            for (var i = 0; i < nodeIds.length; i++) {
                var nodeId = nodeIds[i];
                var value_1 = links[nodeId];
                var link = new MwRemote_1.default();
                link.rehydrate(value_1);
                result[nodeId] = link;
            }
            return result;
        };
        if (value.e) {
            this.editor = this.workspace.createEditor();
            this.editor.setText(value.e.t);
        }
        else {
            this.editor = void 0;
        }
        this.remotes = mapLinks(value.k);
    };
    MwUnit.prototype.getBroadcast = function () {
        var broadcast = {};
        var nodeIds = Object.keys(this.remotes);
        for (var i = 0; i < nodeIds.length; i++) {
            var nodeId = nodeIds[i];
            broadcast[nodeId] = this.getEdits(nodeId);
        }
        return broadcast;
    };
    MwUnit.prototype.getEdits = function (nodeId) {
        var remote = this.ensureRemote(nodeId);
        if (this.editor) {
            var change = this.captureFile(nodeId);
            remote.addChange(nodeId, change);
        }
        return remote.getEdits(nodeId);
    };
    MwUnit.prototype.getEditor = function () {
        return this.editor;
    };
    MwUnit.prototype.setEditor = function (editor) {
        this.editor = editor;
    };
    MwUnit.prototype.removeEditor = function () {
        var editor = this.editor;
        if (editor) {
            this.workspace.deleteEditor(editor);
            editor.release();
            this.editor = void 0;
            var nodeIds = Object.keys(this.remotes);
            for (var n = 0; n < nodeIds.length; n++) {
                var nodeId = nodeIds[n];
                var remote = this.remotes[nodeId];
                remote.addChange(nodeId, remote.removeFile());
            }
        }
    };
    MwUnit.prototype.addRemote = function (nodeId, remote) {
        this.remotes[nodeId] = remote;
    };
    MwUnit.prototype.captureFile = function (nodeId) {
        var remote = this.ensureRemote(nodeId);
        var shadow = remote.shadow;
        var editor = this.editor;
        if (editor) {
            var text = editor.getText();
            if (shadow) {
                if (shadow.happy) {
                    return shadow.createDiffTextChange(text);
                }
                else {
                    if (remote.containsRawAction(nodeId, text)) {
                        return void 0;
                    }
                    else {
                        return shadow.createFullTextChange(text, true);
                    }
                }
            }
            else {
                var shadow_1 = remote.ensureShadow();
                return shadow_1.createFullTextChange(text, true);
            }
        }
        else {
            throw new Error("Must be an editor to capture a file.");
        }
    };
    MwUnit.prototype.ensureRemote = function (nodeId) {
        var existing = this.remotes[nodeId];
        if (!existing) {
            var remote = new MwRemote_1.default();
            this.addRemote(nodeId, remote);
            return remote;
        }
        else {
            return existing;
        }
    };
    MwUnit.prototype.setEdits = function (nodeId, edits) {
        var remote = this.ensureRemote(nodeId);
        var iLen = edits.x.length;
        for (var i = 0; i < iLen; i++) {
            var change = edits.x[i];
            var action = change.a;
            if (action) {
                switch (action.c) {
                    case 'R':
                        {
                            var editor = this.ensureEditor();
                            var text = decodeURI(action.x);
                            editor.setText(text);
                            var shadow = remote.ensureShadow();
                            shadow.updateRaw(text, action.n);
                            remote.discardChanges(nodeId);
                        }
                        break;
                    case 'r':
                        {
                            var text = decodeURI(action.x);
                            var shadow = remote.shadow;
                            shadow.updateRaw(text, action.n);
                            remote.discardChanges(nodeId);
                        }
                        break;
                    case 'D':
                    case 'd':
                        {
                            var editor = this.editor;
                            var shadow = remote.shadow;
                            var backup = remote.backup;
                            remote.patchDelta(nodeId, editor, action.c, action.x, change.m, action.n);
                            backup.copy(shadow);
                            if (typeof change.m === 'number') {
                                remote.discardActionsLe(nodeId, change.m);
                            }
                        }
                        break;
                    case 'N':
                    case 'n':
                        {
                            this.removeEditor();
                            if (typeof change.m === 'number') {
                                remote.discardActionsLe(nodeId, change.m);
                            }
                            remote.discardChanges(nodeId);
                        }
                        break;
                    default: {
                        console.warn("Unknown code: " + action.c);
                    }
                }
            }
            else {
                if (typeof change.m === 'number') {
                    remote.discardActionsLe(nodeId, change.m);
                }
            }
        }
    };
    MwUnit.prototype.ensureEditor = function () {
        if (!this.editor) {
            this.editor = this.workspace.createEditor();
        }
        return this.editor;
    };
    return MwUnit;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MwUnit;
