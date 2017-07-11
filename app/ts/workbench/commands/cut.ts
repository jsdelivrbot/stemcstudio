import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_CUT } from '../../editor/editor_protocol';
import { Editor } from '../../editor/Editor';

/*
function bindKey(win: string | null, mac: string | null): { win: string | null; mac: string | null } {
    return { win, mac };
}
*/

export function createCutCommand(): Command<Editor> {
    return {
        name: COMMAND_NAME_CUT,
        // Providing the bindKey will disable the default action.
        // TODO: We'd like to specify the keys but not forfit the native handling. 
        // bindKey: bindKey("Ctrl-X", "Command-X"),
        exec: function (editor: Editor) {
            editor.cut();
        },
        scrollIntoView: "cursor",
        multiSelectAction: "forEach"
    };
}
