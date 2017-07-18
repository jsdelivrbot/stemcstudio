System.register(["../mode/typescript/DefaultLanguageServiceHost", "../mode/typescript/LanguageServiceDispatcher", "../mode/typescript/LanguageServiceEvents", "../mode/typescript/LanguageServiceHelpers"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DefaultLanguageServiceHost_1, LanguageServiceDispatcher_1, LanguageServiceEvents_1, LanguageServiceEvents_2, LanguageServiceEvents_3, LanguageServiceEvents_4, LanguageServiceEvents_5, LanguageServiceEvents_6, LanguageServiceEvents_7, LanguageServiceEvents_8, LanguageServiceEvents_9, LanguageServiceEvents_10, LanguageServiceEvents_11, LanguageServiceEvents_12, LanguageServiceEvents_13, LanguageServiceEvents_14, LanguageServiceEvents_15, LanguageServiceEvents_16, LanguageServiceEvents_17, LanguageServiceEvents_18, LanguageServiceEvents_19, LanguageServiceEvents_20, LanguageServiceHelpers_1, LanguageServiceHelpers_2, LanguageServiceWorker;
    return {
        setters: [
            function (DefaultLanguageServiceHost_1_1) {
                DefaultLanguageServiceHost_1 = DefaultLanguageServiceHost_1_1;
            },
            function (LanguageServiceDispatcher_1_1) {
                LanguageServiceDispatcher_1 = LanguageServiceDispatcher_1_1;
            },
            function (LanguageServiceEvents_1_1) {
                LanguageServiceEvents_1 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_2 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_3 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_4 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_5 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_6 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_7 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_8 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_9 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_10 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_11 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_12 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_13 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_14 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_15 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_16 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_17 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_18 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_19 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_20 = LanguageServiceEvents_1_1;
            },
            function (LanguageServiceHelpers_1_1) {
                LanguageServiceHelpers_1 = LanguageServiceHelpers_1_1;
                LanguageServiceHelpers_2 = LanguageServiceHelpers_1_1;
            }
        ],
        execute: function () {
            LanguageServiceWorker = (function () {
                function LanguageServiceWorker(sender) {
                    var _this = this;
                    this.sender = sender;
                    this.trace = false;
                    this.traceB = false;
                    this.jsLSHost = new DefaultLanguageServiceHost_1.DefaultLanguageServiceHost();
                    this.pyLSHost = new DefaultLanguageServiceHost_1.DefaultLanguageServiceHost();
                    this.tsLSHost = new DefaultLanguageServiceHost_1.DefaultLanguageServiceHost();
                    this.dispatcher = new LanguageServiceDispatcher_1.LanguageServiceDispatcher(this.jsLSHost, this.pyLSHost, this.tsLSHost);
                    sender.on(LanguageServiceEvents_17.EVENT_SET_TRACE, function (message) {
                        var _a = message.data, trace = _a.trace, callbackId = _a.callbackId;
                        try {
                            var newTrace = trace;
                            var oldTrace = _this.trace;
                            _this.trace = newTrace;
                            _this.resolve(LanguageServiceEvents_17.EVENT_SET_TRACE, oldTrace, callbackId);
                        }
                        catch (err) {
                            _this.reject(LanguageServiceEvents_17.EVENT_SET_TRACE, err, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT, function (message) {
                        var _a = message.data, content = _a.content, callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT + "(" + _this.dispatcher.getDefaultLibFileName({}) + ")");
                            }
                            var added = _this.dispatcher.setScriptContent(_this.dispatcher.getDefaultLibFileName({}), content);
                            _this.resolve(LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT, added, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_3.EVENT_ENSURE_MODULE_MAPPING, function (message) {
                        var _a = message.data, moduleName = _a.moduleName, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_3.EVENT_ENSURE_MODULE_MAPPING + "(" + moduleName + "=>" + fileName + ")");
                            }
                            var previousFileName = _this.dispatcher.ensureModuleMapping(moduleName, fileName);
                            _this.resolve(LanguageServiceEvents_3.EVENT_ENSURE_MODULE_MAPPING, previousFileName, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_3.EVENT_ENSURE_MODULE_MAPPING, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_10.EVENT_GET_SCRIPT_CONTENT, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_10.EVENT_GET_SCRIPT_CONTENT + "(" + fileName + ")");
                            }
                            var content = _this.dispatcher.getScriptContent(fileName);
                            _this.resolve(LanguageServiceEvents_10.EVENT_GET_SCRIPT_CONTENT, content, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_10.EVENT_GET_SCRIPT_CONTENT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_19.EVENT_SET_SCRIPT_CONTENT, function (message) {
                        var _a = message.data, fileName = _a.fileName, content = _a.content, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_19.EVENT_SET_SCRIPT_CONTENT + "(" + fileName + ")");
                            }
                            var added = _this.dispatcher.setScriptContent(fileName, content);
                            _this.resolve(LanguageServiceEvents_19.EVENT_SET_SCRIPT_CONTENT, added, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_19.EVENT_SET_SCRIPT_CONTENT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_1.EVENT_APPLY_DELTA, function (message) {
                        var _a = message.data, fileName = _a.fileName, delta = _a.delta, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_1.EVENT_APPLY_DELTA + "(" + fileName + ", " + JSON.stringify(delta) + ")");
                            }
                            _this.dispatcher.applyDelta(fileName, delta);
                            _this.resolve(LanguageServiceEvents_1.EVENT_APPLY_DELTA, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_1.EVENT_APPLY_DELTA, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_13.EVENT_REMOVE_MODULE_MAPPING, function (message) {
                        var _a = message.data, moduleName = _a.moduleName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_13.EVENT_REMOVE_MODULE_MAPPING + "(" + moduleName + ")");
                            }
                            var mappedFileName = _this.dispatcher.removeModuleMapping(moduleName);
                            _this.resolve(LanguageServiceEvents_13.EVENT_REMOVE_MODULE_MAPPING, mappedFileName, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_13.EVENT_REMOVE_MODULE_MAPPING, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_20.EVENT_REMOVE_SCRIPT, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_20.EVENT_REMOVE_SCRIPT + "(" + fileName + ")");
                            }
                            var removed = _this.dispatcher.removeScript(fileName);
                            _this.resolve(LanguageServiceEvents_20.EVENT_REMOVE_SCRIPT, removed, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_20.EVENT_REMOVE_SCRIPT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_14.EVENT_SET_MODULE_KIND, function (message) {
                        var _a = message.data, moduleKind = _a.moduleKind, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_14.EVENT_SET_MODULE_KIND + "(" + moduleKind + ")");
                            }
                            _this.tsLSHost.moduleKind = moduleKind;
                            _this.resolve(LanguageServiceEvents_14.EVENT_SET_MODULE_KIND, _this.tsLSHost.moduleKind, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_14.EVENT_SET_MODULE_KIND, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING, function (message) {
                        var _a = message.data, operatorOverloading = _a.operatorOverloading, callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING + "(" + operatorOverloading + ")");
                            }
                            var oldValue = _this.setOperatorOverloading(operatorOverloading);
                            _this.resolve(LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING, oldValue, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_16.EVENT_SET_SCRIPT_TARGET, function (message) {
                        var _a = message.data, scriptTarget = _a.scriptTarget, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_16.EVENT_SET_SCRIPT_TARGET + "(" + scriptTarget + ")");
                            }
                            _this.tsLSHost.scriptTarget = scriptTarget;
                            _this.resolve(LanguageServiceEvents_16.EVENT_SET_SCRIPT_TARGET, _this.tsLSHost.scriptTarget, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_16.EVENT_SET_SCRIPT_TARGET, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_18.EVENT_SET_TS_CONFIG, function (message) {
                        var _a = message.data, settings = _a.settings, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_18.EVENT_SET_TS_CONFIG + "(" + JSON.stringify(settings) + ")");
                            }
                            try {
                                var operatorOverloading = _this.dispatcher.isOperatorOverloadingEnabled();
                                var compilerOptions = LanguageServiceHelpers_1.compilerOptionsFromTsConfig(settings, operatorOverloading);
                                _this.dispatcher.setCompilationSettings(compilerOptions);
                                var updatedSettings = LanguageServiceHelpers_2.tsConfigFromCompilerOptions(_this.dispatcher.getCompilationSettings());
                                _this.resolve(LanguageServiceEvents_18.EVENT_SET_TS_CONFIG, updatedSettings, callbackId);
                            }
                            catch (e) {
                                _this.reject(LanguageServiceEvents_18.EVENT_SET_TS_CONFIG, e, callbackId);
                            }
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_18.EVENT_SET_TS_CONFIG, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_12.EVENT_GET_SYNTAX_ERRORS, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_12.EVENT_GET_SYNTAX_ERRORS + "(" + fileName + ")");
                            }
                            var diagnostics = _this.dispatcher.getSyntaxErrors(fileName);
                            _this.resolve(LanguageServiceEvents_12.EVENT_GET_SYNTAX_ERRORS, diagnostics, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_12.EVENT_GET_SYNTAX_ERRORS, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_11.EVENT_GET_SEMANTIC_ERRORS, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_11.EVENT_GET_SEMANTIC_ERRORS + "(" + fileName + ")");
                            }
                            var diagnostics = _this.dispatcher.getSemanticErrors(fileName);
                            _this.resolve(LanguageServiceEvents_11.EVENT_GET_SEMANTIC_ERRORS, diagnostics, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_11.EVENT_GET_SEMANTIC_ERRORS, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION, function (message) {
                        var _a = message.data, fileName = _a.fileName, position = _a.position, prefix = _a.prefix, callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION + "(" + fileName + ", " + position + ", " + prefix + ")");
                            }
                            if (typeof position !== 'number' || isNaN(position)) {
                                throw new Error("position must be a number and not NaN");
                            }
                            var completions = _this.dispatcher.getCompletionsAtPosition(fileName, position);
                            _this.resolve(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION, completions, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_5.EVENT_GET_DEFINITION_AT_POSITION, function (message) {
                        var _a = message.data, fileName = _a.fileName, position = _a.position, callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_5.EVENT_GET_DEFINITION_AT_POSITION + "(" + fileName + ", " + position + ")");
                            }
                            if (typeof position !== 'number' || isNaN(position)) {
                                throw new Error("position must be a number and not NaN");
                            }
                            var definitionInfo = _this.dispatcher.getDefinitionAtPosition(fileName, position);
                            _this.resolve(LanguageServiceEvents_5.EVENT_GET_DEFINITION_AT_POSITION, definitionInfo, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_5.EVENT_GET_DEFINITION_AT_POSITION, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_9.EVENT_GET_QUICK_INFO_AT_POSITION, function (message) {
                        var _a = message.data, fileName = _a.fileName, position = _a.position, callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_9.EVENT_GET_QUICK_INFO_AT_POSITION + "(" + fileName + ", " + position + ")");
                            }
                            if (typeof position !== 'number' || isNaN(position)) {
                                throw new Error("position must be a number and not NaN");
                            }
                            var quickInfo = _this.dispatcher.getQuickInfoAtPosition(fileName, position);
                            _this.resolve(LanguageServiceEvents_9.EVENT_GET_QUICK_INFO_AT_POSITION, quickInfo, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_9.EVENT_GET_QUICK_INFO_AT_POSITION, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_8.EVENT_GET_OUTPUT_FILES, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_8.EVENT_GET_OUTPUT_FILES + "(" + fileName + ")");
                            }
                            var outputFiles = _this.dispatcher.getOutputFiles(fileName);
                            _this.resolve(LanguageServiceEvents_8.EVENT_GET_OUTPUT_FILES, outputFiles, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_8.EVENT_GET_OUTPUT_FILES, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_6.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, function (message) {
                        var _a = message.data, fileName = _a.fileName, settings = _a.settings, callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_6.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT + "(" + fileName + ", " + settings + ")");
                            }
                            if (typeof settings !== 'object') {
                                throw new Error("settings must be an object and not NaN");
                            }
                            var textChanges = _this.dispatcher.getFormattingEditsForDocument(fileName, settings);
                            _this.resolve(LanguageServiceEvents_6.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, textChanges, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_6.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_7.EVENT_GET_LINT_ERRORS, function (message) {
                        var _a = message.data, fileName = _a.fileName, configuration = _a.configuration, callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_7.EVENT_GET_LINT_ERRORS + "(" + fileName + ")");
                                console.log(LanguageServiceEvents_7.EVENT_GET_LINT_ERRORS + "(" + JSON.stringify(configuration, null, 2) + ")");
                            }
                            var diagnostics = _this.dispatcher.getLintErrors(fileName, configuration);
                            _this.resolve(LanguageServiceEvents_7.EVENT_GET_LINT_ERRORS, diagnostics, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_7.EVENT_GET_LINT_ERRORS, reason, callbackId);
                        }
                    });
                }
                LanguageServiceWorker.prototype.isOperatorOverloadingEnabled = function () {
                    return this.dispatcher.isOperatorOverloadingEnabled();
                };
                LanguageServiceWorker.prototype.setOperatorOverloading = function (operatorOverloading) {
                    return this.dispatcher.setOperatorOverloading(operatorOverloading);
                };
                LanguageServiceWorker.prototype.resolve = function (eventName, value, callbackId) {
                    if (this.trace) {
                        if (eventName !== LanguageServiceEvents_17.EVENT_SET_TRACE) {
                            console.log("resolve(" + eventName + ", " + JSON.stringify(value, null, 2) + ")");
                        }
                    }
                    this.sender.resolve(eventName, value, callbackId);
                };
                LanguageServiceWorker.prototype.reject = function (eventName, reason, callbackId) {
                    if (this.trace) {
                        console.warn("reject(" + eventName + ", " + reason + ")");
                    }
                    this.sender.reject(eventName, reason, callbackId);
                };
                return LanguageServiceWorker;
            }());
            exports_1("LanguageServiceWorker", LanguageServiceWorker);
        }
    };
});
