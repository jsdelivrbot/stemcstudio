import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_FORMAT_DOCUMENT } from '../../editor/editor_protocol';
import { formatDocument, FormatDocumentController } from '../actions/formatDocument';
import { EditSession } from '../../virtual/editor';

export function createFormatDocumentCommand(path: string, indentSize: number, controller: FormatDocumentController, session: EditSession): Command<any> {
    return {
        name: COMMAND_NAME_FORMAT_DOCUMENT,
        bindKey: { win: 'Ctrl-Shift-I', mac: 'Command-Alt-I' },
        exec() {
            formatDocument(path, indentSize, controller, session);
        },
        isAvailable(target: any): boolean {
            return isTypeScript(path);
        },
        scrollIntoView: 'animate',
        readOnly: true
    };
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

