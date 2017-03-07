System.register(["../Document", "../lib/delayedCall"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Document_1, delayedCall_1, Mirror;
    return {
        setters: [
            function (Document_1_1) {
                Document_1 = Document_1_1;
            },
            function (delayedCall_1_1) {
                delayedCall_1 = delayedCall_1_1;
            }
        ],
        execute: function () {
            Mirror = (function () {
                function Mirror(host, timeout) {
                    if (timeout === void 0) { timeout = 500; }
                    var _this = this;
                    if (typeof host !== 'object') {
                        throw new TypeError("host must be an object.");
                    }
                    this.host = host;
                    this.$timeout = timeout;
                    this.doc = new Document_1.default("");
                    var deferredUpdate = this.deferredUpdate = delayedCall_1.default(this.onUpdate.bind(this));
                    host.on('change', function (e) {
                        _this.doc.applyDeltas(e.data);
                        if (_this.$timeout) {
                            return deferredUpdate.schedule(_this.$timeout);
                        }
                        else {
                            _this.onUpdate();
                        }
                    });
                }
                Mirror.prototype.setTimeout = function (timeout) {
                    this.$timeout = timeout;
                };
                Mirror.prototype.setValue = function (value) {
                    this.doc.setValue(value);
                    this.deferredUpdate.schedule(this.$timeout);
                };
                Mirror.prototype.getValue = function (callbackId) {
                    this.host.callback(this.doc.getValue(), callbackId);
                };
                Mirror.prototype.emitAnnotations = function (annotations) {
                    this.host.emit("annotations", annotations);
                };
                Mirror.prototype.onUpdate = function () {
                };
                Mirror.prototype.isPending = function () {
                    return this.deferredUpdate.isPending();
                };
                return Mirror;
            }());
            exports_1("default", Mirror);
        }
    };
});
