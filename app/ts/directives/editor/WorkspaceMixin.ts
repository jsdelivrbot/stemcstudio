import ace from 'ace.js';

interface WorkspaceMixin {
    attachEditor(filename: string, mode: string, editor: ace.Editor): void;
    detachEditor(filename: string, mode: string, editor: ace.Editor): void;
}

export default WorkspaceMixin;
