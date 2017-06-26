System.register(["../language/rule/abstractRule", "../utils", "../language/walker/walker"], function (exports_1, context_1) {
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
    var abstractRule_1, utils_1, walker_1, Rule, NoMagicNumbersWalker, _a, _b;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (walker_1_1) {
                walker_1 = walker_1_1;
            }
        ],
        execute: function () {
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var allowedNumbers = this.ruleArguments.length > 0 ? this.ruleArguments : Rule.DEFAULT_ALLOWED;
                    return this.applyWithWalker(new NoMagicNumbersWalker(sourceFile, this.ruleName, new Set(allowedNumbers.map(String))));
                };
                Rule.metadata = {
                    ruleName: "no-magic-numbers",
                    description: (_a = ["\n            Disallows the use constant number values outside of variable assignments.\n            When no list of allowed values is specified, -1, 0 and 1 are allowed by default."], _a.raw = ["\n            Disallows the use constant number values outside of variable assignments.\n            When no list of allowed values is specified, -1, 0 and 1 are allowed by default."], utils_1.dedent(_a)),
                    rationale: (_b = ["\n            Magic numbers should be avoided as they often lack documentation, forcing\n            them to be stored in variables gives them implicit documentation."], _b.raw = ["\n            Magic numbers should be avoided as they often lack documentation, forcing\n            them to be stored in variables gives them implicit documentation."], utils_1.dedent(_b)),
                    optionsDescription: "A list of allowed numbers.",
                    options: {
                        type: "array",
                        items: {
                            type: "number",
                        },
                        minLength: 1,
                    },
                    optionExamples: ["true", "[true, 1, 2, 3]"],
                    type: "typescript",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "'magic numbers' are not allowed";
                Rule.ALLOWED_NODES = new Set([
                    ts.SyntaxKind.ExportAssignment,
                    ts.SyntaxKind.FirstAssignment,
                    ts.SyntaxKind.LastAssignment,
                    ts.SyntaxKind.PropertyAssignment,
                    ts.SyntaxKind.ShorthandPropertyAssignment,
                    ts.SyntaxKind.VariableDeclaration,
                    ts.SyntaxKind.VariableDeclarationList,
                    ts.SyntaxKind.EnumMember,
                    ts.SyntaxKind.PropertyDeclaration,
                    ts.SyntaxKind.Parameter,
                ]);
                Rule.DEFAULT_ALLOWED = [-1, 0, 1];
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            NoMagicNumbersWalker = (function (_super) {
                __extends(NoMagicNumbersWalker, _super);
                function NoMagicNumbersWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoMagicNumbersWalker.prototype.walk = function (sourceFile) {
                    var _this = this;
                    var cb = function (node) {
                        if (node.kind === ts.SyntaxKind.NumericLiteral) {
                            _this.checkNumericLiteral(node, node.text);
                        }
                        else if (node.kind === ts.SyntaxKind.PrefixUnaryExpression &&
                            node.operator === ts.SyntaxKind.MinusToken) {
                            _this.checkNumericLiteral(node, "-" + node.operand.text);
                        }
                        else {
                            ts.forEachChild(node, cb);
                        }
                    };
                    return ts.forEachChild(sourceFile, cb);
                };
                NoMagicNumbersWalker.prototype.checkNumericLiteral = function (node, num) {
                    if (!Rule.ALLOWED_NODES.has(node.parent.kind) && !this.options.has(num)) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                };
                return NoMagicNumbersWalker;
            }(walker_1.AbstractWalker));
        }
    };
});
