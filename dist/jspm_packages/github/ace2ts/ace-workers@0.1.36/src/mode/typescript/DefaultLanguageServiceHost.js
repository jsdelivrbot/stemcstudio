System.register(["./ScriptInfo"], function(exports_1) {
    "use strict";
    var ScriptInfo_1;
    var DefaultLanguageServiceHost;
    return {
        setters:[
            function (ScriptInfo_1_1) {
                ScriptInfo_1 = ScriptInfo_1_1;
            }],
        execute: function() {
            DefaultLanguageServiceHost = (function () {
                function DefaultLanguageServiceHost() {
                    this.compilerOptions = null;
                    this.scripts = {};
                }
                DefaultLanguageServiceHost.prototype.getScriptFileNames = function () {
                    return Object.keys(this.scripts);
                };
                DefaultLanguageServiceHost.prototype.addScript = function (fileName, content) {
                    var script = new ScriptInfo_1.default(content);
                    this.scripts[fileName] = script;
                };
                DefaultLanguageServiceHost.prototype.ensureScript = function (fileName, content) {
                    var script = this.scripts[fileName];
                    if (script) {
                        script.updateContent(content);
                    }
                    else {
                        this.addScript(fileName, content);
                    }
                };
                DefaultLanguageServiceHost.prototype.applyDelta = function (fileName, delta) {
                    var script = this.scripts[fileName];
                    if (script) {
                        script.applyDelta(delta);
                    }
                    else {
                        throw new Error("No script with fileName '" + fileName + "'");
                    }
                };
                DefaultLanguageServiceHost.prototype.removeScript = function (fileName) {
                    var script = this.scripts[fileName];
                    if (script) {
                        delete this.scripts[fileName];
                    }
                    else {
                        console.warn("removeScript: No script with fileName '" + fileName + "'");
                    }
                };
                DefaultLanguageServiceHost.prototype.setCompilationSettings = function (compilerOptions) {
                    this.compilerOptions = compilerOptions;
                };
                DefaultLanguageServiceHost.prototype.getCompilationSettings = function () {
                    return this.compilerOptions;
                };
                DefaultLanguageServiceHost.prototype.getNewLine = function () {
                    return "\n";
                };
                DefaultLanguageServiceHost.prototype.getScriptVersion = function (fileName) {
                    var script = this.scripts[fileName];
                    return "" + script.version;
                };
                DefaultLanguageServiceHost.prototype.getScriptSnapshot = function (fileName) {
                    var script = this.scripts[fileName];
                    var result = ts.ScriptSnapshot.fromString(script.getValue());
                    return result;
                };
                DefaultLanguageServiceHost.prototype.getCurrentDirectory = function () {
                    return "";
                };
                DefaultLanguageServiceHost.prototype.getDefaultLibFileName = function (options) {
                    return "defaultLib.d.ts";
                };
                return DefaultLanguageServiceHost;
            })();
            exports_1("default", DefaultLanguageServiceHost);
        }
    }
});
