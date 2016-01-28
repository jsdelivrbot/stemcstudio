import Command from '../commands/Command';
import Editor from '../Editor';
import EditorAction from '../keyboard/EditorAction';
import CompletionManager from './CompletionManager';
import {COMMAND_NAME_AUTO_COMPLETE} from '../editor_protocol';

/**
 * @class AutoCompleteCommand
 */
export default class AutoCompleteCommand implements Command {
    name: string;
    exec: EditorAction;
    bindKey: string;

    /**
     * @class AutoCompleteCommand
     * @constructor
     * @param [name = COMMAND_NAME_AUTO_COMPLETE] {string}
     */
    constructor(name = COMMAND_NAME_AUTO_COMPLETE) {
        this.name = name;
        this.bindKey = 'Ctrl-Space|Ctrl-Shift-Space|Alt-Space';
        this.exec = function(editor: Editor) {
            let manager: CompletionManager = editor.completionManager;
            if (!manager) {
                manager = new CompletionManager(editor);
                editor.completionManager = manager;
            }
            manager.autoInsert = true;
            manager.autoSelect = true;
            manager.showPopup(editor);
            // needed for firefox on mac
            manager.cancelContextMenu();
        };
    }
}
