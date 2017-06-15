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
                Formatter.prototype.format = function (failures, fixes) {
                    if (failures.length === 0 && (!fixes || fixes.length === 0)) {
                        return "";
                    }
                    var fixLines = [];
                    if (fixes) {
                        var perFileFixes = new Map();
                        for (var _i = 0, fixes_1 = fixes; _i < fixes_1.length; _i++) {
                            var fix = fixes_1[_i];
                            perFileFixes.set(fix.getFileName(), (perFileFixes.get(fix.getFileName()) || 0) + 1);
                        }
                        perFileFixes.forEach(function (fixCount, fixedFile) {
                            fixLines.push("Fixed " + fixCount + " error(s) in " + fixedFile);
                        });
                        fixLines.push("");
                    }
                    var errorLines = failures.map(function (failure) {
                        var fileName = failure.getFileName();
                        var failureString = failure.getFailure();
                        var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
                        var positionTuple = "[" + (lineAndCharacter.line + 1) + ", " + (lineAndCharacter.character + 1) + "]";
                        return "" + fileName + positionTuple + ": " + failureString;
                    });
                    return fixLines.concat(errorLines).join("\n") + "\n";
                };
                Formatter.metadata = {
                    formatterName: "prose",
                    description: "The default formatter which outputs simple human-readable messages.",
                    sample: "myFile.ts[1, 14]: Missing semicolon",
                    consumer: "human",
                };
                return Formatter;
            }(abstractFormatter_1.AbstractFormatter));
            exports_1("Formatter", Formatter);
        }
    };
});
