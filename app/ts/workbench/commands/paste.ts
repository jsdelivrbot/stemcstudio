import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_PASTE } from '../../editor/editor_protocol';
import { Editor } from '../../editor/Editor';

/*
function bindKey(win: string | null, mac: string | null): { win: string | null; mac: string | null } {
    return { win, mac };
}
*/

export function createPasteCommand(): Command<Editor> {
    return {
        name: COMMAND_NAME_PASTE,
        // Providing the bindKey will disable the default action.
        // TODO: We'd like to specify the keys but not forfit the native handling. 
        // bindKey: bindKey("Ctrl-V", "Command-V"),
        exec: function (editor: Editor, args: { text: string }) {
            editor.paste(args);
        },
        scrollIntoView: 'cursor'
    };
}
