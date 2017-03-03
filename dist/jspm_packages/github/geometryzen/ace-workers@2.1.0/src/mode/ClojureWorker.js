System.register(["../worker/Mirror"], function (exports_1, context_1) {
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
    var Mirror_1, ClojureWorker;
    return {
        setters: [
            function (Mirror_1_1) {
                Mirror_1 = Mirror_1_1;
            }
        ],
        execute: function () {
            ClojureWorker = (function (_super) {
                __extends(ClojureWorker, _super);
                function ClojureWorker(host) {
                    var _this = _super.call(this, host, 500) || this;
                    _this.setOptions();
                    return _this;
                }
                ClojureWorker.prototype.setOptions = function (options) {
                    if (this.doc.getValue()) {
                        this.deferredUpdate.schedule(100);
                    }
                };
                ClojureWorker.prototype.changeOptions = function (options) {
                    if (this.doc.getValue()) {
                        this.deferredUpdate.schedule(100);
                    }
                };
                ClojureWorker.prototype.onUpdate = function () {
                    this.doc.getValue();
                    var annotations = [];
                    this.emitAnnotations(annotations);
                };
                return ClojureWorker;
            }(Mirror_1.default));
            exports_1("default", ClojureWorker);
        }
    };
});
