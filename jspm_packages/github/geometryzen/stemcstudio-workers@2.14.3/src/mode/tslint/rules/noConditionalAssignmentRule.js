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
    function isAssignmentToken(token) {
        return token.kind >= ts.SyntaxKind.FirstAssignment && token.kind <= ts.SyntaxKind.LastAssignment;
    }
    var abstractRule_1, utils_1, ruleWalker_1, Rule, NoConditionalAssignmentWalker, _a;
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
                    var walker = new NoConditionalAssignmentWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(walker);
                };
                Rule.metadata = {
                    ruleName: "no-conditional-assignment",
                    description: "Disallows any type of assignment in conditionals.",
                    descriptionDetails: "This applies to `do-while`, `for`, `if`, and `while` statements.",
                    rationale: (_a = ["\n            Assignments in conditionals are often typos:\n            for example `if (var1 = var2)` instead of `if (var1 == var2)`.\n            They also can be an indicator of overly clever code which decreases maintainability."], _a.raw = ["\n            Assignments in conditionals are often typos:\n            for example \\`if (var1 = var2)\\` instead of \\`if (var1 == var2)\\`.\n            They also can be an indicator of overly clever code which decreases maintainability."], utils_1.dedent(_a)),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "Assignments in conditional expressions are forbidden";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            NoConditionalAssignmentWalker = (function (_super) {
                __extends(NoConditionalAssignmentWalker, _super);
                function NoConditionalAssignmentWalker() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.isInConditional = false;
                    return _this;
                }
                NoConditionalAssignmentWalker.prototype.visitIfStatement = function (node) {
                    this.validateConditionalExpression(node.expression);
                    _super.prototype.visitIfStatement.call(this, node);
                };
                NoConditionalAssignmentWalker.prototype.visitWhileStatement = function (node) {
                    this.validateConditionalExpression(node.expression);
                    _super.prototype.visitWhileStatement.call(this, node);
                };
                NoConditionalAssignmentWalker.prototype.visitDoStatement = function (node) {
                    this.validateConditionalExpression(node.expression);
                    _super.prototype.visitDoStatement.call(this, node);
                };
                NoConditionalAssignmentWalker.prototype.visitForStatement = function (node) {
                    if (node.condition != null) {
                        this.validateConditionalExpression(node.condition);
                    }
                    _super.prototype.visitForStatement.call(this, node);
                };
                NoConditionalAssignmentWalker.prototype.visitBinaryExpression = function (expression) {
                    if (this.isInConditional) {
                        this.checkForAssignment(expression);
                    }
                    _super.prototype.visitBinaryExpression.call(this, expression);
                };
                NoConditionalAssignmentWalker.prototype.validateConditionalExpression = function (expression) {
                    this.isInConditional = true;
                    if (expression.kind === ts.SyntaxKind.BinaryExpression) {
                        this.checkForAssignment(expression);
                    }
                    this.walkChildren(expression);
                    this.isInConditional = false;
                };
                NoConditionalAssignmentWalker.prototype.checkForAssignment = function (expression) {
                    if (isAssignmentToken(expression.operatorToken)) {
                        this.addFailureAtNode(expression, Rule.FAILURE_STRING);
                    }
                };
                return NoConditionalAssignmentWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
