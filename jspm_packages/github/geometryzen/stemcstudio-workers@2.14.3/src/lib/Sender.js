System.register(["./event_emitter"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var event_emitter_1, Sender;
    return {
        setters: [
            function (event_emitter_1_1) {
                event_emitter_1 = event_emitter_1_1;
            }
        ],
        execute: function () {
            Sender = (function (_super) {
                __extends(Sender, _super);
                function Sender(target) {
                    var _this = _super.call(this) || this;
                    _this.target = target;
                    return _this;
                }
                Sender.prototype.callback = function (message, callbackId) {
                    this.target.postMessage({ type: "call", id: callbackId, data: message });
                };
                Sender.prototype.emit = function (eventName, message) {
                    this.target.postMessage({ type: "event", name: eventName, data: message });
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
            }(event_emitter_1.EventEmitterClass));
            exports_1("Sender", Sender);
        }
    };
});
