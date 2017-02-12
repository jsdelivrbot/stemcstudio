System.register(["../worker/Mirror", "./json/parse"], function (exports_1, context_1) {
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
    var Mirror_1, parse_1, JsonWorker;
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
            JsonWorker = (function (_super) {
                __extends(JsonWorker, _super);
                function JsonWorker(host) {
                    var _this = _super.call(this, host, 200) || this;
                    _this.setOptions();
                    return _this;
                }
                JsonWorker.prototype.setOptions = function (options) {
                    this.doc.getValue() && this.deferredUpdate.schedule(100);
                };
                JsonWorker.prototype.changeOptions = function (options) {
                    this.doc.getValue() && this.deferredUpdate.schedule(100);
                };
                JsonWorker.prototype.onUpdate = function () {
                    var value = this.doc.getValue();
                    var annotations = [];
                    try {
                        var result = parse_1.default(value);
                    }
                    catch (e) {
                        var index = e.at - 1;
                        var text = e.message;
                        var pos = this.doc.indexToPosition(index);
                        var row = pos.row;
                        var column = pos.column;
                        var annotation = { row: row, column: column, text: text, type: 'error' };
                        annotations.push(annotation);
                    }
                    this.emitAnnotations(annotations);
                };
                return JsonWorker;
            }(Mirror_1.default));
            exports_1("default", JsonWorker);
        }
    };
});
