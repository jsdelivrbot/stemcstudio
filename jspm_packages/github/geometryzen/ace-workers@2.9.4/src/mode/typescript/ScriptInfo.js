System.register(["../../Document"], function (exports_1, context_1) {
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
                function ScriptInfo(textOrLines) {
                    this.version = 1;
                    this.doc = new Document_1.default(textOrLines);
                }
                ScriptInfo.prototype.updateContent = function (content) {
                    this.doc.setValue(content);
                    this.version++;
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
            exports_1("default", ScriptInfo);
        }
    };
});
