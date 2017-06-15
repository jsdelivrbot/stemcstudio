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
    var abstractRule_1, utils_1, ruleWalker_1, Rule, NoConstructWalker, _a;
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
                    return this.applyWithWalker(new NoConstructWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "no-construct",
                    description: "Disallows access to the constructors of `String`, `Number`, and `Boolean`.",
                    descriptionDetails: "Disallows constructor use such as `new Number(foo)` but does not disallow `Number(foo)`.",
                    rationale: (_a = ["\n            There is little reason to use `String`, `Number`, or `Boolean` as constructors.\n            In almost all cases, the regular function-call version is more appropriate.\n            [More details](http://stackoverflow.com/q/4719320/3124288) are available on StackOverflow."], _a.raw = ["\n            There is little reason to use \\`String\\`, \\`Number\\`, or \\`Boolean\\` as constructors.\n            In almost all cases, the regular function-call version is more appropriate.\n            [More details](http://stackoverflow.com/q/4719320/3124288) are available on StackOverflow."], utils_1.dedent(_a)),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "Forbidden constructor, use a literal or simple function call instead";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            NoConstructWalker = (function (_super) {
                __extends(NoConstructWalker, _super);
                function NoConstructWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoConstructWalker.prototype.visitNewExpression = function (node) {
                    if (node.expression.kind === ts.SyntaxKind.Identifier) {
                        var identifier = node.expression;
                        var constructorName = identifier.text;
                        if (NoConstructWalker.FORBIDDEN_CONSTRUCTORS.indexOf(constructorName) !== -1) {
                            this.addFailureAt(node.getStart(), identifier.getEnd() - node.getStart(), Rule.FAILURE_STRING);
                        }
                    }
                    _super.prototype.visitNewExpression.call(this, node);
                };
                NoConstructWalker.FORBIDDEN_CONSTRUCTORS = [
                    "Boolean",
                    "Number",
                    "String",
                ];
                return NoConstructWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
