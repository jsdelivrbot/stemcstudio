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
import { RuleWalker } from '../language/walker/ruleWalker';

export class Rule extends AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IRuleMetadata = {
        ruleName: "no-any",
        description: "Disallows usages of `any` as a type declaration.",
        hasFix: true,
        rationale: "Using `any` as a type declaration nullifies the compile-time benefits of the type system.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Type declaration of 'any' loses type-safety. " +
    "Consider replacing it with a more precise type, the empty type ('{}'), " +
    "or suppress this occurrence.";

    public apply(sourceFile: ts.SourceFile): RuleFailure[] {
        return this.applyWithWalker(new NoAnyWalker(sourceFile, this.getOptions()));
    }
}

class NoAnyWalker extends RuleWalker {
    public visitAnyKeyword(node: ts.Node) {
        const fix = this.createFix(
            this.createReplacement(node.getStart(), node.getWidth(), "{}"),
        );
        this.addFailureAtNode(node, Rule.FAILURE_STRING, fix);
        super.visitAnyKeyword(node);
    }
}
