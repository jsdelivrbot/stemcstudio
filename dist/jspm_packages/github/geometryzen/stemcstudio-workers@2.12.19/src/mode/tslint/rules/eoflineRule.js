System.register(["../language/rule/abstractRule", "../language/rule/rule"], function (exports_1, context_1) {
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
    var abstractRule_1, rule_1, Rule;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
            },
            function (rule_1_1) {
                rule_1 = rule_1_1;
            }
        ],
        execute: function () {
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var length = sourceFile.text.length;
                    if (length === 0 ||
                        sourceFile.text[length - 1] === "\n") {
                        return [];
                    }
                    return this.filterFailures([
                        new rule_1.RuleFailure(sourceFile, length, length, Rule.FAILURE_STRING, this.getOptions().ruleName),
                    ]);
                };
                Rule.metadata = {
                    ruleName: "eofline",
                    description: "Ensures the file ends with a newline.",
                    rationale: "It is a [standard convention](http://stackoverflow.com/q/729692/3124288) to end files with a newline.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "maintainability",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "file should end with a newline";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
        }
    };
});
