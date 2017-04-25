System.register(["../utils", "../walker/walkContext"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1, walkContext_1, AbstractRule;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (walkContext_1_1) {
                walkContext_1 = walkContext_1_1;
            }
        ],
        execute: function () {
            AbstractRule = (function () {
                function AbstractRule(ruleName, value, disabledIntervals) {
                    this.ruleName = ruleName;
                    this.value = value;
                    this.disabledIntervals = disabledIntervals;
                    if (Array.isArray(value) && value.length > 1) {
                        this.ruleArguments = value.slice(1);
                    }
                    else {
                        this.ruleArguments = [];
                    }
                }
                AbstractRule.isRuleEnabled = function (ruleConfigValue) {
                    if (typeof ruleConfigValue === "boolean") {
                        return ruleConfigValue;
                    }
                    if (Array.isArray(ruleConfigValue) && ruleConfigValue.length > 0) {
                        var enabled = ruleConfigValue[0];
                        if (typeof enabled === 'boolean') {
                            return enabled;
                        }
                        else {
                            throw new Error("ruleConfigValue[0] must be a boolean");
                        }
                    }
                    return false;
                };
                AbstractRule.prototype.getOptions = function () {
                    return {
                        disabledIntervals: this.disabledIntervals,
                        ruleArguments: this.ruleArguments,
                        ruleName: this.ruleName,
                    };
                };
                AbstractRule.prototype.applyWithWalker = function (walker) {
                    walker.walk(walker.getSourceFile());
                    return this.filterFailures(walker.getFailures());
                };
                AbstractRule.prototype.isEnabled = function () {
                    return AbstractRule.isRuleEnabled(this.value);
                };
                AbstractRule.prototype.applyWithFunction = function (sourceFile, walkFn, options) {
                    var ctx = new walkContext_1.WalkContext(sourceFile, this.ruleName, options);
                    walkFn(ctx);
                    return this.filterFailures(ctx.failures);
                };
                AbstractRule.prototype.filterFailures = function (failures) {
                    var result = [];
                    var _loop_1 = function (failure) {
                        if (!utils_1.doesIntersect(failure, this_1.disabledIntervals) && !result.some(function (f) { return f.equals(failure); })) {
                            result.push(failure);
                        }
                    };
                    var this_1 = this;
                    for (var _i = 0, failures_1 = failures; _i < failures_1.length; _i++) {
                        var failure = failures_1[_i];
                        _loop_1(failure);
                    }
                    return result;
                };
                return AbstractRule;
            }());
            exports_1("AbstractRule", AbstractRule);
        }
    };
});
