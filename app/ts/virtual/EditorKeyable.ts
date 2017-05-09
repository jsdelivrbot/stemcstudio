import { KeyboardHandler } from './editor';

export interface EditorKeyable {
    createKeyboardHandler(): KeyboardHandler<EditorKeyable>;
    addKeyboardHandler(keyboardHandler: KeyboardHandler<EditorKeyable>): void;
    getKeyboardHandlers(): KeyboardHandler<EditorKeyable>[];
    removeKeyboardHandler(keyboardHandler: KeyboardHandler<EditorKeyable>): boolean;
    toggleOverwrite(): void;
}
