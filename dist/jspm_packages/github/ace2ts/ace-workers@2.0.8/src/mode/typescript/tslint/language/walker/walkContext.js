System.register(["../rule/rule"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var rule_1, WalkContext;
    return {
        setters: [
            function (rule_1_1) {
                rule_1 = rule_1_1;
            }
        ],
        execute: function () {
            WalkContext = (function () {
                function WalkContext(sourceFile, ruleName, options) {
                    this.sourceFile = sourceFile;
                    this.ruleName = ruleName;
                    this.options = options;
                    this.failures = [];
                }
                WalkContext.prototype.addFailureAt = function (start, width, failure, fix) {
                    this.addFailure(start, start + width, failure, fix);
                };
                WalkContext.prototype.addFailure = function (start, end, failure, fix) {
                    var fileLength = this.sourceFile.end;
                    this.failures.push(new rule_1.RuleFailure(this.sourceFile, Math.min(start, fileLength), Math.min(end, fileLength), failure, this.ruleName, fix));
                };
                WalkContext.prototype.addFailureAtNode = function (node, failure, fix) {
                    this.addFailure(node.getStart(this.sourceFile), node.getEnd(), failure, fix);
                };
                WalkContext.prototype.createFix = function () {
                    var replacements = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        replacements[_i] = arguments[_i];
                    }
                    return new rule_1.Fix(this.ruleName, replacements);
                };
                return WalkContext;
            }());
            exports_1("WalkContext", WalkContext);
        }
    };
});
