System.register(["../language/rule/abstractRule", "../language/walker/blockScopeAwareRuleWalker", "../language/utils", "../utils"], function (exports_1, context_1) {
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
    var abstractRule_1, blockScopeAwareRuleWalker_1, utils_1, utils_2, utils_3, Rule, PreferConstWalker, ScopeInfo, _a;
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
                utils_3 = utils_1_1;
            },
            function (utils_2_1) {
                utils_2 = utils_2_1;
            }
        ],
        execute: function () {
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var preferConstWalker = new PreferConstWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(preferConstWalker);
                };
                Rule.metadata = {
                    ruleName: "prefer-const",
                    description: "Requires that variable declarations use `const` instead of `let` if possible.",
                    descriptionDetails: (_a = ["\n            If a variable is only assigned to once when it is declared, it should be declared using 'const'"], _a.raw = ["\n            If a variable is only assigned to once when it is declared, it should be declared using 'const'"], utils_2.dedent(_a)),
                    hasFix: true,
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "maintainability",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING_FACTORY = function (identifier) {
                    return "Identifier '" + identifier + "' is never reassigned; use 'const' instead of 'let'.";
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            PreferConstWalker = (function (_super) {
                __extends(PreferConstWalker, _super);
                function PreferConstWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PreferConstWalker.collect = function (statements, scopeInfo) {
                    for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
                        var s = statements_1[_i];
                        if (s.kind === ts.SyntaxKind.VariableStatement) {
                            PreferConstWalker.collectInVariableDeclarationList(s.declarationList, scopeInfo);
                        }
                    }
                };
                PreferConstWalker.collectInVariableDeclarationList = function (node, scopeInfo) {
                    var allowConst;
                    if (ts.getCombinedModifierFlags === undefined) {
                        allowConst = utils_3.isCombinedNodeFlagSet(node, ts.NodeFlags.Let)
                            && !utils_1.hasModifier(node.parent.modifiers, ts.SyntaxKind.ExportKeyword);
                    }
                    else {
                        allowConst = utils_3.isCombinedNodeFlagSet(node, ts.NodeFlags.Let) && !utils_3.isCombinedModifierFlagSet(node, ts.ModifierFlags.Export);
                    }
                    if (allowConst) {
                        for (var _i = 0, _a = node.declarations; _i < _a.length; _i++) {
                            var decl = _a[_i];
                            PreferConstWalker.addDeclarationName(decl.name, node, scopeInfo);
                        }
                    }
                };
                PreferConstWalker.addDeclarationName = function (node, container, scopeInfo) {
                    if (node.kind === ts.SyntaxKind.Identifier) {
                        scopeInfo.addVariable(node, container);
                    }
                    else {
                        for (var _i = 0, _a = node.elements; _i < _a.length; _i++) {
                            var el = _a[_i];
                            if (el.kind === ts.SyntaxKind.BindingElement) {
                                PreferConstWalker.addDeclarationName(el.name, container, scopeInfo);
                            }
                        }
                    }
                };
                PreferConstWalker.prototype.createScope = function () {
                    return {};
                };
                PreferConstWalker.prototype.createBlockScope = function (node) {
                    var scopeInfo = new ScopeInfo();
                    switch (node.kind) {
                        case ts.SyntaxKind.SourceFile:
                            PreferConstWalker.collect(node.statements, scopeInfo);
                            break;
                        case ts.SyntaxKind.Block:
                            PreferConstWalker.collect(node.statements, scopeInfo);
                            break;
                        case ts.SyntaxKind.ModuleDeclaration:
                            var body = node.body;
                            if (body && body.kind === ts.SyntaxKind.ModuleBlock) {
                                PreferConstWalker.collect(body.statements, scopeInfo);
                            }
                            break;
                        case ts.SyntaxKind.ForStatement:
                        case ts.SyntaxKind.ForOfStatement:
                        case ts.SyntaxKind.ForInStatement:
                            var initializer = node.initializer;
                            if (initializer && initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
                                PreferConstWalker.collectInVariableDeclarationList(initializer, scopeInfo);
                            }
                            break;
                        case ts.SyntaxKind.SwitchStatement:
                            for (var _i = 0, _a = node.caseBlock.clauses; _i < _a.length; _i++) {
                                var caseClause = _a[_i];
                                PreferConstWalker.collect(caseClause.statements, scopeInfo);
                            }
                            break;
                        default:
                            break;
                    }
                    return scopeInfo;
                };
                PreferConstWalker.prototype.onBlockScopeEnd = function () {
                    var seenLetStatements = new Set();
                    for (var _i = 0, _a = this.getCurrentBlockScope().getConstCandiates(); _i < _a.length; _i++) {
                        var usage = _a[_i];
                        var fix = void 0;
                        if (!usage.reassignedSibling && !seenLetStatements.has(usage.letStatement)) {
                            fix = this.createFix(this.createReplacement(usage.letStatement.getStart(), "let".length, "const"));
                            seenLetStatements.add(usage.letStatement);
                        }
                        this.addFailureAtNode(usage.identifier, Rule.FAILURE_STRING_FACTORY(usage.identifier.text), fix);
                    }
                };
                PreferConstWalker.prototype.visitBinaryExpression = function (node) {
                    if (utils_3.isAssignment(node)) {
                        this.handleLHSExpression(node.left);
                    }
                    _super.prototype.visitBinaryExpression.call(this, node);
                };
                PreferConstWalker.prototype.visitPrefixUnaryExpression = function (node) {
                    this.handleUnaryExpression(node);
                    _super.prototype.visitPrefixUnaryExpression.call(this, node);
                };
                PreferConstWalker.prototype.visitPostfixUnaryExpression = function (node) {
                    this.handleUnaryExpression(node);
                    _super.prototype.visitPostfixUnaryExpression.call(this, node);
                };
                PreferConstWalker.prototype.handleLHSExpression = function (node) {
                    var _this = this;
                    node = utils_3.unwrapParentheses(node);
                    if (node.kind === ts.SyntaxKind.Identifier) {
                        this.markAssignment(node);
                    }
                    else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
                        var deconstructionArray = node;
                        deconstructionArray.elements.forEach(function (child) {
                            _this.handleLHSExpression(child);
                        });
                    }
                    else if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                        for (var _i = 0, _a = node.properties; _i < _a.length; _i++) {
                            var prop = _a[_i];
                            switch (prop.kind) {
                                case ts.SyntaxKind.PropertyAssignment:
                                    this.handleLHSExpression(prop.initializer);
                                    break;
                                case ts.SyntaxKind.ShorthandPropertyAssignment:
                                    this.handleLHSExpression(prop.name);
                                    break;
                                case ts.SyntaxKind.SpreadAssignment:
                                    this.handleLHSExpression(prop.expression);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                };
                PreferConstWalker.prototype.handleUnaryExpression = function (node) {
                    if (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken) {
                        this.handleLHSExpression(node.operand);
                    }
                };
                PreferConstWalker.prototype.markAssignment = function (identifier) {
                    var allBlockScopes = this.getAllBlockScopes();
                    for (var i = allBlockScopes.length - 1; i >= 0; i--) {
                        if (allBlockScopes[i].incrementVariableUsage(identifier.text)) {
                            break;
                        }
                    }
                };
                return PreferConstWalker;
            }(blockScopeAwareRuleWalker_1.BlockScopeAwareRuleWalker));
            ScopeInfo = (function () {
                function ScopeInfo() {
                    this.identifierUsages = new Map();
                    this.sharedLetSets = new Map();
                }
                ScopeInfo.prototype.addVariable = function (identifier, letStatement) {
                    this.identifierUsages.set(identifier.text, { letStatement: letStatement, identifier: identifier, usageCount: 0 });
                    var shared = this.sharedLetSets.get(letStatement);
                    if (shared === undefined) {
                        shared = [];
                        this.sharedLetSets.set(letStatement, shared);
                    }
                    shared.push(identifier.text);
                };
                ScopeInfo.prototype.getConstCandiates = function () {
                    var _this = this;
                    var constCandidates = [];
                    this.sharedLetSets.forEach(function (variableNames) {
                        var anyReassigned = variableNames.some(function (key) { return _this.identifierUsages.get(key).usageCount > 0; });
                        for (var _i = 0, variableNames_1 = variableNames; _i < variableNames_1.length; _i++) {
                            var variableName = variableNames_1[_i];
                            var usage = _this.identifierUsages.get(variableName);
                            if (usage.usageCount === 0) {
                                constCandidates.push({
                                    identifier: usage.identifier,
                                    letStatement: usage.letStatement,
                                    reassignedSibling: anyReassigned,
                                });
                            }
                        }
                    });
                    return constCandidates;
                };
                ScopeInfo.prototype.incrementVariableUsage = function (varName) {
                    var usages = this.identifierUsages.get(varName);
                    if (usages !== undefined) {
                        usages.usageCount++;
                        return true;
                    }
                    return false;
                };
                return ScopeInfo;
            }());
        }
    };
});
