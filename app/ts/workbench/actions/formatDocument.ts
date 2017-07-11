import { EditSession } from '../../editor/EditSession';
import { FormatCodeSettings } from '../../editor/workspace/FormatCodeSettings';
import { TextChange } from '../../editor/workspace/TextChange';
import { IndentStyle } from '../../editor/workspace/IndentStyle';
import { isLanguageServiceScript } from '../../utils/isLanguageServiceScript';

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
    if (isLanguageServiceScript(path)) {
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
