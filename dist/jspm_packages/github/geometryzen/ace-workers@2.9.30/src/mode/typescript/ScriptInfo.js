System.register(["../../editor/Document"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Document_1, ScriptInfo;
    return {
        setters: [
            function (Document_1_1) {
                Document_1 = Document_1_1;
            }
        ],
        execute: function () {
            ScriptInfo = (function () {
                function ScriptInfo(textOrLines, version) {
                    this.version = version;
                    this.doc = new Document_1.Document(textOrLines);
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
                };
                ScriptInfo.prototype.getValue = function () {
                    return this.doc.getValue();
                };
                return ScriptInfo;
            }());
            exports_1("ScriptInfo", ScriptInfo);
        }
    };
});
