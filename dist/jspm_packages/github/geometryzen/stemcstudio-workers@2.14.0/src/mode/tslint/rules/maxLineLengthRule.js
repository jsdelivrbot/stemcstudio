System.register(["../language/rule/abstractRule", "../language/rule/rule", "../language/utils", "../utils"], function (exports_1, context_1) {
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
    var abstractRule_1, rule_1, utils_1, utils_2, Rule, _a;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
            },
            function (rule_1_1) {
                rule_1 = rule_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (utils_2_1) {
                utils_2 = utils_2_1;
            }
        ],
        execute: function () {
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.isEnabled = function () {
                    var ruleArguments = this.getOptions().ruleArguments;
                    if (_super.prototype.isEnabled.call(this)) {
                        var option = ruleArguments[0];
                        if (typeof option === "number" && option > 0) {
                            return true;
                        }
                    }
                    return false;
                };
                Rule.prototype.apply = function (sourceFile) {
                    var ruleFailures = [];
                    var ruleArguments = this.getOptions().ruleArguments;
                    var lineLimit = ruleArguments[0];
                    var lineStarts = sourceFile.getLineStarts();
                    var errorString = Rule.FAILURE_STRING_FACTORY(lineLimit);
                    var disabledIntervals = this.getOptions().disabledIntervals;
                    var source = sourceFile.getFullText();
                    for (var i = 0; i < lineStarts.length - 1; ++i) {
                        var from = lineStarts[i];
                        var to = lineStarts[i + 1];
                        if ((to - from - 1) > lineLimit && !((to - from - 2) === lineLimit && source[to - 2] === "\r")) {
                            var ruleFailure = new rule_1.RuleFailure(sourceFile, from, to - 1, errorString, this.getOptions().ruleName);
                            if (!utils_1.doesIntersect(ruleFailure, disabledIntervals)) {
                                ruleFailures.push(ruleFailure);
                            }
                        }
                    }
                    return ruleFailures;
                };
                Rule.metadata = {
                    ruleName: "max-line-length",
                    description: "Requires lines to be under a certain max length.",
                    rationale: (_a = ["\n            Limiting the length of a line of code improves code readability.\n            It also makes comparing code side-by-side easier and improves compatibility with\n            various editors, IDEs, and diff viewers."], _a.raw = ["\n            Limiting the length of a line of code improves code readability.\n            It also makes comparing code side-by-side easier and improves compatibility with\n            various editors, IDEs, and diff viewers."], utils_2.dedent(_a)),
                    optionsDescription: "An integer indicating the max length of lines.",
                    options: {
                        type: "number",
                        minimum: "1",
                    },
                    optionExamples: ["[true, 120]"],
                    type: "maintainability",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING_FACTORY = function (lineLimit) {
                    return "Exceeds maximum line length of " + lineLimit;
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
        }
    };
});
