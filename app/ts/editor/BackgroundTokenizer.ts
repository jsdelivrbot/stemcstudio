import { EventBus } from './EventBus';
import { Delta, Document } from 'editor-document';
import { EventEmitterClass } from "./lib/EventEmitterClass";
import { FirstAndLast } from "./FirstAndLast";
import { Tokenizer } from "./Tokenizer";
import { HighlighterStackElement, HighlighterStack, HighlighterToken } from '../editor/mode/Highlighter';

/**
 * Symbolic constant for the timer handle.
 */
const NOT_RUNNING = 0;

export type BackgroundTokenizerEventName = 'update';

export interface BackgroundTokenizerEditSession {

}

/**
 * Tokenizes an Document in the background, and caches the tokenized rows for future use. 
 * 
 * If a certain row is changed, everything below that row is re-tokenized.
 */
export class BackgroundTokenizer implements EventBus<BackgroundTokenizerEventName, any, BackgroundTokenizer> {
    /**
     * This is the value returned by setTimeout, so it's really a timer handle.
     * There are some conditionals looking for a falsey value, so we use zero where needed.
     */
    private running_ = NOT_RUNNING;

    /**
     * This could be called tokensByLine.
     * The first index access is by line number and returns an array of tokens.
     */
    private readonly lines: (HighlighterToken[] | null)[] = [];

    /**
     * 
     */
    public readonly states: (HighlighterStackElement | HighlighterStack | null)[] = [];

    private currentLine = 0;
    private tokenizer: Tokenizer<HighlighterToken, HighlighterStackElement, HighlighterStack>;
    private doc: Document | undefined;

    /**
     * The function that is called periodically using a timer.
     */
    private $worker: () => void;

    // TODO: We would like type safety in the event name.
    private eventBus: EventEmitterClass<BackgroundTokenizerEventName, any, BackgroundTokenizer>;

    /**
     * Creates a new background tokenizer object using a tokenizer supplied by the language mode.
     */
    constructor(tokenizer: Tokenizer<HighlighterToken, HighlighterStackElement, HighlighterStack>, unused?: BackgroundTokenizerEditSession) {
        this.eventBus = new EventEmitterClass<BackgroundTokenizerEventName, any, BackgroundTokenizer>(this);
        this.tokenizer = tokenizer;

        /**
         * The essence of this function is that it tokenizes rows until it runs
         * out of its allotted (20ms) time, whereupon it cues up another batch using
         * setTimeout and fires an update event reporting the startLine and endLine.
         */
        this.$worker = () => {
            if (this.running_ === NOT_RUNNING) { return; }

            const workerStart = new Date();
            let currentLine = this.currentLine;
            let endLine = -1;

            const startLine = currentLine;
            while (this.lines[currentLine]) {
                currentLine++;
            }

            if (this.doc) {
                const doc = this.doc;
                const len = doc.getLength();

                let processedLines = 0;
                this.running_ = NOT_RUNNING;
                while (currentLine < len) {
                    this.tokenizeRow(currentLine);
                    endLine = currentLine;
                    do {
                        currentLine++;
                    } while (this.lines[currentLine]);

                    // Only check every 5 lines.
                    processedLines++;
                    if ((processedLines % 5 === 0) && (new Date().getTime() - workerStart.getTime()) > 20) {
                        this.running_ = window.setTimeout(this.$worker, 20);
                        break;
                    }
                }
            }
            this.currentLine = currentLine;

            if (endLine === -1) {
                endLine = currentLine;
            }

            if (startLine <= endLine) {
                this.fireUpdateEvent(startLine, endLine);
            }
        };
    }

    /**
     * Emits the `'update'` event with data being FirstAndLast.
     * `firstRow` and `lastRow` are used to define the boundaries of the region to be updated.
     */
    public fireUpdateEvent(firstRow: number, lastRow: number): void {
        const data: FirstAndLast = { first: firstRow, last: lastRow };
        this.eventBus._signal("update", { data: data });
    }

    /**
     *
     */
    on(eventName: BackgroundTokenizerEventName, callback: (event: any, source: BackgroundTokenizer) => any): void {
        this.eventBus.on(eventName, callback, false);
    }

    /**
     *
     */
    off(eventName: BackgroundTokenizerEventName, callback: (event: any, source: BackgroundTokenizer) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * Returns the state of tokenization at the end of a row.
     */
    getState(row: number): string {
        if (row < 0) {
            console.log(`BackgroundTokenizer.getState(row = ${row})`);
            console.log(`BackgroundTokenizer (currentLine = ${this.currentLine})`);
        }
        if (this.currentLine === row) {
            this.tokenizeRow(row);
        }
        // Dodgy, let's see if it works.
        // We know we can get an string array, but what does it mean?
        // This is the original code, but it requires a cast :(
        // return <string>this.states[row] || "start";
        // Lets be a bit more rigorous...
        /**
         * state could be a string or string[]
         */
        const state = this.states[row];
        if (typeof state === 'string') {
            return state || "start";
        }
        else if (Array.isArray(state)) {
            // We are in uncharted territory...
            // We don't seem to end up here in normal scenarios.
            // There is good reason to believe that this method MUST return a string.
            if (state.length > 0) {
                return <string>state[0];
            }
            else {
                // We are in uncharted territory...
                console.warn(`states[row]: string[] => ${JSON.stringify(state)}`);
                // [] || 'start' => [], so an empty array is consistent with the
                // original code, but that breaks the API contract. 
                // return void 0;
                // We do this instead to simplify the return value to string only.
                throw new Error(`No viable states at row ${row}`);
            }
        }
        else {
            // We are in uncharted territory...
            console.warn(`states[row] => ${JSON.stringify(state)}`);
            throw new Error(`That is NOT supposed to happen: states[row] => ${JSON.stringify(state)}`);
        }
    }

    /**
     * Gives list of tokens of the row. (tokens are cached).
     */
    getTokens(row: number): HighlighterToken[] {
        return this.lines[row] || this.tokenizeRow(row);
    }

    /**
     * Sets a new document to associate with this object.
     */
    setDocument(doc: Document | undefined): void {
        this.doc = doc;
        this.lines.length = 0;
        this.states.length = 0;

        // TODO: Why do we stop? What is the lifecycle? Documentation!
        this.stop();
    }

    /**
     * Sets a new tokenizer for this object.
     */
    setTokenizer(tokenizer: Tokenizer<HighlighterToken, HighlighterStackElement, HighlighterStack>): void {
        // TODO: Why don't we stop first?
        this.tokenizer = tokenizer;
        this.lines.length = 0;
        this.states.length = 0;

        // Start at row zero.
        this.start(0);
    }

    /**
     * Starts tokenizing at the row indicated.
     */
    start(startRow: number): void {
        if (this.doc) {
            this.currentLine = Math.min(startRow || 0, this.currentLine, this.doc.getLength());

            // Remove all cached items below this line.
            this.lines.splice(this.currentLine, this.lines.length);
            this.states.splice(this.currentLine, this.states.length);

            this.stop();
            // Pretty long delay to prevent the tokenizer from interfering with the user.
            this.running_ = window.setTimeout(this.$worker, 700);
        }
        else {
            console.warn("Unable to start background tokenizer without a document");
        }
    }

    /**
     * Stops tokenizing.
     */
    stop(): void {
        if (this.running_ !== NOT_RUNNING) {
            clearTimeout(this.running_);
            this.running_ = NOT_RUNNING;
        }
    }

    /**
     * Schedules this background tokenizer to start in 700ms.
     */
    public scheduleStart(): void {
        if (this.running_ === NOT_RUNNING) {
            this.running_ = window.setTimeout(this.$worker, 700);
        }
    }

    /**
     *
     */
    public updateOnChange(delta: Delta): void {
        const startRow = delta.start.row;
        const len = delta.end.row - startRow;

        if (len === 0) {
            this.lines[startRow] = null;
        }
        else if (delta.action === 'remove') {
            this.lines.splice(startRow, len + 1, null);
            this.states.splice(startRow, len + 1, null);
        }
        else if (delta.action === 'insert') {
            const args = Array(len + 1);
            args.unshift(startRow, 1);
            this.lines.splice.apply(this.lines, args);
            this.states.splice.apply(this.states, args);
        }
        else {
            console.warn(`Unexpected action '${delta.action}' in updateOnChange`);
        }

        if (this.doc) {
            this.currentLine = Math.min(startRow, this.currentLine, this.doc.getLength());
        }

        this.stop();
    }

    /**
     * For the given row, updates the lines[row] and sets the currentLine to row + 1.
     * Returns null if there is no document.
     */
    public tokenizeRow(row: number): HighlighterToken[] {
        if (this.doc) {
            const line: string = this.doc.getLine(row);
            const state = this.states[row - 1];

            const data = this.tokenizer.getLineTokens(line, state);

            // Because state[row]: string | string[], ...
            if (this.states[row] + "" !== data.state + "") {
                this.states[row] = data.state;
                this.lines[row + 1] = null;
                if (this.currentLine > row + 1) {
                    this.currentLine = row + 1;
                }
            }
            else if (this.currentLine === row) {
                this.currentLine = row + 1;
            }

            const tokens = data.tokens;
            this.lines[row] = tokens;
            return tokens;
        }
        else {
            throw new Error("must be a document to tokenize a row");
        }
    }
}
