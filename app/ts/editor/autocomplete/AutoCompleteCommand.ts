import Command from '../commands/Command';
import Editor from '../Editor';
import EditorAction from '../keyboard/EditorAction';
import { CompletionManager } from './CompletionManager';
import { COMMAND_NAME_AUTO_COMPLETE } from '../editor_protocol';

/**
 * Returns a completion manager and caches it as an editor property.
 */
function ensureCompletionManager(editor: Editor): CompletionManager {
    if (editor.completionManager) {
        return editor.completionManager;
    }
    else {
        const completionManager = new CompletionManager();
        editor.completionManager = completionManager;
        return completionManager;
    }
}

/**
 *
 */
export default class AutoCompleteCommand implements Command {
    name: string;
    exec: EditorAction;
    bindKey: string;

    /**
     *
     */
    constructor(name = COMMAND_NAME_AUTO_COMPLETE) {
        this.name = name;
        this.bindKey = 'Ctrl-Space|Ctrl-Shift-Space|Alt-Space';
        this.exec = function (editor: Editor) {
            const manager = ensureCompletionManager(editor);
            manager.autoInsert = true;
            manager.autoSelect = true;
            // Attaching to the editor triggers the autocompletion behaviour.
            // The manager will remain attached until events indicated it is no longer needed.
            // It will then detach itself.
            manager.attach(editor);
            // Prevent Ctrl-Space opening context menu on firefox on mac.
            manager.cancelContextMenu();
        };
    }
}
