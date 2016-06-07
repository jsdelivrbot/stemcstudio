"use strict";

import Completer from '../autocomplete/Completer';
import Completion from '../Completion';
import CompletionEntry from './CompletionEntry';
import Editor from '../Editor';
import EditSession from "../EditSession";
import Position from "../Position";
import Workspace from './Workspace';
import EditorPosition from './EditorPosition';

/**
 *
 */
export default class WorkspaceCompleter implements Completer {

    private workspace: Workspace;
    private fileName: string;

    constructor(fileName: string, workspace: Workspace) {
        this.fileName = fileName;
        this.workspace = workspace;
    }
    /**
     * @method getCompletionsAtPosition
     * @param editor {Editor}
     * @param position {Position}
     * @param prefix {string}
     * @return {Promise}
     */
    getCompletionsAtPosition(editor: Editor, position: Position, prefix: string): Promise<Completion[]> {

        const offset: number = EditorPosition.getPositionChars(editor, position);

        return new Promise<Completion[]>((resolve: (completions: Completion[]) => any, reject: (err: any) => any) => {
            this.workspace.getCompletionsAtPosition(this.fileName, offset, prefix)
                .then(function(entries: CompletionEntry[]) {
                    resolve(entries.map(function(entry) {
                        return {
                            caption: entry.name,
                            value: entry.name,
                            score: 0,
                            meta: entry.kind
                        };
                    }));
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }
    getCompletions(editor: Editor, session: EditSession, position: Position, prefix: string, callback: (err: any, completions?: Completion[]) => void) {
        return this.getCompletionsAtPosition(editor, position, prefix)
            .then(function(completions) {
                callback(void 0, completions);
            })
            .catch(function(err) {
                callback(err);
            });
    }

}
