import { EditorMinimal } from './EditorMinimal';

export interface EditorFocusable extends EditorMinimal {
    focus(): void;
    blur(): void;
}

export function isEditorFocusable(editor: EditorMinimal): editor is EditorFocusable {
    if (editor) {
        const candidate = editor as EditorFocusable;
        return typeof candidate.focus === 'function' && typeof candidate.blur === 'function';
    }
    else {
        return false;
    }
}
