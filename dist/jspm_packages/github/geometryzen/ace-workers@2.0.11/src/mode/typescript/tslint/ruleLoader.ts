/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { showWarningOnce } from "./error";
import { AbstractRule } from "./language/rule/abstractRule";
import { IDisabledInterval, IRule } from "./language/rule/rule";
import { camelize } from "./utils";

import { Rule as commentFormatRule } from './rules/commentFormatRule';
import { Rule as curlyRule } from './rules/curlyRule';
import { Rule as eoflineRule } from './rules/eoflineRule';
import { Rule as forinRule } from './rules/forinRule';
import { Rule as jsdocFormatRule } from './rules/jsdocFormatRule';
import { Rule as noShadowedVariableRule } from './rules/noShadowedVariableRule';
import { Rule as noTrailingWhitespaceRule } from './rules/noTrailingWhitespaceRule';
import { Rule as noVarKeywordRule } from './rules/noVarKeywordRule';
import { Rule as oneVariablePerDeclarationRule } from './rules/oneVariablePerDeclarationRule';
import { Rule as preferForOfRule } from './rules/preferForOfRule';
import { Rule as preferConstRule } from './rules/preferConstRule';
import { Rule as semicolonRule } from './rules/semicolonRule';
import { Rule as tripleEqualsRule } from './rules/tripleEqualsRule';

/**
 * null indicates that the rule was not found
 */
const cachedRules = new Map<string, typeof AbstractRule | null>();

export interface IEnableDisablePosition {
    isEnabled: boolean;
    position: number;
}

export function loadRules(ruleConfiguration: { [name: string]: boolean | (boolean | string)[] },
    enableDisableRuleMap: { [rulename: string]: IEnableDisablePosition[] },
    isJs?: boolean): IRule[] {
    const rules: IRule[] = [];
    const notFoundRules: string[] = [];
    const notAllowedInJsRules: string[] = [];

    for (const ruleName in ruleConfiguration) {
        if (ruleConfiguration.hasOwnProperty(ruleName)) {
            const ruleValue = ruleConfiguration[ruleName];
            if (AbstractRule.isRuleEnabled(ruleValue) || enableDisableRuleMap.hasOwnProperty(ruleName)) {
                const Rule: (typeof AbstractRule) | null = findRule(ruleName);
                if (Rule == null) {
                    notFoundRules.push(ruleName);
                } else {
                    if (isJs && Rule.metadata && Rule.metadata.typescriptOnly != null && Rule.metadata.typescriptOnly) {
                        notAllowedInJsRules.push(ruleName);
                    } else {
                        const ruleSpecificList = (ruleName in enableDisableRuleMap ? enableDisableRuleMap[ruleName] : []);
                        const disabledIntervals = buildDisabledIntervalsFromSwitches(ruleSpecificList);
                        rules.push(new (Rule as any)(ruleName, ruleValue, disabledIntervals));

                        if (Rule.metadata && Rule.metadata.deprecationMessage) {
                            showWarningOnce(`${Rule.metadata.ruleName} is deprecated. ${Rule.metadata.deprecationMessage}`);
                        }
                    }
                }
            }
        }
    }
    return rules;
}

export function findRule(name: string): typeof AbstractRule {
    const camelizedName = transformName(name);

    const Rule = loadCachedRule(camelizedName);

    if (Rule) {
        return Rule;
    }
    else {
        throw new Error(`rule ${name} not found`);
    }
}

function transformName(name: string) {
    // camelize strips out leading and trailing underscores and dashes, so make sure they aren't passed to camelize
    // the regex matches the groups (leading underscores and dashes)(other characters)(trailing underscores and dashes)
    const nameMatch = name.match(/^([-_]*)(.*?)([-_]*)$/);
    if (nameMatch == null) {
        return name + "Rule";
    }
    return nameMatch[1] + camelize(nameMatch[2]) + nameMatch[3] + "Rule";
}

/**
 * ruleName is the name of a rule in filename format. ex) "someLintRule"
 */
function loadRule(ruleName: string): typeof AbstractRule | null {
    switch (ruleName) {
        case 'curlyRule': return curlyRule;
        case 'commentFormatRule': return commentFormatRule;
        case 'eoflineRule': return eoflineRule;
        case 'forinRule': return forinRule;
        case 'jsdocFormatRule': return jsdocFormatRule;
        case 'noShadowedVariableRule': return noShadowedVariableRule;
        case 'noTrailingWhitespaceRule': return noTrailingWhitespaceRule;
        case 'noVarKeywordRule': return noVarKeywordRule;
        case 'oneVariablePerDeclarationRule': return oneVariablePerDeclarationRule;
        case 'preferConstRule': return preferConstRule;
        case 'preferForOfRule': return preferForOfRule;
        case 'semicolonRule': return semicolonRule;
        case 'tripleEqualsRule': return tripleEqualsRule;
        default: return null;
    }
}

function loadCachedRule(ruleName: string): typeof AbstractRule | null {

    const cachedRule = cachedRules.get(ruleName);
    if (cachedRule !== undefined) {
        return cachedRule;
    }

    const Rule = loadRule(ruleName);
    cachedRules.set(ruleName, Rule);
    return Rule;
}

/**
 * creates disabled intervals for rule based on list of switchers for it
 * ruleSpecificList contains all switchers for rule states sorted top-down and strictly alternating between enabled and disabled
 */
function buildDisabledIntervalsFromSwitches(ruleSpecificList: IEnableDisablePosition[]) {
    const disabledIntervalList: IDisabledInterval[] = [];
    // starting from second element in the list since first is always enabled in position 0;
    let i = 1;

    while (i < ruleSpecificList.length) {
        const startPosition = ruleSpecificList[i].position;

        // rule enabled state is always alternating therefore we can use position of next switch as end of disabled interval
        // set endPosition as Infinity in case when last switch for rule in a file is disabled
        const endPosition = ruleSpecificList[i + 1] ? ruleSpecificList[i + 1].position : Infinity;

        disabledIntervalList.push({
            endPosition,
            startPosition,
        });

        i += 2;
    }

    return disabledIntervalList;
}
