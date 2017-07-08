System.register(["./abstractRule"], function (exports_1, context_1) {
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
    var abstractRule_1, TypedRule;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
            }
        ],
        execute: function () {
            TypedRule = (function (_super) {
                __extends(TypedRule, _super);
                function TypedRule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TypedRule.isTypedRule = function (rule) {
                    return "applyWithProgram" in rule;
                };
                TypedRule.prototype.apply = function () {
                    throw new Error("The '" + this.ruleName + "' rule requires type checking");
                };
                return TypedRule;
            }(abstractRule_1.AbstractRule));
            exports_1("TypedRule", TypedRule);
        }
    };
});
