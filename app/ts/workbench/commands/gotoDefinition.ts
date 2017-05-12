import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_GOTO_DEFINITION } from '../../editor/editor_protocol';
import { EditorTypeAware } from '../../virtual/EditorTypeAware';

export function createGotoDefinitionCommand(): Command<EditorTypeAware> {
    return {
        name: COMMAND_NAME_GOTO_DEFINITION,
        bindKey: { win: 'F12', mac: 'F12' },
        exec(editor) {
            editor.gotoDefinition();
        },
        isAvailable(editor): boolean {
            return editor.isGotoDefinitionAvailable();
        },
        scrollIntoView: 'animate',
        readOnly: true
    };
}

/*
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
*/
