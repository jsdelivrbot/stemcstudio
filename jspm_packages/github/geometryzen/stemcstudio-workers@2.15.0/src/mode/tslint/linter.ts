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

import { IConfigurationFile } from "./configuration";
import { EnableDisableRulesWalker } from "./enableDisableRules";
import { isError, showWarningOnce } from "./error";
import { ILinterOptions } from "./index";
import { IRule, RuleFailure } from "./language/rule/rule";
import { TypedRule } from "./language/rule/typedRule";
import { loadRules } from "./ruleLoader";
import { dedent } from "./utils";

/**
 * Linter that can lint multiple files in consecutive runs.
 */
export class Linter {
    private failures: RuleFailure[] = [];
    private fixes: RuleFailure[] = [];

    /**
     * Returns a list of source file names from a TypeScript program. This includes all referenced
     * files and excludes declaration (".d.ts") files.
     */
    public static getFileNames(program: ts.Program): string[] {
        return program.getSourceFiles().map((s) => s.fileName).filter((l) => l.substr(-5) !== ".d.ts");
    }

    /**
     * DGH: If we require a program then we can surely get a source file.
     */
    constructor(options: ILinterOptions, private languageService: ts.LanguageService) {
        if (typeof options !== "object") {
            throw new Error("Unknown Linter options type: " + typeof options);
        }
        if ((options as any).configuration != null) {
            throw new Error("ILinterOptions does not contain the property `configuration` as of version 4. " +
                "Did you mean to pass the `IConfigurationFile` object to lint() ? ");
        }
    }

    public lint(fileName: string, configuration: IConfigurationFile): void {
        let sourceFile = this.getSourceFile(fileName);
        const isJs = /\.jsx?$/i.test(fileName);

        const enabledRules = this.getEnabledRules(sourceFile, configuration, isJs);
        let hasLinterRun = false;
        let fileFailures: RuleFailure[] = [];

        // make a 1st pass or make a 2nd pass if there were any fixes because the positions may be off
        if (!hasLinterRun || this.fixes.length > 0) {
            fileFailures = [];
            for (const rule of enabledRules) {
                const ruleFailures = this.applyRule(rule, sourceFile);
                if (ruleFailures.length > 0) {
                    fileFailures = fileFailures.concat(ruleFailures);
                }
            }
        }
        this.failures = this.failures.concat(fileFailures);
    }

    public getRuleFailures(): RuleFailure[] {
        return this.failures;
    }

    private applyRule(rule: IRule, sourceFile: ts.SourceFile) {
        let ruleFailures: RuleFailure[] = [];
        try {
            if (TypedRule.isTypedRule(rule)) {
                ruleFailures = rule.applyWithProgram(sourceFile, this.languageService);
            } else {
                ruleFailures = rule.apply(sourceFile, this.languageService);
            }
        } catch (error) {
            if (isError(error)) {
                showWarningOnce(`Warning: ${error.message}`);
            } else {
                // DGH
                // console.warn(`Warning: ${error}`);
            }
        }

        const fileFailures: RuleFailure[] = [];
        for (const ruleFailure of ruleFailures) {
            if (!this.containsRule(this.failures, ruleFailure)) {
                fileFailures.push(ruleFailure);
            }
        }
        return fileFailures;
    }

    private getEnabledRules(sourceFile: ts.SourceFile, configuration: IConfigurationFile, isJs: boolean): IRule[] {
        const configurationRules = isJs ? configuration.jsRules : configuration.rules;

        // walk the code first to find all the intervals where rules are disabled
        const enableDisableRuleMap = new EnableDisableRulesWalker(sourceFile, configurationRules).getEnableDisableRuleMap();

        const configuredRules = configurationRules ? loadRules(configurationRules, enableDisableRuleMap, isJs) : [];

        return configuredRules.filter((r) => r.isEnabled());
    }

    private getSourceFile(fileName: string/*, source: string*/) {
        const sourceFile = this.languageService.getProgram().getSourceFile(fileName);
        // check if the program has been type checked
        if (sourceFile && !("resolvedModules" in sourceFile)) {
            throw new Error("Program must be type checked before linting");
        }

        if (sourceFile === undefined) {
            const INVALID_SOURCE_ERROR = dedent`
                Invalid source file: ${fileName}. Ensure that the files supplied to lint have a .ts, .tsx, .js or .jsx extension.
            `;
            throw new Error(INVALID_SOURCE_ERROR);
        }
        return sourceFile;
    }

    private containsRule(rules: RuleFailure[], rule: RuleFailure) {
        return rules.some((r) => r.equals(rule));
    }
}
