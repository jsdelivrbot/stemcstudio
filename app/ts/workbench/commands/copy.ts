import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_COPY } from '../../editor/editor_protocol';
import { EditorChangeable } from '../../virtual/EditorChangeable';

/*
function bindKey(win: string | null, mac: string | null): { win: string | null; mac: string | null } {
    return { win, mac };
}
*/

export function createCopyCommand(): Command<EditorChangeable> {
    return {
        name: COMMAND_NAME_COPY,
        // Providing the bindKey will disable the default action.
        // TODO: We'd like to specify the keys but not forfit the native handling. 
        // bindKey: bindKey("Ctrl-C", "Command-C"),
        exec: function (editor: EditorChangeable) {
            // editor.copy();
        },
        readOnly: true
    };
}
