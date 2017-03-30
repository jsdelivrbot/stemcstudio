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
    var abstractRule_1, utils_1, ruleWalker_1, Rule, RadixWalker, _a;
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
                    var radixWalker = new RadixWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(radixWalker);
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            Rule.metadata = {
                ruleName: "radix",
                description: "Requires the radix parameter to be specified when calling `parseInt`.",
                rationale: (_a = ["\n            From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt):\n            > Always specify this parameter to eliminate reader confusion and to guarantee predictable behavior.\n            > Different implementations produce different results when a radix is not specified, usually defaulting the value to 10."], _a.raw = ["\n            From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt):\n            > Always specify this parameter to eliminate reader confusion and to guarantee predictable behavior.\n            > Different implementations produce different results when a radix is not specified, usually defaulting the value to 10."], utils_1.dedent(_a)),
                optionsDescription: "Not configurable.",
                options: null,
                optionExamples: ["true"],
                type: "functionality",
                typescriptOnly: false,
            };
            Rule.FAILURE_STRING = "Missing radix parameter";
            exports_1("Rule", Rule);
            RadixWalker = (function (_super) {
                __extends(RadixWalker, _super);
                function RadixWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                RadixWalker.prototype.visitCallExpression = function (node) {
                    var expression = node.expression;
                    if (expression.kind === ts.SyntaxKind.Identifier
                        && node.getFirstToken().getText() === "parseInt"
                        && node.arguments.length < 2) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitCallExpression.call(this, node);
                };
                return RadixWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
