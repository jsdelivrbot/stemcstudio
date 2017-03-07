System.register(["../language/rule/abstractRule", "../language/rule/rule", "../language/utils", "../utils"], function (exports_1, context_1) {
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
    function walk(ctx) {
        var lastSeenWasWhitespace = false;
        var lastSeenWhitespacePosition = 0;
        utils_1.forEachToken(ctx.sourceFile, false, function (fullText, kind, pos) {
            if (kind === ts.SyntaxKind.NewLineTrivia || kind === ts.SyntaxKind.EndOfFileToken) {
                if (lastSeenWasWhitespace) {
                    reportFailure(ctx, lastSeenWhitespacePosition, pos.tokenStart);
                }
                lastSeenWasWhitespace = false;
            }
            else if (kind === ts.SyntaxKind.WhitespaceTrivia) {
                lastSeenWasWhitespace = true;
                lastSeenWhitespacePosition = pos.tokenStart;
            }
            else {
                if (ctx.options !== 1) {
                    if (kind === ts.SyntaxKind.SingleLineCommentTrivia) {
                        var commentText = fullText.substring(pos.tokenStart + 2, pos.end);
                        var match = /\s+$/.exec(commentText);
                        if (match !== null) {
                            reportFailure(ctx, pos.end - match[0].length, pos.end);
                        }
                    }
                    else if (kind === ts.SyntaxKind.MultiLineCommentTrivia &&
                        (ctx.options !== 2 ||
                            fullText[pos.tokenStart + 2] !== "*" ||
                            fullText[pos.tokenStart + 3] === "*")) {
                        var startPos = pos.tokenStart + 2;
                        var commentText = fullText.substring(startPos, pos.end - 2);
                        var lines = commentText.split("\n");
                        var len = lines.length - 1;
                        for (var i = 0; i < len; ++i) {
                            var line = lines[i];
                            if (line.endsWith("\r")) {
                                line = line.substr(0, line.length - 1);
                            }
                            var start = line.search(/\s+$/);
                            if (start !== -1) {
                                reportFailure(ctx, startPos + start, startPos + line.length);
                            }
                            startPos += lines[i].length + 1;
                        }
                    }
                }
                lastSeenWasWhitespace = false;
            }
        });
    }
    function reportFailure(ctx, start, end) {
        ctx.addFailure(start, end, Rule.FAILURE_STRING, ctx.createFix(rule_1.Replacement.deleteFromTo(start, end)));
    }
    var abstractRule_1, rule_1, utils_1, utils_2, OPTION_IGNORE_COMMENTS, OPTION_IGNORE_JSDOC, Rule, _a;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
            },
            function (rule_1_1) {
                rule_1 = rule_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (utils_2_1) {
                utils_2 = utils_2_1;
            }
        ],
        execute: function () {
            OPTION_IGNORE_COMMENTS = "ignore-comments";
            OPTION_IGNORE_JSDOC = "ignore-jsdoc";
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var option = 0;
                    if (this.ruleArguments.indexOf(OPTION_IGNORE_COMMENTS) !== -1) {
                        option = 1;
                    }
                    else if (this.ruleArguments.indexOf(OPTION_IGNORE_JSDOC) !== -1) {
                        option = 2;
                    }
                    return this.applyWithFunction(sourceFile, walk, option);
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            Rule.metadata = {
                ruleName: "no-trailing-whitespace",
                description: "Disallows trailing whitespace at the end of a line.",
                rationale: "Keeps version control diffs clean as it prevents accidental whitespace from being committed.",
                optionsDescription: (_a = ["\n            Possible settings are:\n\n            * `\"", "\"`: Allows trailing whitespace in comments.\n            * `\"", "\"`: Allows trailing whitespace only in JSDoc comments."], _a.raw = ["\n            Possible settings are:\n\n            * \\`\"", "\"\\`: Allows trailing whitespace in comments.\n            * \\`\"", "\"\\`: Allows trailing whitespace only in JSDoc comments."], utils_2.dedent(_a, OPTION_IGNORE_COMMENTS, OPTION_IGNORE_JSDOC)),
                hasFix: true,
                options: {
                    type: "array",
                    items: {
                        type: "string",
                        enum: [OPTION_IGNORE_COMMENTS, OPTION_IGNORE_JSDOC],
                    },
                },
                optionExamples: [
                    "true",
                    "[true, \"" + OPTION_IGNORE_COMMENTS + "\"]",
                    "[true, \"" + OPTION_IGNORE_JSDOC + "\"]",
                ],
                type: "style",
                typescriptOnly: false,
            };
            Rule.FAILURE_STRING = "trailing whitespace";
            exports_1("Rule", Rule);
        }
    };
});
