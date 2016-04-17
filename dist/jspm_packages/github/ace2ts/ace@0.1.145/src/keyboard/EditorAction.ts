import Editor from '../Editor';

/**
 * An action that is performed in the context of an <code>Editor</code>.
 *
 * @class EditorAction
 */
interface EditorAction {
    (editor: Editor, args?: any): any;
}

export default EditorAction;
