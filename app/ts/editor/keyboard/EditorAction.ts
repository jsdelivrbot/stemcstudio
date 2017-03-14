// FIXME: Does this really make any sense?
// import Editor from '../Editor';

/**
 * An action that is performed in the context of an <code>Editor</code>.
 */
interface EditorAction {
    // TODO: Make the return type void?
    (editor: any /*Editor*/, args?: any): any;
}

export default EditorAction;
