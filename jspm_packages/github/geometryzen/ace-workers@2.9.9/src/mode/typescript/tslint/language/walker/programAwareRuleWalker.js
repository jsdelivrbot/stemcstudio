System.register(["./ruleWalker"], function (exports_1, context_1) {
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
    var ruleWalker_1, ProgramAwareRuleWalker;
    return {
        setters: [
            function (ruleWalker_1_1) {
                ruleWalker_1 = ruleWalker_1_1;
            }
        ],
        execute: function () {
            ProgramAwareRuleWalker = (function (_super) {
                __extends(ProgramAwareRuleWalker, _super);
                function ProgramAwareRuleWalker(sourceFile, options, program) {
                    var _this = _super.call(this, sourceFile, options) || this;
                    _this.program = program;
                    _this.typeChecker = program.getTypeChecker();
                    return _this;
                }
                ProgramAwareRuleWalker.prototype.getProgram = function () {
                    return this.program;
                };
                ProgramAwareRuleWalker.prototype.getTypeChecker = function () {
                    return this.typeChecker;
                };
                return ProgramAwareRuleWalker;
            }(ruleWalker_1.RuleWalker));
            exports_1("ProgramAwareRuleWalker", ProgramAwareRuleWalker);
        }
    };
});
