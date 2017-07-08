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
    var abstractRule_1, ruleWalker_1, Rule, NoAnyWalker;
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
                    return this.applyWithWalker(new NoAnyWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "no-any",
                    description: "Disallows usages of `any` as a type declaration.",
                    hasFix: true,
                    rationale: "Using `any` as a type declaration nullifies the compile-time benefits of the type system.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "typescript",
                    typescriptOnly: true,
                };
                Rule.FAILURE_STRING = "Type declaration of 'any' loses type-safety. " +
                    "Consider replacing it with a more precise type, the empty type ('{}'), " +
                    "or suppress this occurrence.";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            NoAnyWalker = (function (_super) {
                __extends(NoAnyWalker, _super);
                function NoAnyWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoAnyWalker.prototype.visitAnyKeyword = function (node) {
                    var fix = this.createFix(this.createReplacement(node.getStart(), node.getWidth(), "{}"));
                    this.addFailureAtNode(node, Rule.FAILURE_STRING, fix);
                    _super.prototype.visitAnyKeyword.call(this, node);
                };
                return NoAnyWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
