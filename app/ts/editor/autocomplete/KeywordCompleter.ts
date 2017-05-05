import { Completer } from '../../virtual/editor';
import { Completion } from '../../virtual/editor';
import { Editor } from '../../virtual/editor';
import { EditSession } from '../../virtual/editor';
import { Position } from '../../virtual/editor';

export interface KeywordCompleterEditor extends Editor {
    getSession(): EditSession | undefined;
}

/**
 * Provides completions for a language mode.
 */
export default class KeywordCompleter implements Completer<KeywordCompleterEditor> {

    getCompletionsAtPosition(editor: KeywordCompleterEditor, position: Position, prefix: string): Promise<Completion[]> {

        const session = editor.getSession();

        return new Promise<Completion[]>(function (resolve, reject) {
            if (session) {
                const state = session.getState(position.row);
                const completions = session.modeOrThrow().getCompletions(state, session, position, prefix);
                resolve(completions);
            }
            else {
                console.warn("editor session is not available.");
                resolve([]);
            }
        });
    }

    getCompletions(editor: KeywordCompleterEditor, position: Position, prefix: string, callback: (err: any, completions?: Completion[]) => void) {
        return this.getCompletionsAtPosition(editor, position, prefix)
            .then(function (completions) {
                callback(void 0, completions);
            })
            .catch(function (err) {
                callback(err);
            });
    }
}
