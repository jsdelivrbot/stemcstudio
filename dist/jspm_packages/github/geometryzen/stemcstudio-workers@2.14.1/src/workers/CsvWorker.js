System.register(["./Mirror", "davinci-csv"], function (exports_1, context_1) {
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
    var Mirror_1, davinci_csv_1, CsvWorker;
    return {
        setters: [
            function (Mirror_1_1) {
                Mirror_1 = Mirror_1_1;
            },
            function (davinci_csv_1_1) {
                davinci_csv_1 = davinci_csv_1_1;
            }
        ],
        execute: function () {
            CsvWorker = (function (_super) {
                __extends(CsvWorker, _super);
                function CsvWorker(host) {
                    var _this = _super.call(this, host, 200) || this;
                    _this.setOptions();
                    return _this;
                }
                CsvWorker.prototype.setOptions = function (options) {
                    if (this.doc.getValue()) {
                        this.deferredUpdate.schedule(100);
                    }
                };
                CsvWorker.prototype.changeOptions = function (options) {
                    if (this.doc.getValue()) {
                        this.deferredUpdate.schedule(100);
                    }
                };
                CsvWorker.prototype.onUpdate = function () {
                    var value = this.doc.getValue();
                    var annotations = [];
                    try {
                        var errors = [];
                        davinci_csv_1.parse(value, errors);
                        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
                            var error = errors_1[_i];
                            var pos = this.doc.indexToPosition(error.index);
                            var row = pos.row;
                            var column = pos.column;
                            var annotation = { row: row, column: column, text: error.message, type: 'error' };
                            annotations.push(annotation);
                        }
                    }
                    catch (e) {
                        console.log("e => " + JSON.stringify(e, null, 2));
                        if (e instanceof davinci_csv_1.CSVError) {
                            var text = e.message;
                            var pos = this.doc.indexToPosition(e.index);
                            var row = pos.row;
                            var column = pos.column;
                            var annotation = { row: row, column: column, text: text, type: 'error' };
                            annotations.push(annotation);
                        }
                        else {
                            var text = "" + e;
                            var annotation = { row: 0, column: 0, text: text, type: 'error' };
                            annotations.push(annotation);
                        }
                    }
                    this.emitAnnotations(annotations);
                };
                return CsvWorker;
            }(Mirror_1.Mirror));
            exports_1("CsvWorker", CsvWorker);
        }
    };
});
