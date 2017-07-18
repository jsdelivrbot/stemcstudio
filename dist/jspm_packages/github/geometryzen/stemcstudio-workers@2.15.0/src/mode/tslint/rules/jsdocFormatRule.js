System.register(["../language/rule/abstractRule", "../language/utils", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
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
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, Rule, JsdocWalker, _a;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (utils_2_1) {
                utils_2 = utils_2_1;
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
                    return this.applyWithWalker(new JsdocWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "jsdoc-format",
                    description: "Enforces basic format rules for JSDoc comments.",
                    descriptionDetails: (_a = ["\n            The following rules are enforced for JSDoc comments (comments starting with `/**`):\n\n            * each line contains an asterisk and asterisks must be aligned\n            * each asterisk must be followed by either a space or a newline (except for the first and the last)\n            * the only characters before the asterisk on each line must be whitespace characters\n            * one line comments must start with `/** ` and end with `*/`"], _a.raw = ["\n            The following rules are enforced for JSDoc comments (comments starting with \\`/**\\`):\n\n            * each line contains an asterisk and asterisks must be aligned\n            * each asterisk must be followed by either a space or a newline (except for the first and the last)\n            * the only characters before the asterisk on each line must be whitespace characters\n            * one line comments must start with \\`/** \\` and end with \\`*/\\`"], utils_2.dedent(_a)),
                    rationale: "Helps maintain a consistent, readable style for JSDoc comments.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "style",
                    typescriptOnly: false,
                };
                Rule.ALIGNMENT_FAILURE_STRING = "asterisks in jsdoc must be aligned";
                Rule.FORMAT_FAILURE_STRING = "jsdoc is not formatted correctly on this line";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            JsdocWalker = (function (_super) {
                __extends(JsdocWalker, _super);
                function JsdocWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                JsdocWalker.prototype.visitSourceFile = function (node) {
                    var _this = this;
                    utils_1.forEachComment(node, function (fullText, kind, pos) {
                        if (kind === ts.SyntaxKind.MultiLineCommentTrivia) {
                            _this.findFailuresForJsdocComment(fullText.substring(pos.tokenStart, pos.end), pos.tokenStart);
                        }
                    });
                };
                JsdocWalker.prototype.findFailuresForJsdocComment = function (commentText, startingPosition) {
                    var currentPosition = startingPosition;
                    var lines = commentText.split(/\r?\n/);
                    var firstLine = lines[0];
                    var jsdocPosition = currentPosition;
                    var isJsdocMatch = firstLine.match(/^\s*\/\*\*([^*]|$)/);
                    if (isJsdocMatch != null) {
                        if (lines.length === 1) {
                            var firstLineMatch = firstLine.match(/^\s*\/\*\* (.* )?\*\/$/);
                            if (firstLineMatch == null) {
                                this.addFailureAt(jsdocPosition, firstLine.length, Rule.FORMAT_FAILURE_STRING);
                            }
                            return;
                        }
                        var indexToMatch = firstLine.indexOf("**") + this.getLineAndCharacterOfPosition(currentPosition).character;
                        var otherLines = lines.splice(1, lines.length - 2);
                        jsdocPosition += firstLine.length + 1;
                        for (var _i = 0, otherLines_1 = otherLines; _i < otherLines_1.length; _i++) {
                            var line = otherLines_1[_i];
                            var asteriskMatch = line.match(/^\s*\*( |$)/);
                            if (asteriskMatch == null) {
                                this.addFailureAt(jsdocPosition, line.length, Rule.FORMAT_FAILURE_STRING);
                            }
                            var asteriskIndex = line.indexOf("*");
                            if (asteriskIndex !== indexToMatch) {
                                this.addFailureAt(jsdocPosition, line.length, Rule.ALIGNMENT_FAILURE_STRING);
                            }
                            jsdocPosition += line.length + 1;
                        }
                        var lastLine = lines[lines.length - 1];
                        var endBlockCommentMatch = lastLine.match(/^\s*\*\/$/);
                        if (endBlockCommentMatch == null) {
                            this.addFailureAt(jsdocPosition, lastLine.length, Rule.FORMAT_FAILURE_STRING);
                        }
                        var lastAsteriskIndex = lastLine.indexOf("*");
                        if (lastAsteriskIndex !== indexToMatch) {
                            this.addFailureAt(jsdocPosition, lastLine.length, Rule.ALIGNMENT_FAILURE_STRING);
                        }
                    }
                };
                return JsdocWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
