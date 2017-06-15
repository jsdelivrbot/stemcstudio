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
    var abstractRule_1, utils_1, ruleWalker_1, Rule, LabelPositionWalker, _a;
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
                    return this.applyWithWalker(new LabelPositionWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "label-position",
                    description: "Only allows labels in sensible locations.",
                    descriptionDetails: "This rule only allows labels to be on `do/for/while/switch` statements.",
                    rationale: (_a = ["\n            Labels in JavaScript only can be used in conjunction with `break` or `continue`,\n            constructs meant to be used for loop flow control. While you can theoretically use\n            labels on any block statement in JS, it is considered poor code structure to do so."], _a.raw = ["\n            Labels in JavaScript only can be used in conjunction with \\`break\\` or \\`continue\\`,\n            constructs meant to be used for loop flow control. While you can theoretically use\n            labels on any block statement in JS, it is considered poor code structure to do so."], utils_1.dedent(_a)),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "unexpected label on statement";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            LabelPositionWalker = (function (_super) {
                __extends(LabelPositionWalker, _super);
                function LabelPositionWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                LabelPositionWalker.prototype.visitLabeledStatement = function (node) {
                    var statement = node.statement;
                    if (statement.kind !== ts.SyntaxKind.DoStatement
                        && statement.kind !== ts.SyntaxKind.ForStatement
                        && statement.kind !== ts.SyntaxKind.ForInStatement
                        && statement.kind !== ts.SyntaxKind.ForOfStatement
                        && statement.kind !== ts.SyntaxKind.WhileStatement
                        && statement.kind !== ts.SyntaxKind.SwitchStatement) {
                        this.addFailureAtNode(node.label, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitLabeledStatement.call(this, node);
                };
                return LabelPositionWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
