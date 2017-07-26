System.register(["../language/rule/abstractRule", "../language/walker/ruleWalker", "../index"], function (exports_1, context_1) {
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
    var abstractRule_1, ruleWalker_1, Lint, OPTION_IGNORE_FOR_LOOP, Rule, OneVariablePerDeclarationWalker, _a;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
            },
            function (ruleWalker_1_1) {
                ruleWalker_1 = ruleWalker_1_1;
            },
            function (Lint_1) {
                Lint = Lint_1;
            }
        ],
        execute: function () {
            OPTION_IGNORE_FOR_LOOP = "ignore-for-loop";
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var oneVarWalker = new OneVariablePerDeclarationWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(oneVarWalker);
                };
                Rule.metadata = {
                    ruleName: "one-variable-per-declaration",
                    description: "Disallows multiple variable definitions in the same declaration statement.",
                    optionsDescription: (_a = ["\n            One argument may be optionally provided:\n\n            * `", "` allows multiple variable definitions in a for loop declaration."], _a.raw = ["\n            One argument may be optionally provided:\n\n            * \\`", "\\` allows multiple variable definitions in a for loop declaration."], Lint.Utils.dedent(_a, OPTION_IGNORE_FOR_LOOP)),
                    options: {
                        type: "array",
                        items: {
                            type: "string",
                            enum: [OPTION_IGNORE_FOR_LOOP],
                        },
                        minLength: 0,
                        maxLength: 1,
                    },
                    optionExamples: ["true", "[true, \"" + OPTION_IGNORE_FOR_LOOP + "\"]"],
                    type: "style",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "Multiple variable declarations in the same statement are forbidden";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            OneVariablePerDeclarationWalker = (function (_super) {
                __extends(OneVariablePerDeclarationWalker, _super);
                function OneVariablePerDeclarationWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                OneVariablePerDeclarationWalker.prototype.visitVariableStatement = function (node) {
                    var declarationList = node.declarationList;
                    if (declarationList.declarations.length > 1) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitVariableStatement.call(this, node);
                };
                OneVariablePerDeclarationWalker.prototype.visitForStatement = function (node) {
                    var initializer = node.initializer;
                    var shouldIgnoreForLoop = this.hasOption(OPTION_IGNORE_FOR_LOOP);
                    if (!shouldIgnoreForLoop
                        && initializer != null
                        && initializer.kind === ts.SyntaxKind.VariableDeclarationList
                        && initializer.declarations.length > 1) {
                        this.addFailureAtNode(initializer, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitForStatement.call(this, node);
                };
                return OneVariablePerDeclarationWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
