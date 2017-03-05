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
    function nodeIsContinue(node) {
        var kind = node.kind;
        if (kind === ts.SyntaxKind.ContinueStatement) {
            return true;
        }
        if (kind === ts.SyntaxKind.Block) {
            var blockStatements = node.statements;
            if (blockStatements.length === 1 && blockStatements[0].kind === ts.SyntaxKind.ContinueStatement) {
                return true;
            }
        }
        return false;
    }
    var abstractRule_1, utils_1, ruleWalker_1, Rule, ForInWalker, _a;
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
                    return this.applyWithWalker(new ForInWalker(sourceFile, this.getOptions()));
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            Rule.metadata = {
                ruleName: "forin",
                description: "Requires a `for ... in` statement to be filtered with an `if` statement.",
                rationale: (_a = ["\n            ```ts\n            for (let key in someObject) {\n                if (someObject.hasOwnProperty(key)) {\n                    // code here\n                }\n            }\n            ```\n            Prevents accidental iteration over properties inherited from an object's prototype.\n            See [MDN's `for...in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)\n            documentation for more information about `for...in` loops."], _a.raw = ["\n            \\`\\`\\`ts\n            for (let key in someObject) {\n                if (someObject.hasOwnProperty(key)) {\n                    // code here\n                }\n            }\n            \\`\\`\\`\n            Prevents accidental iteration over properties inherited from an object's prototype.\n            See [MDN's \\`for...in\\`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)\n            documentation for more information about \\`for...in\\` loops."], utils_1.dedent(_a)),
                optionsDescription: "Not configurable.",
                options: null,
                optionExamples: ["true"],
                type: "functionality",
                typescriptOnly: false,
            };
            Rule.FAILURE_STRING = "for (... in ...) statements must be filtered with an if statement";
            exports_1("Rule", Rule);
            ForInWalker = (function (_super) {
                __extends(ForInWalker, _super);
                function ForInWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ForInWalker.prototype.visitForInStatement = function (node) {
                    this.handleForInStatement(node);
                    _super.prototype.visitForInStatement.call(this, node);
                };
                ForInWalker.prototype.handleForInStatement = function (node) {
                    var statement = node.statement;
                    var statementKind = node.statement.kind;
                    if (statementKind === ts.SyntaxKind.IfStatement) {
                        return;
                    }
                    if (statementKind === ts.SyntaxKind.Block) {
                        var blockNode = statement;
                        var blockStatements = blockNode.statements;
                        if (blockStatements.length >= 1) {
                            var firstBlockStatement = blockStatements[0];
                            if (firstBlockStatement.kind === ts.SyntaxKind.IfStatement) {
                                if (blockStatements.length === 1) {
                                    return;
                                }
                                var ifStatement = firstBlockStatement.thenStatement;
                                if (nodeIsContinue(ifStatement)) {
                                    return;
                                }
                            }
                        }
                    }
                    this.addFailureAtNode(node, Rule.FAILURE_STRING);
                };
                return ForInWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
