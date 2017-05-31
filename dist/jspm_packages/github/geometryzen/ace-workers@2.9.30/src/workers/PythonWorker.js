System.register(["../fp/mixin", "./Mirror"], function (exports_1, context_1) {
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
    var mixin_1, Mirror_1, PythonWorker;
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
            PythonWorker = (function (_super) {
                __extends(PythonWorker, _super);
                function PythonWorker(host) {
                    var _this = _super.call(this, host, 500) || this;
                    _this.setOptions();
                    return _this;
                }
                PythonWorker.prototype.setOptions = function (options) {
                    this.options = options || {};
                    if (this.doc.getValue()) {
                        this.deferredUpdate.schedule(100);
                    }
                };
                PythonWorker.prototype.changeOptions = function (options) {
                    mixin_1.mixin(this.options, options);
                    if (this.doc.getValue()) {
                        this.deferredUpdate.schedule(100);
                    }
                };
                PythonWorker.prototype.onUpdate = function () {
                    var annotations = [];
                    this.emitAnnotations(annotations);
                };
                return PythonWorker;
            }(Mirror_1.Mirror));
            exports_1("PythonWorker", PythonWorker);
        }
    };
});
