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

import { doesIntersect } from "../utils";
import { IWalker } from "../walker/walker";
import { WalkContext } from "../walker/walkContext";
import { IDisabledInterval, IOptions, IRule, IRuleMetadata, RuleArgumentType, RuleFailure } from "./rule";

export abstract class AbstractRule implements IRule {
    public static metadata: IRuleMetadata;
    protected readonly ruleArguments: (boolean | number | string)[];

    public static isRuleEnabled(ruleConfigValue: boolean | RuleArgumentType[]): boolean {
        if (typeof ruleConfigValue === "boolean") {
            return ruleConfigValue;
        }

        if (Array.isArray(ruleConfigValue) && ruleConfigValue.length > 0) {
            const enabled = ruleConfigValue[0];
            if (typeof enabled === 'boolean') {
                return enabled;
            }
            else {
                throw new Error(`ruleConfigValue[0] must be a boolean`);
            }
        }

        return false;
    }

    constructor(public readonly ruleName: string, private value: boolean | (boolean | number | string)[], private disabledIntervals: IDisabledInterval[]) {
        if (Array.isArray(value) && value.length > 1) {
            this.ruleArguments = value.slice(1);
        }
        else {
            this.ruleArguments = [];
        }
    }

    public getOptions(): IOptions {
        return {
            disabledIntervals: this.disabledIntervals,
            ruleArguments: this.ruleArguments,
            ruleName: this.ruleName,
        };
    }

    public abstract apply(sourceFile: ts.SourceFile, languageService: ts.LanguageService): RuleFailure[];

    public applyWithWalker(walker: IWalker): RuleFailure[] {
        walker.walk(walker.getSourceFile());
        return this.filterFailures(walker.getFailures());
    }

    public isEnabled(): boolean {
        return AbstractRule.isRuleEnabled(this.value);
    }

    protected applyWithFunction(sourceFile: ts.SourceFile, walkFn: (ctx: WalkContext<void>) => void): RuleFailure[];
    protected applyWithFunction<T>(sourceFile: ts.SourceFile, walkFn: (ctx: WalkContext<T>) => void, options: T): RuleFailure[];
    protected applyWithFunction<T>(sourceFile: ts.SourceFile, walkFn: (ctx: WalkContext<T | void>) => void, options?: T): RuleFailure[] {
        const ctx = new WalkContext(sourceFile, this.ruleName, options);
        walkFn(ctx);
        return this.filterFailures(ctx.failures);
    }

    protected filterFailures(failures: RuleFailure[]): RuleFailure[] {
        const result: RuleFailure[] = [];
        for (const failure of failures) {
            // don't add failures for a rule if the failure intersects an interval where that rule is disabled
            if (!doesIntersect(failure, this.disabledIntervals) && !result.some((f) => f.equals(failure))) {
                result.push(failure);
            }
        }
        return result;
    }
}
