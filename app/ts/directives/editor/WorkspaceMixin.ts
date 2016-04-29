import Editor from '../../widgets/editor/Editor'

interface WorkspaceMixin {
    attachEditor(filename: string, mode: string, editor: Editor): void;
    detachEditor(filename: string, mode: string, editor: Editor): void;
}

export default WorkspaceMixin;
