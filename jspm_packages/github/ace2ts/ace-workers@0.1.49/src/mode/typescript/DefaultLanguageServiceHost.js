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
                    this.compilerOptions = {};
                    this.compilerOptions.module = ts.ModuleKind.None;
                    this.compilerOptions.target = ts.ScriptTarget.ES3;
                    this.scripts = {};
                }
                Object.defineProperty(DefaultLanguageServiceHost.prototype, "moduleKind", {
                    get: function () {
                        var moduleKind = this.compilerOptions.module;
                        switch (moduleKind) {
                            case ts.ModuleKind.AMD: {
                                return 'amd';
                            }
                            case ts.ModuleKind.CommonJS: {
                                return 'commonjs';
                            }
                            case ts.ModuleKind.ES2015: {
                                return 'es2015';
                            }
                            case ts.ModuleKind.ES6: {
                                return 'es6';
                            }
                            case ts.ModuleKind.None: {
                                return 'none';
                            }
                            case ts.ModuleKind.System: {
                                return 'system';
                            }
                            case ts.ModuleKind.UMD: {
                                return 'umd';
                            }
                            default: {
                                throw new Error("Unrecognized module kind: " + moduleKind);
                            }
                        }
                    },
                    set: function (moduleKind) {
                        moduleKind = moduleKind.toLowerCase();
                        switch (moduleKind) {
                            case 'amd': {
                                this.compilerOptions.module = ts.ModuleKind.AMD;
                                break;
                            }
                            case 'commonjs': {
                                this.compilerOptions.module = ts.ModuleKind.CommonJS;
                                break;
                            }
                            case 'es2015': {
                                this.compilerOptions.module = ts.ModuleKind.ES2015;
                                break;
                            }
                            case 'es6': {
                                this.compilerOptions.module = ts.ModuleKind.ES6;
                                break;
                            }
                            case 'none': {
                                this.compilerOptions.module = ts.ModuleKind.None;
                                break;
                            }
                            case 'system': {
                                this.compilerOptions.module = ts.ModuleKind.System;
                                break;
                            }
                            case 'umd': {
                                this.compilerOptions.module = ts.ModuleKind.UMD;
                                break;
                            }
                            default: {
                                throw new Error("Unrecognized module kind: " + moduleKind);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DefaultLanguageServiceHost.prototype, "scriptTarget", {
                    get: function () {
                        var scriptTarget = this.compilerOptions.target;
                        switch (scriptTarget) {
                            case ts.ScriptTarget.ES2015: {
                                return 'ES2015';
                            }
                            case ts.ScriptTarget.ES3: {
                                return 'ES3';
                            }
                            case ts.ScriptTarget.ES5: {
                                return 'ES5';
                            }
                            case ts.ScriptTarget.ES6: {
                                return 'ES6';
                            }
                            case ts.ScriptTarget.Latest: {
                                return 'Latest';
                            }
                            default: {
                                throw new Error("Unrecognized script target: " + scriptTarget);
                            }
                        }
                    },
                    set: function (scriptTarget) {
                        scriptTarget = scriptTarget.toLowerCase();
                        switch (scriptTarget) {
                            case 'es2015': {
                                this.compilerOptions.target = ts.ScriptTarget.ES2015;
                                break;
                            }
                            case 'es3': {
                                this.compilerOptions.target = ts.ScriptTarget.ES3;
                                break;
                            }
                            case 'es5': {
                                this.compilerOptions.target = ts.ScriptTarget.ES5;
                                break;
                            }
                            case 'es6': {
                                this.compilerOptions.target = ts.ScriptTarget.ES6;
                                break;
                            }
                            case 'latest': {
                                this.compilerOptions.target = ts.ScriptTarget.Latest;
                                break;
                            }
                            default: {
                                throw new Error("Unrecognized script target: " + scriptTarget);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
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
                    if (script) {
                        var result = ts.ScriptSnapshot.fromString(script.getValue());
                        return result;
                    }
                    else {
                        throw new Error("getScriptSnapshot(" + fileName + ")");
                    }
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
