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

// DGH
// import * as fs from "fs";
// import * as path from "path";

// DGH
// import { getRelativePath } from "./configuration";
import { showWarningOnce } from "./error";
import { AbstractRule } from "./language/rule/abstractRule";
import { IDisabledInterval, IRule } from "./language/rule/rule";
import { /* arrayify, */ camelize, dedent } from "./utils";

// DGH
import { Rule as commentFormatRule } from './rules/commentFormatRule';
import { Rule as eoflineRule } from './rules/eoflineRule';
import { Rule as jsdocFormatRule } from './rules/jsdocFormatRule';
import { Rule as noVarKeywordRule } from './rules/noVarKeywordRule';
import { Rule as semicolonRule } from './rules/semicolonRule';
import { Rule as tripleEqualsRule } from './rules/tripleEqualsRule';

// DGH
// const moduleDirectory = path.dirname(module.filename);
// const CORE_RULES_DIRECTORY = path.resolve(moduleDirectory, ".", "rules");
// DGH: Fake the directory.
const CORE_RULES_DIRECTORY = 'rules';
const cachedRules = new Map<string, typeof AbstractRule | null>(); // null indicates that the rule was not found

export interface IEnableDisablePosition {
    isEnabled: boolean;
    position: number;
}

// DGH
export function loadRules(ruleConfiguration: { [name: string]: boolean },
    enableDisableRuleMap: { [rulename: string]: IEnableDisablePosition[] },
    rulesDirectories?: string | string[],
    isJs?: boolean): IRule[] {
    const rules: IRule[] = [];
    const notFoundRules: string[] = [];
    const notAllowedInJsRules: string[] = [];

    for (const ruleName in ruleConfiguration) {
        if (ruleConfiguration.hasOwnProperty(ruleName)) {
            const ruleValue = ruleConfiguration[ruleName];
            if (AbstractRule.isRuleEnabled(ruleValue) || enableDisableRuleMap.hasOwnProperty(ruleName)) {
                const Rule: (typeof AbstractRule) | null = findRule(ruleName, rulesDirectories);
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

    if (notFoundRules.length > 0) {
        const warning = dedent`
            Could not find implementations for the following rules specified in the configuration:
                ${notFoundRules.join("\n                ")}
            Try upgrading TSLint and/or ensuring that you have all necessary custom rules installed.
            If TSLint was recently upgraded, you may have old rules configured which need to be cleaned up.
        `;

        console.warn(warning);
    }
    if (notAllowedInJsRules.length > 0) {
        const warning = dedent`
            Following rules specified in configuration couldn't be applied to .js or .jsx files:
                ${notAllowedInJsRules.join("\n                ")}
            Make sure to exclude them from "jsRules" section of your tslint.json.
        `;

        console.warn(warning);
    }
    if (rules.length === 0) {
        // DGH
        // console.warn("No valid rules have been specified");
    }
    return rules;
}

// DGH
export function findRule(name: string, rulesDirectories?: string | string[]): typeof AbstractRule {
    const camelizedName = transformName(name);
    let Rule: typeof AbstractRule | null;

    // first check for core rules
    // DGH
    Rule = loadCachedRule(CORE_RULES_DIRECTORY, camelizedName);

    // DGH: This is for custom paths, which we don't need.
    /*
    if (Rule == null) {
        // then check for rules within the first level of rulesDirectory
        for (const dir of arrayify(rulesDirectories)) {
            Rule = loadCachedRule(dir, camelizedName, true);
            if (Rule != null) {
                break;
            }
        }
    }
    */

    if (Rule) {
        return Rule;
    }
    else {
        throw new Error(`rule ${name} not found`);
    }
}

// DGH
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
 * @param directory - An absolute path to a directory of rules
 * @param ruleName - A name of a rule in filename format. ex) "someLintRule"
 */
// DGH
function loadRule(directory: string, ruleName: string): typeof AbstractRule | null {
    directory = directory;
    ruleName = ruleName;
    // DGH: Dynamically loading rules here. We need to do it from those in the modules.
    /*
    const fullPath = path.join(directory, ruleName);
    if (fs.existsSync(fullPath + ".js")) {
        const ruleModule = require(fullPath);
        if (ruleModule && ruleModule.Rule) {
            return ruleModule.Rule;
        }
    }
    */
    switch (ruleName) {
        case 'commentFormatRule': return commentFormatRule;
        case 'eoflineRule': return eoflineRule;
        case 'jsdocFormatRule': return jsdocFormatRule;
        case 'noVarKeywordRule': return noVarKeywordRule;
        case 'semicolonRule': return semicolonRule;
        case 'tripleEqualsRule': return tripleEqualsRule;
        default: return null;
    }
}


// DGH
function loadCachedRule(directory: string, ruleName: string/*, isCustomPath = false*/): typeof AbstractRule | null {
    // use cached value if available
    // DGH: We fake once again.
    const fullPath = `${directory}/${ruleName}`;

    //  const fullPath = path.join(directory, ruleName);
    const cachedRule = cachedRules.get(fullPath);
    if (cachedRule !== undefined) {
        return cachedRule;
    }

    // get absolute path
    let absolutePath: string | undefined = directory;
    // DGH
    /*
    if (isCustomPath) {
        absolutePath = getRelativePath(directory);
        if (absolutePath != null) {
            if (!fs.existsSync(absolutePath)) {
                throw new Error(`Could not find custom rule directory: ${directory}`);
            }
        }
    }
    */

    let Rule: typeof AbstractRule | null = null;
    if (absolutePath != null) {
        Rule = loadRule(absolutePath, ruleName);
    }
    cachedRules.set(fullPath, Rule);
    return Rule;
}

/**
 * creates disabled intervals for rule based on list of switchers for it
 * @param ruleSpecificList - contains all switchers for rule states sorted top-down and strictly alternating between enabled and disabled
 */
// DGH
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
