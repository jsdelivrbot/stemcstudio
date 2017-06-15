System.register(["../language/rule/abstractRule", "../language/walker/blockScopeAwareRuleWalker", "../language/utils"], function (exports_1, context_1) {
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
    var abstractRule_1, blockScopeAwareRuleWalker_1, utils_1, Rule, NoShadowedVariableWalker;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
            },
            function (blockScopeAwareRuleWalker_1_1) {
                blockScopeAwareRuleWalker_1 = blockScopeAwareRuleWalker_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NoShadowedVariableWalker(sourceFile, this.getOptions()));
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            Rule.metadata = {
                ruleName: "no-shadowed-variable",
                description: "Disallows shadowing variable declarations.",
                rationale: "Shadowing a variable masks access to it and obscures to what value an identifier actually refers.",
                optionsDescription: "Not configurable.",
                options: null,
                optionExamples: ["true"],
                type: "functionality",
                typescriptOnly: false,
            };
            Rule.FAILURE_STRING_FACTORY = function (name) {
                return "Shadowed variable: '" + name + "'";
            };
            exports_1("Rule", Rule);
            NoShadowedVariableWalker = (function (_super) {
                __extends(NoShadowedVariableWalker, _super);
                function NoShadowedVariableWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoShadowedVariableWalker.prototype.createScope = function () {
                    return new Set();
                };
                NoShadowedVariableWalker.prototype.createBlockScope = function () {
                    return new Set();
                };
                NoShadowedVariableWalker.prototype.visitBindingElement = function (node) {
                    var isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;
                    if (isSingleVariable) {
                        var name = node.name;
                        var variableDeclaration = utils_1.getBindingElementVariableDeclaration(node);
                        var isBlockScopedVar = variableDeclaration !== null && utils_1.isBlockScopedVariable(variableDeclaration);
                        this.handleSingleVariableIdentifier(name, isBlockScopedVar);
                    }
                    _super.prototype.visitBindingElement.call(this, node);
                };
                NoShadowedVariableWalker.prototype.visitCatchClause = function (node) {
                    this.visitBlock(node.block);
                };
                NoShadowedVariableWalker.prototype.visitCallSignature = function (_node) {
                };
                NoShadowedVariableWalker.prototype.visitFunctionType = function (_node) {
                };
                NoShadowedVariableWalker.prototype.visitConstructorType = function (_node) {
                };
                NoShadowedVariableWalker.prototype.visitIndexSignatureDeclaration = function (_node) {
                };
                NoShadowedVariableWalker.prototype.visitMethodSignature = function (_node) {
                };
                NoShadowedVariableWalker.prototype.visitParameterDeclaration = function (node) {
                    var isSingleParameter = node.name.kind === ts.SyntaxKind.Identifier;
                    if (isSingleParameter) {
                        this.handleSingleVariableIdentifier(node.name, false);
                    }
                    _super.prototype.visitParameterDeclaration.call(this, node);
                };
                NoShadowedVariableWalker.prototype.visitTypeLiteral = function (_node) {
                };
                NoShadowedVariableWalker.prototype.visitVariableDeclaration = function (node) {
                    var isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;
                    if (isSingleVariable) {
                        this.handleSingleVariableIdentifier(node.name, utils_1.isBlockScopedVariable(node));
                    }
                    _super.prototype.visitVariableDeclaration.call(this, node);
                };
                NoShadowedVariableWalker.prototype.handleSingleVariableIdentifier = function (variableIdentifier, isBlockScoped) {
                    var variableName = variableIdentifier.text;
                    if (this.isVarInCurrentScope(variableName) && !this.inCurrentBlockScope(variableName)) {
                        this.addFailureOnIdentifier(variableIdentifier);
                    }
                    else if (this.inPreviousBlockScope(variableName)) {
                        this.addFailureOnIdentifier(variableIdentifier);
                    }
                    if (!isBlockScoped) {
                        this.getCurrentScope().add(variableName);
                    }
                    this.getCurrentBlockScope().add(variableName);
                };
                NoShadowedVariableWalker.prototype.isVarInCurrentScope = function (varName) {
                    return this.getCurrentScope().has(varName);
                };
                NoShadowedVariableWalker.prototype.inCurrentBlockScope = function (varName) {
                    return this.getCurrentBlockScope().has(varName);
                };
                NoShadowedVariableWalker.prototype.inPreviousBlockScope = function (varName) {
                    var _this = this;
                    return this.getAllBlockScopes().some(function (scopeInfo) {
                        return scopeInfo !== _this.getCurrentBlockScope() && scopeInfo.has(varName);
                    });
                };
                NoShadowedVariableWalker.prototype.addFailureOnIdentifier = function (ident) {
                    var failureString = Rule.FAILURE_STRING_FACTORY(ident.text);
                    this.addFailureAtNode(ident, failureString);
                };
                return NoShadowedVariableWalker;
            }(blockScopeAwareRuleWalker_1.BlockScopeAwareRuleWalker));
        }
    };
});
