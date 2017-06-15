System.register(["./language/rule/abstractRule", "./language/utils"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, EnableDisableRulesWalker;
    return {
        setters: [
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            EnableDisableRulesWalker = (function () {
                function EnableDisableRulesWalker(sourceFile, rules) {
                    this.sourceFile = sourceFile;
                    this.enableDisableRuleMap = {};
                    this.enabledRules = [];
                    if (rules) {
                        for (var _i = 0, _a = Object.keys(rules); _i < _a.length; _i++) {
                            var rule = _a[_i];
                            if (abstractRule_1.AbstractRule.isRuleEnabled(rules[rule])) {
                                this.enabledRules.push(rule);
                                this.enableDisableRuleMap[rule] = [{
                                        isEnabled: true,
                                        position: 0,
                                    }];
                            }
                        }
                    }
                }
                EnableDisableRulesWalker.prototype.getEnableDisableRuleMap = function () {
                    var _this = this;
                    utils_1.forEachComment(this.sourceFile, function (fullText, kind, pos) {
                        var commentText = kind === ts.SyntaxKind.SingleLineCommentTrivia
                            ? fullText.substring(pos.tokenStart + 2, pos.end)
                            : fullText.substring(pos.tokenStart + 2, pos.end - 2);
                        return _this.handleComment(commentText, pos);
                    });
                    return this.enableDisableRuleMap;
                };
                EnableDisableRulesWalker.prototype.getStartOfLinePosition = function (position, lineOffset) {
                    if (lineOffset === void 0) { lineOffset = 0; }
                    var line = ts.getLineAndCharacterOfPosition(this.sourceFile, position).line + lineOffset;
                    var lineStarts = this.sourceFile.getLineStarts();
                    if (line >= lineStarts.length) {
                        return undefined;
                    }
                    return lineStarts[line];
                };
                EnableDisableRulesWalker.prototype.switchRuleState = function (ruleName, isEnabled, start, end) {
                    var ruleStateMap = this.enableDisableRuleMap[ruleName];
                    if (ruleStateMap === undefined ||
                        isEnabled === ruleStateMap[ruleStateMap.length - 1].isEnabled) {
                        return;
                    }
                    ruleStateMap.push({
                        isEnabled: isEnabled,
                        position: start,
                    });
                    if (end) {
                        ruleStateMap.push({
                            isEnabled: !isEnabled,
                            position: end,
                        });
                    }
                };
                EnableDisableRulesWalker.prototype.handleComment = function (commentText, pos) {
                    var match = /^\s*tslint:(enable|disable)(?:-(line|next-line))?(:|\s|$)/.exec(commentText);
                    if (match !== null) {
                        var rulesList = commentText.substr(match[0].length)
                            .split(/\s+/)
                            .filter(function (rule) { return !!rule; });
                        if (rulesList.length === 0 && match[3] === ":") {
                            return;
                        }
                        if (rulesList.length === 0 ||
                            rulesList.indexOf("all") !== -1) {
                            rulesList = this.enabledRules;
                        }
                        this.handleTslintLineSwitch(rulesList, match[1] === "enable", match[2], pos);
                    }
                };
                EnableDisableRulesWalker.prototype.handleTslintLineSwitch = function (rules, isEnabled, modifier, pos) {
                    var start;
                    var end;
                    if (modifier === "line") {
                        start = this.getStartOfLinePosition(pos.tokenStart);
                        end = this.getStartOfLinePosition(pos.end, 1);
                    }
                    else if (modifier === "next-line") {
                        start = this.getStartOfLinePosition(pos.end, 1);
                        if (start === undefined) {
                            return;
                        }
                        end = this.getStartOfLinePosition(pos.end, 2);
                    }
                    else {
                        start = pos.tokenStart;
                        end = undefined;
                    }
                    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
                        var ruleToSwitch = rules_1[_i];
                        this.switchRuleState(ruleToSwitch, isEnabled, start, end);
                    }
                };
                return EnableDisableRulesWalker;
            }());
            exports_1("EnableDisableRulesWalker", EnableDisableRulesWalker);
        }
    };
});
