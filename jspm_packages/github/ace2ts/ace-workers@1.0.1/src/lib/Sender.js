System.register(['./event_emitter'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var event_emitter_1;
    var Sender;
    return {
        setters:[
            function (event_emitter_1_1) {
                event_emitter_1 = event_emitter_1_1;
            }],
        execute: function() {
            Sender = (function (_super) {
                __extends(Sender, _super);
                function Sender(target) {
                    _super.call(this);
                    this.target = target;
                }
                Sender.prototype.callback = function (data, callbackId) {
                    this.target.postMessage({ type: "call", id: callbackId, data: data });
                };
                Sender.prototype.emit = function (name, data) {
                    this.target.postMessage({ type: "event", name: name, data: data });
                };
                Sender.prototype.resolve = function (eventName, value, callbackId) {
                    var response = { value: value, callbackId: callbackId };
                    this.emit(eventName, response);
                };
                Sender.prototype.reject = function (eventName, reason, callbackId) {
                    var response = { err: "" + reason, callbackId: callbackId };
                    this.emit(eventName, response);
                };
                return Sender;
            }(event_emitter_1.default));
            exports_1("default", Sender);
        }
    }
});
