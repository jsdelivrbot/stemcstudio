import { EditSession } from '../../virtual/editor';
import { FormatCodeSettings } from '../../editor/workspace/FormatCodeSettings';
import { TextChange } from '../../editor/workspace/TextChange';
import { IndentStyle } from '../../editor/workspace/IndentStyle';

export interface FormatDocumentController {
    getFormattingEditsForDocument(path: string, settings: FormatCodeSettings): Promise<TextChange<number>[]>;
    applyTextChanges(edits: TextChange<number>[], session: EditSession): void;
}

export function formatCodeSettings(indentSize: number): FormatCodeSettings {
    const settings: FormatCodeSettings = {};
    settings.baseIndentSize = 0;
    settings.convertTabsToSpaces = true;
    settings.indentSize = indentSize;
    settings.indentStyle = IndentStyle.Smart;
    settings.insertSpaceAfterCommaDelimiter = true;
    settings.insertSpaceAfterConstructor = false;
    settings.insertSpaceAfterFunctionKeywordForAnonymousFunctions = false;
    settings.insertSpaceAfterKeywordsInControlFlowStatements = true;

    settings.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces = false;
    // The following setting is useful for putting spaces around named imports.
    settings.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces = true;
    settings.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets = false;
    settings.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis = false;
    settings.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces = false;

    settings.insertSpaceAfterSemicolonInForStatements = true;
    settings.insertSpaceAfterTypeAssertion = true;
    settings.insertSpaceBeforeAndAfterBinaryOperators = true;
    settings.insertSpaceBeforeFunctionParenthesis = false;
    settings.newLineCharacter = '\n';
    return settings;
}

export function formatDocument(path: string, indentSize: number, controller: FormatDocumentController, session: EditSession) {
    if (isTypeScript(path)) {
        const settings = formatCodeSettings(indentSize);
        controller.getFormattingEditsForDocument(path, settings)
            .then(function (textChanges) {
                controller.applyTextChanges(textChanges, session);
            })
            .catch(function (reason) {
                // This is rather unlikely, given that our service is running in a thread.
                console.warn(`${reason}`);
            });
    }
    else {
        console.warn(`Ignoring format document because '${path}' is not a TypeScript file.`);
    }
}

function isTypeScript(path: string): boolean {
    const period = path.lastIndexOf('.');
    if (period >= 0) {
        const extension = path.substring(period + 1);
        switch (extension) {
            case 'ts':
            case 'tsx': {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    console.warn(`isTypeScript('${path}') can't figure that one out.`);
    return false;
}


