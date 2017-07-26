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
                    var outputLines = failures.map(function (failure) {
                        var fileName = failure.getFileName();
                        var failureString = failure.getFailure();
                        var ruleName = failure.getRuleName();
                        var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
                        var positionTuple = "[" + (lineAndCharacter.line + 1) + ", " + (lineAndCharacter.character + 1) + "]";
                        return "(" + ruleName + ") " + fileName + positionTuple + ": " + failureString;
                    });
                    return outputLines.join("\n") + "\n";
                };
                Formatter.metadata = {
                    formatterName: "verbose",
                    description: "The human-readable formatter which includes the rule name in messages.",
                    descriptionDetails: "The output is the same as the prose formatter with the rule name included",
                    sample: "(semicolon) myFile.ts[1, 14]: Missing semicolon",
                    consumer: "human",
                };
                return Formatter;
            }(abstractFormatter_1.AbstractFormatter));
            exports_1("Formatter", Formatter);
        }
    };
});
