System.register(["../../src/workers/CsvWorker"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CsvWorker_1, MockWorkerCallback;
    return {
        setters: [
            function (CsvWorker_1_1) {
                CsvWorker_1 = CsvWorker_1_1;
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
                        case 'change': {
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
                    switch (eventName) {
                        case 'annotations': {
                            console.log("MockWorkerCallback.emit(eventName = " + eventName + ", data = " + JSON.stringify(data) + ")");
                            break;
                        }
                        default: {
                            console.warn("MockWorkerCallback.emit(" + eventName + ")");
                        }
                    }
                };
                MockWorkerCallback.prototype.resolve = function (eventName, value, callbackId) {
                    switch (eventName) {
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
            describe("CsvWorker", function () {
                describe("valid", function () {
                    var host = new MockWorkerCallback();
                    var worker = new CsvWorker_1.CsvWorker(host);
                    var sourceText = [
                        "1,2,3"
                    ].join('\n');
                    it("", function () {
                        worker.setValue(sourceText);
                        worker.getValue(42);
                        expect(true).toBe(true);
                    });
                });
                describe("invalid", function () {
                    var host = new MockWorkerCallback();
                    var worker = new CsvWorker_1.CsvWorker(host);
                    var sourceText = [
                        "1,'2,3"
                    ].join('\n');
                    it("", function () {
                        worker.setValue(sourceText);
                        worker.onUpdate();
                        expect(true).toBe(true);
                    });
                });
            });
        }
    };
});
