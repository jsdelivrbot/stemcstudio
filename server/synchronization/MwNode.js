"use strict";
var asserts_1 = require('./asserts');
var MwLink_1 = require('./MwLink');
var dehydrateMap_1 = require('./ds/dehydrateMap');
var MwNode = (function () {
    function MwNode(id, workspace) {
        this.id = id;
        this.editors = {};
        this.links = {};
        this.workspace = workspace;
    }
    MwNode.prototype.addEditor = function (fileId, editor) {
        this.editors[fileId] = editor;
        var owners = Object.keys(this.links);
        var iLen = owners.length;
        for (var i = 0; i < iLen; i++) {
            var owner = owners[i];
            var link = this.links[owner];
            var shadow = link.ensureShadow(fileId);
            shadow.updateTextAndIncrementLocalVersion(editor.getText());
        }
    };
    MwNode.prototype.removeEditor = function (fileId) {
        var editor = this.editors[fileId];
        if (editor) {
            this.workspace.deleteEditor(editor);
            editor.release();
            delete this.editors[fileId];
            var nodeIds = Object.keys(this.links);
            for (var n = 0; n < nodeIds.length; n++) {
                var nodeId = nodeIds[n];
                var link = this.links[nodeId];
                var edit = {
                    s: this.id,
                    t: nodeId,
                    x: [link.removeFile(fileId)]
                };
                link.edits.push(edit);
            }
        }
    };
    MwNode.prototype.addLink = function (nodeId, link) {
        this.links[nodeId] = link;
    };
    MwNode.prototype.ensureLink = function (nodeId) {
        var existing = this.links[nodeId];
        if (!existing) {
            var link = new MwLink_1.default();
            this.addLink(nodeId, link);
            return link;
        }
        else {
            return existing;
        }
    };
    MwNode.prototype.getEditor = function (fileId) {
        return this.editors[fileId];
    };
    MwNode.prototype.getBroadcast = function () {
        var broadcast = {};
        var nodeIds = Object.keys(this.links);
        for (var i = 0; i < nodeIds.length; i++) {
            var nodeId = nodeIds[i];
            broadcast[nodeId] = this.getEdits(nodeId);
        }
        return broadcast;
    };
    MwNode.prototype.getEdits = function (nodeId) {
        var link = this.ensureLink(nodeId);
        this.captureWorkspace(nodeId);
        return link.edits;
    };
    MwNode.prototype.setEdits = function (edits) {
        var iLen = edits.length;
        for (var i = 0; i < iLen; i++) {
            var edit = edits[i];
            this.setEdit(edit);
        }
    };
    MwNode.prototype.rehydrate = function (value) {
        var _this = this;
        var mapEditors = function (editors) {
            var result = {};
            var fileIds = Object.keys(editors);
            for (var i = 0; i < fileIds.length; i++) {
                var fileId = fileIds[i];
                var value_1 = editors[fileId];
                var editor = _this.workspace.createEditor();
                editor.setText(value_1.t);
                result[fileId] = editor;
            }
            return result;
        };
        var mapLinks = function (links) {
            var result = {};
            var nodeIds = Object.keys(links);
            for (var i = 0; i < nodeIds.length; i++) {
                var nodeId = nodeIds[i];
                var value_2 = links[nodeId];
                var link = new MwLink_1.default();
                link.rehydrate(value_2);
                result[nodeId] = link;
            }
            return result;
        };
        this.id = value.i;
        this.editors = mapEditors(value.e);
        this.links = mapLinks(value.k);
    };
    MwNode.prototype.dehydrate = function () {
        var _this = this;
        var mapEditors = function (editors) {
            var result = {};
            var fileIds = Object.keys(editors);
            for (var i = 0; i < fileIds.length; i++) {
                var fileId = fileIds[i];
                var editor = editors[fileId];
                result[fileId] = {
                    t: editor.getText()
                };
                _this.workspace.deleteEditor(editor);
            }
            return result;
        };
        var value = {
            i: this.id,
            e: mapEditors(this.editors),
            k: dehydrateMap_1.default(this.links)
        };
        this.id = void 0;
        this.editors = void 0;
        this.links = void 0;
        return value;
    };
    MwNode.prototype.captureWorkspace = function (nodeId) {
        var link = this.ensureLink(nodeId);
        var edit = {
            s: this.id,
            t: nodeId,
            x: []
        };
        var fileIds = Object.keys(this.editors);
        var iLen = fileIds.length;
        for (var i = 0; i < iLen; i++) {
            var fileId = fileIds[i];
            var change = this.captureFile(fileId, link);
            if (change) {
                edit.x.push(change);
            }
        }
        link.edits.push(edit);
    };
    MwNode.prototype.containsRawAction = function (link, text) {
        var edits = link.edits;
        for (var i = 0; i < edits.length; i++) {
            var edit = edits[i];
            var changes = edit.x;
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
        }
        return false;
    };
    MwNode.prototype.captureFile = function (fileId, link) {
        asserts_1.mustBeTruthy(link, "link must be a MwLink (" + typeof link + ")");
        var shadow = link.shadows[fileId];
        var editor = this.editors[fileId];
        var text = editor.getText();
        if (shadow) {
            if (shadow.happy) {
                return shadow.createDiffTextChange(text, fileId);
            }
            else {
                if (this.containsRawAction(link, text)) {
                    return void 0;
                }
                else {
                    return shadow.createFullTextChange(text, fileId, true);
                }
            }
        }
        else {
            var shadow_1 = link.ensureShadow(fileId);
            return shadow_1.createFullTextChange(text, fileId, true);
        }
    };
    MwNode.prototype.setEdit = function (edit) {
        if (edit.t !== this.id) {
            throw new Error("edit " + edit.t + " is not for this node " + this.id);
        }
        var link = this.ensureLink(edit.s);
        var iLen = edit.x.length;
        for (var i = 0; i < iLen; i++) {
            var change = edit.x[i];
            var action = change.a;
            if (action) {
                switch (action.c) {
                    case 'R':
                        {
                            var editor = this.ensureEditor(change.f);
                            var text = decodeURI(action.x);
                            editor.setText(text);
                            var shadow = link.ensureShadow(change.f);
                            shadow.updateRaw(text, action.n);
                            link.discardFileChanges(change.f);
                        }
                        break;
                    case 'r':
                        {
                            var text = decodeURI(action.x);
                            var shadow = link.shadows[change.f];
                            shadow.updateRaw(text, action.n);
                            link.discardFileChanges(change.f);
                        }
                        break;
                    case 'D':
                    case 'd':
                        {
                            var editor = this.editors[change.f];
                            var shadow = link.getShadow(change.f);
                            var backup = link.getBackup(change.f);
                            link.patchDelta(change.f, editor, action.c, action.x, change.m, action.n);
                            backup.copy(shadow);
                            if (typeof change.m === 'number') {
                                link.discardActionsLe(change.f, change.m);
                            }
                        }
                        break;
                    case 'N':
                    case 'n':
                        {
                            this.removeEditor(change.f);
                            if (typeof change.m === 'number') {
                                link.discardActionsLe(change.f, change.m);
                            }
                            link.discardFileChanges(change.f);
                        }
                        break;
                    default: {
                        console.warn("Unknown code: " + action.c);
                    }
                }
            }
            else {
                if (typeof change.m === 'number') {
                    link.discardActionsLe(change.f, change.m);
                }
            }
        }
    };
    MwNode.prototype.ensureEditor = function (fileId) {
        var existing = this.editors[fileId];
        if (!existing) {
            var editor = this.workspace.createEditor();
            this.addEditor(fileId, editor);
            return editor;
        }
        else {
            return existing;
        }
    };
    return MwNode;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MwNode;
