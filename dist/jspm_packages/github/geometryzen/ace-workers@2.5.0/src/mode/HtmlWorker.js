System.register(["../worker/Mirror", "./html/SAXParser"], function (exports_1, context_1) {
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
    var Mirror_1, SAXParser_1, codeToAnnotationType, HtmlWorker;
    return {
        setters: [
            function (Mirror_1_1) {
                Mirror_1 = Mirror_1_1;
            },
            function (SAXParser_1_1) {
                SAXParser_1 = SAXParser_1_1;
            }
        ],
        execute: function () {
            codeToAnnotationType = {
                "expected-doctype-but-got-start-tag": "info",
                "expected-doctype-but-got-chars": "info",
                "non-html-root": "info",
            };
            HtmlWorker = (function (_super) {
                __extends(HtmlWorker, _super);
                function HtmlWorker(host) {
                    var _this = _super.call(this, host, 500) || this;
                    _this.setOptions();
                    return _this;
                }
                HtmlWorker.prototype.setOptions = function (options) {
                    if (options) {
                        this.context = options.context;
                    }
                    else {
                        this.context = void 0;
                    }
                    if (this.doc.getValue()) {
                        this.deferredUpdate.schedule(100);
                    }
                };
                HtmlWorker.prototype.onUpdate = function () {
                    var annotations = [];
                    var value = this.doc.getValue();
                    if (!value) {
                        this.emitAnnotations(annotations);
                        return;
                    }
                    var parser = new SAXParser_1.default();
                    if (parser) {
                        var noop = function () {
                        };
                        parser.contentHandler = {
                            startDocument: noop,
                            endDocument: noop,
                            startElement: noop,
                            endElement: noop,
                            characters: noop
                        };
                        parser.errorHandler = {
                            error: function (message, location, code) {
                                annotations.push({
                                    row: location.line,
                                    column: location.column,
                                    text: message,
                                    type: codeToAnnotationType[code] || "error"
                                });
                            }
                        };
                        if (this.context) {
                            parser.parseFragment(value, this.context);
                        }
                        else {
                            parser.parse(value);
                        }
                    }
                    this.emitAnnotations(annotations);
                };
                return HtmlWorker;
            }(Mirror_1.default));
            exports_1("default", HtmlWorker);
        }
    };
});
