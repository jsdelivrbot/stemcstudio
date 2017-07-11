import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_GOTO_DEFINITION } from '../../editor/editor_protocol';
import { Editor } from '../../editor/Editor';

export function createGotoDefinitionCommand(): Command<Editor> {
    return {
        name: COMMAND_NAME_GOTO_DEFINITION,
        bindKey: { win: 'F12', mac: 'F12' },
        exec(editor: Editor) {
            editor.gotoDefinition();
        },
        isAvailable(editor): boolean {
            return editor.isGotoDefinitionAvailable();
        },
        scrollIntoView: 'animate',
        readOnly: true
    };
}
