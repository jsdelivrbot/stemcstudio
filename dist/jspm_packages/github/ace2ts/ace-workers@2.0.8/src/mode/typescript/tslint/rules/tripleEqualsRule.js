System.register(["../language/rule/abstractRule", "../language/utils", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
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
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, OPTION_ALLOW_NULL_CHECK, OPTION_ALLOW_UNDEFINED_CHECK, Rule, ComparisonWalker, _a;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (utils_2_1) {
                utils_2 = utils_2_1;
            },
            function (ruleWalker_1_1) {
                ruleWalker_1 = ruleWalker_1_1;
            }
        ],
        execute: function () {
            OPTION_ALLOW_NULL_CHECK = "allow-null-check";
            OPTION_ALLOW_UNDEFINED_CHECK = "allow-undefined-check";
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var comparisonWalker = new ComparisonWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(comparisonWalker);
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            Rule.metadata = {
                ruleName: "triple-equals",
                description: "Requires `===` and `!==` in place of `==` and `!=`.",
                optionsDescription: (_a = ["\n            Two arguments may be optionally provided:\n\n            * `\"allow-null-check\"` allows `==` and `!=` when comparing to `null`.\n            * `\"allow-undefined-check\"` allows `==` and `!=` when comparing to `undefined`."], _a.raw = ["\n            Two arguments may be optionally provided:\n\n            * \\`\"allow-null-check\"\\` allows \\`==\\` and \\`!=\\` when comparing to \\`null\\`.\n            * \\`\"allow-undefined-check\"\\` allows \\`==\\` and \\`!=\\` when comparing to \\`undefined\\`."], utils_2.dedent(_a)),
                options: {
                    type: "array",
                    items: {
                        type: "string",
                        enum: [OPTION_ALLOW_NULL_CHECK, OPTION_ALLOW_UNDEFINED_CHECK],
                    },
                    minLength: 0,
                    maxLength: 2,
                },
                optionExamples: ["true", '[true, "allow-null-check"]', '[true, "allow-undefined-check"]'],
                type: "functionality",
                typescriptOnly: false,
            };
            Rule.EQ_FAILURE_STRING = "== should be ===";
            Rule.NEQ_FAILURE_STRING = "!= should be !==";
            exports_1("Rule", Rule);
            ComparisonWalker = (function (_super) {
                __extends(ComparisonWalker, _super);
                function ComparisonWalker() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.allowNull = _this.hasOption(OPTION_ALLOW_NULL_CHECK);
                    _this.allowUndefined = _this.hasOption(OPTION_ALLOW_UNDEFINED_CHECK);
                    return _this;
                }
                ComparisonWalker.prototype.visitBinaryExpression = function (node) {
                    var eq = utils_1.getEqualsKind(node.operatorToken);
                    if (eq && !eq.isStrict && !this.isExpressionAllowed(node)) {
                        this.addFailureAtNode(node.operatorToken, eq.isPositive ? Rule.EQ_FAILURE_STRING : Rule.NEQ_FAILURE_STRING);
                    }
                    _super.prototype.visitBinaryExpression.call(this, node);
                };
                ComparisonWalker.prototype.isExpressionAllowed = function (_a) {
                    var _this = this;
                    var left = _a.left, right = _a.right;
                    var isAllowed = function (n) {
                        return n.kind === ts.SyntaxKind.NullKeyword ? _this.allowNull
                            : _this.allowUndefined &&
                                n.kind === ts.SyntaxKind.Identifier &&
                                n.originalKeywordKind === ts.SyntaxKind.UndefinedKeyword;
                    };
                    return isAllowed(left) || isAllowed(right);
                };
                return ComparisonWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
