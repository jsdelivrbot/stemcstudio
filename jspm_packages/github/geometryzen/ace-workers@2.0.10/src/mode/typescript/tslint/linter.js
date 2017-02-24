System.register(["./enableDisableRules", "./error", "./language/languageServiceHost", "./language/rule/typedRule", "./ruleLoader", "./utils"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var enableDisableRules_1, error_1, languageServiceHost_1, typedRule_1, ruleLoader_1, utils_1, Linter;
    return {
        setters: [
            function (enableDisableRules_1_1) {
                enableDisableRules_1 = enableDisableRules_1_1;
            },
            function (error_1_1) {
                error_1 = error_1_1;
            },
            function (languageServiceHost_1_1) {
                languageServiceHost_1 = languageServiceHost_1_1;
            },
            function (typedRule_1_1) {
                typedRule_1 = typedRule_1_1;
            },
            function (ruleLoader_1_1) {
                ruleLoader_1 = ruleLoader_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            Linter = (function () {
                function Linter(options, program) {
                    this.program = program;
                    this.failures = [];
                    this.fixes = [];
                    if (typeof options !== "object") {
                        throw new Error("Unknown Linter options type: " + typeof options);
                    }
                    if (options.configuration != null) {
                        throw new Error("ILinterOptions does not contain the property `configuration` as of version 4. " +
                            "Did you mean to pass the `IConfigurationFile` object to lint() ? ");
                    }
                    if (program) {
                        this.languageService = languageServiceHost_1.wrapProgram(program);
                    }
                }
                Linter.getFileNames = function (program) {
                    return program.getSourceFiles().map(function (s) { return s.fileName; }).filter(function (l) { return l.substr(-5) !== ".d.ts"; });
                };
                Linter.prototype.lint = function (fileName, configuration) {
                    var sourceFile = this.getSourceFile(fileName);
                    var isJs = /\.jsx?$/i.test(fileName);
                    var enabledRules = this.getEnabledRules(sourceFile, configuration, isJs);
                    var hasLinterRun = false;
                    var fileFailures = [];
                    if (!hasLinterRun || this.fixes.length > 0) {
                        fileFailures = [];
                        for (var _i = 0, enabledRules_1 = enabledRules; _i < enabledRules_1.length; _i++) {
                            var rule = enabledRules_1[_i];
                            var ruleFailures = this.applyRule(rule, sourceFile);
                            if (ruleFailures.length > 0) {
                                fileFailures = fileFailures.concat(ruleFailures);
                            }
                        }
                    }
                    this.failures = this.failures.concat(fileFailures);
                };
                Linter.prototype.getRuleFailures = function () {
                    return this.failures;
                };
                Linter.prototype.applyRule = function (rule, sourceFile) {
                    var ruleFailures = [];
                    try {
                        if (typedRule_1.TypedRule.isTypedRule(rule) && this.program) {
                            ruleFailures = rule.applyWithProgram(sourceFile, this.languageService);
                        }
                        else {
                            ruleFailures = rule.apply(sourceFile, this.languageService);
                        }
                    }
                    catch (error) {
                        if (error_1.isError(error)) {
                            error_1.showWarningOnce("Warning: " + error.message);
                        }
                        else {
                        }
                    }
                    var fileFailures = [];
                    for (var _i = 0, ruleFailures_1 = ruleFailures; _i < ruleFailures_1.length; _i++) {
                        var ruleFailure = ruleFailures_1[_i];
                        if (!this.containsRule(this.failures, ruleFailure)) {
                            fileFailures.push(ruleFailure);
                        }
                    }
                    return fileFailures;
                };
                Linter.prototype.getEnabledRules = function (sourceFile, configuration, isJs) {
                    var configurationRules = isJs ? configuration.jsRules : configuration.rules;
                    var enableDisableRuleMap = new enableDisableRules_1.EnableDisableRulesWalker(sourceFile, configurationRules).getEnableDisableRuleMap();
                    var configuredRules = configurationRules ? ruleLoader_1.loadRules(configurationRules, enableDisableRuleMap, isJs) : [];
                    return configuredRules.filter(function (r) { return r.isEnabled(); });
                };
                Linter.prototype.getSourceFile = function (fileName) {
                    var sourceFile = this.program.getSourceFile(fileName);
                    if (sourceFile && !("resolvedModules" in sourceFile)) {
                        throw new Error("Program must be type checked before linting");
                    }
                    if (sourceFile === undefined) {
                        var INVALID_SOURCE_ERROR = (_a = ["\n                Invalid source file: ", ". Ensure that the files supplied to lint have a .ts, .tsx, .js or .jsx extension.\n            "], _a.raw = ["\n                Invalid source file: ", ". Ensure that the files supplied to lint have a .ts, .tsx, .js or .jsx extension.\n            "], utils_1.dedent(_a, fileName));
                        throw new Error(INVALID_SOURCE_ERROR);
                    }
                    return sourceFile;
                    var _a;
                };
                Linter.prototype.containsRule = function (rules, rule) {
                    return rules.some(function (r) { return r.equals(rule); });
                };
                return Linter;
            }());
            exports_1("default", Linter);
        }
    };
});
