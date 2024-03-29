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
import { dedent } from '../utils';
import { RuleWalker } from '../language/walker/ruleWalker';

export class Rule extends AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IRuleMetadata = {
        ruleName: "no-arg",
        description: "Disallows use of `arguments.callee`.",
        rationale: dedent`
            Using \`arguments.callee\` makes various performance optimizations impossible.
            See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee)
            for more details on why to avoid \`arguments.callee\`.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Access to arguments.callee is forbidden";

    public apply(sourceFile: ts.SourceFile): RuleFailure[] {
        return this.applyWithWalker(new NoArgWalker(sourceFile, this.getOptions()));
    }
}

class NoArgWalker extends RuleWalker {
    public visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
        const expression = node.expression;
        const name = node.name;

        if (expression.kind === ts.SyntaxKind.Identifier && name.text === "callee") {
            const identifierExpression = expression as ts.Identifier;
            if (identifierExpression.text === "arguments") {
                this.addFailureAtNode(expression, Rule.FAILURE_STRING);
            }
        }

        super.visitPropertyAccessExpression(node);
    }
}
