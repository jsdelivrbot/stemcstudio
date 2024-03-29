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
import { forEachComment } from '../language/utils';
import { dedent } from '../utils';
import { RuleWalker } from '../language/walker/ruleWalker';

export class Rule extends AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IRuleMetadata = {
        ruleName: "jsdoc-format",
        description: "Enforces basic format rules for JSDoc comments.",
        descriptionDetails: dedent`
            The following rules are enforced for JSDoc comments (comments starting with \`/**\`):

            * each line contains an asterisk and asterisks must be aligned
            * each asterisk must be followed by either a space or a newline (except for the first and the last)
            * the only characters before the asterisk on each line must be whitespace characters
            * one line comments must start with \`/** \` and end with \`*/\``,
        rationale: "Helps maintain a consistent, readable style for JSDoc comments.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static ALIGNMENT_FAILURE_STRING = "asterisks in jsdoc must be aligned";
    public static FORMAT_FAILURE_STRING = "jsdoc is not formatted correctly on this line";

    public apply(sourceFile: ts.SourceFile): RuleFailure[] {
        return this.applyWithWalker(new JsdocWalker(sourceFile, this.getOptions()));
    }
}

class JsdocWalker extends RuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        forEachComment(node, (fullText, kind, pos) => {
            if (kind === ts.SyntaxKind.MultiLineCommentTrivia) {
                this.findFailuresForJsdocComment(fullText.substring(pos.tokenStart, pos.end), pos.tokenStart);
            }
        });
    }

    private findFailuresForJsdocComment(commentText: string, startingPosition: number) {
        const currentPosition = startingPosition;
        // the file may be different depending on the OS it was originally authored on
        // can't rely on require('os').EOL or process.platform as that is the execution env
        // regex is: split optionally on \r\n, but alwasy split on \n if no \r exists
        const lines = commentText.split(/\r?\n/);
        const firstLine = lines[0];
        let jsdocPosition = currentPosition;

        // regex is: start of string, followed by any amount of whitespace, followed by /** but not more than 2 **
        const isJsdocMatch = firstLine.match(/^\s*\/\*\*([^*]|$)/);
        if (isJsdocMatch != null) {
            if (lines.length === 1) {
                const firstLineMatch = firstLine.match(/^\s*\/\*\* (.* )?\*\/$/);
                if (firstLineMatch == null) {
                    this.addFailureAt(jsdocPosition, firstLine.length, Rule.FORMAT_FAILURE_STRING);
                }
                return;
            }

            const indexToMatch = firstLine.indexOf("**") + this.getLineAndCharacterOfPosition(currentPosition).character;
            // all lines but the first and last
            const otherLines = lines.splice(1, lines.length - 2);
            jsdocPosition += firstLine.length + 1; // + 1 for the splitted-out newline
            for (const line of otherLines) {
                // regex is: start of string, followed by any amount of whitespace, followed by *,
                // followed by either a space or the end of the string
                const asteriskMatch = line.match(/^\s*\*( |$)/);
                if (asteriskMatch == null) {
                    this.addFailureAt(jsdocPosition, line.length, Rule.FORMAT_FAILURE_STRING);
                }
                const asteriskIndex = line.indexOf("*");
                if (asteriskIndex !== indexToMatch) {
                    this.addFailureAt(jsdocPosition, line.length, Rule.ALIGNMENT_FAILURE_STRING);
                }
                jsdocPosition += line.length + 1; // + 1 for the splitted-out newline
            }

            const lastLine = lines[lines.length - 1];
            // regex is: start of string, followed by any amount of whitespace, followed by */,
            // followed by the end of the string
            const endBlockCommentMatch = lastLine.match(/^\s*\*\/$/);
            if (endBlockCommentMatch == null) {
                this.addFailureAt(jsdocPosition, lastLine.length, Rule.FORMAT_FAILURE_STRING);
            }
            const lastAsteriskIndex = lastLine.indexOf("*");
            if (lastAsteriskIndex !== indexToMatch) {
                this.addFailureAt(jsdocPosition, lastLine.length, Rule.ALIGNMENT_FAILURE_STRING);
            }
        }
    }
}
