System.register(["../rule/rule", "./syntaxWalker"], function (exports_1, context_1) {
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
    var rule_1, syntaxWalker_1, RuleWalker;
    return {
        setters: [
            function (rule_1_1) {
                rule_1 = rule_1_1;
            },
            function (syntaxWalker_1_1) {
                syntaxWalker_1 = syntaxWalker_1_1;
            }
        ],
        execute: function () {
            RuleWalker = (function (_super) {
                __extends(RuleWalker, _super);
                function RuleWalker(sourceFile, options) {
                    var _this = _super.call(this) || this;
                    _this.sourceFile = sourceFile;
                    _this.failures = [];
                    _this.options = options.ruleArguments;
                    _this.limit = _this.sourceFile.getFullWidth();
                    _this.ruleName = options.ruleName;
                    return _this;
                }
                RuleWalker.prototype.getSourceFile = function () {
                    return this.sourceFile;
                };
                RuleWalker.prototype.getLineAndCharacterOfPosition = function (position) {
                    return this.sourceFile.getLineAndCharacterOfPosition(position);
                };
                RuleWalker.prototype.getFailures = function () {
                    return this.failures;
                };
                RuleWalker.prototype.getLimit = function () {
                    return this.limit;
                };
                RuleWalker.prototype.getOptions = function () {
                    return this.options;
                };
                RuleWalker.prototype.hasOption = function (option) {
                    if (this.options) {
                        return this.options.indexOf(option) !== -1;
                    }
                    else {
                        return false;
                    }
                };
                RuleWalker.prototype.skip = function (_node) {
                    return;
                };
                RuleWalker.prototype.createFailure = function (start, width, failure, fix) {
                    var from = (start > this.limit) ? this.limit : start;
                    var to = ((start + width) > this.limit) ? this.limit : (start + width);
                    return new rule_1.RuleFailure(this.sourceFile, from, to, failure, this.ruleName, fix);
                };
                RuleWalker.prototype.addFailure = function (failure) {
                    this.failures.push(failure);
                };
                RuleWalker.prototype.addFailureAt = function (start, width, failure, fix) {
                    this.addFailure(this.createFailure(start, width, failure, fix));
                };
                RuleWalker.prototype.addFailureFromStartToEnd = function (start, end, failure, fix) {
                    this.addFailureAt(start, end - start, failure, fix);
                };
                RuleWalker.prototype.addFailureAtNode = function (node, failure, fix) {
                    this.addFailureAt(node.getStart(this.sourceFile), node.getWidth(this.sourceFile), failure, fix);
                };
                RuleWalker.prototype.createReplacement = function (start, length, text) {
                    return new rule_1.Replacement(start, length, text);
                };
                RuleWalker.prototype.appendText = function (start, text) {
                    return this.createReplacement(start, 0, text);
                };
                RuleWalker.prototype.deleteText = function (start, length) {
                    return this.createReplacement(start, length, "");
                };
                RuleWalker.prototype.deleteFromTo = function (start, end) {
                    return this.createReplacement(start, end - start, "");
                };
                RuleWalker.prototype.getRuleName = function () {
                    return this.ruleName;
                };
                RuleWalker.prototype.createFix = function () {
                    var replacements = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        replacements[_i] = arguments[_i];
                    }
                    return new rule_1.Fix(this.ruleName, replacements);
                };
                return RuleWalker;
            }(syntaxWalker_1.SyntaxWalker));
            exports_1("RuleWalker", RuleWalker);
        }
    };
});
