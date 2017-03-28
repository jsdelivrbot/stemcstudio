System.register(["./banRule"], function (exports_1, context_1) {
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
    var BanRule, Rule;
    return {
        setters: [
            function (BanRule_1) {
                BanRule = BanRule_1;
            }
        ],
        execute: function () {
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var options = this.getOptions();
                    var consoleBanWalker = new BanRule.BanFunctionWalker(sourceFile, this.getOptions());
                    for (var _i = 0, _a = options.ruleArguments; _i < _a.length; _i++) {
                        var option = _a[_i];
                        consoleBanWalker.addBannedFunction(["console", option]);
                    }
                    return this.applyWithWalker(consoleBanWalker);
                };
                return Rule;
            }(BanRule.Rule));
            Rule.metadata = {
                ruleName: "no-console",
                description: "Bans the use of specified `console` methods.",
                rationale: "In general, \`console\` methods aren't appropriate for production code.",
                optionsDescription: "A list of method names to ban.",
                options: {
                    type: "array",
                    items: { type: "string" },
                },
                optionExamples: ["[true, \"log\", \"error\"]"],
                type: "functionality",
                typescriptOnly: false,
            };
            exports_1("Rule", Rule);
        }
    };
});
