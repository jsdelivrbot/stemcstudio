import { UndoManager } from './editor';

export interface EditorUndoable {
    undo(): void;
    redo(): void;
    setUndoManager(undoManager: UndoManager): void;
}
