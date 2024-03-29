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

import { AbstractRule } from '../language/rule/abstractRule';
import { IRuleMetadata, RuleFailure } from '../language/rule/rule';

export class Rule extends AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IRuleMetadata = {
        ruleName: "eofline",
        description: "Ensures the file ends with a newline.",
        rationale: "It is a [standard convention](http://stackoverflow.com/q/729692/3124288) to end files with a newline.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    public static FAILURE_STRING = "file should end with a newline";

    public apply(sourceFile: ts.SourceFile): RuleFailure[] {
        const length = sourceFile.text.length;
        if (length === 0 || // if the file is empty, it "ends with a newline", so don't return a failure
            sourceFile.text[length - 1] === "\n") {
            return [];
        }

        return this.filterFailures([
            new RuleFailure(sourceFile, length, length, Rule.FAILURE_STRING, this.getOptions().ruleName),
        ]);
    }
}
