/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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
import { RuleWalker } from '../language/walker/ruleWalker';

export class Rule extends AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IRuleMetadata = {
        ruleName: "new-parens",
        description: "Requires parentheses when invoking a constructor via the `new` keyword.",
        rationale: "Maintains stylistic consistency with other function calls.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Parentheses are required when invoking a constructor";

    public apply(sourceFile: ts.SourceFile): RuleFailure[] {
        const newParensWalker = new NewParensWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(newParensWalker);
    }
}

class NewParensWalker extends RuleWalker {
    public visitNewExpression(node: ts.NewExpression) {
        if (node.arguments === undefined) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        super.visitNewExpression(node);
    }
}
