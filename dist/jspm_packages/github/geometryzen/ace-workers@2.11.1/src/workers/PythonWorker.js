System.register(["../fp/mixin", "./Mirror", "typhon-lang"], function (exports_1, context_1) {
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
    var mixin_1, Mirror_1, typhon_lang_1, PythonWorker;
    return {
        setters: [
            function (mixin_1_1) {
                mixin_1 = mixin_1_1;
            },
            function (Mirror_1_1) {
                Mirror_1 = Mirror_1_1;
            },
            function (typhon_lang_1_1) {
                typhon_lang_1 = typhon_lang_1_1;
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
                    var sourceText = this.doc.getValue();
                    try {
                        var result = typhon_lang_1.transpileModule(sourceText);
                        var targetText = result.code;
                        console.log(targetText);
                    }
                    catch (e) {
                        if (e instanceof SyntaxError) {
                            if (e.name === 'ParseError') {
                                console.log(JSON.stringify(e, null, 2));
                                var parseError = e;
                                if (parseError.begin) {
                                    var row = parseError.begin.row;
                                    var column = parseError.begin.column;
                                    var annotation = { row: row, column: column, text: e.message, type: 'error' };
                                    annotations.push(annotation);
                                }
                                else {
                                    var annotation = { row: 0, text: e.message, type: 'error' };
                                    annotations.push(annotation);
                                    console.warn(JSON.stringify(e, null, 2));
                                }
                            }
                            else {
                                var annotation = { row: 0, text: e.message, type: 'error' };
                                annotations.push(annotation);
                                console.warn(JSON.stringify(e, null, 2));
                            }
                        }
                        else {
                            console.warn(JSON.stringify(e, null, 2));
                        }
                    }
                    this.emitAnnotations(annotations);
                };
                return PythonWorker;
            }(Mirror_1.Mirror));
            exports_1("PythonWorker", PythonWorker);
        }
    };
});
