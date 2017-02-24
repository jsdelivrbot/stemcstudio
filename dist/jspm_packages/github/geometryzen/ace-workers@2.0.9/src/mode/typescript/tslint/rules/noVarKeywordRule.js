System.register(["../language/rule/abstractRule", "../language/utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
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
    var abstractRule_1, utils_1, ruleWalker_1, Rule, NoVarKeywordWalker;
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
                    var noVarKeywordWalker = new NoVarKeywordWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(noVarKeywordWalker);
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            Rule.metadata = {
                ruleName: "no-var-keyword",
                description: "Disallows usage of the `var` keyword.",
                descriptionDetails: "Use `let` or `const` instead.",
                hasFix: true,
                optionsDescription: "Not configurable.",
                options: null,
                optionExamples: ["true"],
                type: "functionality",
                typescriptOnly: false,
            };
            Rule.FAILURE_STRING = "Forbidden 'var' keyword, use 'let' or 'const' instead";
            exports_1("Rule", Rule);
            NoVarKeywordWalker = (function (_super) {
                __extends(NoVarKeywordWalker, _super);
                function NoVarKeywordWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoVarKeywordWalker.prototype.visitVariableStatement = function (node) {
                    if (!utils_1.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)
                        && !utils_1.isBlockScopedVariable(node)) {
                        this.reportFailure(node.declarationList);
                    }
                    _super.prototype.visitVariableStatement.call(this, node);
                };
                NoVarKeywordWalker.prototype.visitForStatement = function (node) {
                    this.handleInitializerNode(node.initializer);
                    _super.prototype.visitForStatement.call(this, node);
                };
                NoVarKeywordWalker.prototype.visitForInStatement = function (node) {
                    this.handleInitializerNode(node.initializer);
                    _super.prototype.visitForInStatement.call(this, node);
                };
                NoVarKeywordWalker.prototype.visitForOfStatement = function (node) {
                    this.handleInitializerNode(node.initializer);
                    _super.prototype.visitForOfStatement.call(this, node);
                };
                NoVarKeywordWalker.prototype.handleInitializerNode = function (node) {
                    if (node && node.kind === ts.SyntaxKind.VariableDeclarationList &&
                        !(utils_1.isNodeFlagSet(node, ts.NodeFlags.Let) || utils_1.isNodeFlagSet(node, ts.NodeFlags.Const))) {
                        this.reportFailure(node);
                    }
                };
                NoVarKeywordWalker.prototype.reportFailure = function (node) {
                    var nodeStart = node.getStart(this.getSourceFile());
                    this.addFailureAt(nodeStart, "var".length, Rule.FAILURE_STRING, this.createFix(this.createReplacement(nodeStart, "var".length, "let")));
                };
                return NoVarKeywordWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
