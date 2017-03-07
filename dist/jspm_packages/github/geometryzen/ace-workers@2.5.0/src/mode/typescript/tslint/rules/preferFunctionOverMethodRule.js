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
    function isRecursiveCall(thisOrSuper, cur) {
        var parent = thisOrSuper.parent;
        return thisOrSuper.kind === ts.SyntaxKind.ThisKeyword
            && parent.kind === ts.SyntaxKind.PropertyAccessExpression
            && parent.name.text === cur.name;
    }
    function methodVisibility(node) {
        if (utils_1.hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword)) {
            return 2;
        }
        else if (utils_1.hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword)) {
            return 1;
        }
        else {
            return 0;
        }
    }
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, OPTION_ALLOW_PUBLIC, OPTION_ALLOW_PROTECTED, Rule, PreferFunctionOverMethodWalker, _a;
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
            OPTION_ALLOW_PUBLIC = "allow-public";
            OPTION_ALLOW_PROTECTED = "allow-protected";
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new PreferFunctionOverMethodWalker(sourceFile, this.getOptions()));
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            Rule.metadata = {
                ruleName: "prefer-function-over-method",
                description: "Warns for class methods that do not use 'this'.",
                optionsDescription: (_a = ["\n            \"", "\" excludes checking of public methods.\n            \"", "\" excludes checking of protected methods."], _a.raw = ["\n            \"", "\" excludes checking of public methods.\n            \"", "\" excludes checking of protected methods."], utils_2.dedent(_a, OPTION_ALLOW_PUBLIC, OPTION_ALLOW_PROTECTED)),
                options: {
                    type: "string",
                    enum: [OPTION_ALLOW_PUBLIC, OPTION_ALLOW_PROTECTED],
                },
                optionExamples: [
                    "true",
                    "[true, \"" + OPTION_ALLOW_PUBLIC + "\", \"" + OPTION_ALLOW_PROTECTED + "\"]",
                ],
                type: "style",
                typescriptOnly: false,
            };
            Rule.FAILURE_STRING = "Class method does not use 'this'. Use a function instead.";
            exports_1("Rule", Rule);
            PreferFunctionOverMethodWalker = (function (_super) {
                __extends(PreferFunctionOverMethodWalker, _super);
                function PreferFunctionOverMethodWalker() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.allowPublic = _this.hasOption(OPTION_ALLOW_PUBLIC);
                    _this.allowProtected = _this.hasOption(OPTION_ALLOW_PROTECTED);
                    _this.stack = [];
                    return _this;
                }
                PreferFunctionOverMethodWalker.prototype.visitNode = function (node) {
                    var _this = this;
                    switch (node.kind) {
                        case ts.SyntaxKind.ThisKeyword:
                        case ts.SyntaxKind.SuperKeyword:
                            this.setThisUsed(node);
                            break;
                        case ts.SyntaxKind.MethodDeclaration:
                            var name = node.name;
                            var usesThis = this.withThisScope(name.kind === ts.SyntaxKind.Identifier ? name.text : undefined, function () { return _super.prototype.visitNode.call(_this, node); });
                            if (!usesThis
                                && node.parent.kind !== ts.SyntaxKind.ObjectLiteralExpression
                                && this.shouldWarnForModifiers(node)) {
                                this.addFailureAtNode(node.name, Rule.FAILURE_STRING);
                            }
                            break;
                        case ts.SyntaxKind.FunctionDeclaration:
                        case ts.SyntaxKind.FunctionExpression:
                            this.withThisScope(undefined, function () { return _super.prototype.visitNode.call(_this, node); });
                            break;
                        default:
                            _super.prototype.visitNode.call(this, node);
                    }
                };
                PreferFunctionOverMethodWalker.prototype.setThisUsed = function (node) {
                    var cur = this.stack[this.stack.length - 1];
                    if (cur && !isRecursiveCall(node, cur)) {
                        cur.isThisUsed = true;
                    }
                };
                PreferFunctionOverMethodWalker.prototype.withThisScope = function (name, recur) {
                    this.stack.push({ name: name, isThisUsed: false });
                    recur();
                    return this.stack.pop().isThisUsed;
                };
                PreferFunctionOverMethodWalker.prototype.shouldWarnForModifiers = function (node) {
                    if (utils_1.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword)) {
                        return false;
                    }
                    switch (methodVisibility(node)) {
                        case 0:
                            return !this.allowPublic;
                        case 1:
                            return !this.allowProtected;
                        default:
                            return true;
                    }
                };
                return PreferFunctionOverMethodWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
