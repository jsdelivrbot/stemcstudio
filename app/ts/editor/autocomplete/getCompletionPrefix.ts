import { Editor } from '../Editor';
import { Position } from 'editor-document';
import { retrievePrecedingIdentifier } from './retrievePrecedingIdentifier';

/**
 * Computes the (auto)completion prefix based upon the current cursor position of the editor.
 * If the editor has completers (with specialized identifier recognizers), then they are given
 * first chance to determine the identifier that precedes the cursor position.
 * If a prefix is not determined by the specialized completers, then a generic function is
 * called to guess the preceding identifier.
 */
export function getCompletionPrefix(this: void, editor: Editor): string {
    const pos: Position = editor.getCursorPosition();
    const line: string = editor.sessionOrThrow().getLine(pos.row);
    let prefix: string | undefined;
    editor.completers.forEach((completer) => {
        if (completer.identifierRegexps) {
            completer.identifierRegexps.forEach(function (identifierRegex: RegExp) {
                if (!prefix && identifierRegex) {
                    prefix = retrievePrecedingIdentifier(line, pos.column, identifierRegex);
                }
            });
        }
    });
    return prefix || retrievePrecedingIdentifier(line, pos.column);
}
