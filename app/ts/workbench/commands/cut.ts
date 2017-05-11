import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_CUT } from '../../editor/editor_protocol';
import { EditorChangeable } from '../../virtual/EditorChangeable';

/*
function bindKey(win: string | null, mac: string | null): { win: string | null; mac: string | null } {
    return { win, mac };
}
*/

export function createCutCommand(): Command<EditorChangeable> {
    return {
        name: COMMAND_NAME_CUT,
        // Providing the bindKey will disable the default action.
        // TODO: We'd like to specify the keys but not forfit the native handling. 
        // bindKey: bindKey("Ctrl-X", "Command-X"),
        exec: function (editor: EditorChangeable) {
            editor.cut();
        },
        scrollIntoView: "cursor",
        multiSelectAction: "forEach"
    };
}
