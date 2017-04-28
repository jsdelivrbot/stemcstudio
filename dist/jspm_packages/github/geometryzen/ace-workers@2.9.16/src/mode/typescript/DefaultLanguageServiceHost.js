System.register(["./ScriptInfo", "../LanguageServiceHelpers"], function (exports_1, context_1) {
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
    var ScriptInfo_1, LanguageServiceHelpers_1, LanguageServiceHelpers_2, LanguageServiceHelpers_3, LanguageServiceHelpers_4, DefaultLanguageServiceHost;
    return {
        setters: [
            function (ScriptInfo_1_1) {
                ScriptInfo_1 = ScriptInfo_1_1;
            },
            function (LanguageServiceHelpers_1_1) {
                LanguageServiceHelpers_1 = LanguageServiceHelpers_1_1;
                LanguageServiceHelpers_2 = LanguageServiceHelpers_1_1;
                LanguageServiceHelpers_3 = LanguageServiceHelpers_1_1;
                LanguageServiceHelpers_4 = LanguageServiceHelpers_1_1;
            }
        ],
        execute: function () {
            DefaultLanguageServiceHost = (function () {
                function DefaultLanguageServiceHost() {
                    this.compilerOptions = {};
                    this.scripts = {};
                    this.moduleNameToFileName = {};
                    this.compilerOptions.allowJs = true;
                    this.compilerOptions.declaration = true;
                    this.compilerOptions.emitDecoratorMetadata = true;
                    this.compilerOptions.experimentalDecorators = true;
                    this.compilerOptions.jsx = ts.JsxEmit.React;
                    this.compilerOptions.module = ts.ModuleKind.System;
                    this.compilerOptions.noImplicitAny = true;
                    this.compilerOptions.noImplicitReturns = true;
                    this.compilerOptions.noImplicitThis = true;
                    this.compilerOptions.noUnusedLocals = true;
                    this.compilerOptions.noUnusedParameters = true;
                    this.compilerOptions.operatorOverloading = true;
                    this.compilerOptions.preserveConstEnums = true;
                    this.compilerOptions.removeComments = false;
                    this.compilerOptions.sourceMap = true;
                    this.compilerOptions.strictNullChecks = true;
                    this.compilerOptions.suppressImplicitAnyIndexErrors = true;
                    this.compilerOptions.target = ts.ScriptTarget.ES5;
                    this.compilerOptions.traceResolution = true;
                }
                Object.defineProperty(DefaultLanguageServiceHost.prototype, "moduleKind", {
                    get: function () {
                        return LanguageServiceHelpers_1.tsConfigModuleKindFromCompilerOptions(this.compilerOptions.module, 'system');
                    },
                    set: function (moduleKind) {
                        moduleKind = moduleKind.toLowerCase();
                        this.compilerOptions.module = LanguageServiceHelpers_2.compilerModuleKindFromTsConfig(moduleKind);
                    },
                    enumerable: true,
                    configurable: true
                });
                DefaultLanguageServiceHost.prototype.isOperatorOverloadingEnabled = function () {
                    return !!this.compilerOptions.operatorOverloading;
                };
                DefaultLanguageServiceHost.prototype.setOperatorOverloading = function (operatorOverloading) {
                    var oldValue = this.isOperatorOverloadingEnabled();
                    this.compilerOptions.operatorOverloading = operatorOverloading;
                    return oldValue;
                };
                Object.defineProperty(DefaultLanguageServiceHost.prototype, "scriptTarget", {
                    get: function () {
                        return LanguageServiceHelpers_3.tsConfigScriptTargetFromCompilerOptions(this.compilerOptions.target, 'es5');
                    },
                    set: function (scriptTarget) {
                        scriptTarget = scriptTarget.toLowerCase();
                        this.compilerOptions.target = LanguageServiceHelpers_4.compilerScriptTargetFromTsConfig(scriptTarget);
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
                DefaultLanguageServiceHost.prototype.ensureModuleMapping = function (moduleName, fileName) {
                    var previousFileName = this.moduleNameToFileName[moduleName];
                    this.moduleNameToFileName[moduleName] = fileName;
                    return previousFileName;
                };
                DefaultLanguageServiceHost.prototype.ensureScript = function (fileName, content) {
                    var script = this.scripts[fileName];
                    if (script) {
                        script.updateContent(content);
                        return false;
                    }
                    else {
                        this.addScript(fileName, content);
                        return true;
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
                DefaultLanguageServiceHost.prototype.removeModuleMapping = function (moduleName) {
                    var fileName = this.moduleNameToFileName[moduleName];
                    delete this.moduleNameToFileName[moduleName];
                    return fileName;
                };
                DefaultLanguageServiceHost.prototype.removeScript = function (fileName) {
                    var script = this.scripts[fileName];
                    if (script) {
                        delete this.scripts[fileName];
                        return true;
                    }
                    else {
                        return false;
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
                    var _this = this;
                    var fileNames = Object.keys(this.scripts);
                    return moduleNames.map(function (moduleName) {
                        var fileName = fileNames.find(function (candidateFileName) {
                            var isRelativeToBaseURI = moduleName.startsWith('./');
                            if (isRelativeToBaseURI) {
                                var simpleName = moduleName.substring(2);
                                if (candidateFileName.indexOf(simpleName + ".ts") >= 0) {
                                    return true;
                                }
                                if (candidateFileName.indexOf(simpleName + ".tsx") >= 0) {
                                    return true;
                                }
                            }
                            else {
                                if (candidateFileName === moduleName) {
                                    return true;
                                }
                                if (candidateFileName.indexOf(moduleName + "/index.d.ts") >= 0) {
                                    return true;
                                }
                                if (_this.moduleNameToFileName[moduleName] === candidateFileName) {
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
            exports_1("DefaultLanguageServiceHost", DefaultLanguageServiceHost);
        }
    };
});
