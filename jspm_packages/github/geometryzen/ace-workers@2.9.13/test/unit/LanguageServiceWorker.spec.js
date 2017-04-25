System.register(["../../src/mode/LanguageServiceEvents", "../../src/mode/LanguageServiceWorker"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var LanguageServiceEvents_1, LanguageServiceEvents_2, LanguageServiceEvents_3, LanguageServiceEvents_4, LanguageServiceEvents_5, LanguageServiceEvents_6, LanguageServiceEvents_7, LanguageServiceEvents_8, LanguageServiceEvents_9, LanguageServiceEvents_10, LanguageServiceEvents_11, LanguageServiceEvents_12, LanguageServiceEvents_13, LanguageServiceEvents_14, LanguageServiceEvents_15, LanguageServiceEvents_16, LanguageServiceEvents_17, LanguageServiceEvents_18, LanguageServiceWorker_1, MockWorkerCallback, MockLanguageServiceProxy;
    return {
        setters: [
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
            },
            function (LanguageServiceWorker_1_1) {
                LanguageServiceWorker_1 = LanguageServiceWorker_1_1;
            }
        ],
        execute: function () {
            MockWorkerCallback = (function () {
                function MockWorkerCallback() {
                    this.callbacks = {};
                    this.resolutions = {};
                }
                MockWorkerCallback.prototype.on = function (eventName, callback) {
                    switch (eventName) {
                        case LanguageServiceEvents_1.EVENT_APPLY_DELTA:
                        case LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT:
                        case LanguageServiceEvents_3.EVENT_ENSURE_MODULE_MAPPING:
                        case LanguageServiceEvents_4.EVENT_ENSURE_SCRIPT:
                        case LanguageServiceEvents_5.EVENT_GET_COMPLETIONS_AT_POSITION:
                        case LanguageServiceEvents_6.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT:
                        case LanguageServiceEvents_7.EVENT_GET_LINT_ERRORS:
                        case LanguageServiceEvents_8.EVENT_GET_OUTPUT_FILES:
                        case LanguageServiceEvents_9.EVENT_GET_QUICK_INFO_AT_POSITION:
                        case LanguageServiceEvents_10.EVENT_GET_SEMANTIC_ERRORS:
                        case LanguageServiceEvents_11.EVENT_GET_SYNTAX_ERRORS:
                        case LanguageServiceEvents_12.EVENT_REMOVE_MODULE_MAPPING:
                        case LanguageServiceEvents_13.EVENT_REMOVE_SCRIPT:
                        case LanguageServiceEvents_14.EVENT_SET_MODULE_KIND:
                        case LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING:
                        case LanguageServiceEvents_16.EVENT_SET_SCRIPT_TARGET:
                        case LanguageServiceEvents_17.EVENT_SET_TRACE:
                        case LanguageServiceEvents_18.EVENT_SET_TS_CONFIG: {
                            this.callbacks[eventName] = callback;
                            break;
                        }
                        default: {
                            console.warn("MockWorkerCallback.on(" + eventName + ")");
                        }
                    }
                };
                MockWorkerCallback.prototype.callback = function (data, callbackId) {
                };
                MockWorkerCallback.prototype.emit = function (eventName, data) {
                    console.warn("MockWorkerCallback.emit(" + eventName + ")");
                };
                MockWorkerCallback.prototype.resolve = function (eventName, value, callbackId) {
                    switch (eventName) {
                        case LanguageServiceEvents_3.EVENT_ENSURE_MODULE_MAPPING:
                        case LanguageServiceEvents_4.EVENT_ENSURE_SCRIPT:
                        case LanguageServiceEvents_8.EVENT_GET_OUTPUT_FILES:
                        case LanguageServiceEvents_12.EVENT_REMOVE_MODULE_MAPPING:
                        case LanguageServiceEvents_13.EVENT_REMOVE_SCRIPT:
                        case LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING:
                        case LanguageServiceEvents_17.EVENT_SET_TRACE: {
                            this.resolutions[callbackId] = { eventName: eventName, value: value };
                            break;
                        }
                        default: {
                            console.warn("MockWorkerCallback.resolve(" + eventName + ")");
                        }
                    }
                };
                MockWorkerCallback.prototype.reject = function (eventName, reason, callbackId) {
                    console.warn("MockWorkerCallback.reject(" + eventName + ")");
                };
                return MockWorkerCallback;
            }());
            MockLanguageServiceProxy = (function () {
                function MockLanguageServiceProxy(sender) {
                    this.sender = sender;
                }
                MockLanguageServiceProxy.prototype.ensureModuleMapping = function (moduleName, fileName, callbackId) {
                    var callback = this.sender.callbacks[LanguageServiceEvents_3.EVENT_ENSURE_MODULE_MAPPING];
                    var data = { moduleName: moduleName, fileName: fileName, callbackId: callbackId };
                    callback({ data: data });
                };
                MockLanguageServiceProxy.prototype.removeModuleMapping = function (moduleName, callbackId) {
                    var callback = this.sender.callbacks[LanguageServiceEvents_12.EVENT_REMOVE_MODULE_MAPPING];
                    var data = { moduleName: moduleName, callbackId: callbackId };
                    callback({ data: data });
                };
                MockLanguageServiceProxy.prototype.ensureScript = function (fileName, content, callbackId) {
                    var callback = this.sender.callbacks[LanguageServiceEvents_4.EVENT_ENSURE_SCRIPT];
                    var data = { fileName: fileName, content: content, callbackId: callbackId };
                    callback({ data: data });
                };
                MockLanguageServiceProxy.prototype.removeScript = function (fileName, callbackId) {
                    var callback = this.sender.callbacks[LanguageServiceEvents_13.EVENT_REMOVE_SCRIPT];
                    var data = { fileName: fileName, callbackId: callbackId };
                    callback({ data: data });
                };
                MockLanguageServiceProxy.prototype.getOutputFiles = function (fileName, callbackId) {
                    var callback = this.sender.callbacks[LanguageServiceEvents_8.EVENT_GET_OUTPUT_FILES];
                    var data = { fileName: fileName, callbackId: callbackId };
                    callback({ data: data });
                };
                MockLanguageServiceProxy.prototype.setOperatorOverloading = function (operatorOverloading, callbackId) {
                    var callback = this.sender.callbacks[LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING];
                    var data = { operatorOverloading: operatorOverloading, callbackId: callbackId };
                    callback({ data: data });
                };
                MockLanguageServiceProxy.prototype.setTrace = function (trace, callbackId) {
                    var callback = this.sender.callbacks[LanguageServiceEvents_17.EVENT_SET_TRACE];
                    var data = { trace: trace, callbackId: callbackId };
                    callback({ data: data });
                };
                return MockLanguageServiceProxy;
            }());
            describe("LanguageServiceWorker", function () {
                describe("constructor", function () {
                    var sender = new MockWorkerCallback();
                    var registry = ts.createDocumentRegistry(true);
                    var lsw = new LanguageServiceWorker_1.default(sender);
                    it("lsw should be defined", function () {
                        expect(lsw).toBeDefined();
                    });
                    it("registry should be defined", function () {
                        expect(registry).toBeDefined();
                    });
                    it("trace property should default to false", function () {
                        expect(lsw.trace).toBe(false);
                    });
                });
                describe("setOperatorOverloading", function () {
                    describe("(true)", function () {
                        var sender = new MockWorkerCallback();
                        var proxy = new MockLanguageServiceProxy(sender);
                        var lsw = new LanguageServiceWorker_1.default(sender);
                        lsw.setOperatorOverloading(false);
                        it("should change the operatorOverloading property from false to true", function () {
                            expect(lsw.isOperatorOverloadingEnabled()).toBe(false);
                            var callbackId = Math.random();
                            proxy.setOperatorOverloading(true, callbackId);
                            expect(lsw).toBeDefined();
                            var resolution = sender.resolutions[callbackId];
                            expect(resolution).toBeDefined();
                            expect(resolution.eventName).toBe(LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING);
                            expect(lsw.isOperatorOverloadingEnabled()).toBe(true);
                        });
                    });
                    describe("(false)", function () {
                        var sender = new MockWorkerCallback();
                        var proxy = new MockLanguageServiceProxy(sender);
                        var lsw = new LanguageServiceWorker_1.default(sender);
                        lsw.setOperatorOverloading(true);
                        it("should change the operatorOverloading property from true to false", function () {
                            expect(lsw.isOperatorOverloadingEnabled()).toBe(true);
                            var callbackId = Math.random();
                            proxy.setOperatorOverloading(false, callbackId);
                            expect(lsw).toBeDefined();
                            var resolution = sender.resolutions[callbackId];
                            expect(resolution).toBeDefined();
                            expect(resolution.eventName).toBe(LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING);
                            expect(lsw.isOperatorOverloadingEnabled()).toBe(false);
                        });
                    });
                });
                describe("setTrace", function () {
                    describe("(true)", function () {
                        var sender = new MockWorkerCallback();
                        var proxy = new MockLanguageServiceProxy(sender);
                        var lsw = new LanguageServiceWorker_1.default(sender);
                        lsw.trace = false;
                        it("should change the trace property from false to true", function () {
                            expect(lsw.trace).toBe(false);
                            var callbackId = Math.random();
                            proxy.setTrace(true, callbackId);
                            expect(lsw).toBeDefined();
                            var resolution = sender.resolutions[callbackId];
                            expect(resolution).toBeDefined();
                            expect(resolution.eventName).toBe(LanguageServiceEvents_17.EVENT_SET_TRACE);
                            expect(lsw.trace).toBe(true);
                        });
                    });
                    describe("(false)", function () {
                        var sender = new MockWorkerCallback();
                        var proxy = new MockLanguageServiceProxy(sender);
                        var lsw = new LanguageServiceWorker_1.default(sender);
                        lsw.trace = true;
                        it("should change the trace property from true to false", function () {
                            expect(lsw.trace).toBe(true);
                            var callbackId = Math.random();
                            proxy.setTrace(false, callbackId);
                            expect(lsw).toBeDefined();
                            var resolution = sender.resolutions[callbackId];
                            expect(resolution).toBeDefined();
                            expect(resolution.eventName).toBe(LanguageServiceEvents_17.EVENT_SET_TRACE);
                            expect(lsw.trace).toBe(false);
                        });
                    });
                });
                describe("ensureModuleMapping", function () {
                    var sender = new MockWorkerCallback();
                    var proxy = new MockLanguageServiceProxy(sender);
                    var lsw = new LanguageServiceWorker_1.default(sender);
                    it("should acknowledge", function () {
                        var callbackId = Math.random();
                        proxy.ensureModuleMapping('rxjs/Rx', 'https://somewhere/Rx.js', callbackId);
                        expect(lsw).toBeDefined();
                        var resolution = sender.resolutions[callbackId];
                        expect(resolution).toBeDefined();
                        expect(resolution.eventName).toBe(LanguageServiceEvents_3.EVENT_ENSURE_MODULE_MAPPING);
                    });
                });
                describe("removeModuleMapping", function () {
                    var sender = new MockWorkerCallback();
                    var proxy = new MockLanguageServiceProxy(sender);
                    var lsw = new LanguageServiceWorker_1.default(sender);
                    it("should acknowledge", function () {
                        var callbackId = Math.random();
                        proxy.removeModuleMapping('rxjs/Rx', callbackId);
                        expect(lsw).toBeDefined();
                        var resolution = sender.resolutions[callbackId];
                        expect(resolution).toBeDefined();
                        expect(resolution.eventName).toBe(LanguageServiceEvents_12.EVENT_REMOVE_MODULE_MAPPING);
                    });
                });
                describe("ensureScript", function () {
                    var sender = new MockWorkerCallback();
                    var proxy = new MockLanguageServiceProxy(sender);
                    var lsw = new LanguageServiceWorker_1.default(sender);
                    it("should acknowledge", function () {
                        var callbackId = Math.random();
                        proxy.ensureScript('index.ts', 'const x = 42', callbackId);
                        expect(lsw).toBeDefined();
                        var resolution = sender.resolutions[callbackId];
                        expect(resolution).toBeDefined();
                        expect(resolution.eventName).toBe(LanguageServiceEvents_4.EVENT_ENSURE_SCRIPT);
                    });
                });
                describe("removeScript", function () {
                    var sender = new MockWorkerCallback();
                    var proxy = new MockLanguageServiceProxy(sender);
                    var lsw = new LanguageServiceWorker_1.default(sender);
                    it("should acknowledge", function () {
                        var callbackId = Math.random();
                        proxy.removeScript('index.ts', callbackId);
                        expect(lsw).toBeDefined();
                        var resolution = sender.resolutions[callbackId];
                        expect(resolution).toBeDefined();
                        expect(resolution.eventName).toBe(LanguageServiceEvents_13.EVENT_REMOVE_SCRIPT);
                    });
                });
                describe("getOutputFiles", function () {
                    var sender = new MockWorkerCallback();
                    var proxy = new MockLanguageServiceProxy(sender);
                    var lsw = new LanguageServiceWorker_1.default(sender);
                    it("should acknowledge", function () {
                        var one = Math.random();
                        proxy.ensureScript('index.ts', 'const x = 0;\nconst y = 1;', one);
                        expect(lsw).toBeDefined();
                        var resolution1 = sender.resolutions[one];
                        expect(resolution1).toBeDefined();
                        expect(resolution1.eventName).toBe(LanguageServiceEvents_4.EVENT_ENSURE_SCRIPT);
                        var two = Math.random();
                        proxy.getOutputFiles('index.ts', two);
                        var resolution2 = sender.resolutions[two];
                        expect(resolution2).toBeDefined();
                        expect(resolution2.eventName).toBe(LanguageServiceEvents_8.EVENT_GET_OUTPUT_FILES);
                        var outputFiles = resolution2.value;
                        expect(outputFiles).toBeDefined();
                        expect(Array.isArray(outputFiles)).toBe(true);
                        expect(outputFiles.length).toBe(2);
                        var fileOne = outputFiles[0];
                        expect(fileOne).toBeDefined();
                        expect(fileOne.name).toBe('index.js');
                        expect(fileOne.text).toBe('var x = 0;\nvar y = 1;\n//# sourceMappingURL=index.js.map');
                        var fileTwo = outputFiles[1];
                        expect(fileTwo).toBeDefined();
                        expect(fileTwo.name).toBe('index.js.map');
                        var map = JSON.parse(fileTwo.text);
                        expect(map.version).toBe(3);
                        expect(map.file).toBe('index.js');
                        expect(map.sourceRoot).toBe('');
                        expect(map.sources).toEqual(['index.ts']);
                        expect(map.names).toEqual([]);
                    });
                });
            });
        }
    };
});
