/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
import { Fix, IRuleMetadata, RuleFailure } from '../language/rule/rule';
import { childOfKind } from '../language/utils';
import { RuleWalker } from '../language/walker/ruleWalker';

export class Rule extends AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IRuleMetadata = {
        ruleName: "prefer-method-signature",
        description: "Prefer `foo(): void` over `foo: () => void` in interfaces and types.",
        hasFix: true,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Use a method signature instead of a property signature of function type.";

    public apply(sourceFile: ts.SourceFile): RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends RuleWalker {
    public visitPropertySignature(node: ts.PropertyDeclaration) {
        const { type } = node;
        if (type !== undefined && type.kind === ts.SyntaxKind.FunctionType) {
            this.addFailureAtNode(node.name, Rule.FAILURE_STRING, this.createMethodSignatureFix(node, type as ts.FunctionTypeNode));
        }

        super.visitPropertySignature(node);
    }

    private createMethodSignatureFix(node: ts.PropertyDeclaration, type: ts.FunctionTypeNode): Fix | undefined {
        return type.type && this.createFix(
            this.deleteFromTo(childOfKind(node, ts.SyntaxKind.ColonToken)!.getStart(), type.getStart()),
            this.deleteFromTo(childOfKind(type, ts.SyntaxKind.EqualsGreaterThanToken)!.getStart(), type.type.getStart()),
            this.appendText(childOfKind(type, ts.SyntaxKind.CloseParenToken)!.end, ":"));
    }
}
