import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_PASTE } from '../../editor/editor_protocol';
import { EditorChangeable } from '../../virtual/EditorChangeable';

/*
function bindKey(win: string | null, mac: string | null): { win: string | null; mac: string | null } {
    return { win, mac };
}
*/

export function createPasteCommand(): Command<EditorChangeable> {
    return {
        name: COMMAND_NAME_PASTE,
        // Providing the bindKey will disable the default action.
        // TODO: We'd like to specify the keys but not forfit the native handling. 
        // bindKey: bindKey("Ctrl-V", "Command-V"),
        exec: function (editor: EditorChangeable, args: { text: string }) {
            editor.paste(args);
        },
        scrollIntoView: 'cursor'
    };
}
