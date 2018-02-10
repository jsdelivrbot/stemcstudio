import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_FORMAT_DOCUMENT } from '../../editor/editor_protocol';
import { formatDocument, FormatDocumentController } from '../actions/formatDocument';
import { Editor } from '../../editor/Editor';
import { isCSS } from '../../utils/isCSS';
import { isHtmlFilePath } from '../../utils/isHtmlFilePath';
import { isJavaScript } from '../../utils/isJavaScript';
import { isTypeScript } from '../../utils/isTypeScript';

/**
 * Commands only work when we have a UI so it makes sense that this function takes an Editor.
 * The Editor plays the role of the controller.
 * This allows us to ensure a proper refresh of the UI.
 * @param path 
 * @param indentSize 
 * @param controller 
 * @param editor 
 */
export function createFormatDocumentCommand(path: string, indentSize: number, controller: FormatDocumentController, editor: Editor): Command<any> {
    return {
        name: COMMAND_NAME_FORMAT_DOCUMENT,
        bindKey: { win: 'Ctrl-Shift-I', mac: 'Command-Alt-I' },
        exec() {
            formatDocument(path, indentSize, controller, editor.getSession());
            editor.updateFull(true);
        },
        isAvailable(target: any): boolean {
            return isTypeScript(path) || isJavaScript(path) || isCSS(path) || isHtmlFilePath(path);
        },
        scrollIntoView: 'animate',
        readOnly: true
    };
}
