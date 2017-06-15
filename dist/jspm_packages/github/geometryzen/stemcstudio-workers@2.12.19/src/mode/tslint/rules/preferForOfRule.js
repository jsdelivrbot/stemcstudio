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
    var abstractRule_1, blockScopeAwareRuleWalker_1, utils_1, Rule, PreferForOfWalker;
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
                    return this.applyWithWalker(new PreferForOfWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "prefer-for-of",
                    description: "Recommends a 'for-of' loop over a standard 'for' loop if the index is only used to access the array being iterated.",
                    rationale: "A for(... of ...) loop is easier to implement and read when the index is not needed.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "typescript",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "Expected a 'for-of' loop instead of a 'for' loop with this simple iteration";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            PreferForOfWalker = (function (_super) {
                __extends(PreferForOfWalker, _super);
                function PreferForOfWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PreferForOfWalker.prototype.createScope = function () { };
                PreferForOfWalker.prototype.createBlockScope = function () {
                    return new Map();
                };
                PreferForOfWalker.prototype.visitForStatement = function (node) {
                    var arrayNodeInfo = this.getForLoopHeaderInfo(node);
                    var currentBlockScope = this.getCurrentBlockScope();
                    var indexVariableName;
                    if (node.incrementor != null && arrayNodeInfo != null) {
                        var indexVariable = arrayNodeInfo.indexVariable, arrayToken = arrayNodeInfo.arrayToken;
                        indexVariableName = indexVariable.getText();
                        currentBlockScope.set(indexVariableName, {
                            arrayToken: arrayToken,
                            forLoopEndPosition: node.incrementor.end + 1,
                            onlyArrayReadAccess: true,
                        });
                    }
                    _super.prototype.visitForStatement.call(this, node);
                    if (indexVariableName != null) {
                        var incrementorState = currentBlockScope.get(indexVariableName);
                        if (incrementorState.onlyArrayReadAccess) {
                            this.addFailureFromStartToEnd(node.getStart(), incrementorState.forLoopEndPosition, Rule.FAILURE_STRING);
                        }
                        currentBlockScope.delete(indexVariableName);
                    }
                };
                PreferForOfWalker.prototype.visitIdentifier = function (node) {
                    var incrementorScope = this.findBlockScope(function (scope) { return scope.has(node.text); });
                    if (incrementorScope != null) {
                        var incrementorState = incrementorScope.get(node.text);
                        if (incrementorState != null && incrementorState.arrayToken != null && incrementorState.forLoopEndPosition < node.getStart()) {
                            if (node.parent.kind === ts.SyntaxKind.ElementAccessExpression) {
                                var elementAccess = node.parent;
                                var arrayIdentifier = utils_1.unwrapParentheses(elementAccess.expression);
                                if (incrementorState.arrayToken.getText() !== arrayIdentifier.getText()) {
                                    incrementorState.onlyArrayReadAccess = false;
                                }
                                else if (elementAccess.parent != null && utils_1.isAssignment(elementAccess.parent)) {
                                    incrementorState.onlyArrayReadAccess = false;
                                }
                            }
                            else {
                                incrementorState.onlyArrayReadAccess = false;
                            }
                        }
                        _super.prototype.visitIdentifier.call(this, node);
                    }
                };
                PreferForOfWalker.prototype.getForLoopHeaderInfo = function (forLoop) {
                    var indexVariableName;
                    var indexVariable;
                    if (forLoop.initializer != null && forLoop.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
                        var syntaxList = forLoop.initializer.getChildAt(1);
                        if (syntaxList.kind === ts.SyntaxKind.SyntaxList && syntaxList.getChildCount() === 1) {
                            var assignment = syntaxList.getChildAt(0);
                            if (assignment.kind === ts.SyntaxKind.VariableDeclaration && assignment.getChildCount() === 3) {
                                var value = assignment.getChildAt(2).getText();
                                if (value === "0") {
                                    indexVariable = assignment.getChildAt(0);
                                    indexVariableName = indexVariable.getText();
                                }
                            }
                        }
                    }
                    if (indexVariableName == null
                        || forLoop.condition == null
                        || forLoop.condition.kind !== ts.SyntaxKind.BinaryExpression
                        || forLoop.condition.getChildAt(0).getText() !== indexVariableName
                        || forLoop.condition.getChildAt(1).getText() !== "<") {
                        return null;
                    }
                    if (forLoop.incrementor == null || !this.isIncremented(forLoop.incrementor, indexVariableName)) {
                        return null;
                    }
                    var conditionRight = forLoop.condition.getChildAt(2);
                    if (conditionRight.kind === ts.SyntaxKind.PropertyAccessExpression) {
                        var propertyAccess = conditionRight;
                        if (indexVariable != null && propertyAccess.name.getText() === "length") {
                            return { indexVariable: indexVariable, arrayToken: utils_1.unwrapParentheses(propertyAccess.expression) };
                        }
                    }
                    return null;
                };
                PreferForOfWalker.prototype.isIncremented = function (node, indexVariableName) {
                    if (node == null) {
                        return false;
                    }
                    if (node.kind === ts.SyntaxKind.PrefixUnaryExpression) {
                        var incrementor = node;
                        if (incrementor.operator === ts.SyntaxKind.PlusPlusToken && incrementor.operand.getText() === indexVariableName) {
                            return true;
                        }
                    }
                    else if (node.kind === ts.SyntaxKind.PostfixUnaryExpression) {
                        var incrementor = node;
                        if (incrementor.operator === ts.SyntaxKind.PlusPlusToken && incrementor.operand.getText() === indexVariableName) {
                            return true;
                        }
                    }
                    else if (node.kind === ts.SyntaxKind.BinaryExpression) {
                        var binaryExpression = node;
                        if (binaryExpression.operatorToken.getText() === "+="
                            && binaryExpression.left.getText() === indexVariableName
                            && binaryExpression.right.getText() === "1") {
                            return true;
                        }
                        if (binaryExpression.operatorToken.getText() === "="
                            && binaryExpression.left.getText() === indexVariableName) {
                            var addExpression = binaryExpression.right;
                            if (addExpression.operatorToken.getText() === "+") {
                                if (addExpression.right.getText() === indexVariableName && addExpression.left.getText() === "1") {
                                    return true;
                                }
                                else if (addExpression.left.getText() === indexVariableName && addExpression.right.getText() === "1") {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                };
                return PreferForOfWalker;
            }(blockScopeAwareRuleWalker_1.BlockScopeAwareRuleWalker));
        }
    };
});
