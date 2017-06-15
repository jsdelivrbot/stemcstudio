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
    var abstractRule_1, utils_1, ruleWalker_1, Rule, UseIsnanRuleWalker, _a;
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
                    return this.applyWithWalker(new UseIsnanRuleWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "use-isnan",
                    description: "Enforces use of the `isNaN()` function to check for NaN references instead of a comparison to the `NaN` constant.",
                    rationale: (_a = ["\n            Since `NaN !== NaN`, comparisons with regular operators will produce unexpected results.\n            So, instead of `if (myVar === NaN)`, do `if (isNaN(myVar))`."], _a.raw = ["\n            Since \\`NaN !== NaN\\`, comparisons with regular operators will produce unexpected results.\n            So, instead of \\`if (myVar === NaN)\\`, do \\`if (isNaN(myVar))\\`."], utils_1.dedent(_a)),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "Found an invalid comparison for NaN: ";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            UseIsnanRuleWalker = (function (_super) {
                __extends(UseIsnanRuleWalker, _super);
                function UseIsnanRuleWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                UseIsnanRuleWalker.prototype.visitBinaryExpression = function (node) {
                    if ((this.isExpressionNaN(node.left) || this.isExpressionNaN(node.right))
                        && node.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING + node.getText());
                    }
                    _super.prototype.visitBinaryExpression.call(this, node);
                };
                UseIsnanRuleWalker.prototype.isExpressionNaN = function (node) {
                    return node.kind === ts.SyntaxKind.Identifier && node.getText() === "NaN";
                };
                return UseIsnanRuleWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
