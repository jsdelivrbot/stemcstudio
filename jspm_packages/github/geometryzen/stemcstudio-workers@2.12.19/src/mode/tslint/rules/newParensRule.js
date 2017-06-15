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
    var abstractRule_1, ruleWalker_1, Rule, NewParensWalker;
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
                    var newParensWalker = new NewParensWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(newParensWalker);
                };
                Rule.metadata = {
                    ruleName: "new-parens",
                    description: "Requires parentheses when invoking a constructor via the `new` keyword.",
                    rationale: "Maintains stylistic consistency with other function calls.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "style",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "Parentheses are required when invoking a constructor";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            NewParensWalker = (function (_super) {
                __extends(NewParensWalker, _super);
                function NewParensWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NewParensWalker.prototype.visitNewExpression = function (node) {
                    if (node.arguments === undefined) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitNewExpression.call(this, node);
                };
                return NewParensWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
