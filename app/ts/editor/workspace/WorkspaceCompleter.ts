import Completer from '../autocomplete/Completer';
import Completion from '../Completion';
import CompletionEntry from './CompletionEntry';
import Editor from '../Editor';
import EditSession from "../EditSession";
import Position from "../Position";
import WorkspaceCompleterHost from './WorkspaceCompleterHost';

/**
 *
 */
export default class WorkspaceCompleter implements Completer {

    private workspace: WorkspaceCompleterHost;
    private fileName: string;

    constructor(fileName: string, workspace: WorkspaceCompleterHost) {
        this.fileName = fileName;
        this.workspace = workspace;
    }

    /**
     * @param editor
     * @param position
     * @param prefix
     */
    getCompletionsAtPosition(editor: Editor, position: Position, prefix: string): Promise<Completion[]> {

        const document = editor.getSession().getDocument();

        return new Promise<Completion[]>((resolve: (completions: Completion[]) => any, reject: (err: any) => any) => {
            this.workspace.getCompletionsAtPosition(this.fileName, document.positionToIndex(position), prefix)
                .then(function (entries: CompletionEntry[]) {
                    resolve(entries.map(function (entry) {
                        return {
                            caption: entry.name,
                            value: entry.name,
                            score: 0,
                            meta: entry.kind
                        };
                    }));
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }
    getCompletions(editor: Editor, session: EditSession, position: Position, prefix: string, callback: (err: any, completions?: Completion[]) => void) {
        return this.getCompletionsAtPosition(editor, position, prefix)
            .then(function (completions) {
                callback(void 0, completions);
            })
            .catch(function (err) {
                callback(err);
            });
    }
}
