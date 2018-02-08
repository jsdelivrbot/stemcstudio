import { EditSession } from '../../editor/EditSession';
import { FormatCodeSettings } from '../../editor/workspace/FormatCodeSettings';
import { TextChange } from '../../editor/workspace/TextChange';
import { IndentStyle } from '../../editor/workspace/IndentStyle';
import { isCSS } from '../../utils/isCSS';
import { isHtmlFilePath } from '../../utils/isHtmlFilePath';
import { isLanguageServiceScript } from '../../utils/isLanguageServiceScript';
import { css } from 'js-beautify';
// import { html } from'js-beautify';
import { DMP } from '../../synchronization/DMP';
import { applyPatchToDocument } from '../../modules/wsmodel/applyPatchToDocument';
import { style_html } from '../../beautify/html/index';

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
    else if (isHtmlFilePath(path)) {
        const settings = formatCodeSettings(indentSize);
        const oldCode = session.getValue();
        const newCode = style_html(oldCode, {
            eol: settings.newLineCharacter,
            end_with_newline: true,
            format_svg: true,
            indent_char: " ",
            indent_size: indentSize,
            // It's trendy these days to put head and body at the same level as html.
            indent_inner_html: false
        });
        const dmp = new DMP();
        const diffs = dmp.diff_main(oldCode, newCode);
        if (diffs.length > 2) {
            dmp.diff_cleanupSemantic(diffs);
            dmp.diff_cleanupEfficiency(diffs);
        }
        const patches = dmp.computePatches(oldCode, diffs);
        for (const patch of patches) {
            const { start, length, applied } = applyPatchToDocument(patch, session);
            /**
             * ok is true if all the boolean values in the applied array are true, otherwise false. 
             */
            const ok = applied.reduce((previousValue, currentValue) => { return previousValue && currentValue; }, true);
            if (!ok) {
                console.warn(`start: ${start}, length=${length}, applied=${applied}`);
            }
        }
    }
    else if (isCSS(path)) {
        const settings = formatCodeSettings(indentSize);
        const oldCode = session.getValue();
        const newCode = css(session.getValue(), {
            eol: settings.newLineCharacter,
            end_with_newline: true,
            indent_char: " ",
            indent_size: indentSize,
            newline_between_rules: true,
        });
        const dmp = new DMP();
        const diffs = dmp.diff_main(oldCode, newCode);
        if (diffs.length > 2) {
            dmp.diff_cleanupSemantic(diffs);
            dmp.diff_cleanupEfficiency(diffs);
        }
        const patches = dmp.computePatches(oldCode, diffs);
        for (const patch of patches) {
            const { start, length, applied } = applyPatchToDocument(patch, session);
            /**
             * ok is true if all the boolean values in the applied array are true, otherwise false. 
             */
            const ok = applied.reduce((previousValue, currentValue) => { return previousValue && currentValue; }, true);
            if (!ok) {
                console.warn(`start: ${start}, length=${length}, applied=${applied}`);
            }
        }
    }
    else {
        console.warn(`Ignoring format document because '${path}' is not a TypeScript file.`);
    }
}
