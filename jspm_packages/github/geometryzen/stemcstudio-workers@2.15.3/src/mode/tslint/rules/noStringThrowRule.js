System.register(["../language/rule/abstractRule", "../language/walker/ruleWalker"], function (exports_1, context_1) {
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
    var abstractRule_1, ruleWalker_1, Rule, Walker;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
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
                    return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "no-string-throw",
                    description: "Flags throwing plain strings or concatenations of strings " +
                        "because only Errors produce proper stack traces.",
                    hasFix: true,
                    options: null,
                    optionsDescription: "Not configurable.",
                    type: "functionality",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "Throwing plain strings (not instances of Error) gives no stack traces";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            Walker = (function (_super) {
                __extends(Walker, _super);
                function Walker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Walker.prototype.visitThrowStatement = function (node) {
                    var expression = node.expression;
                    if (this.stringConcatRecursive(expression)) {
                        var fix = this.createFix(this.createReplacement(expression.getStart(), expression.getEnd() - expression.getStart(), "new Error(" + expression.getText() + ")"));
                        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING, fix));
                    }
                    _super.prototype.visitThrowStatement.call(this, node);
                };
                Walker.prototype.stringConcatRecursive = function (node) {
                    switch (node.kind) {
                        case ts.SyntaxKind.StringLiteral:
                        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                        case ts.SyntaxKind.TemplateExpression:
                            return true;
                        case ts.SyntaxKind.BinaryExpression:
                            var n = node;
                            var op = n.operatorToken.kind;
                            return op === ts.SyntaxKind.PlusToken &&
                                (this.stringConcatRecursive(n.left) ||
                                    this.stringConcatRecursive(n.right));
                        case ts.SyntaxKind.ParenthesizedExpression:
                            return this.stringConcatRecursive(node.expression);
                        default:
                            return false;
                    }
                };
                return Walker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
