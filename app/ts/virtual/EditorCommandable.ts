import { Command } from './editor';
import { EditorMinimal } from './EditorMinimal';

export interface EditorCommandable extends EditorMinimal {
    addCommand(command: Command<EditorCommandable>): void;
    getCommandByName(name: string): Command<EditorCommandable>;
}

export function isEditorCommandable(editor: EditorMinimal): editor is EditorCommandable {
    if (editor) {
        const candidate = editor as EditorCommandable;
        return typeof candidate.addCommand === 'function'
            && typeof candidate.getCommandByName === 'function';
    }
    else {
        return false;
    }
}
