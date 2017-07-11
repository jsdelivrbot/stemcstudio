import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_COPY } from '../../editor/editor_protocol';
import { Editor } from '../../editor/Editor';

/*
function bindKey(win: string | null, mac: string | null): { win: string | null; mac: string | null } {
    return { win, mac };
}
*/

export function createCopyCommand(): Command<Editor> {
    return {
        name: COMMAND_NAME_COPY,
        // Providing the bindKey will disable the default action.
        // TODO: We'd like to specify the keys but not forfit the native handling. 
        // bindKey: bindKey("Ctrl-C", "Command-C"),
        exec: function (editor: Editor) {
            // editor.copy();
        },
        readOnly: true
    };
}
