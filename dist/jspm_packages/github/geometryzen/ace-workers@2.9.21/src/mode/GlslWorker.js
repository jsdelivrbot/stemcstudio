System.register(["../worker/Mirror", "./glsl/parse"], function (exports_1, context_1) {
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
    var Mirror_1, parse_1, GlslWorker;
    return {
        setters: [
            function (Mirror_1_1) {
                Mirror_1 = Mirror_1_1;
            },
            function (parse_1_1) {
                parse_1 = parse_1_1;
            }
        ],
        execute: function () {
            GlslWorker = (function (_super) {
                __extends(GlslWorker, _super);
                function GlslWorker(host) {
                    var _this = _super.call(this, host, 200) || this;
                    _this.setOptions();
                    return _this;
                }
                GlslWorker.prototype.setOptions = function (options) {
                    if (this.doc.getValue()) {
                        this.deferredUpdate.schedule(100);
                    }
                };
                GlslWorker.prototype.changeOptions = function (options) {
                    if (this.doc.getValue()) {
                        this.deferredUpdate.schedule(100);
                    }
                };
                GlslWorker.prototype.onUpdate = function () {
                    var value = this.doc.getValue();
                    var annotations = [];
                    try {
                        parse_1.parse(value);
                    }
                    catch (e) {
                        var text = e.message;
                        var row = e.line - 1;
                        var column = e.column;
                        var annotation = { row: row, column: column, text: text, type: 'error' };
                        annotations.push(annotation);
                    }
                    this.emitAnnotations(annotations);
                };
                return GlslWorker;
            }(Mirror_1.Mirror));
            exports_1("GlslWorker", GlslWorker);
        }
    };
});
