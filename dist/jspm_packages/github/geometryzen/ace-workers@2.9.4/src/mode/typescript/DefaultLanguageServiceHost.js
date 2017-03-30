System.register(["./ScriptInfo"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function extensionFromFileName(fileName) {
        if (fileName.endsWith('.d.ts')) {
            return ts.Extension.Dts;
        }
        else if (fileName.endsWith('.ts')) {
            return ts.Extension.Ts;
        }
        else if (fileName.endsWith('.tsx')) {
            return ts.Extension.Tsx;
        }
        else if (fileName.endsWith('.js')) {
            return ts.Extension.Js;
        }
        else if (fileName.endsWith('.jsx')) {
            return ts.Extension.Jsx;
        }
        else {
            return undefined;
        }
    }
    var ScriptInfo_1, DefaultLanguageServiceHost;
    return {
        setters: [
            function (ScriptInfo_1_1) {
                ScriptInfo_1 = ScriptInfo_1_1;
            }
        ],
        execute: function () {
            DefaultLanguageServiceHost = (function () {
                function DefaultLanguageServiceHost() {
                    this.compilerOptions = {};
                    this.scripts = {};
                    this.compilerOptions.module = ts.ModuleKind.System;
                    this.compilerOptions.target = ts.ScriptTarget.ES5;
                    this.compilerOptions.allowJs = true;
                    this.compilerOptions.declaration = true;
                    this.compilerOptions.jsx = ts.JsxEmit.React;
                    this.compilerOptions.noImplicitAny = true;
                    this.compilerOptions.noImplicitReturns = true;
                    this.compilerOptions.noImplicitThis = true;
                    this.compilerOptions.noUnusedLocals = true;
                    this.compilerOptions.noUnusedParameters = true;
                    this.compilerOptions.operatorOverloading = true;
                    this.compilerOptions.strictNullChecks = true;
                    this.compilerOptions.suppressImplicitAnyIndexErrors = true;
                    this.compilerOptions.traceResolution = true;
                    this.compilerOptions.sourceMap = true;
                }
                Object.defineProperty(DefaultLanguageServiceHost.prototype, "moduleKind", {
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
                Object.defineProperty(DefaultLanguageServiceHost.prototype, "operatorOverloading", {
                    get: function () {
                        return !!this.compilerOptions.operatorOverloading;
                    },
                    set: function (operatorOverloading) {
                        this.compilerOptions.operatorOverloading = operatorOverloading;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DefaultLanguageServiceHost.prototype, "scriptTarget", {
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
                };
                DefaultLanguageServiceHost.prototype.setCompilationSettings = function (compilerOptions) {
                    this.compilerOptions = compilerOptions;
                };
                DefaultLanguageServiceHost.prototype.getCompilationSettings = function () {
                    return this.compilerOptions;
                };
                DefaultLanguageServiceHost.prototype.getCustomTransformers = function () {
                    var before = [];
                    var after = [];
                    var that = { before: before, after: after };
                    return that;
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
                        return void 0;
                    }
                };
                DefaultLanguageServiceHost.prototype.getCurrentDirectory = function () {
                    return "";
                };
                DefaultLanguageServiceHost.prototype.getDefaultLibFileName = function (options) {
                    return "defaultLib.d.ts";
                };
                DefaultLanguageServiceHost.prototype.resolveModuleNames = function (moduleNames, containingFile) {
                    var fileNames = Object.keys(this.scripts);
                    return moduleNames.map(function (moduleName) {
                        var fileName = fileNames.find(function (candidateName) {
                            var isRelativeToBaseURI = moduleName.startsWith('./');
                            if (isRelativeToBaseURI) {
                                var simpleName = moduleName.substring(2);
                                if (candidateName.indexOf(simpleName + ".ts") >= 0) {
                                    return true;
                                }
                                if (candidateName.indexOf(simpleName + ".tsx") >= 0) {
                                    return true;
                                }
                            }
                            else {
                                if (candidateName === moduleName) {
                                    return true;
                                }
                                if (candidateName.indexOf(moduleName + "/index.d.ts") >= 0) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (fileName) {
                            var m = {
                                resolvedFileName: fileName,
                                isExternalLibraryImport: false,
                                extension: extensionFromFileName(fileName)
                            };
                            return m;
                        }
                        else {
                            return undefined;
                        }
                    });
                };
                return DefaultLanguageServiceHost;
            }());
            exports_1("default", DefaultLanguageServiceHost);
        }
    };
});
