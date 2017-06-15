System.register(["../language/rule/abstractRule", "../language/walker/ruleWalker"], function (exports_1, context_1) {
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
    var abstractRule_1, ruleWalker_1, Rule, NameWalker;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
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
                    return this.applyWithWalker(new NameWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "class-name",
                    description: "Enforces PascalCased class and interface names.",
                    rationale: "Makes it easy to differentiate classes from regular variables at a glance.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "style",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "Class name must be in pascal case";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            NameWalker = (function (_super) {
                __extends(NameWalker, _super);
                function NameWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NameWalker.prototype.visitClassDeclaration = function (node) {
                    if (node.name != null) {
                        var className = node.name.getText();
                        if (!this.isPascalCased(className)) {
                            this.addFailureAtNode(node.name, Rule.FAILURE_STRING);
                        }
                    }
                    _super.prototype.visitClassDeclaration.call(this, node);
                };
                NameWalker.prototype.visitInterfaceDeclaration = function (node) {
                    var interfaceName = node.name.getText();
                    if (!this.isPascalCased(interfaceName)) {
                        this.addFailureAtNode(node.name, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitInterfaceDeclaration.call(this, node);
                };
                NameWalker.prototype.isPascalCased = function (name) {
                    if (name.length <= 0) {
                        return true;
                    }
                    var firstCharacter = name.charAt(0);
                    return ((firstCharacter === firstCharacter.toUpperCase()) && name.indexOf("_") === -1);
                };
                return NameWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
