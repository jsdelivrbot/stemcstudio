System.register(["../language/formatter/abstractFormatter", "../utils"], function (exports_1, context_1) {
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
    var abstractFormatter_1, Utils, Formatter, _a;
    return {
        setters: [
            function (abstractFormatter_1_1) {
                abstractFormatter_1 = abstractFormatter_1_1;
            },
            function (Utils_1) {
                Utils = Utils_1;
            }
        ],
        execute: function () {
            Formatter = (function (_super) {
                __extends(Formatter, _super);
                function Formatter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Formatter.prototype.format = function (failures) {
                    var output = "<pmd version=\"tslint\">";
                    for (var _i = 0, failures_1 = failures; _i < failures_1.length; _i++) {
                        var failure = failures_1[_i];
                        var failureString = failure.getFailure()
                            .replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/'/g, "&#39;")
                            .replace(/"/g, "&quot;");
                        var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
                        output += "<file name=\"" + failure.getFileName();
                        output += "\"><violation begincolumn=\"" + (lineAndCharacter.character + 1);
                        output += "\" beginline=\"" + (lineAndCharacter.line + 1);
                        output += "\" priority=\"1\"";
                        output += " rule=\"" + failureString + "\"> </violation></file>";
                    }
                    output += "</pmd>";
                    return output;
                };
                return Formatter;
            }(abstractFormatter_1.AbstractFormatter));
            Formatter.metadata = {
                formatterName: "pmd",
                description: "Formats errors as through they were PMD output.",
                descriptionDetails: "Imitates the XML output from PMD. All errors have a priority of 1.",
                sample: (_a = ["\n        <pmd version=\"tslint\">\n            <file name=\"myFile.ts\">\n                <violation begincolumn=\"14\" beginline=\"1\" priority=\"1\" rule=\"Missing semicolon\"></violation>\n            </file>\n        </pmd>"], _a.raw = ["\n        <pmd version=\"tslint\">\n            <file name=\"myFile.ts\">\n                <violation begincolumn=\"14\" beginline=\"1\" priority=\"1\" rule=\"Missing semicolon\"></violation>\n            </file>\n        </pmd>"], Utils.dedent(_a)),
                consumer: "machine",
            };
            exports_1("Formatter", Formatter);
        }
    };
});
