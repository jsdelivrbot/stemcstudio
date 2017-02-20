import Delta from './Delta';
import EditSession from './EditSession';
import EventBus from './EventBus';
import Document from './Document';
import EventEmitterClass from "./lib/EventEmitterClass";
import FirstAndLast from "./FirstAndLast";
import Tokenizer from './Tokenizer';
import Token from './Token';
import TokenizedLine from './TokenizedLine';

/**
 * Tokenizes an Document in the background, and caches the tokenized rows for future use. 
 * 
 * If a certain row is changed, everything below that row is re-tokenized.
 */
export default class BackgroundTokenizer implements EventBus<any, BackgroundTokenizer> {
    /**
     * This is the value returned by setTimeout, so it's really a timer handle.
     * There are some conditionals looking for a falsey value, so we use zero where needed.
     */
    private running = 0;

    /**
     * This could be called tokensByLine.
     * The first index access is by line number and returns an array of tokens.
     */
    private lines: Token[][] = [];

    private states: (string | string[])[] = [];
    private currentLine = 0;
    private tokenizer: Tokenizer;
    private doc: Document;

    /**
     * The function that is called periodically using a timer.
     */
    private $worker: () => void;

    private eventBus: EventEmitterClass<any, BackgroundTokenizer>;

    /**
     * Creates a new background tokenizer object.
     *
     * @param tokenizer The tokenizer to use, supplied by the LanguageMode.
     */
    constructor(tokenizer: Tokenizer, unused?: EditSession) {
        this.eventBus = new EventEmitterClass<any, BackgroundTokenizer>(this);
        this.tokenizer = tokenizer;

        /**
         * The essence of this function is that it tokenizes rows until it runs
         * out of its allotted (20ms) time, whereupon it cues up another batch using
         * setTimeout and fires an update event reporting the startLine and endLine.
         */
        this.$worker = () => {
            if (!this.running) { return; }

            const workerStart = new Date();
            let currentLine = this.currentLine;
            let endLine = -1;
            const doc = this.doc;

            while (this.lines[currentLine]) {
                currentLine++;
            }

            const startLine = currentLine;

            const len = doc.getLength();
            let processedLines = 0;
            this.running = 0;
            while (currentLine < len) {
                this.tokenizeRow(currentLine);
                endLine = currentLine;
                do {
                    currentLine++;
                } while (this.lines[currentLine]);

                // Only check every 5 lines.
                processedLines++;
                if ((processedLines % 5 === 0) && (new Date().getTime() - workerStart.getTime()) > 20) {
                    this.running = window.setTimeout(this.$worker, 20);
                    break;
                }
            }
            this.currentLine = currentLine;

            if (startLine <= endLine) {
                this.fireUpdateEvent(startLine, endLine);
            }
        };
    }

    /**
     * Emits the `'update'` event.
     * `firstRow` and `lastRow` are used to define the boundaries of the region to be updated.
     *
     * @method fireUpdateEvent
     * @param firstRow The starting row region.
     * @param lastRow The final row region.
     */
    public fireUpdateEvent(firstRow: number, lastRow: number): void {
        const data: FirstAndLast = { first: firstRow, last: lastRow };
        /**
         * Fires whenever the background tokeniziers between a range of rows are going to be updated.
         *
         * @event update
         * @param {data: FirstAndLast}
         */
        // TODO: FirstAndlastEvent interface.
        this.eventBus._signal("update", { data: data });
    }

    /**
     * @param eventName
     * @param callback
     */
    on(eventName: string, callback: (event: any, source: BackgroundTokenizer) => any): void {
        this.eventBus.on(eventName, callback, false);
    }

    /**
     * @param eventName
     * @param callback
     */
    off(eventName: string, callback: (event: any, source: BackgroundTokenizer) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * Returns the state of tokenization at the end of a row.
     *
     * @method getState
     * @param row The row to get state at.
     */
    getState(row: number): string {
        if (this.currentLine === row) {
            this.tokenizeRow(row);
        }
        // Dodgy, let's see if it works.
        // We know we can get an string array, but what does it mean?
        return <string>this.states[row] || "start";
        /*
        if (typeof this.states[row] === 'string') {
            const state: string = <any>this.states[row];
            return state || "start";
        }
        else if (Array.isArray(this.states[row])) {
            const stateNames = <string[]>this.states[row];
            if (stateNames.length > 0) {
                // FIXME: May need to be more sophisticated here.
                console.warn(`states[row] => ${JSON.stringify(this.states[row])}`);
                return stateNames[0];
            }
            else {
                return void 0;
            }
        }
        else {
            throw new Error(`That is NOT supposed to happen: states[row] => ${this.states[row]}`);
        }
        */
    }

    /**
     * Gives list of tokens of the row. (tokens are cached).
     *
     * @method getTokens
     * @param row {number} The row to get tokens at.
     * @return {Token[]}
     */
    getTokens(row: number): Token[] {
        return this.lines[row] || this.tokenizeRow(row);
    }

    /**
     * Sets a new document to associate with this object.
     *
     * @method setDocument
     * @param doc {Document} The new document to associate with.
     * @return {void}
     */
    setDocument(doc: Document): void {
        this.doc = doc;
        this.lines = [];
        this.states = [];

        // TODO: Why do we stop? What is the lifecycle? Documentation!
        this.stop();
    }

    /**
     * Sets a new tokenizer for this object.
     *
     * @method setTokenizer
     * @param tokenizer {Tokenizer} The new tokenizer to use.
     * @return {void}
     */
    setTokenizer(tokenizer: Tokenizer): void {
        // TODO: Why don't we stop first?
        this.tokenizer = tokenizer;
        this.lines = [];
        this.states = [];

        // Start at row zero.
        this.start(0);
    }

    /**
     * Starts tokenizing at the row indicated.
     *
     * @method start
     * @param startRow {number} The row to start at.
     * @return {void}
     */
    start(startRow: number): void {
        this.currentLine = Math.min(startRow || 0, this.currentLine, this.doc.getLength());

        // Remove all cached items below this line.
        this.lines.splice(this.currentLine, this.lines.length);
        this.states.splice(this.currentLine, this.states.length);

        this.stop();
        // Pretty long delay to prevent the tokenizer from interfering with the user.
        this.running = window.setTimeout(this.$worker, 700);
    }

    /**
     * Stops tokenizing.
     *
     * @method stop
     * @return {void}
     */
    stop(): void {
        if (this.running) {
            clearTimeout(this.running);
        }
        this.running = 0;
    }

    /**
     * @method scheduleStart
     * @return {void}
     */
    public scheduleStart(): void {
        if (!this.running) {
            this.running = window.setTimeout(this.$worker, 700);
        }
    }

    /**
     * @method updateOnChange
     * @param delta {Delta}
     * @return {void}
     */
    public updateOnChange(delta: Delta): void {
        const startRow = delta.start.row;
        const len = delta.end.row - startRow;

        if (len === 0) {
            this.lines[startRow] = null;
        }
        else if (delta.action === "remove") {
            this.lines.splice(startRow, len + 1, null);
            this.states.splice(startRow, len + 1, null);
        }
        else {
            const args = Array(len + 1);
            args.unshift(startRow, 1);
            this.lines.splice.apply(this.lines, args);
            this.states.splice.apply(this.states, args);
        }

        this.currentLine = Math.min(startRow, this.currentLine, this.doc.getLength());

        this.stop();
    }

    /**
     * For the given row, updates the lines[row] and sets the currentLine to row + 1.
     *
     * @param row
     */
    public tokenizeRow(row: number): Token[] {

        const line: string = this.doc.getLine(row);
        const state = this.states[row - 1];

        const data: TokenizedLine = this.tokenizer.getLineTokens(line, state);

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

        return this.lines[row] = data.tokens;
    }
}
