import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_FORMAT_DOCUMENT } from '../../editor/editor_protocol';
import { formatDocument, FormatDocumentController } from '../actions/formatDocument';
import { EditSession } from '../../editor/EditSession';
import { isCSS } from '../../utils/isCSS';
import { isHtmlFilePath } from '../../utils/isHtmlFilePath';
import { isJavaScript } from '../../utils/isJavaScript';
import { isTypeScript } from '../../utils/isTypeScript';

export function createFormatDocumentCommand(path: string, indentSize: number, controller: FormatDocumentController, session: EditSession): Command<any> {
    return {
        name: COMMAND_NAME_FORMAT_DOCUMENT,
        bindKey: { win: 'Ctrl-Shift-I', mac: 'Command-Alt-I' },
        exec() {
            formatDocument(path, indentSize, controller, session);
        },
        isAvailable(target: any): boolean {
            return isTypeScript(path) || isJavaScript(path) || isCSS(path) || isHtmlFilePath(path);
        },
        scrollIntoView: 'animate',
        readOnly: true
    };
}
