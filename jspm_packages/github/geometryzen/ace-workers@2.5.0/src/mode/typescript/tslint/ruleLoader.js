System.register(["./error", "./language/rule/abstractRule", "./utils", "./rules/commentFormatRule", "./rules/curlyRule", "./rules/eoflineRule", "./rules/forinRule", "./rules/jsdocFormatRule", "./rules/noConditionalAssignmentRule", "./rules/noConstructRule", "./rules/noForInArrayRule", "./rules/noMagicNumbersRule", "./rules/noShadowedVariableRule", "./rules/noStringThrowRule", "./rules/noTrailingWhitespaceRule", "./rules/noVarKeywordRule", "./rules/oneVariablePerDeclarationRule", "./rules/preferForOfRule", "./rules/preferFunctionOverMethodRule", "./rules/preferConstRule", "./rules/radixRule", "./rules/semicolonRule", "./rules/trailingCommaRule", "./rules/tripleEqualsRule", "./rules/useIsnanRule"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function loadRules(ruleConfiguration, enableDisableRuleMap, isJs) {
        var rules = [];
        var notFoundRules = [];
        var notAllowedInJsRules = [];
        for (var ruleName in ruleConfiguration) {
            if (ruleConfiguration.hasOwnProperty(ruleName)) {
                var ruleValue = ruleConfiguration[ruleName];
                if (abstractRule_1.AbstractRule.isRuleEnabled(ruleValue) || enableDisableRuleMap.hasOwnProperty(ruleName)) {
                    var Rule = findRule(ruleName);
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
        return rules;
    }
    exports_1("loadRules", loadRules);
    function findRule(name) {
        var camelizedName = transformName(name);
        var Rule = loadCachedRule(camelizedName);
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
    function loadRule(ruleName) {
        switch (ruleName) {
            case 'curlyRule': return curlyRule_1.Rule;
            case 'commentFormatRule': return commentFormatRule_1.Rule;
            case 'eoflineRule': return eoflineRule_1.Rule;
            case 'forinRule': return forinRule_1.Rule;
            case 'jsdocFormatRule': return jsdocFormatRule_1.Rule;
            case 'noConditionalAssignmentRule': return noConditionalAssignmentRule_1.Rule;
            case 'noConstructRule': return noConstructRule_1.Rule;
            case 'noForInArrayRule': return noForInArrayRule_1.Rule;
            case 'noMagicNumbersRule': return noMagicNumbersRule_1.Rule;
            case 'noShadowedVariableRule': return noShadowedVariableRule_1.Rule;
            case 'noStringThrowRule': return noStringThrowRule_1.Rule;
            case 'noTrailingWhitespaceRule': return noTrailingWhitespaceRule_1.Rule;
            case 'noVarKeywordRule': return noVarKeywordRule_1.Rule;
            case 'oneVariablePerDeclarationRule': return oneVariablePerDeclarationRule_1.Rule;
            case 'preferConstRule': return preferConstRule_1.Rule;
            case 'preferForOfRule': return preferForOfRule_1.Rule;
            case 'preferFunctionOverMethodRule': return preferFunctionOverMethodRule_1.Rule;
            case 'radixRule': return radixRule_1.Rule;
            case 'semicolonRule': return semicolonRule_1.Rule;
            case 'trailingCommaRule': return trailingCommaRule_1.Rule;
            case 'tripleEqualsRule': return tripleEqualsRule_1.Rule;
            case 'useIsnanRule': return useIsnanRule_1.Rule;
            default: return null;
        }
    }
    function loadCachedRule(ruleName) {
        var cachedRule = cachedRules.get(ruleName);
        if (cachedRule !== undefined) {
            return cachedRule;
        }
        var Rule = loadRule(ruleName);
        cachedRules.set(ruleName, Rule);
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
    var error_1, abstractRule_1, utils_1, commentFormatRule_1, curlyRule_1, eoflineRule_1, forinRule_1, jsdocFormatRule_1, noConditionalAssignmentRule_1, noConstructRule_1, noForInArrayRule_1, noMagicNumbersRule_1, noShadowedVariableRule_1, noStringThrowRule_1, noTrailingWhitespaceRule_1, noVarKeywordRule_1, oneVariablePerDeclarationRule_1, preferForOfRule_1, preferFunctionOverMethodRule_1, preferConstRule_1, radixRule_1, semicolonRule_1, trailingCommaRule_1, tripleEqualsRule_1, useIsnanRule_1, cachedRules;
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
            function (curlyRule_1_1) {
                curlyRule_1 = curlyRule_1_1;
            },
            function (eoflineRule_1_1) {
                eoflineRule_1 = eoflineRule_1_1;
            },
            function (forinRule_1_1) {
                forinRule_1 = forinRule_1_1;
            },
            function (jsdocFormatRule_1_1) {
                jsdocFormatRule_1 = jsdocFormatRule_1_1;
            },
            function (noConditionalAssignmentRule_1_1) {
                noConditionalAssignmentRule_1 = noConditionalAssignmentRule_1_1;
            },
            function (noConstructRule_1_1) {
                noConstructRule_1 = noConstructRule_1_1;
            },
            function (noForInArrayRule_1_1) {
                noForInArrayRule_1 = noForInArrayRule_1_1;
            },
            function (noMagicNumbersRule_1_1) {
                noMagicNumbersRule_1 = noMagicNumbersRule_1_1;
            },
            function (noShadowedVariableRule_1_1) {
                noShadowedVariableRule_1 = noShadowedVariableRule_1_1;
            },
            function (noStringThrowRule_1_1) {
                noStringThrowRule_1 = noStringThrowRule_1_1;
            },
            function (noTrailingWhitespaceRule_1_1) {
                noTrailingWhitespaceRule_1 = noTrailingWhitespaceRule_1_1;
            },
            function (noVarKeywordRule_1_1) {
                noVarKeywordRule_1 = noVarKeywordRule_1_1;
            },
            function (oneVariablePerDeclarationRule_1_1) {
                oneVariablePerDeclarationRule_1 = oneVariablePerDeclarationRule_1_1;
            },
            function (preferForOfRule_1_1) {
                preferForOfRule_1 = preferForOfRule_1_1;
            },
            function (preferFunctionOverMethodRule_1_1) {
                preferFunctionOverMethodRule_1 = preferFunctionOverMethodRule_1_1;
            },
            function (preferConstRule_1_1) {
                preferConstRule_1 = preferConstRule_1_1;
            },
            function (radixRule_1_1) {
                radixRule_1 = radixRule_1_1;
            },
            function (semicolonRule_1_1) {
                semicolonRule_1 = semicolonRule_1_1;
            },
            function (trailingCommaRule_1_1) {
                trailingCommaRule_1 = trailingCommaRule_1_1;
            },
            function (tripleEqualsRule_1_1) {
                tripleEqualsRule_1 = tripleEqualsRule_1_1;
            },
            function (useIsnanRule_1_1) {
                useIsnanRule_1 = useIsnanRule_1_1;
            }
        ],
        execute: function () {
            cachedRules = new Map();
        }
    };
});
