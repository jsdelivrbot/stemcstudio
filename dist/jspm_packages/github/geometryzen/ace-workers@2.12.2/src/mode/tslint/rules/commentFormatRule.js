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
    function startsWith(commentText, changeCase) {
        if (commentText.length <= 2) {
            return true;
        }
        var firstCharacterMatch = commentText.match(/^\/\/\s*(\w)/);
        if (firstCharacterMatch != null) {
            var firstCharacter = firstCharacterMatch[1];
            return firstCharacter === changeCase(firstCharacter);
        }
        else {
            return true;
        }
    }
    function startsWithLowercase(commentText) {
        return startsWith(commentText, function (c) { return c.toLowerCase(); });
    }
    function startsWithUppercase(commentText) {
        return startsWith(commentText, function (c) { return c.toUpperCase(); });
    }
    function startsWithSpace(commentText) {
        if (commentText.length <= 2) {
            return true;
        }
        var commentBody = commentText.substring(2);
        if ((/^#(end)?region/).test(commentBody)) {
            return true;
        }
        if ((/^noinspection\s/).test(commentBody)) {
            return true;
        }
        var firstCharacter = commentBody.charAt(0);
        return firstCharacter === " " || firstCharacter === "/";
    }
    function isEnableDisableFlag(commentText) {
        return /^(\/\*|\/\/)\s*tslint:(enable|disable)/.test(commentText);
    }
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, utils_3, OPTION_SPACE, OPTION_LOWERCASE, OPTION_UPPERCASE, Rule, CommentWalker, _a;
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
                utils_3 = utils_2_1;
            },
            function (ruleWalker_1_1) {
                ruleWalker_1 = ruleWalker_1_1;
            }
        ],
        execute: function () {
            OPTION_SPACE = "check-space";
            OPTION_LOWERCASE = "check-lowercase";
            OPTION_UPPERCASE = "check-uppercase";
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new CommentWalker(sourceFile, this.getOptions()));
                };
                return Rule;
            }(abstractRule_1.AbstractRule));
            Rule.metadata = {
                ruleName: "comment-format",
                description: "Enforces formatting rules for single-line comments.",
                rationale: "Helps maintain a consistent, readable style in your codebase.",
                optionsDescription: (_a = ["\n            Three arguments may be optionally provided:\n\n            * `\"check-space\"` requires that all single-line comments must begin with a space, as in `// comment`\n                * note that comments starting with `///` are also allowed, for things such as `///<reference>`\n            * `\"check-lowercase\"` requires that the first non-whitespace character of a comment must be lowercase, if applicable.\n            * `\"check-uppercase\"` requires that the first non-whitespace character of a comment must be uppercase, if applicable.\n            \n            Exceptions to `\"check-lowercase\"` or `\"check-uppercase\"` can be managed with object that may be passed as last argument.\n            \n            One of two options can be provided in this object:\n                \n                * `\"ignore-words\"`  - array of strings - words that will be ignored at the beginning of the comment.\n                * `\"ignore-pattern\"` - string - RegExp pattern that will be ignored at the beginning of the comment.\n            "], _a.raw = ["\n            Three arguments may be optionally provided:\n\n            * \\`\"check-space\"\\` requires that all single-line comments must begin with a space, as in \\`// comment\\`\n                * note that comments starting with \\`///\\` are also allowed, for things such as \\`///<reference>\\`\n            * \\`\"check-lowercase\"\\` requires that the first non-whitespace character of a comment must be lowercase, if applicable.\n            * \\`\"check-uppercase\"\\` requires that the first non-whitespace character of a comment must be uppercase, if applicable.\n            \n            Exceptions to \\`\"check-lowercase\"\\` or \\`\"check-uppercase\"\\` can be managed with object that may be passed as last argument.\n            \n            One of two options can be provided in this object:\n                \n                * \\`\"ignore-words\"\\`  - array of strings - words that will be ignored at the beginning of the comment.\n                * \\`\"ignore-pattern\"\\` - string - RegExp pattern that will be ignored at the beginning of the comment.\n            "], utils_2.dedent(_a)),
                options: {
                    type: "array",
                    items: {
                        anyOf: [
                            {
                                type: "string",
                                enum: [
                                    "check-space",
                                    "check-lowercase",
                                    "check-uppercase",
                                ],
                            },
                            {
                                type: "object",
                                properties: {
                                    "ignore-words": {
                                        type: "array",
                                        items: {
                                            type: "string",
                                        },
                                    },
                                    "ignore-pattern": {
                                        type: "string",
                                    },
                                },
                                minProperties: 1,
                                maxProperties: 1,
                            },
                        ],
                    },
                    minLength: 1,
                    maxLength: 4,
                },
                optionExamples: [
                    '[true, "check-space", "check-uppercase"]',
                    '[true, "check-lowercase", {"ignore-words": ["TODO", "HACK"]}]',
                    '[true, "check-lowercase", {"ignore-pattern": "STD\\w{2,3}\\b"}]',
                ],
                type: "style",
                typescriptOnly: false,
            };
            Rule.LOWERCASE_FAILURE = "comment must start with lowercase letter";
            Rule.UPPERCASE_FAILURE = "comment must start with uppercase letter";
            Rule.LEADING_SPACE_FAILURE = "comment must start with a space";
            Rule.IGNORE_WORDS_FAILURE_FACTORY = function (words) { return " or the word(s): " + words.join(", "); };
            Rule.IGNORE_PATTERN_FAILURE_FACTORY = function (pattern) { return " or its start must match the regex pattern \"" + pattern + "\""; };
            exports_1("Rule", Rule);
            CommentWalker = (function (_super) {
                __extends(CommentWalker, _super);
                function CommentWalker(sourceFile, options) {
                    var _this = _super.call(this, sourceFile, options) || this;
                    _this.failureIgnorePart = "";
                    _this.exceptionsRegExp = _this.composeExceptionsRegExp();
                    return _this;
                }
                CommentWalker.prototype.visitSourceFile = function (node) {
                    var _this = this;
                    utils_1.forEachComment(node, function (fullText, kind, pos) {
                        if (kind === ts.SyntaxKind.SingleLineCommentTrivia) {
                            var commentText = fullText.substring(pos.tokenStart, pos.end);
                            var startPosition = pos.tokenStart + 2;
                            var width = commentText.length - 2;
                            if (_this.hasOption(OPTION_SPACE)) {
                                if (!startsWithSpace(commentText)) {
                                    _this.addFailureAt(startPosition, width, Rule.LEADING_SPACE_FAILURE);
                                }
                            }
                            if (_this.hasOption(OPTION_LOWERCASE)) {
                                if (!startsWithLowercase(commentText) && !_this.startsWithException(commentText)) {
                                    _this.addFailureAt(startPosition, width, Rule.LOWERCASE_FAILURE + _this.failureIgnorePart);
                                }
                            }
                            if (_this.hasOption(OPTION_UPPERCASE)) {
                                if (!startsWithUppercase(commentText) && !isEnableDisableFlag(commentText) && !_this.startsWithException(commentText)) {
                                    _this.addFailureAt(startPosition, width, Rule.UPPERCASE_FAILURE + _this.failureIgnorePart);
                                }
                            }
                        }
                    });
                };
                CommentWalker.prototype.startsWithException = function (commentText) {
                    if (this.exceptionsRegExp == null) {
                        return false;
                    }
                    return this.exceptionsRegExp.test(commentText);
                };
                CommentWalker.prototype.composeExceptionsRegExp = function () {
                    var optionsList = this.getOptions();
                    var exceptionsObject = optionsList[optionsList.length - 1];
                    if (typeof exceptionsObject === "string" || !exceptionsObject) {
                        return null;
                    }
                    if (exceptionsObject["ignore-pattern"]) {
                        var ignorePattern = exceptionsObject["ignore-pattern"];
                        this.failureIgnorePart = Rule.IGNORE_PATTERN_FAILURE_FACTORY(ignorePattern);
                        return new RegExp("^//\\s*(" + ignorePattern + ")");
                    }
                    if (exceptionsObject["ignore-words"]) {
                        var ignoreWords = exceptionsObject["ignore-words"];
                        this.failureIgnorePart = Rule.IGNORE_WORDS_FAILURE_FACTORY(ignoreWords);
                        var wordsPattern = ignoreWords
                            .map(String)
                            .map(function (str) { return str.trim(); })
                            .map(utils_3.escapeRegExp)
                            .join("|");
                        return new RegExp("^//\\s*(" + wordsPattern + ")\\b");
                    }
                    return null;
                };
                return CommentWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
