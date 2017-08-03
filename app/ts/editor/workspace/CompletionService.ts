import { CompletionEntry } from './CompletionEntry';
import { Editor } from '../Editor';
import { Position } from 'editor-document';
import { retrievePrecedingIdentifier } from '../autocomplete/retrievePrecedingIdentifier';

/**
 * This is DEAD code.
 */
export class CompletionService {

    private editor: Editor;

    // private workspace: Workspace;

    /**
     * Records the text where the completion was initiated.
     * May be used to filter completions.
     * TODO: The common terminology for this property is 'prefix'.
     */
    public matchText: string;

    /**
     * Records whether the completion was initiated for a member as opposed to in the global scope.
     * May be used to filter completions.
     */
    public memberMode: boolean;

    constructor(editor: Editor/*, workspace: Workspace*/) {
        this.editor = editor;
        // this.workspace = workspace;
    }

    private _getCompletionsAtPosition(fileName: string, position: number, prefix: string): Promise<CompletionEntry[]> {
        return new Promise<CompletionEntry[]>(function (resolve, reject) {
            reject(new Error("Completions are not available at this time."));
        });
        /*
        if (typeof this.workspace !== 'undefined') {
            return this.workspace.getCompletionsAtPosition(fileName, position, prefix);
        }
        else {
            return new Promise<CompletionEntry[]>(function(resolve, reject) {
                reject(new Error("Completions are not available at this time."));
            });
        }
        */
    }

    /**
     * Returns the completion entries at the cursor position asynchronously using a Promise.
     * There is a side-effect of setting the matchText and memeberMode properties which
     * can be used for subsequent filtering.
     */
    getCompletionsAtCursor(fileName: string, position: Position): Promise<CompletionEntry[]> {

        const editor = this.editor;

        const session = editor.getSession();

        const document = session.getDocument();

        /**
         * The zero-based position characters is a variable because we may adjust it.
         */
        let positionChars = document.positionToIndex(position);


        const line = session.getLine(position.row);

        const column = position.column;

        // The prefix and the matchText appear comparable.
        // However, the RegEx for the prefix is a bit different.
        const prefix = retrievePrecedingIdentifier(line, column);

        const text: string = line.slice(0, column);

        let matches: string[] = text.match(/\.([a-zA-Z_0-9\$]*$)/);
        if (matches && matches.length > 0) {
            this.matchText = matches[1];
            this.memberMode = true;
            positionChars -= this.matchText.length;
        }
        else {
            matches = text.match(/[a-zA-Z_0-9\$]*$/);
            this.matchText = matches[0];
            this.memberMode = false;
        }

        return this._getCompletionsAtPosition(fileName, positionChars, prefix);
    }
}
