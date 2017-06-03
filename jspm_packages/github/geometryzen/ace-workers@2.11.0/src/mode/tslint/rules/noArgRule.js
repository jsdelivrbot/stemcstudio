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
    var abstractRule_1, utils_1, ruleWalker_1, Rule, NoArgWalker, _a;
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
                    return this.applyWithWalker(new NoArgWalker(sourceFile, this.getOptions()));
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            Rule.metadata = {
                ruleName: "no-arg",
                description: "Disallows use of `arguments.callee`.",
                rationale: (_a = ["\n            Using `arguments.callee` makes various performance optimizations impossible.\n            See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee)\n            for more details on why to avoid `arguments.callee`."], _a.raw = ["\n            Using \\`arguments.callee\\` makes various performance optimizations impossible.\n            See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee)\n            for more details on why to avoid \\`arguments.callee\\`."], utils_1.dedent(_a)),
                optionsDescription: "Not configurable.",
                options: null,
                optionExamples: ["true"],
                type: "functionality",
                typescriptOnly: false,
            };
            Rule.FAILURE_STRING = "Access to arguments.callee is forbidden";
            exports_1("Rule", Rule);
            NoArgWalker = (function (_super) {
                __extends(NoArgWalker, _super);
                function NoArgWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoArgWalker.prototype.visitPropertyAccessExpression = function (node) {
                    var expression = node.expression;
                    var name = node.name;
                    if (expression.kind === ts.SyntaxKind.Identifier && name.text === "callee") {
                        var identifierExpression = expression;
                        if (identifierExpression.text === "arguments") {
                            this.addFailureAtNode(expression, Rule.FAILURE_STRING);
                        }
                    }
                    _super.prototype.visitPropertyAccessExpression.call(this, node);
                };
                return NoArgWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
