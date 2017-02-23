System.register(["../lib/mixin", "../worker/Mirror"], function (exports_1, context_1) {
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
    var mixin_1, Mirror_1, TypeScriptWorker;
    return {
        setters: [
            function (mixin_1_1) {
                mixin_1 = mixin_1_1;
            },
            function (Mirror_1_1) {
                Mirror_1 = Mirror_1_1;
            }
        ],
        execute: function () {
            TypeScriptWorker = (function (_super) {
                __extends(TypeScriptWorker, _super);
                function TypeScriptWorker(host) {
                    var _this = _super.call(this, host, 500) || this;
                    _this.setOptions();
                    return _this;
                }
                TypeScriptWorker.prototype.setOptions = function (options) {
                    this.options = options || {};
                };
                TypeScriptWorker.prototype.changeOptions = function (options) {
                    mixin_1.default(this.options, options);
                    this.deferredUpdate.schedule(100);
                };
                TypeScriptWorker.prototype.onUpdate = function () {
                    var value = this.doc.getValue();
                    value = value.replace(/^#!.*\n/, "\n");
                    if (!value) {
                        this.emitAnnotations([]);
                        return;
                    }
                    var annotations = [];
                    this.emitAnnotations(annotations);
                };
                return TypeScriptWorker;
            }(Mirror_1.default));
            exports_1("default", TypeScriptWorker);
        }
    };
});
