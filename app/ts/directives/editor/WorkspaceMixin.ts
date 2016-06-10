import Editor from '../../editor/Editor';

interface WorkspaceMixin {
    /**
     * Notifies the workspace of the existence of an Editor for the specified path.
     * @returns A function that may be used to detach the Editor.
     */
    attachEditor(path: string, mode: string, editor: Editor): () => void;
}

export default WorkspaceMixin;
