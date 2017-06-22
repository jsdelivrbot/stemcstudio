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
    var abstractRule_1, utils_1, ruleWalker_1, OPTION_ALWAYS, OPTION_NEVER, Rule, NameWalker, _a;
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
            OPTION_ALWAYS = "always-prefix";
            OPTION_NEVER = "never-prefix";
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NameWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "interface-name",
                    description: "Requires interface names to begin with a capital 'I'",
                    rationale: "Makes it easy to differentiate interfaces from regular classes at a glance.",
                    optionsDescription: (_a = ["\n            One of the following two options must be provided:\n\n            * `\"", "\"` requires interface names to start with an \"I\"\n            * `\"", "\"` requires interface names to not have an \"I\" prefix"], _a.raw = ["\n            One of the following two options must be provided:\n\n            * \\`\"", "\"\\` requires interface names to start with an \"I\"\n            * \\`\"", "\"\\` requires interface names to not have an \"I\" prefix"], utils_1.dedent(_a, OPTION_ALWAYS, OPTION_NEVER)),
                    options: {
                        type: "string",
                        enum: [OPTION_ALWAYS, OPTION_NEVER],
                    },
                    optionExamples: ["[true, \"" + OPTION_ALWAYS + "\"]", "[true, \"" + OPTION_NEVER + "\"]"],
                    type: "style",
                    typescriptOnly: true,
                };
                Rule.FAILURE_STRING = "interface name must start with a capitalized I";
                Rule.FAILURE_STRING_NO_PREFIX = "interface name must not have an \"I\" prefix";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            NameWalker = (function (_super) {
                __extends(NameWalker, _super);
                function NameWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NameWalker.prototype.visitInterfaceDeclaration = function (node) {
                    var interfaceName = node.name.text;
                    var always = this.hasOption(OPTION_ALWAYS) || (this.getOptions() && this.getOptions().length === 0);
                    if (always) {
                        if (!this.startsWithI(interfaceName)) {
                            this.addFailureAtNode(node.name, Rule.FAILURE_STRING);
                        }
                    }
                    else if (this.hasOption(OPTION_NEVER)) {
                        if (this.hasPrefixI(interfaceName)) {
                            this.addFailureAtNode(node.name, Rule.FAILURE_STRING_NO_PREFIX);
                        }
                    }
                    _super.prototype.visitInterfaceDeclaration.call(this, node);
                };
                NameWalker.prototype.startsWithI = function (name) {
                    if (name.length <= 0) {
                        return true;
                    }
                    var firstCharacter = name.charAt(0);
                    return (firstCharacter === "I");
                };
                NameWalker.prototype.hasPrefixI = function (name) {
                    if (name.length <= 0) {
                        return true;
                    }
                    var firstCharacter = name.charAt(0);
                    if (firstCharacter !== "I") {
                        return false;
                    }
                    var secondCharacter = name.charAt(1);
                    if (secondCharacter === "") {
                        return false;
                    }
                    else if (secondCharacter !== secondCharacter.toUpperCase()) {
                        return false;
                    }
                    if (name.indexOf("IDB") === 0) {
                        return false;
                    }
                    return true;
                };
                return NameWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
