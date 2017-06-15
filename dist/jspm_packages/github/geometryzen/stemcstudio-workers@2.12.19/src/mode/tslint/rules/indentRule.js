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
    var abstractRule_1, utils_1, ruleWalker_1, OPTION_USE_TABS, OPTION_USE_SPACES, Rule, IndentWalker, _a, _b;
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
            OPTION_USE_TABS = "tabs";
            OPTION_USE_SPACES = "spaces";
            Rule = (function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new IndentWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "indent",
                    description: "Enforces indentation with tabs or spaces.",
                    rationale: (_a = ["\n            Using only one of tabs or spaces for indentation leads to more consistent editor behavior,\n            cleaner diffs in version control, and easier programmatic manipulation."], _a.raw = ["\n            Using only one of tabs or spaces for indentation leads to more consistent editor behavior,\n            cleaner diffs in version control, and easier programmatic manipulation."], utils_1.dedent(_a)),
                    optionsDescription: (_b = ["\n            One of the following arguments must be provided:\n\n            * `\"spaces\"` enforces consistent spaces.\n            * `\"tabs\"` enforces consistent tabs."], _b.raw = ["\n            One of the following arguments must be provided:\n\n            * \\`\"spaces\"\\` enforces consistent spaces.\n            * \\`\"tabs\"\\` enforces consistent tabs."], utils_1.dedent(_b)),
                    options: {
                        type: "string",
                        enum: ["tabs", "spaces"],
                    },
                    optionExamples: ['[true, "spaces"]'],
                    type: "maintainability",
                    typescriptOnly: false,
                };
                Rule.FAILURE_STRING_TABS = "tab indentation expected";
                Rule.FAILURE_STRING_SPACES = "space indentation expected";
                return Rule;
            }(abstractRule_1.AbstractRule));
            exports_1("Rule", Rule);
            IndentWalker = (function (_super) {
                __extends(IndentWalker, _super);
                function IndentWalker(sourceFile, options) {
                    var _this = _super.call(this, sourceFile, options) || this;
                    if (_this.hasOption(OPTION_USE_TABS)) {
                        _this.regExp = new RegExp(" ");
                        _this.failureString = Rule.FAILURE_STRING_TABS;
                    }
                    else if (_this.hasOption(OPTION_USE_SPACES)) {
                        _this.regExp = new RegExp("\t");
                        _this.failureString = Rule.FAILURE_STRING_SPACES;
                    }
                    return _this;
                }
                IndentWalker.prototype.visitSourceFile = function (node) {
                    if (!this.hasOption(OPTION_USE_TABS) && !this.hasOption(OPTION_USE_SPACES)) {
                        return;
                    }
                    var endOfComment = -1;
                    var endOfTemplateString = -1;
                    var scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, node.text);
                    for (var _i = 0, _a = node.getLineStarts(); _i < _a.length; _i++) {
                        var lineStart = _a[_i];
                        if (lineStart < endOfComment || lineStart < endOfTemplateString) {
                            continue;
                        }
                        scanner.setTextPos(lineStart);
                        var currentScannedType = scanner.scan();
                        var fullLeadingWhitespace = "";
                        var lastStartPos = -1;
                        while (currentScannedType === ts.SyntaxKind.WhitespaceTrivia) {
                            var startPos = scanner.getStartPos();
                            if (startPos === lastStartPos) {
                                break;
                            }
                            lastStartPos = startPos;
                            fullLeadingWhitespace += scanner.getTokenText();
                            currentScannedType = scanner.scan();
                        }
                        var commentRanges = ts.getTrailingCommentRanges(node.text, lineStart);
                        if (commentRanges) {
                            endOfComment = commentRanges[commentRanges.length - 1].end;
                        }
                        else {
                            var scanType = currentScannedType;
                            while (scanType !== ts.SyntaxKind.NewLineTrivia && scanType !== ts.SyntaxKind.EndOfFileToken) {
                                if (scanType === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
                                    endOfTemplateString = scanner.getStartPos() + scanner.getTokenText().length;
                                }
                                else if (scanType === ts.SyntaxKind.TemplateHead) {
                                    while (scanType !== ts.SyntaxKind.TemplateTail && scanType !== ts.SyntaxKind.EndOfFileToken) {
                                        scanType = scanner.scan();
                                        if (scanType === ts.SyntaxKind.CloseBraceToken) {
                                            scanType = scanner.reScanTemplateToken();
                                        }
                                    }
                                    endOfTemplateString = scanner.getStartPos() + scanner.getTokenText().length;
                                }
                                scanType = scanner.scan();
                            }
                        }
                        if (currentScannedType === ts.SyntaxKind.SingleLineCommentTrivia
                            || currentScannedType === ts.SyntaxKind.MultiLineCommentTrivia
                            || currentScannedType === ts.SyntaxKind.NewLineTrivia) {
                            continue;
                        }
                        if (fullLeadingWhitespace.match(this.regExp)) {
                            this.addFailureAt(lineStart, fullLeadingWhitespace.length, this.failureString);
                        }
                    }
                };
                return IndentWalker;
            }(ruleWalker_1.RuleWalker));
        }
    };
});
