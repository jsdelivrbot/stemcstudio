import { UndoManager } from './editor';
import { EditorMinimal } from './EditorMinimal';

export interface EditorUndoable extends EditorMinimal {
    undo(): void;
    redo(): void;
    setUndoManager(undoManager: UndoManager): void;
}

export function isEditorUndoable(editor: EditorMinimal): editor is EditorUndoable {
    if (editor) {
        const candidate = editor as EditorUndoable;
        return typeof candidate.undo === 'function';
    }
    else {
        return false;
    }
}
