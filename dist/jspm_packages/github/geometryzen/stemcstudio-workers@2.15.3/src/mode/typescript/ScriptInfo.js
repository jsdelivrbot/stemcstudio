System.register(["editor-document"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var editor_document_1, ScriptInfo;
    return {
        setters: [
            function (editor_document_1_1) {
                editor_document_1 = editor_document_1_1;
            }
        ],
        execute: function () {
            ScriptInfo = (function () {
                function ScriptInfo(textOrLines, version) {
                    this.version = version;
                    this.doc = new editor_document_1.Document(textOrLines);
                }
                ScriptInfo.prototype.updateContent = function (content) {
                    this.updateContentAndVersionNumber(content, this.version + 1);
                };
                ScriptInfo.prototype.updateContentAndVersionNumber = function (content, version) {
                    this.doc.setValue(content);
                    this.version = version;
                };
                ScriptInfo.prototype.applyDelta = function (delta) {
                    this.doc.applyDelta(delta);
                    this.version++;
                    return this.version;
                };
                ScriptInfo.prototype.getValue = function () {
                    return this.doc.getValue();
                };
                ScriptInfo.prototype.getLineAndColumn = function (positionIndex) {
                    var pos = this.doc.indexToPosition(positionIndex);
                    if (pos) {
                        return { line: pos.row + 1, column: pos.column };
                    }
                    else {
                        return void 0;
                    }
                };
                ScriptInfo.prototype.positionToIndex = function (pos) {
                    return this.doc.positionToIndex(pos, 0);
                };
                ScriptInfo.prototype.lineAndColumnToIndex = function (lineAndColumn) {
                    return this.doc.positionToIndex({ row: lineAndColumn.line - 1, column: lineAndColumn.column }, 0);
                };
                return ScriptInfo;
            }());
            exports_1("ScriptInfo", ScriptInfo);
        }
    };
});
