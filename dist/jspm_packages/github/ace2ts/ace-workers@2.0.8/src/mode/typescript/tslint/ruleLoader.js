System.register(["./error", "./language/rule/abstractRule", "./utils", "./rules/commentFormatRule", "./rules/eoflineRule", "./rules/jsdocFormatRule", "./rules/noVarKeywordRule", "./rules/semicolonRule", "./rules/tripleEqualsRule"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function loadRules(ruleConfiguration, enableDisableRuleMap, rulesDirectories, isJs) {
        var rules = [];
        var notFoundRules = [];
        var notAllowedInJsRules = [];
        for (var ruleName in ruleConfiguration) {
            if (ruleConfiguration.hasOwnProperty(ruleName)) {
                var ruleValue = ruleConfiguration[ruleName];
                if (abstractRule_1.AbstractRule.isRuleEnabled(ruleValue) || enableDisableRuleMap.hasOwnProperty(ruleName)) {
                    var Rule = findRule(ruleName, rulesDirectories);
                    if (Rule == null) {
                        notFoundRules.push(ruleName);
                    }
                    else {
                        if (isJs && Rule.metadata && Rule.metadata.typescriptOnly != null && Rule.metadata.typescriptOnly) {
                            notAllowedInJsRules.push(ruleName);
                        }
                        else {
                            var ruleSpecificList = (ruleName in enableDisableRuleMap ? enableDisableRuleMap[ruleName] : []);
                            var disabledIntervals = buildDisabledIntervalsFromSwitches(ruleSpecificList);
                            rules.push(new Rule(ruleName, ruleValue, disabledIntervals));
                            if (Rule.metadata && Rule.metadata.deprecationMessage) {
                                error_1.showWarningOnce(Rule.metadata.ruleName + " is deprecated. " + Rule.metadata.deprecationMessage);
                            }
                        }
                    }
                }
            }
        }
        if (notFoundRules.length > 0) {
            var warning = (_a = ["\n            Could not find implementations for the following rules specified in the configuration:\n                ", "\n            Try upgrading TSLint and/or ensuring that you have all necessary custom rules installed.\n            If TSLint was recently upgraded, you may have old rules configured which need to be cleaned up.\n        "], _a.raw = ["\n            Could not find implementations for the following rules specified in the configuration:\n                ", "\n            Try upgrading TSLint and/or ensuring that you have all necessary custom rules installed.\n            If TSLint was recently upgraded, you may have old rules configured which need to be cleaned up.\n        "], utils_1.dedent(_a, notFoundRules.join("\n                ")));
            console.warn(warning);
        }
        if (notAllowedInJsRules.length > 0) {
            var warning = (_b = ["\n            Following rules specified in configuration couldn't be applied to .js or .jsx files:\n                ", "\n            Make sure to exclude them from \"jsRules\" section of your tslint.json.\n        "], _b.raw = ["\n            Following rules specified in configuration couldn't be applied to .js or .jsx files:\n                ", "\n            Make sure to exclude them from \"jsRules\" section of your tslint.json.\n        "], utils_1.dedent(_b, notAllowedInJsRules.join("\n                ")));
            console.warn(warning);
        }
        if (rules.length === 0) {
        }
        return rules;
        var _a, _b;
    }
    exports_1("loadRules", loadRules);
    function findRule(name, rulesDirectories) {
        var camelizedName = transformName(name);
        var Rule;
        Rule = loadCachedRule(CORE_RULES_DIRECTORY, camelizedName);
        if (Rule) {
            return Rule;
        }
        else {
            throw new Error("rule " + name + " not found");
        }
    }
    exports_1("findRule", findRule);
    function transformName(name) {
        var nameMatch = name.match(/^([-_]*)(.*?)([-_]*)$/);
        if (nameMatch == null) {
            return name + "Rule";
        }
        return nameMatch[1] + utils_1.camelize(nameMatch[2]) + nameMatch[3] + "Rule";
    }
    function loadRule(directory, ruleName) {
        directory = directory;
        ruleName = ruleName;
        switch (ruleName) {
            case 'commentFormatRule': return commentFormatRule_1.Rule;
            case 'eoflineRule': return eoflineRule_1.Rule;
            case 'jsdocFormatRule': return jsdocFormatRule_1.Rule;
            case 'noVarKeywordRule': return noVarKeywordRule_1.Rule;
            case 'semicolonRule': return semicolonRule_1.Rule;
            case 'tripleEqualsRule': return tripleEqualsRule_1.Rule;
            default: return null;
        }
    }
    function loadCachedRule(directory, ruleName) {
        var fullPath = directory + "/" + ruleName;
        var cachedRule = cachedRules.get(fullPath);
        if (cachedRule !== undefined) {
            return cachedRule;
        }
        var absolutePath = directory;
        var Rule = null;
        if (absolutePath != null) {
            Rule = loadRule(absolutePath, ruleName);
        }
        cachedRules.set(fullPath, Rule);
        return Rule;
    }
    function buildDisabledIntervalsFromSwitches(ruleSpecificList) {
        var disabledIntervalList = [];
        var i = 1;
        while (i < ruleSpecificList.length) {
            var startPosition = ruleSpecificList[i].position;
            var endPosition = ruleSpecificList[i + 1] ? ruleSpecificList[i + 1].position : Infinity;
            disabledIntervalList.push({
                endPosition: endPosition,
                startPosition: startPosition,
            });
            i += 2;
        }
        return disabledIntervalList;
    }
    var error_1, abstractRule_1, utils_1, commentFormatRule_1, eoflineRule_1, jsdocFormatRule_1, noVarKeywordRule_1, semicolonRule_1, tripleEqualsRule_1, CORE_RULES_DIRECTORY, cachedRules;
    return {
        setters: [
            function (error_1_1) {
                error_1 = error_1_1;
            },
            function (abstractRule_1_1) {
                abstractRule_1 = abstractRule_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (commentFormatRule_1_1) {
                commentFormatRule_1 = commentFormatRule_1_1;
            },
            function (eoflineRule_1_1) {
                eoflineRule_1 = eoflineRule_1_1;
            },
            function (jsdocFormatRule_1_1) {
                jsdocFormatRule_1 = jsdocFormatRule_1_1;
            },
            function (noVarKeywordRule_1_1) {
                noVarKeywordRule_1 = noVarKeywordRule_1_1;
            },
            function (semicolonRule_1_1) {
                semicolonRule_1 = semicolonRule_1_1;
            },
            function (tripleEqualsRule_1_1) {
                tripleEqualsRule_1 = tripleEqualsRule_1_1;
            }
        ],
        execute: function () {
            CORE_RULES_DIRECTORY = 'rules';
            cachedRules = new Map();
        }
    };
});
