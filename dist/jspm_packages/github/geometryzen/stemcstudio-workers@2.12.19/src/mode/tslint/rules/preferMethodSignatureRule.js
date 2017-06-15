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
    var abstractRule_1, utils_1, ruleWalker_1, Rule, Walker;
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
                    return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "prefer-method-signature",
                    description: "Prefer `foo(): void` over `foo: () => void` in interfaces and types.",
                    hasFix: true,
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "style",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "Use a method signature instead of a property signature of function type.";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            Walker = (function (_super) {
                __extends(Walker, _super);
                function Walker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Walker.prototype.visitPropertySignature = function (node) {
                    var type = node.type;
                    if (type !== undefined && type.kind === ts.SyntaxKind.FunctionType) {
                        this.addFailureAtNode(node.name, Rule.FAILURE_STRING, this.createMethodSignatureFix(node, type));
                    }
                    _super.prototype.visitPropertySignature.call(this, node);
                };
                Walker.prototype.createMethodSignatureFix = function (node, type) {
                    return type.type && this.createFix(this.deleteFromTo(utils_1.childOfKind(node, ts.SyntaxKind.ColonToken).getStart(), type.getStart()), this.deleteFromTo(utils_1.childOfKind(type, ts.SyntaxKind.EqualsGreaterThanToken).getStart(), type.type.getStart()), this.appendText(utils_1.childOfKind(type, ts.SyntaxKind.CloseParenToken).end, ":"));
                };
                return Walker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
