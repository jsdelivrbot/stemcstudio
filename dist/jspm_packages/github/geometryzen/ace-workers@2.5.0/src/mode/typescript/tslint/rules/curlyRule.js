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
    function isStatementBraced(node) {
        return node.kind === ts.SyntaxKind.Block;
    }
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, Rule, CurlyWalker, _a;
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
                    return this.applyWithWalker(new CurlyWalker(sourceFile, this.getOptions()));
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            Rule.metadata = {
                ruleName: "curly",
                description: "Enforces braces for `if`/`for`/`do`/`while` statements.",
                rationale: (_a = ["\n            ```ts\n            if (foo === bar)\n                foo++;\n                bar++;\n            ```\n\n            In the code above, the author almost certainly meant for both `foo++` and `bar++`\n            to be executed only if `foo === bar`. However, he forgot braces and `bar++` will be executed\n            no matter what. This rule could prevent such a mistake."], _a.raw = ["\n            \\`\\`\\`ts\n            if (foo === bar)\n                foo++;\n                bar++;\n            \\`\\`\\`\n\n            In the code above, the author almost certainly meant for both \\`foo++\\` and \\`bar++\\`\n            to be executed only if \\`foo === bar\\`. However, he forgot braces and \\`bar++\\` will be executed\n            no matter what. This rule could prevent such a mistake."], utils_2.dedent(_a)),
                optionsDescription: "Not configurable.",
                options: null,
                optionExamples: ["true"],
                type: "functionality",
                typescriptOnly: false,
            };
            Rule.DO_FAILURE_STRING = "do statements must be braced";
            Rule.ELSE_FAILURE_STRING = "else statements must be braced";
            Rule.FOR_FAILURE_STRING = "for statements must be braced";
            Rule.IF_FAILURE_STRING = "if statements must be braced";
            Rule.WHILE_FAILURE_STRING = "while statements must be braced";
            exports_1("Rule", Rule);
            CurlyWalker = (function (_super) {
                __extends(CurlyWalker, _super);
                function CurlyWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CurlyWalker.prototype.visitForInStatement = function (node) {
                    if (!isStatementBraced(node.statement)) {
                        this.addFailureAtNode(node, Rule.FOR_FAILURE_STRING);
                    }
                    _super.prototype.visitForInStatement.call(this, node);
                };
                CurlyWalker.prototype.visitForOfStatement = function (node) {
                    if (!isStatementBraced(node.statement)) {
                        this.addFailureAtNode(node, Rule.FOR_FAILURE_STRING);
                    }
                    _super.prototype.visitForOfStatement.call(this, node);
                };
                CurlyWalker.prototype.visitForStatement = function (node) {
                    if (!isStatementBraced(node.statement)) {
                        this.addFailureAtNode(node, Rule.FOR_FAILURE_STRING);
                    }
                    _super.prototype.visitForStatement.call(this, node);
                };
                CurlyWalker.prototype.visitIfStatement = function (node) {
                    if (!isStatementBraced(node.thenStatement)) {
                        this.addFailureFromStartToEnd(node.getStart(), node.thenStatement.getEnd(), Rule.IF_FAILURE_STRING);
                    }
                    if (node.elseStatement != null
                        && node.elseStatement.kind !== ts.SyntaxKind.IfStatement
                        && !isStatementBraced(node.elseStatement)) {
                        var elseKeywordNode = utils_1.childOfKind(node, ts.SyntaxKind.ElseKeyword);
                        this.addFailureFromStartToEnd(elseKeywordNode.getStart(), node.elseStatement.getEnd(), Rule.ELSE_FAILURE_STRING);
                    }
                    _super.prototype.visitIfStatement.call(this, node);
                };
                CurlyWalker.prototype.visitDoStatement = function (node) {
                    if (!isStatementBraced(node.statement)) {
                        this.addFailureAtNode(node, Rule.DO_FAILURE_STRING);
                    }
                    _super.prototype.visitDoStatement.call(this, node);
                };
                CurlyWalker.prototype.visitWhileStatement = function (node) {
                    if (!isStatementBraced(node.statement)) {
                        this.addFailureAtNode(node, Rule.WHILE_FAILURE_STRING);
                    }
                    _super.prototype.visitWhileStatement.call(this, node);
                };
                return CurlyWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
