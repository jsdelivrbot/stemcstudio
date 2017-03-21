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
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, Rule, MemberAccessWalker, _a;
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
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new MemberAccessWalker(sourceFile, this.getOptions()));
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            Rule.metadata = {
                ruleName: "member-access",
                description: "Requires explicit visibility declarations for class members.",
                rationale: "Explicit visibility declarations can make code more readable and accessible for those new to TS.",
                optionsDescription: (_a = ["\n            Two arguments may be optionally provided:\n\n            * `\"check-accessor\"` enforces explicit visibility on get/set accessors (can only be public)\n            * `\"check-constructor\"`  enforces explicit visibility on constructors (can only be public)"], _a.raw = ["\n            Two arguments may be optionally provided:\n\n            * \\`\"check-accessor\"\\` enforces explicit visibility on get/set accessors (can only be public)\n            * \\`\"check-constructor\"\\`  enforces explicit visibility on constructors (can only be public)"], utils_2.dedent(_a)),
                options: {
                    type: "array",
                    items: {
                        type: "string",
                        enum: ["check-accessor", "check-constructor"],
                    },
                    minLength: 0,
                    maxLength: 2,
                },
                optionExamples: ["true", '[true, "check-accessor"]'],
                type: "typescript",
                typescriptOnly: true,
            };
            Rule.FAILURE_STRING_FACTORY = function (memberType, memberName, publicOnly) {
                memberName = memberName === undefined ? "" : " '" + memberName + "'";
                if (publicOnly) {
                    return "The " + memberType + memberName + " must be marked as 'public'";
                }
                return "The " + memberType + memberName + " must be marked either 'private', 'public', or 'protected'";
            };
            exports_1("Rule", Rule);
            MemberAccessWalker = (function (_super) {
                __extends(MemberAccessWalker, _super);
                function MemberAccessWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MemberAccessWalker.prototype.visitConstructorDeclaration = function (node) {
                    if (this.hasOption("check-constructor")) {
                        this.validateVisibilityModifiers(node);
                    }
                    _super.prototype.visitConstructorDeclaration.call(this, node);
                };
                MemberAccessWalker.prototype.visitMethodDeclaration = function (node) {
                    this.validateVisibilityModifiers(node);
                    _super.prototype.visitMethodDeclaration.call(this, node);
                };
                MemberAccessWalker.prototype.visitPropertyDeclaration = function (node) {
                    this.validateVisibilityModifiers(node);
                    _super.prototype.visitPropertyDeclaration.call(this, node);
                };
                MemberAccessWalker.prototype.visitGetAccessor = function (node) {
                    if (this.hasOption("check-accessor")) {
                        this.validateVisibilityModifiers(node);
                    }
                    _super.prototype.visitGetAccessor.call(this, node);
                };
                MemberAccessWalker.prototype.visitSetAccessor = function (node) {
                    if (this.hasOption("check-accessor")) {
                        this.validateVisibilityModifiers(node);
                    }
                    _super.prototype.visitSetAccessor.call(this, node);
                };
                MemberAccessWalker.prototype.validateVisibilityModifiers = function (node) {
                    if (node.parent.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                        return;
                    }
                    var hasAnyVisibilityModifiers = utils_1.hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword, ts.SyntaxKind.PrivateKeyword, ts.SyntaxKind.ProtectedKeyword);
                    if (!hasAnyVisibilityModifiers) {
                        var memberType = void 0;
                        var publicOnly = false;
                        var end = void 0;
                        if (node.kind === ts.SyntaxKind.MethodDeclaration) {
                            memberType = "class method";
                            end = node.name.getEnd();
                        }
                        else if (node.kind === ts.SyntaxKind.PropertyDeclaration) {
                            memberType = "class property";
                            end = node.name.getEnd();
                        }
                        else if (node.kind === ts.SyntaxKind.Constructor) {
                            memberType = "class constructor";
                            publicOnly = true;
                            end = utils_1.childOfKind(node, ts.SyntaxKind.ConstructorKeyword).getEnd();
                        }
                        else if (node.kind === ts.SyntaxKind.GetAccessor) {
                            memberType = "get property accessor";
                            end = node.name.getEnd();
                        }
                        else if (node.kind === ts.SyntaxKind.SetAccessor) {
                            memberType = "set property accessor";
                            end = node.name.getEnd();
                        }
                        else {
                            throw new Error("unhandled node type");
                        }
                        var memberName = void 0;
                        if (node.name !== undefined && node.name.kind === ts.SyntaxKind.Identifier) {
                            memberName = node.name.text;
                        }
                        var failureString = Rule.FAILURE_STRING_FACTORY(memberType, memberName, publicOnly);
                        this.addFailureFromStartToEnd(node.getStart(), end, failureString);
                    }
                };
                return MemberAccessWalker;
            }(ruleWalker_1.RuleWalker));
            exports_1("MemberAccessWalker", MemberAccessWalker);
        }
    };
});
