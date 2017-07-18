System.register(["../language/rule/typedRule", "../utils", "../language/walker/programAwareRuleWalker"], function (exports_1, context_1) {
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
    var typedRule_1, utils_1, programAwareRuleWalker_1, Rule, NoForInArrayWalker, _a;
    return {
        setters: [
            function (typedRule_1_1) {
                typedRule_1 = typedRule_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (programAwareRuleWalker_1_1) {
                programAwareRuleWalker_1 = programAwareRuleWalker_1_1;
            }
        ],
        execute: function () {
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.applyWithProgram = function (sourceFile, langSvc) {
                    var noForInArrayWalker = new NoForInArrayWalker(sourceFile, this.getOptions(), langSvc.getProgram());
                    return this.applyWithWalker(noForInArrayWalker);
                };
                Rule.metadata = {
                    ruleName: "no-for-in-array",
                    description: "Disallows iterating over an array with a for-in loop.",
                    descriptionDetails: (_a = ["\n            A for-in loop (`for (var k in o)`) iterates over the properties of an Object.\n\n            While it is legal to use for-in loops with array types, it is not common.\n            for-in will iterate over the indices of the array as strings, omitting any \"holes\" in\n            the array.\n\n            More common is to use for-of, which iterates over the values of an array.\n            If you want to iterate over the indices, alternatives include:\n\n            array.forEach((value, index) => { ... });\n            for (const [index, value] of array.entries()) { ... }\n            for (let i = 0; i < array.length; i++) { ... }\n            "], _a.raw = ["\n            A for-in loop (\\`for (var k in o)\\`) iterates over the properties of an Object.\n\n            While it is legal to use for-in loops with array types, it is not common.\n            for-in will iterate over the indices of the array as strings, omitting any \"holes\" in\n            the array.\n\n            More common is to use for-of, which iterates over the values of an array.\n            If you want to iterate over the indices, alternatives include:\n\n            array.forEach((value, index) => { ... });\n            for (const [index, value] of array.entries()) { ... }\n            for (let i = 0; i < array.length; i++) { ... }\n            "], utils_1.dedent(_a)),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    requiresTypeInfo: true,
                    type: "functionality",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING = "for-in loops over arrays are forbidden. Use for-of or array.forEach instead.";
                return Rule;
            }(typedRule_1.TypedRule));
            exports_1("Rule", Rule);
            NoForInArrayWalker = (function (_super) {
                __extends(NoForInArrayWalker, _super);
                function NoForInArrayWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoForInArrayWalker.prototype.visitForInStatement = function (node) {
                    var iteratee = node.expression;
                    var tc = this.getTypeChecker();
                    var type = tc.getTypeAtLocation(iteratee);
                    var isArrayType = type.symbol && type.symbol.name === "Array";
                    var isStringType = (type.flags & ts.TypeFlags.StringLike) !== 0;
                    if (isArrayType || isStringType) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitForInStatement.call(this, node);
                };
                return NoForInArrayWalker;
            }(programAwareRuleWalker_1.ProgramAwareRuleWalker));
        }
    };
});
