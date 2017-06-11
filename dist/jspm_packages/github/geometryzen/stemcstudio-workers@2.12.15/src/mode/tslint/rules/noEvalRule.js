System.register(["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
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
    var abstractRule_1, utils_1, ruleWalker_1, Rule, NoEvalWalker, _a;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (ruleWalker_1_1) {
                ruleWalker_1 = ruleWalker_1_1;
            }
        ],
        execute: function () {
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NoEvalWalker(sourceFile, this.getOptions()));
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            Rule.metadata = {
                ruleName: "no-eval",
                description: "Disallows `eval` function invocations.",
                rationale: (_a = ["\n            `eval()` is dangerous as it allows arbitrary code execution with full privileges. There are\n            [alternatives](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)\n            for most of the use cases for `eval()`."], _a.raw = ["\n            \\`eval()\\` is dangerous as it allows arbitrary code execution with full privileges. There are\n            [alternatives](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)\n            for most of the use cases for \\`eval()\\`."], utils_1.dedent(_a)),
                optionsDescription: "Not configurable.",
                options: null,
                optionExamples: ["true"],
                type: "functionality",
                typescriptOnly: false,
            };
            Rule.FAILURE_STRING = "forbidden eval";
            exports_1("Rule", Rule);
            NoEvalWalker = (function (_super) {
                __extends(NoEvalWalker, _super);
                function NoEvalWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoEvalWalker.prototype.visitCallExpression = function (node) {
                    var expression = node.expression;
                    if (expression.kind === ts.SyntaxKind.Identifier) {
                        var expressionName = expression.text;
                        if (expressionName === "eval") {
                            this.addFailureAtNode(expression, Rule.FAILURE_STRING);
                        }
                    }
                    _super.prototype.visitCallExpression.call(this, node);
                };
                return NoEvalWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
