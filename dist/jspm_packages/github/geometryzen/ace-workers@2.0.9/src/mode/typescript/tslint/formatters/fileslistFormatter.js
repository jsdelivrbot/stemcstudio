System.register(["../language/formatter/abstractFormatter"], function (exports_1, context_1) {
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
    var abstractFormatter_1, Formatter;
    return {
        setters: [
            function (abstractFormatter_1_1) {
                abstractFormatter_1 = abstractFormatter_1_1;
            }
        ],
        execute: function () {
            Formatter = (function (_super) {
                __extends(Formatter, _super);
                function Formatter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Formatter.prototype.format = function (failures) {
                    if (failures.length === 0) {
                        return "";
                    }
                    var files = [];
                    var currentFile;
                    for (var _i = 0, failures_1 = failures; _i < failures_1.length; _i++) {
                        var failure = failures_1[_i];
                        var fileName = failure.getFileName();
                        if (fileName !== currentFile) {
                            files.push(fileName);
                            currentFile = fileName;
                        }
                    }
                    return files.join("\n") + "\n";
                };
                return Formatter;
            }(abstractFormatter_1.AbstractFormatter));
            Formatter.metadata = {
                formatterName: "filesList",
                description: "Lists files containing lint errors.",
                sample: "directory/myFile.ts",
                consumer: "machine",
            };
            exports_1("Formatter", Formatter);
        }
    };
});
