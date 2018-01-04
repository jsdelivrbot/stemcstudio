import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { equalPositions } from 'editor-document';
import { createDelayedCall } from './lib/lang/createDelayedCall';
import { DelayedCall } from './lib/lang/DelayedCall';
import { stringRepeat } from "./lib/lang";
import { Annotation } from './Annotation';
import { Delta } from "editor-document";
import { DeltaIgnorable } from "./DeltaIgnorable";
import { DeltaGroup } from './DeltaGroup';
import { Disposable } from './Disposable';
import { EditorMouseEvent } from './EditorMouseEvent';
import { EventEmitterClass } from "./lib/EventEmitterClass";
import { FirstAndLast } from "./FirstAndLast";
import { FoldLine } from "./FoldLine";
import { Fold } from "./Fold";
import { FoldEvent } from "./FoldEvent";
import { FoldWidget } from "./FoldWidget";
import { FoldStyle } from "./FoldStyle";
import { GutterRenderer } from './layer/GutterRenderer';
import { Selection } from "./Selection";
import { Marker, MarkerType } from "./Marker";
import { MarkerRenderer } from "./layer/MarkerRenderer";
import { Range } from "./Range";
import { RangeBasic } from "./RangeBasic";
import { collapseRows, compareEnd, comparePoint, compareRange, contains, isEmpty, isEnd, isEqual, isPosition, isRange, isMultiLine, isStart, setEnd } from "./RangeHelpers";
import { mutateExtendToken } from "./Token";
import { Token } from "./Token";
import { Document, NewLineMode } from "editor-document";
import { BackgroundTokenizer } from "./BackgroundTokenizer";
import { SearchHighlight } from "./SearchHighlight";
import { BracketMatch } from "./BracketMatch";
import { UndoManager } from './UndoManager';
import { TokenIterator } from './TokenIterator';
import { LineWidget } from './LineWidget';
import { LineWidgetManager } from './LineWidgetManager';
import { Position } from 'editor-document';
import { HighlighterToken } from './mode/Highlighter';

import { LanguageMode } from '../editor/LanguageMode';
import { RangeWithCollapseChildren } from '../editor/RangeBasic';
import { OrientedRange } from '../editor/RangeBasic';
import { RangeSelectionMarker } from '../editor/RangeBasic';
import { TokenWithIndex } from '../editor/Token';
import { FoldMode } from './mode/folding/FoldMode';
import { TextMode } from './mode/TextMode';


// "Tokens"
const CHAR = 1;
const CHAR_EXT = 2;
const PLACEHOLDER_START = 3;
const PLACEHOLDER_BODY = 4;
const PUNCTUATION = 9;
const SPACE = 10;
const TAB = 11;
const TAB_SPACE = 12;

// For every keystroke this gets called once per char in the whole doc!!
// Wouldn't hurt to make it a bit faster for c >= 0x1100
function isFullWidth(c: number): boolean {
    if (c < 0x1100) {
        return false;
    }
    return c >= 0x1100 && c <= 0x115F ||
        c >= 0x11A3 && c <= 0x11A7 ||
        c >= 0x11FA && c <= 0x11FF ||
        c >= 0x2329 && c <= 0x232A ||
        c >= 0x2E80 && c <= 0x2E99 ||
        c >= 0x2E9B && c <= 0x2EF3 ||
        c >= 0x2F00 && c <= 0x2FD5 ||
        c >= 0x2FF0 && c <= 0x2FFB ||
        c >= 0x3000 && c <= 0x303E ||
        c >= 0x3041 && c <= 0x3096 ||
        c >= 0x3099 && c <= 0x30FF ||
        c >= 0x3105 && c <= 0x312D ||
        c >= 0x3131 && c <= 0x318E ||
        c >= 0x3190 && c <= 0x31BA ||
        c >= 0x31C0 && c <= 0x31E3 ||
        c >= 0x31F0 && c <= 0x321E ||
        c >= 0x3220 && c <= 0x3247 ||
        c >= 0x3250 && c <= 0x32FE ||
        c >= 0x3300 && c <= 0x4DBF ||
        c >= 0x4E00 && c <= 0xA48C ||
        c >= 0xA490 && c <= 0xA4C6 ||
        c >= 0xA960 && c <= 0xA97C ||
        c >= 0xAC00 && c <= 0xD7A3 ||
        c >= 0xD7B0 && c <= 0xD7C6 ||
        c >= 0xD7CB && c <= 0xD7FB ||
        c >= 0xF900 && c <= 0xFAFF ||
        c >= 0xFE10 && c <= 0xFE19 ||
        c >= 0xFE30 && c <= 0xFE52 ||
        c >= 0xFE54 && c <= 0xFE66 ||
        c >= 0xFE68 && c <= 0xFE6B ||
        c >= 0xFF01 && c <= 0xFF60 ||
        c >= 0xFFE0 && c <= 0xFFE6;
}

const defaultModeCallback = function (err: any) {
    if (!err) {
        // Do nothing.
    }
    else {
        console.warn(`${err}`);
    }
};

// TODO: EditSession could now support a workerCompletedEvents Observable.
/**
 * The name of an event that is emitted by the EditSession when an editor worker has done its
 * thing and has produced its annotations. We will only be interested in this event for TypeScript
 * files (where, ironically, the editor worker does no real work). So essentially, this event says that
 * changes have been applied to the edit session.
 */
export const workerCompleted = 'workerCompleted';

export type EditSessionEventName =
    'workerCompleted'   // Does not originate from the EditSession, forwarded as an emit from the TypeScript worker.
    | 'change'
    | 'changeAnnotation'    // Almost all workers emitting annotations emit this event. TypeScript worker does not.
    | 'changeBackMarker'
    | 'changeBreakpoint'
    | 'changeEditor'
    | 'changeFold'
    | 'changeFrontMarker'
    | 'changeMode'
    | 'changeOverwrite'
    | 'changeScrollLeft'
    | 'changeScrollTop'
    | 'changeTabSize'
    | 'changeWrapLimit'
    | 'changeWrapMode'
    | 'session' // When the EditSession constructor completes. Who cares?
    | 'tokenizerUpdate';

/**
 *
 */
export class EditSession {
    private firstLineNumber_ = 1;
    public gutterRenderer: GutterRenderer;
    public $breakpoints: string[] = [];
    public $decorations: string[] = [];
    private $frontMarkers: { [id: number]: Marker } = {};
    public $backMarkers: { [id: number]: Marker } = {};
    private $markerId = 1;

    /**
     *
     */
    public $undoSelect = true;

    private $deltas: { group: ('doc' | 'fold'); deltas: Delta[] | { action: string; folds: Fold[] }[] }[];
    private $deltasDoc: Delta[];
    private $deltasFold: { action: string; folds: Fold[] }[];
    private $fromUndo: boolean;

    public widgetManager: LineWidgetManager;
    private $updateFoldWidgets: (delta: Delta, editSession: EditSession) => any;
    /**
     * 
     */
    private readonly foldLines_: FoldLine[] = [];
    /**
     * 
     */
    public foldWidgets: (FoldWidget | null)[] | null;
    /**
     * May return "start" or "end".
     */
    public getFoldWidget: (row: number) => FoldWidget;
    public getFoldWidgetRange: (row: number, forceMultiline?: boolean) => RangeWithCollapseChildren;
    public _changedWidgets: LineWidget[];

    // Emacs
    public $useEmacsStyleLineStart: boolean;

    // Emacs
    public $selectLongWords: boolean;

    public doc: Document | undefined;

    /**
     *
     */
    private $defaultUndoManager = {
        undo: function () {
            // Do nothing.
        },
        redo: function () {
            // Do nothing.
        },
        reset: function () {
            // Do nothing.
        }
    };

    private $undoManager: UndoManager;
    private $informUndoManager: DelayedCall;
    public bgTokenizer: BackgroundTokenizer;
    public traceTokenizer = false;
    public $modified: boolean;

    /**
     *
     */
    public selection: Selection | undefined;

    // TODO: Why do we need to have a separate single and multi-selection?

    /**
     *
     */
    public multiSelect: Selection | undefined;

    /**
     *
     */
    public $selectionMarkers: RangeSelectionMarker[];

    /**
     *
     */
    public selectionMarkerCount: number;

    private $docRowCache: number[];
    private $wrapData: number[][];
    private $screenRowCache: number[];
    private $rowLengthCache: (number | null)[];
    private $overwrite = false;
    public $searchHighlight: SearchHighlight;
    private $annotations: Annotation[];
    // TODO: '$autoNewLine' is declared but its value is never read.
    // private $autoNewLine: string;

    /**
     *
     */
    private eventBus: EventEmitterClass<EditSessionEventName, any, EditSession>;

    // private readonly changeModeBus = new EventEmitterClass<'changeMode', {}, EditSession>(this);
    // public readonly changeModeEvents = this.changeModeBus.events('changeMode');

    /**
     * A source of 'change' events that is observable.
     */
    public readonly changeEvents: Observable<Delta>;

    /**
     * Determines whether the worker will be started.
     */
    private $useWorker = true;

    /**
     *
     */
    // private $modes: { [path: string]: LanguageMode } = {};

    /**
     * This properrty should be accessed from outside ising modeOrThrow() or getMode().
     */
    private $mode: LanguageMode | null = null;

    /**
     * The worker corresponding to the mode (i.e. Language).
     */
    private $worker: Disposable | null;

    /**
     * 
     */
    public workerCompleted: Observable<void>;

    public tokenRe: RegExp;
    public nonTokenRe: RegExp;
    public $scrollTop = 0;
    private $scrollLeft = 0;
    private $wrap: boolean | number | string;
    private $wrapAsCode: boolean;
    private $wrapLimit = 80;
    public $useWrapMode = false;
    private $wrapLimitRange: { min: number | null; max: number | null } = {
        min: null,
        max: null
    };
    public $updating: boolean;
    private $onChange = this.onChange.bind(this);
    private removeDocumentChangeListener: (() => void) | undefined;
    private $syncInformUndoManager: () => void;
    public mergeUndoDeltas: boolean;
    private $useSoftTabs = true;
    private $tabSize = 4;
    private screenWidth: number;
    public lineWidgets: (LineWidget | undefined)[] | null = null;
    private lineWidgetsWidth: number;
    public lineWidgetWidth: number | null;
    public $getWidgetScreenLength: () => number;
    /**
     * This is a marker identifier for which XML or HTML tag to highlight.
     * FIXME: Some inconsistency in the use of null versus void 0.
     */
    public $tagHighlight: number | null;
    /**
     * This is a marker identifier for which bracket market to highlight.
     */
    public $bracketHighlight: number | undefined;
    /**
     * This is really a Range with an added marker id.
     */
    public $highlightLineMarker: RangeSelectionMarker | null;
    /**
     * A number is a marker identifier, null indicates that no such marker exists. 
     */
    public $selectionMarker: number | null = null;
    private $bracketMatcher = new BracketMatch(this);
    private refCount = 1;

    constructor(doc: string | Document, mode: LanguageMode = new TextMode(), callback = defaultModeCallback) {
        if ((typeof doc !== 'string') && !(doc instanceof Document)) {
            throw new TypeError('doc must be an Document');
        }
        this.$breakpoints = [];
        this.eventBus = new EventEmitterClass<EditSessionEventName, any, EditSession>(this);

        // TODO: This is getting better. Can we turn it into a 1-liner on the eventBus?
        this.changeEvents = this.eventBus.events('change');
        this.changeEvents = new Observable<Delta>((observer: Observer<Delta>) => {
            function changeListener(value: Delta, source: EditSession) {
                observer.next(value);
            }
            return this.eventBus.on('change', changeListener, false);
        });

        this.foldLines_.toString = function (this: FoldLine[]) {
            return this.join("\n");
        };

        this.eventBus.on("changeFold", this.onChangeFold.bind(this));

        if (typeof doc === 'string') {
            this.setDocument(new Document(doc));
        }
        else {
            this.setDocument(doc);
        }
        this.selection = new Selection(this);

        // FIXME: Can we avoid setting a "temporary mode"?
        // The reason is that the worker can fail.
        this.setLanguageMode(mode, callback);
        this.eventBus._signal("session", this);
    }

    protected destructor(): void {
        this.$stopWorker();
        this.setDocument(void 0);
    }

    /**
     * DEPRECATED Use changeEvents instead.
     */
    addChangeListener(callback: (event: Delta, source: EditSession) => void): () => void {
        return this.on('change', callback);
    }

    /**
     * DEPRECATED Use changeEvents instead.
     */
    removeChangeListener(callback: (event: Delta, source: EditSession) => void): void {
        this.off('change', callback);
    }

    addRef(): number {
        this.refCount++;
        return this.refCount;
    }

    release(): number {
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor();
        }
        else if (this.refCount < 0) {
            throw new Error("refCount is less than zero.");
        }
        return this.refCount;
    }

    // TODO: Provide an Observable for each type of change.

    /**
     * 
     */
    on(eventName: EditSessionEventName, callback: (event: any, session: EditSession) => void): () => void {
        return this.eventBus.on(eventName, callback, false);
    }

    /**
     *
     */
    off(eventName: EditSessionEventName, callback: (event: any, session: EditSession) => void): void {
        this.eventBus.off(eventName, callback);
    }

    _emit(eventName: EditSessionEventName, event?: any) {
        this.eventBus._emit(eventName, event);
    }

    _signal(eventName: EditSessionEventName, event?: any) {
        this.eventBus._signal(eventName, event);
    }

    /**
     * Sets the `EditSession` to point to a new `Document`.
     * If a background tokenizer exists, it also points to `doc`.
     *
     * @param doc The new `Document` to use.
     */
    private setDocument(doc: Document | undefined): void {
        if (this.doc === doc) {
            console.warn("Wasting time setting the same document more than once!");
            return;
        }

        if (this.doc) {
            if (this.removeDocumentChangeListener) {
                this.removeDocumentChangeListener();
                this.removeDocumentChangeListener = void 0;
            }
            this.doc.release();
            this.doc = void 0;
            if (this.bgTokenizer) {
                this.bgTokenizer.stop();
                this.bgTokenizer.setDocument(void 0);
            }
        }

        this.resetCaches();

        if (doc) {
            this.doc = doc;
            this.doc.addRef();
            this.removeDocumentChangeListener = this.doc.addChangeListener(this.$onChange);

            if (this.bgTokenizer) {
                this.bgTokenizer.setDocument(doc);
                this.bgTokenizer.start(0);
            }
        }
    }

    /**
     * Returns the `Document` associated with this session.
     * The returned document is not reference counted, and so should not be released.
     */
    public getDocument(): Document | undefined {
        return this.doc;
    }

    /**
     *
     */
    private $resetRowCache(docRow: number): void {
        if (!docRow) {
            this.$docRowCache = [];
            this.$screenRowCache = [];
            return;
        }
        const l = this.$docRowCache.length;
        const i = this.$getRowCacheIndex(this.$docRowCache, docRow) + 1;
        if (l > i) {
            this.$docRowCache.splice(i, l);
            this.$screenRowCache.splice(i, l);
        }
    }

    private $getRowCacheIndex(cacheArray: number[], val: number): number {
        let low = 0;
        let hi = cacheArray.length - 1;

        while (low <= hi) {
            const mid = (low + hi) >> 1;
            const c = cacheArray[mid];

            if (val > c) {
                low = mid + 1;
            }
            else if (val < c) {
                hi = mid - 1;
            }
            else {
                return mid;
            }
        }

        return low - 1;
    }

    private resetCaches() {
        this.$modified = true;
        this.$wrapData = [];
        this.$rowLengthCache = [];
        this.$resetRowCache(0);
    }

    private onChangeFold(event: FoldEvent): void {
        const fold = event.data;
        this.$resetRowCache(fold.start.row);
    }

    private onChange(delta: DeltaIgnorable, doc: Document): void {

        this.$modified = true;

        this.$resetRowCache(delta.start.row);

        const removedFolds = this.$updateInternalDataOnChange(delta);
        if (!this.$fromUndo && this.$undoManager && !delta.ignore) {
            this.$deltasDoc.push(delta);
            if (removedFolds && removedFolds.length !== 0) {
                this.$deltasFold.push({
                    action: "removeFolds",
                    folds: removedFolds
                });
            }

            this.$informUndoManager.schedule();
        }

        if (this.bgTokenizer) {
            this.bgTokenizer.updateOnChange(delta);
        }
        /**
         * @event change
         * @param delta {Delta}
         */
        this.eventBus._signal("change", delta);
    }

    /**
     * Sets the session text.
     * In addition to setting the text in the underlying document, this method
     * resets many aspects of the session.
     *
     * @param text The new text to place in the document.
     */
    public setValue(text: string): void {
        if (this.doc) {
            this.doc.setValue(text);
        }
        if (this.selection) {
            this.selection.moveTo(0, 0);
        }

        this.$resetRowCache(0);
        this.$deltas = [];
        this.$deltasDoc = [];
        this.$deltasFold = [];
        this.setUndoManager(this.$undoManager);
        this.getUndoManager().reset();
    }

    /**
     * Returns the current Document as a string.
     */
    public toString(): string {
        return this.getValue();
    }

    /**
     * Returns a copy of all lines in the document.
     * These lines do not include the line terminator.
     */
    public getAllLines(): string[] {
        if (this.doc) {
            return this.doc.getAllLines();
        }
        else {
            throw new Error("document must be defined");
        }
    }

    /**
     * Returns the current Document as a string.
     * This method is a direct pass-through to the underlying document with no other side-effects.
     */
    public getValue(): string {
        if (this.doc) {
            return this.doc.getValue();
        }
        else {
            throw new Error("document must be defined");
        }
    }

    public selectionOrThrow(): Selection {
        if (this.selection) {
            return this.selection;
        }
        else {
            throw new Error("selection does not exist");
        }
    }

    /**
     * Returns the current selection, which may not be defined!
     */
    public getSelection(): Selection | undefined {
        return this.selection;
    }

    /**
     * Sets the current selection.
     */
    public setSelection(selection: Selection | undefined): void {
        this.selection = selection;
    }

    /**
     * Returns the state of background tokenization and the end of a row.
     * Returns nothing if there is no background tokenizer.
     */
    public getState(row: number): string {
        if (row >= 0) {
            return this.bgTokenizerOrThrow().getState(row);
        }
        else {
            throw new Error("row must be greater than or equal to zero");
        }
    }

    /**
     * Starts tokenizing at the row indicated.
     * Returns a list of objects of the tokenized rows.
     * Throws an Error if there is no background tokenizer.
     */
    public getTokens(row: number): HighlighterToken[] {
        return this.bgTokenizerOrThrow().getTokens(row);
    }

    private bgTokenizerOrThrow(): BackgroundTokenizer {
        if (this.bgTokenizer) {
            return this.bgTokenizer;
        }
        else {
            throw new Error("background tokenizer is not available");
        }
    }

    /**
     * Returns the token at the specified row and column.
     * Returns null if there is no token.
     * Returns nothing if the background tokenizer is not running.
     */
    public getTokenAt(row: number, column?: number): TokenWithIndex | null | undefined {
        if (this.bgTokenizer) {
            const tokens = this.bgTokenizer.getTokens(row);
            if (tokens) {
                let c = 0;
                let i: number;
                if (typeof column !== 'number') {
                    i = tokens.length - 1;
                    c = this.getLine(row).length;
                }
                else {
                    for (i = 0; i < tokens.length; i++) {
                        c += tokens[i].value.length;
                        if (c >= column) {
                            break;
                        }
                    }
                }
                if (tokens[i]) {
                    const basicToken = tokens[i];
                    const start = c - basicToken.value.length;
                    return mutateExtendToken(basicToken, i, start);
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }
        else {
            return void 0;
        }
    }

    /**
     * Sets the undo manager.
     */
    public setUndoManager(undoManager: UndoManager): void {
        this.$undoManager = undoManager;
        this.$deltas = [];
        this.$deltasDoc = [];
        this.$deltasFold = [];

        if (this.$informUndoManager) {
            this.$informUndoManager.cancel();
        }

        if (undoManager) {
            this.$syncInformUndoManager = () => {

                this.$informUndoManager.cancel();

                if (this.$deltasFold.length) {
                    this.$deltas.push({
                        group: "fold",
                        deltas: this.$deltasFold
                    });
                    this.$deltasFold = [];
                }

                if (this.$deltasDoc.length) {
                    this.$deltas.push({
                        group: "doc",
                        deltas: this.$deltasDoc
                    });
                    this.$deltasDoc = [];
                }

                if (this.$deltas.length > 0) {
                    undoManager.execute({ action: "aceupdate", args: [this.$deltas, this], merge: this.mergeUndoDeltas });
                }
                this.mergeUndoDeltas = false;
                this.$deltas = [];
            };
            this.$informUndoManager = createDelayedCall(this.$syncInformUndoManager);
        }
    }

    /**
     * Starts a new group in undo history.
     */
    public markUndoGroup(): void {
        if (this.$syncInformUndoManager) {
            this.$syncInformUndoManager();
        }
    }

    /**
     * Returns the current undo manager.
     */
    public getUndoManager(): UndoManager {
        // FIXME: Want simple API, don't want to cast.
        return this.$undoManager || <UndoManager>this.$defaultUndoManager;
    }

    /**
     * Returns the current value for tabs.
     * If the user is using soft tabs, this will be a series of spaces (defined by [[EditSession.getTabSize `getTabSize()`]]); otherwise it's simply `'\t'`.
     */
    public getTabString(): string {
        if (this.getUseSoftTabs()) {
            return stringRepeat(" ", this.getTabSize());
        }
        else {
            return "\t";
        }
    }

    /**
     * Pass `true` to enable the use of soft tabs.
     * Soft tabs means you're using spaces instead of the tab character (`'\t'`).
     */
    public setUseSoftTabs(useSoftTabs: boolean): EditSession {
        this.$useSoftTabs = useSoftTabs;
        return this;
    }

    /**
     * Returns `true` if soft tabs are being used, `false` otherwise.
     */
    public getUseSoftTabs(): boolean {
        if (this.$mode) {
            return this.$useSoftTabs && !this.$mode.$indentWithTabs;
        }
        else {
            return this.$useSoftTabs;
        }
    }

    /**
     * Set the number of spaces that define a soft tab.
     * For example, passing in `4` transforms the soft tabs to be equivalent to four spaces.
     * This function also emits the `changeTabSize` event.
     */
    public setTabSize(tabSize: number): void {
        if (isNaN(tabSize) || this.$tabSize === tabSize) return;

        this.$modified = true;
        this.$rowLengthCache = [];
        this.$tabSize = tabSize;
        this._signal("changeTabSize");
    }

    /**
     * Returns the current tab size.
     *
     * @method getTabSize
     * @returns {number}
     */
    public getTabSize(): number {
        return this.$tabSize;
    }

    /**
     * Returns `true` if the character at the position is a soft tab.
     *
     * @param position The position to check.
     */
    public isTabStop(position: Position): boolean {
        return this.$useSoftTabs && (position.column % this.$tabSize === 0);
    }

    /**
     * Pass in `true` to enable overwrites in your session, or `false` to disable.
     *
     * If overwrites is enabled, any text you enter will type over any text after it. If the value of `overwrite` changes, this function also emites the `changeOverwrite` event.
     *
     * @param overwrite Defines whether or not to set overwrites.
     */
    public setOverwrite(overwrite: boolean): void {
        this.$overwrite = overwrite;
        this._signal("changeOverwrite");
    }

    /**
     * Returns `true` if overwrites are enabled; `false` otherwise.
     */
    public getOverwrite(): boolean {
        return this.$overwrite;
    }

    /**
     * Sets the value of overwrite to the opposite of whatever it currently is.
     */
    public toggleOverwrite(): void {
        this.setOverwrite(!this.$overwrite);
    }

    /**
     * Adds `className` to the `row`, to be used for CSS stylings and whatnot.
     *
     * @param row The row number.
     * @param className The class to add.
     */
    public addGutterDecoration(row: number, className: string): void {
        if (!this.$decorations[row]) {
            this.$decorations[row] = "";
        }
        this.$decorations[row] += " " + className;
        /**
         * @event changeBreakpoint
         */
        this.eventBus._signal("changeBreakpoint", {});
    }

    /**
     * Removes `className` from the `row`.
     *
     * @param row The row number.
     * @param className The class to add.
     */
    public removeGutterDecoration(row: number, className: string): void {
        this.$decorations[row] = (this.$decorations[row] || "").replace(" " + className, "");
        /**
         * @event changeBreakpoint
         */
        this.eventBus._signal("changeBreakpoint", {});
    }

    /**
     * Returns an array of strings, indicating the breakpoint class (if any) applied to each row.
     */
    public getBreakpoints(): string[] {
        return this.$breakpoints;
    }

    /**
     * Sets a breakpoint on every row number given by `rows`.
     * This function also emites the `'changeBreakpoint'` event.
     *
     * @param rows An array of row indices
     */
    public setBreakpoints(rows: number[]): void {
        this.$breakpoints = [];
        for (let i = 0; i < rows.length; i++) {
            this.$breakpoints[rows[i]] = "ace_breakpoint";
        }
        /**
         * @event changeBreakpoint
         */
        this.eventBus._signal("changeBreakpoint", {});
    }

    /**
     * Removes all breakpoints on the rows.
     * This function also emites the `'changeBreakpoint'` event.
     */
    public clearBreakpoints(): void {
        this.$breakpoints = [];
        /**
         * @event changeBreakpoint
         */
        this.eventBus._signal("changeBreakpoint", {});
    }

    /**
     * Sets a breakpoint on the row number given by `rows`.
     * This function also emites the `'changeBreakpoint'` event.
     *
     * @param row A row index
     * @param className Class of the breakpoint.
     */
    public setBreakpoint(row: number, className: string): void {
        if (className === undefined)
            className = "ace_breakpoint";
        if (className)
            this.$breakpoints[row] = className;
        else
            delete this.$breakpoints[row];
        /**
         * @event changeBreakpoint
         */
        this.eventBus._signal("changeBreakpoint", {});
    }

    /**
     * Removes a breakpoint on the row number given by `rows`.
     * This function also emites the `'changeBreakpoint'` event.
     *
     * @param row A row index
     */
    public clearBreakpoint(row: number): void {
        delete this.$breakpoints[row];
        /**
         * @event changeBreakpoint
         */
        this.eventBus._signal("changeBreakpoint", {});
    }

    /**
     * Adds a new marker to the given `Range`, returning the new marker id.
     * If `inFront` is `true`, a front marker is defined, and the `'changeFrontMarker'` event fires; otherwise, the `'changeBackMarker'` event fires.
     */
    public addMarker(range: OrientedRange, clazz: string, type: MarkerType = 'line', renderer?: MarkerRenderer | null, inFront?: boolean): number {
        const id = this.$markerId++;

        if (range) {
            if (typeof range.start.row !== 'number') {
                throw new TypeError();
            }
            if (typeof range.start.column !== 'number') {
                throw new TypeError();
            }
            if (typeof range.end.row !== 'number') {
                throw new TypeError();
            }
            if (typeof range.end.column !== 'number') {
                throw new TypeError();
            }
        }

        const marker: Marker = {
            range: range,
            type: type || "line",
            renderer: renderer,
            clazz: clazz,
            inFront: !!inFront,
            id: id
        };

        if (inFront) {
            this.$frontMarkers[id] = marker;
            this.eventBus._signal("changeFrontMarker");
        }
        else {
            this.$backMarkers[id] = marker;
            this.eventBus._signal("changeBackMarker");
        }

        return id;
    }

    /**
     * Adds a dynamic marker to the session.
     * The marker must have an update method.
     * Emits either 'changeFrontMarker' or 'changeBackMarker'.
     */
    private addDynamicMarker<T extends Marker>(marker: T, inFront?: boolean): T {
        if (!marker.update) {
            throw new Error("marker must have an update method.");
            // return void 0;
        }
        const id = this.$markerId++;
        marker.id = id;
        marker.inFront = !!inFront;

        if (inFront) {
            this.$frontMarkers[id] = marker;
            this.eventBus._signal("changeFrontMarker");
        }
        else {
            this.$backMarkers[id] = marker;
            this.eventBus._signal("changeBackMarker");
        }

        return marker;
    }

    /**
     * Removes the marker with the specified ID.
     * If this marker was in front, the `'changeFrontMarker'` event is emitted.
     * If the marker was in the back, the `'changeBackMarker'` event is emitted.
     *
     * markerId is a number representing a marker.
     */
    public removeMarker(markerId: number): void {
        const marker: Marker = this.$frontMarkers[markerId] || this.$backMarkers[markerId];
        if (!marker) {
            return;
        }

        const markers: { [id: number]: Marker } = marker.inFront ? this.$frontMarkers : this.$backMarkers;
        if (marker) {
            delete (markers[markerId]);
            this.eventBus._signal(marker.inFront ? "changeFrontMarker" : "changeBackMarker");
        }
    }

    /**
     * Returns an array containing the IDs of all the markers, either front or back.
     * inFront If `true`, indicates you only want front markers; `false` indicates only back markers.
     */
    public getMarkers(inFront: boolean): { [id: number]: Marker } {
        return inFront ? this.$frontMarkers : this.$backMarkers;
    }

    /**
     *
     */
    public highlight(re: RegExp | null | undefined): void {
        if (!this.$searchHighlight) {
            const highlight = new SearchHighlight(null, "ace_selected-word", "text");
            this.$searchHighlight = this.addDynamicMarker(highlight);
        }
        this.$searchHighlight.setRegexp(re);
    }

    /**
     *
     */
    public highlightLines(startRow: number, endRow: number, clazz = "ace_step", inFront?: boolean): Range {
        const range: Range = new Range(startRow, 0, endRow, Infinity);
        range.markerId = this.addMarker(range, clazz, "fullLine", undefined, inFront);
        return range;
    }

    /**
     * Sets annotations for the `EditSession`.
     * This functions emits the `'changeAnnotation'` event.
     */
    public setAnnotations(annotations: Annotation[]): void {
        this.$annotations = annotations;
        this.eventBus._signal("changeAnnotation", {});
    }

    public onWorkerCompleted(annotations: Annotation[]): void {
        this.eventBus._emit(workerCompleted, { data: annotations });
    }

    /**
     * Returns the annotations for the `EditSession`.
     */
    public getAnnotations(): Annotation[] {
        return this.$annotations || [];
    }

    /**
     * Clears all the annotations for this session.
     * This function also triggers the `'changeAnnotation'` event.
     * This is called by the language modes when the worker terminates.
     */
    public clearAnnotations(): void {
        this.setAnnotations([]);
    }

    /**
     * If `text` contains either the newline (`\n`) or carriage-return ('\r') characters, `$autoNewLine` stores that value.
     *
     * @param text A block of text.
     */
    public $detectNewLine(text: string): void {
        const match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            // this.$autoNewLine = match[1];
        }
        else {
            // this.$autoNewLine = "\n";
        }
    }

    /**
     * Given a starting row and column, this method returns the `Range` of the first word boundary it finds.
     */
    public getWordRange(row: number, column: number): OrientedRange {
        const line: string = this.getLine(row);

        let inToken = false;
        if (column > 0)
            inToken = !!line.charAt(column - 1).match(this.tokenRe);

        if (!inToken) {
            inToken = !!line.charAt(column).match(this.tokenRe);
        }

        let re: RegExp;
        if (inToken)
            re = this.tokenRe;
        else if (/^\s+$/.test(line.slice(column - 1, column + 1)))
            re = /\s/;
        else
            re = this.nonTokenRe;

        let start = column;
        if (start > 0) {
            do {
                start--;
            }
            while (start >= 0 && line.charAt(start).match(re));
            start++;
        }

        let end = column;
        while (end < line.length && line.charAt(end).match(re)) {
            end++;
        }

        return new Range(row, start, row, end);
    }

    /**
     * Gets the range of a word, including its right whitespace.
     *
     * @param row The row number to start from.
     * @param column The column number to start from.
     */
    public getAWordRange(row: number, column: number): RangeBasic {
        const wordRange = this.getWordRange(row, column);
        const line = this.getLine(wordRange.end.row);

        while (line.charAt(wordRange.end.column).match(/[ \t]/)) {
            wordRange.end.column += 1;
        }

        return wordRange;
    }

    /**
     * Returns the underlying Document, if it is defined.
     * Throws an exception if it is not defined.
     * The returned Document is a weak reference.
     * TODO: This should not be a public method; Document should be an implementation detail.
     */
    public docOrThrow(): Document {
        if (this.doc) {
            return this.doc;
        }
        else {
            throw new Error("document is not available");
        }
    }

    public setNewLineMode(newLineMode: NewLineMode): void {
        this.docOrThrow().setNewLineMode(newLineMode);
    }

    public getNewLineMode(): NewLineMode {
        return this.docOrThrow().getNewLineMode();
    }

    /**
     * Identifies if you want to use a worker for the `EditSession`.
     *
     * @param useWorker Set to `true` to use a worker.
     */
    public setUseWorker(useWorker: boolean): void {
        this.$useWorker = useWorker;

        this.$stopWorker();
        if (useWorker) {
            this.$startWorker(function (err) {
                // Do nothing.
            });
        }
    }

    /**
     * Returns `true` if workers are being used.
     */
    public getUseWorker(): boolean { return this.$useWorker; }

    /**
     * Reloads all the tokens on the current session.
     * This function calls background tokenizer to start to all the rows; it also emits the `'tokenizerUpdate'` event.
     */
    // TODO: strongtype the event.
    private onReloadTokenizer(e: any) {
        const rows = e.data;
        this.bgTokenizer.start(rows.first);
        /**
         * @event tokenizerUpdate
         */
        this.eventBus._signal("tokenizerUpdate", e);
    }

    /**
     * Sets a new langauge mode for the `EditSession`.
     * This method also emits the `'changeMode'` event.
     * If a background tokenizer is set, the `'tokenizerUpdate'` event is also emitted.
     *
     * @param mode Set a new language mode instance or module name.
     * @param callback
     */
    public setLanguageMode(mode: LanguageMode, callback: (err: any) => any): void {

        if (this.$mode === mode) {
            setTimeout(callback, 0);
            return;
        }

        this.$mode = mode;

        this.$stopWorker();

        /**
         * The tokenizer for highlighting, and behaviours runs independently of the worker thread.
         */
        const tokenizer = mode.getTokenizer();

        if (tokenizer['addEventListener'] !== undefined) {
            const onReloadTokenizer = this.onReloadTokenizer.bind(this);
            tokenizer['addEventListener']("update", onReloadTokenizer);
        }

        if (!this.bgTokenizer) {
            this.bgTokenizer = new BackgroundTokenizer(tokenizer, this);
            // TODO: Remove this handler later.
            this.bgTokenizer.on("update", (event, bg: BackgroundTokenizer) => {
                /**
                 * @event tokenizerUpdate
                 */
                this.eventBus._signal("tokenizerUpdate", event);
            });
        }
        else {
            this.bgTokenizer.setTokenizer(tokenizer);
        }

        this.bgTokenizer.setDocument(this.getDocument());

        this.tokenRe = mode.tokenRe;
        this.nonTokenRe = mode.nonTokenRe;


        this.setWrapType('auto');
        this.$setFolding(mode.foldingRules);
        this.bgTokenizer.start(0);

        if (this.$useWorker) {
            this.$startWorker((err: any) => {
                if (!err) {
                    callback(void 0);
                }
                else {
                    callback(err);
                }
            });
        }
        else {
            setTimeout(callback, 0);
        }
        // this.changeModeBus._emit('changeMode', {});
        /**
         * @event changeMode
         */
        this.eventBus._emit("changeMode");
    }

    /**
     *
     */
    private $stopWorker(): void {
        if (this.$worker) {
            this.$worker.dispose();
        }
        this.$worker = null;
    }

    public modeOrThrow(): LanguageMode {
        if (this.$mode) {
            return this.$mode;
        }
        else {
            throw new Error("language mode is not available");
        }
    }

    /**
     *
     */
    private $startWorker(callback: (err: any) => any): void {
        try {
            if (this.$mode) {
                this.$mode.createWorker(this, (err: any, worker: Disposable) => {
                    if (!err) {
                        // This amounts to an asynchronous ACK that the worker started.
                        this.$worker = worker;
                        callback(void 0);
                    }
                    else {
                        callback(err);
                    }
                });
            }
            else {
                callback(new Error("language mode is not available"));
            }
        }
        catch (e) {
            this.$worker = null;
            callback(e);
        }
    }

    /**
     * Returns the current language mode.
     * @returns The current language mode.
     */
    public getMode(): LanguageMode | null {
        return this.$mode;
    }

    /**
     * This function sets the scroll top value. It also emits the `'changeScrollTop'` event.
     */
    public setScrollTop(scrollTop: number): void {
        // TODO: should we force integer lineheight instead? scrollTop = Math.round(scrollTop); 
        if (this.$scrollTop === scrollTop || isNaN(scrollTop)) {
            return;
        }
        this.$scrollTop = scrollTop;
        this.eventBus._signal("changeScrollTop", scrollTop);
    }

    /**
     * Returns the value of the distance between the top of the editor and the topmost part of the visible content.
     */
    public getScrollTop(): number {
        return this.$scrollTop;
    }

    /**
     * Sets the value of the distance between the left of the editor and the leftmost part of the visible content.
     */
    public setScrollLeft(scrollLeft: number): void {
        // scrollLeft = Math.round(scrollLeft);
        if (this.$scrollLeft === scrollLeft || isNaN(scrollLeft))
            return;

        this.$scrollLeft = scrollLeft;
        /**
         * @event changeScrollLeft
         */
        this.eventBus._signal("changeScrollLeft", scrollLeft);
    }

    /**
     * Returns the value of the distance between the left of the editor and the leftmost part of the visible content.
     */
    public getScrollLeft(): number {
        return this.$scrollLeft;
    }

    /**
     * Returns the width of the screen.
     */
    public getScreenWidth(): number {
        this.$computeWidth();
        if (this.lineWidgets)
            return Math.max(this.getLineWidgetMaxWidth(), this.screenWidth);
        return this.screenWidth;
    }

    /**
     *
     */
    private getLineWidgetMaxWidth(): number {
        if (this.lineWidgetsWidth != null) return this.lineWidgetsWidth;
        let width = 0;
        if (this.lineWidgets) {
            this.lineWidgets.forEach(function (widget) {
                if (widget && typeof widget.screenWidth === 'number' && widget.screenWidth > width) {
                    width = widget.screenWidth;
                }
            });
        }
        return this.lineWidgetWidth = width;
    }

    public $computeWidth(force?: boolean): number | undefined {
        const doc = this.docOrThrow();
        if (this.$modified || force) {
            this.$modified = false;

            if (this.$useWrapMode) {
                return this.screenWidth = this.$wrapLimit;
            }

            const lines = doc.getAllLines();
            const cache = this.$rowLengthCache;
            let longestScreenLine = 0;
            let foldIndex = 0;
            let foldLine = this.foldLines_[foldIndex];
            let foldStart = foldLine ? foldLine.start.row : Infinity;
            const len = lines.length;

            for (let i = 0; i < len; i++) {
                if (i > foldStart) {
                    i = foldLine.end.row + 1;
                    if (i >= len)
                        break;
                    foldLine = this.foldLines_[foldIndex++];
                    foldStart = foldLine ? foldLine.start.row : Infinity;
                }

                const cacheEntry = cache[i];
                if (typeof cacheEntry === 'number') {
                    if (cacheEntry > longestScreenLine) {
                        longestScreenLine = cacheEntry;
                    }
                }
                else {
                    const stringWidth = this.$getStringScreenWidth(lines[i])[0];
                    if (stringWidth > longestScreenLine) {
                        longestScreenLine = stringWidth;
                    }
                    cache[i] = stringWidth;
                }
            }
            this.screenWidth = longestScreenLine;
        }
        return void 0;
    }

    /**
     * Returns a verbatim copy of the given row as it is in the document.
     *
     * @param row The row to retrieve from.
     */
    public getLine(row: number): string {
        if (this.doc) {
            return this.doc.getLine(row);
        }
        else {
            throw new Error(`document must be defined`);
        }
    }

    /**
     * Returns a COPY of the lines between and including `firstRow` and `lastRow`.
     * These lines do not include the line terminator.
     */
    public getLines(firstRow: number, lastRow: number): string[] {
        return this.docOrThrow().getLines(firstRow, lastRow);
    }

    /**
     * Returns the number of rows in the document.
     */
    public getLength(): number {
        return this.docOrThrow().getLength();
    }

    /**
     * Returns all the text corresponding to the range with line terminators.
     * If the range is omitted, the range corresponding to the selection is used.
     * Throws an exception if neither range nor selection are available.
     */
    public getTextRange(range?: RangeBasic): string {
        const doc = this.docOrThrow();
        if (range) {
            return doc.getTextRange(range);
        }
        else if (this.selection) {
            return doc.getTextRange(this.selection.getRange());
        }
        else {
            throw new Error("range must be supplied if there is no selection");
        }
    }

    public indexToPosition(index: number, startRow?: number): Position {
        return this.docOrThrow().indexToPosition(index, startRow);
    }

    public positionToIndex(position: Position, startRow?: number): number {
        return this.docOrThrow().positionToIndex(position, startRow);
    }

    /**
     * Inserts a block of `text` at the indicated `position`.
     * Returns the end position of the inserted text.
     * Triggers a 'change' event on the document.
     * Throws if the document is not defined.
     */
    public insert(position: Position, text: string): Position {
        return this.docOrThrow().insert(position, text);
    }

    public insertInLine(position: Readonly<Position>, text: string): Position {
        return this.docOrThrow().insertInLine(position, text);
    }

    public removeInLine(row: number, startColumn: number, endColumn: number): Position {
        return this.docOrThrow().removeInLine(row, startColumn, endColumn);
    }

    /**
     * Removes the `range` from the document.
     * Triggers a 'change' event in the document.
     * Throws if the document is not defined.
     */
    public remove(range: Readonly<RangeBasic>): Position {
        return this.docOrThrow().remove(range);
    }

    /**
     * Removes a range of full lines. This method also triggers the `'change'` event.
     * Returns a COPY of the removed lines.
     * Triggers a 'change' event in the document.
     * Throws if the document is not defined.
     */
    removeFullLines(firstRow: number, lastRow: number): string[] {
        return this.docOrThrow().removeFullLines(firstRow, lastRow);
    }

    /**
     * Reverts previous changes to your document.
     *
     * @param deltaSets An array of previous changes.
     * @param dontSelect If `true`, doesn't select the range of where the change occured.
     */
    public undoChanges(deltaSets: DeltaGroup[], dontSelect?: boolean): Range | undefined | null {
        if (!deltaSets.length) {
            return void 0;
        }

        const doc = this.docOrThrow();

        this.$fromUndo = true;
        let lastUndoRange: Range | null = null;
        for (let i = deltaSets.length - 1; i !== -1; i--) {
            const delta = deltaSets[i];
            if (delta.group === "doc") {
                doc.revertDeltas(delta.deltas);
                lastUndoRange = this.$getUndoSelection(delta.deltas, true, lastUndoRange);
            }
            else {
                delta.deltas.forEach((foldDelta) => {
                    if (foldDelta.folds) {
                        this.addFolds(foldDelta.folds);
                    }
                });
            }
        }
        this.$fromUndo = false;
        if (this.selection && lastUndoRange && this.$undoSelect && !dontSelect) {
            this.selection.setSelectionRange(lastUndoRange);
        }
        return lastUndoRange;
    }

    /**
     * Re-implements a previously undone change to your document.
     *
     * @param deltaSets An array of previous changes
     * @param dontSelect
     */
    public redoChanges(deltaSets: DeltaGroup[], dontSelect?: boolean): Range | undefined | null {
        if (!deltaSets.length) {
            return void 0;
        }

        const doc = this.docOrThrow();

        this.$fromUndo = true;
        let lastUndoRange: Range | null = null;
        for (let i = 0; i < deltaSets.length; i++) {
            const delta = deltaSets[i];
            if (delta.group === "doc") {
                doc.applyDeltas(delta.deltas);
                lastUndoRange = this.$getUndoSelection(delta.deltas, false, lastUndoRange);
            }
        }
        this.$fromUndo = false;
        if (lastUndoRange && this.$undoSelect && !dontSelect) {
            if (this.selection) {
                this.selection.setSelectionRange(lastUndoRange);
            }
        }
        return lastUndoRange;
    }

    /**
     * Enables or disables highlighting of the range where an undo occurred.
     *
     * @param enable If `true`, selects the range of the reinserted change.
     */
    public setUndoSelect(enable: boolean): void {
        this.$undoSelect = enable;
    }

    private $getUndoSelection(deltas: Delta[], isUndo: boolean, lastUndoRange: Range | null): Range {

        function isInsert(delta: Delta) {
            return isUndo ? delta.action !== "insert" : delta.action === "insert";
        }

        let delta = deltas[0];
        let range: Range;
        let point: Position;
        // TODO: 'lastDeltaIsInsert' is declared but its value is never used.
        // let lastDeltaIsInsert = false;
        if (isInsert(delta)) {
            range = Range.fromPoints(delta.start, delta.end);
            // lastDeltaIsInsert = true;
        } else {
            range = Range.fromPoints(delta.start, delta.start);
            // lastDeltaIsInsert = false;
        }

        for (let i = 1; i < deltas.length; i++) {
            delta = deltas[i];
            if (isInsert(delta)) {
                point = delta.start;
                if (range.compare(point.row, point.column) === -1) {
                    range.setStart(point.row, point.column);
                }
                point = delta.end;
                if (range.compare(point.row, point.column) === 1) {
                    setEnd(range, point.row, point.column);
                }
                // lastDeltaIsInsert = true;
            }
            else {
                point = delta.start;
                if (range.compare(point.row, point.column) === -1) {
                    range = Range.fromPoints(delta.start, delta.start);
                }
                // lastDeltaIsInsert = false;
            }
        }

        // Check if this range and the last undo range has something in common.
        // If true, merge the ranges.
        if (lastUndoRange !== null) {
            if (equalPositions(lastUndoRange.start, range.start)) {
                lastUndoRange.start.column += range.end.column - range.start.column;
                lastUndoRange.end.column += range.end.column - range.start.column;
            }

            const cmp = compareRange(lastUndoRange, range);
            if (cmp === 1) {
                range.setStart(lastUndoRange.start.row, lastUndoRange.start.column);
            }
            else if (cmp === -1) {
                setEnd(range, lastUndoRange.end.row, lastUndoRange.end.column);
            }
        }

        return range;
    }

    /**
     * Replaces a range in the document with the `newText`.
     * Returns the end position of the change.
     * This method triggers a change events in the document for removal and insertion.
     */
    public replace(range: RangeBasic, newText: string): Position {
        return this.docOrThrow().replace(range, newText);
    }

    /**
     * Moves a range of text from the given range to the given position.
     *
     * @method moveText
     * @param fromRange {Range} The range of text you want moved within the document
     * @param toPosition {Position} The location (row and column) where you want to move the text to.
     * @param copy {boolean}
     * @returns {Range} The new range where the text was moved to.
     */
    public moveText(fromRange: Range, toPosition: Position, copy: boolean): Range {
        const text = this.getTextRange(fromRange);
        const folds = this.getFoldsInRange(fromRange);
        let rowDiff: number;
        let colDiff: number;

        const toRange = Range.fromPoints(toPosition, toPosition);
        if (!copy) {
            this.remove(fromRange);
            rowDiff = fromRange.start.row - fromRange.end.row;
            colDiff = rowDiff ? -fromRange.end.column : fromRange.start.column - fromRange.end.column;
            if (colDiff) {
                if (toRange.start.row === fromRange.end.row && toRange.start.column > fromRange.end.column) {
                    toRange.start.column += colDiff;
                }
                if (toRange.end.row === fromRange.end.row && toRange.end.column > fromRange.end.column) {
                    toRange.end.column += colDiff;
                }
            }
            if (rowDiff && toRange.start.row >= fromRange.end.row) {
                toRange.start.row += rowDiff;
                toRange.end.row += rowDiff;
            }
        }

        toRange.end = this.insert(toRange.start, text);
        if (folds.length) {
            const oldStart = fromRange.start;
            const newStart = toRange.start;
            rowDiff = newStart.row - oldStart.row;
            colDiff = newStart.column - oldStart.column;
            this.addFolds(folds.map(function (x) {
                x = x.clone();
                if (x.start.row === oldStart.row) {
                    x.start.column += colDiff;
                }
                if (x.end.row === oldStart.row) {
                    x.end.column += colDiff;
                }
                x.start.row += rowDiff;
                x.end.row += rowDiff;
                return x;
            }));
        }

        return toRange;
    }

    /**
     * Indents all the rows, from `startRow` to `endRow` (inclusive), by prefixing each row with the token in `indentString`.
     *
     *  If `indentString` contains the `'\t'` character, it's replaced by whatever is defined by [[EditSession.getTabString `getTabString()`]].
     *
     * @param startRow Starting row
     * @param endRow Ending row
     * @param indentString The indent token
     */
    public indentRows(startRow: number, endRow: number, indentString: string): void {
        indentString = indentString.replace(/\t/g, this.getTabString());
        for (let row = startRow; row <= endRow; row++)
            this.insert({ row: row, column: 0 }, indentString);
    }

    /**
     * Outdents all the rows defined by the `start` and `end` properties of `range`.
     *
     * @param range A range of rows.
     */
    public outdentRows(range: RangeBasic): void {
        const rowRange = collapseRows(range);
        const deleteRange = new Range(0, 0, 0, 0);
        const size = this.getTabSize();

        for (let i = rowRange.start.row; i <= rowRange.end.row; ++i) {
            const line = this.getLine(i);

            deleteRange.start.row = i;
            deleteRange.end.row = i;
            let j: number;
            for (j = 0; j < size; ++j)
                if (line.charAt(j) !== ' ')
                    break;
            if (j < size && line.charAt(j) === '\t') {
                deleteRange.start.column = j;
                deleteRange.end.column = j + 1;
            } else {
                deleteRange.start.column = 0;
                deleteRange.end.column = j;
            }
            this.remove(deleteRange);
        }
    }

    private $moveLines(firstRow: number, lastRow: number, dir: number): number {
        const doc = this.docOrThrow();
        firstRow = this.getRowFoldStart(firstRow);
        lastRow = this.getRowFoldEnd(lastRow);
        let diff: number;
        if (dir < 0) {
            const row = this.getRowFoldStart(firstRow + dir);
            if (row < 0) return 0;
            diff = row - firstRow;
        }
        else if (dir > 0) {
            const row = this.getRowFoldEnd(lastRow + dir);
            if (row > doc.getLength() - 1) return 0;
            diff = row - lastRow;
        }
        else {
            firstRow = this.$clipRowToDocument(firstRow);
            lastRow = this.$clipRowToDocument(lastRow);
            diff = lastRow - firstRow + 1;
        }

        const range = new Range(firstRow, 0, lastRow, Number.MAX_VALUE);
        const folds = this.getFoldsInRange(range).map(function (x) {
            x = x.clone();
            x.start.row += diff;
            x.end.row += diff;
            return x;
        });

        const lines = (dir === 0) ? doc.getLines(firstRow, lastRow) : doc.removeFullLines(firstRow, lastRow);
        doc.insertFullLines(firstRow + diff, lines);
        if (folds.length) {
            this.addFolds(folds);
        }
        return diff;
    }

    /**
     * Shifts all the lines in the document up one, starting from `firstRow` and ending at `lastRow`.
     *
     * @method moveLinesUp
     * @param firstRow {number} The starting row to move up.
     * @param lastRow {number} The final row to move up.
     * @returns {number} If `firstRow` is less-than or equal to 0, this function returns 0. Otherwise, on success, it returns -1.
     */
    public moveLinesUp(firstRow: number, lastRow: number): number {
        return this.$moveLines(firstRow, lastRow, -1);
    }

    /**
     * Shifts all the lines in the document down one, starting from `firstRow` and ending at `lastRow`.
     *
     * @method moveLinesDown
     * @param firstRow {number} The starting row to move down.
     * @param lastRow {number} The final row to move down.
     * @returns {number} If `firstRow` is less-than or equal to 0, this function returns 0.
     * Otherwise, on success, it returns -1.
     */
    public moveLinesDown(firstRow: number, lastRow: number): number {
        return this.$moveLines(firstRow, lastRow, 1);
    }

    /**
     * Duplicates all the text between `firstRow` and `lastRow`.
     *
     * @param firstRow The starting row to duplicate
     * @param lastRow The final row to duplicate
     * @returns Returns the number of new rows added; in other words, `lastRow - firstRow + 1`.
     */
    public duplicateLines(firstRow: number, lastRow: number): number {
        return this.$moveLines(firstRow, lastRow, 0);
    }

    private $clipRowToDocument(row: number): number {
        const doc = this.docOrThrow();
        return Math.max(0, Math.min(row, doc.getLength() - 1));
    }

    private $clipColumnToRow(row: number, column: number): number {
        const doc = this.docOrThrow();
        if (column < 0) {
            return 0;
        }
        return Math.min(doc.getLine(row).length, column);
    }

    /**
     *
     */
    public $clipPositionToDocument(row: number, column: number): Position {
        const doc = this.docOrThrow();
        column = Math.max(0, column);

        if (row < 0) {
            row = 0;
            column = 0;
        }
        else {
            const len = doc.getLength();
            if (row >= len) {
                row = len - 1;
                column = doc.getLine(len - 1).length;
            }
            else {
                column = Math.min(doc.getLine(row).length, column);
            }
        }

        return { row: row, column: column };
    }

    /**
     *
     */
    public $clipRangeToDocument(range: RangeBasic): RangeBasic {
        const doc = this.docOrThrow();
        if (range.start.row < 0) {
            range.start.row = 0;
            range.start.column = 0;
        }
        else {
            range.start.column = this.$clipColumnToRow(
                range.start.row,
                range.start.column
            );
        }

        const len = doc.getLength() - 1;
        if (range.end.row > len) {
            range.end.row = len;
            range.end.column = doc.getLine(len).length;
        }
        else {
            range.end.column = this.$clipColumnToRow(
                range.end.row,
                range.end.column
            );
        }
        return range;
    }

    /**
     * Sets whether or not line wrapping is enabled.
     * If `useWrapMode` is different than the current value, the `'changeWrapMode'` event is emitted.
     *
     * @param useWrapMode Enable (or disable) wrap mode
     */
    public setUseWrapMode(useWrapMode: boolean): void {
        if (useWrapMode !== this.$useWrapMode) {
            this.$useWrapMode = useWrapMode;
            this.$modified = true;
            this.$resetRowCache(0);

            // If wrapMode is activaed, the wrapData array has to be initialized.
            if (useWrapMode) {
                const len = this.getLength();
                this.$wrapData = Array<number[]>(len);
                this.$updateWrapData(0, len - 1);
            }

            /**
             * @event changeWrapMode
             */
            this.eventBus._signal("changeWrapMode");
        }
    }

    /**
     * Returns `true` if wrap mode is being used; `false` otherwise.
     */
    getUseWrapMode(): boolean {
        return this.$useWrapMode;
    }

    // Allow the wrap limit to move freely between min and max. Either
    // parameter can be null to allow the wrap limit to be unconstrained
    // in that direction. Or set both parameters to the same number to pin
    // the limit to that value.
    /**
     * Sets the boundaries of wrap.
     * Either value can be `null` to have an unconstrained wrap, or, they can be the same number to pin the limit.
     * If the wrap limits for `min` or `max` are different, this method also emits the `'changeWrapMode'` event.
     *
     * @param min The minimum wrap value (the left side wrap)
     * @param max The maximum wrap value (the right side wrap)
     */
    setWrapLimitRange(min: number | null, max: number | null): void {
        if (this.$wrapLimitRange.min !== min || this.$wrapLimitRange.max !== max) {
            this.$wrapLimitRange = {
                min: min,
                max: max
            };
            this.$modified = true;
            // This will force a recalculation of the wrap limit.
            /**
             * @event changeWrapMode
             */
            this.eventBus._signal("changeWrapMode");
        }
    }

    /**
     * This should generally only be called by the renderer when a resize is detected.
     *
     * @param desiredLimit The new wrap limit
     */
    public adjustWrapLimit(desiredLimit: number, $printMargin: number): boolean {
        let limits = this.$wrapLimitRange;
        if (typeof limits.max === 'number' && limits.max < 0) {
            limits = { min: $printMargin, max: $printMargin };
        }
        const wrapLimit = this.$constrainWrapLimit(desiredLimit, limits.min, limits.max);
        if (wrapLimit !== this.$wrapLimit && wrapLimit > 1) {
            this.$wrapLimit = wrapLimit;
            this.$modified = true;
            if (this.$useWrapMode) {
                this.$updateWrapData(0, this.getLength() - 1);
                this.$resetRowCache(0);
                /**
                 * @event changeWrapLimit
                 */
                this.eventBus._signal("changeWrapLimit");
            }
            return true;
        }
        return false;
    }

    private $constrainWrapLimit(wrapLimit: number, min: number | null, max: number | null): number {
        if (min)
            wrapLimit = Math.max(min, wrapLimit);

        if (max)
            wrapLimit = Math.min(max, wrapLimit);

        return wrapLimit;
    }

    /**
     * Returns the value of wrap limit.
     */
    public getWrapLimit(): number {
        return this.$wrapLimit;
    }

    public setWrapType(wrapType: 'auto' | 'code' | 'text') {
        if (this.$mode) {
            const value: boolean = (wrapType === 'auto') ? this.$mode.wrap !== 'text' : wrapType !== 'text';
            if (value !== this.$wrapAsCode) {
                this.$wrapAsCode = value;
                if (this.$useWrapMode) {
                    this.$modified = true;
                    this.$resetRowCache(0);
                    this.$updateWrapData(0, this.getLength() - 1);
                }
            }
        }
    }

    /**
     * Sets the line length for soft wrap in the editor. Lines will break
     * at a minimum of the given length minus 20 chars and at a maximum
     * of the given number of chars.
     *
     * @param limit The maximum line length in chars, for soft wrapping lines.
     */
    public setWrapLimit(limit: number): void {
        this.setWrapLimitRange(limit, limit);
    }

    /**
     * Returns an object that defines the minimum and maximum of the wrap limit.
     */
    public getWrapLimitRange(): { min: number | null; max: number | null } {
        // Avoid unexpected mutation by returning a copy
        return {
            min: this.$wrapLimitRange.min,
            max: this.$wrapLimitRange.max
        };
    }

    /**
     *
     */
    private $updateInternalDataOnChange(delta: Delta): Fold[] {
        const doc = this.docOrThrow();
        const useWrapMode = this.$useWrapMode;
        const action = delta.action;
        const start = delta.start;
        const end = delta.end;
        const firstRow = start.row;
        let lastRow = end.row;
        let len = lastRow - firstRow;
        let removedFolds: Fold[] = [];

        this.$updating = true;
        if (len !== 0) {
            if (action === "remove") {
                this[useWrapMode ? "$wrapData" : "$rowLengthCache"].splice(firstRow, len);

                const foldLines = this.foldLines_;
                removedFolds = this.getFoldsInRange(delta);
                this.removeFolds(removedFolds);

                let foldLine = this.getFoldLine(end.row);
                let idx = 0;
                if (foldLine) {
                    foldLine.addRemoveChars(end.row, end.column, start.column - end.column);
                    foldLine.shiftRow(-len);

                    const foldLineBefore = this.getFoldLine(firstRow);
                    if (foldLineBefore && foldLineBefore !== foldLine) {
                        foldLineBefore.merge(foldLine);
                        foldLine = foldLineBefore;
                    }
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    const foldLine = foldLines[idx];
                    if (foldLine.start.row >= end.row) {
                        foldLine.shiftRow(-len);
                    }
                }

                lastRow = firstRow;
            }
            else {
                const args = Array(len);
                args.unshift(firstRow, 0);
                const arr = useWrapMode ? this.$wrapData : this.$rowLengthCache;
                arr.splice.apply(arr, args);

                // If some new line is added inside of a foldLine, then split
                // the fold line up.
                const foldLines = this.foldLines_;
                let foldLine = this.getFoldLine(firstRow);
                let idx = 0;
                if (foldLine) {
                    const cmp = foldLine.range.compareInside(start.row, start.column);
                    // Inside of the foldLine range. Need to split stuff up.
                    if (cmp === 0) {
                        foldLine = foldLine.split(start.row, start.column);
                        if (foldLine) {
                            foldLine.shiftRow(len);
                            foldLine.addRemoveChars(lastRow, 0, end.column - start.column);
                        }
                    }
                    else {
                        // Infront of the foldLine but same row. Need to shift column.
                        if (cmp === -1) {
                            foldLine.addRemoveChars(firstRow, 0, end.column - start.column);
                            foldLine.shiftRow(len);
                        }
                    }
                    // Nothing to do if the insert is after the foldLine.
                    if (foldLine) {
                        idx = foldLines.indexOf(foldLine) + 1;
                    }
                }

                for (idx; idx < foldLines.length; idx++) {
                    const foldLine = foldLines[idx];
                    if (foldLine.start.row >= firstRow) {
                        foldLine.shiftRow(len);
                    }
                }
            }
        }
        else {
            // Realign folds. E.g. if you add some new chars before a fold, the
            // fold should "move" to the right.
            len = Math.abs(delta.start.column - delta.end.column);
            if (action === "remove") {
                // Get all the folds in the change range and remove them.
                removedFolds = this.getFoldsInRange(delta);
                this.removeFolds(removedFolds);

                len = -len;
            }
            const foldLine = this.getFoldLine(firstRow);
            if (foldLine) {
                foldLine.addRemoveChars(firstRow, start.column, len);
            }
        }

        if (useWrapMode && this.$wrapData.length !== doc.getLength()) {
            console.error("doc.getLength() and $wrapData.length have to be the same!");
        }
        this.$updating = false;

        if (useWrapMode)
            this.$updateWrapData(firstRow, lastRow);
        else
            this.$updateRowLengthCache(firstRow, lastRow);

        return removedFolds;
    }

    private $updateRowLengthCache(firstRow: number, lastRow: number) {
        this.$rowLengthCache[firstRow] = null;
        this.$rowLengthCache[lastRow] = null;
    }

    public $updateWrapData(firstRow: number, lastRow: number) {
        const doc = this.docOrThrow();
        const lines = doc.getAllLines();
        const tabSize = this.getTabSize();
        const wrapData = this.$wrapData;
        const wrapLimit = this.$wrapLimit;
        let tokens: number[];
        let foldLine: FoldLine | undefined | null;

        let row = firstRow;
        lastRow = Math.min(lastRow, lines.length - 1);
        while (row <= lastRow) {
            foldLine = this.getFoldLine(row, foldLine);
            if (!foldLine) {
                tokens = this.$getDisplayTokens(lines[row]);
                wrapData[row] = this.$computeWrapSplits(tokens, wrapLimit, tabSize);
                row++;
            } else {
                tokens = [];
                foldLine.walk((placeholder: string, row: number, column: number, lastColumn: number) => {
                    let walkTokens: number[];
                    if (placeholder != null) {
                        walkTokens = this.$getDisplayTokens(placeholder, tokens.length);
                        walkTokens[0] = PLACEHOLDER_START;
                        for (let i = 1; i < walkTokens.length; i++) {
                            walkTokens[i] = PLACEHOLDER_BODY;
                        }
                    }
                    else {
                        walkTokens = this.$getDisplayTokens(lines[row].substring(lastColumn, column), tokens.length);
                    }
                    tokens = tokens.concat(walkTokens);
                },
                    foldLine.end.row,
                    lines[foldLine.end.row].length + 1
                );

                wrapData[foldLine.start.row] = this.$computeWrapSplits(tokens, wrapLimit, tabSize);
                row = foldLine.end.row + 1;
            }
        }
    }

    private $computeWrapSplits(tokens: number[], wrapLimit: number, tabSize?: number) {
        if (tokens.length === 0) {
            return [];
        }

        const splits: number[] = [];
        const displayLength = tokens.length;
        let lastSplit = 0;
        let lastDocSplit = 0;

        const isCode: boolean = this.$wrapAsCode;

        function addSplit(screenPos: number) {
            const displayed = tokens.slice(lastSplit, screenPos);

            // The document size is the current size - the extra width for tabs
            // and multipleWidth characters.
            let len = displayed.length;
            // FIXME: Why does replace require the callback to return a string?
            displayed.join("").
                // Get all the TAB_SPACEs.
                replace(/12/g, function () { len -= 1; return ''; }).
                // Get all the CHAR_EXT/multipleWidth characters.
                replace(/2/g, function () { len -= 1; return ''; });

            lastDocSplit += len;
            splits.push(lastDocSplit);
            lastSplit = screenPos;
        }

        while (displayLength - lastSplit > wrapLimit) {
            // This is, where the split should be.
            let split = lastSplit + wrapLimit;

            // If there is a space or tab at this split position, then making
            // a split is simple.
            if (tokens[split - 1] >= SPACE && tokens[split] >= SPACE) {
                /* disabled see https://github.com/ajaxorg/ace/issues/1186
                // Include all following spaces + tabs in this split as well.
                while (tokens[split] >= SPACE) {
                    split ++;
                } */
                addSplit(split);
                continue;
            }

            // === ELSE ===
            // Check if split is inside of a placeholder. Placeholder are
            // not splitable. Therefore, seek the beginning of the placeholder
            // and try to place the split beofre the placeholder's start.
            if (tokens[split] === PLACEHOLDER_START || tokens[split] === PLACEHOLDER_BODY) {
                // Seek the start of the placeholder and do the split
                // before the placeholder. By definition there always
                // a PLACEHOLDER_START between split and lastSplit.
                for (split; split !== lastSplit - 1; split--) {
                    if (tokens[split] === PLACEHOLDER_START) {
                        // split++; << No incremental here as we want to
                        //  have the position before the Placeholder.
                        break;
                    }
                }

                // If the PLACEHOLDER_START is not the index of the
                // last split, then we can do the split
                if (split > lastSplit) {
                    addSplit(split);
                    continue;
                }

                // If the PLACEHOLDER_START IS the index of the last
                // split, then we have to place the split after the
                // placeholder. So, let's seek for the end of the placeholder.
                split = lastSplit + wrapLimit;
                for (split; split < tokens.length; split++) {
                    if (tokens[split] !== PLACEHOLDER_BODY) {
                        break;
                    }
                }

                // If spilt == tokens.length, then the placeholder is the last
                // thing in the line and adding a new split doesn't make sense.
                if (split === tokens.length) {
                    break;  // Breaks the while-loop.
                }

                // Finally, add the split...
                addSplit(split);
                continue;
            }

            // === ELSE ===
            // Search for the first non space/tab/placeholder/punctuation token backwards.
            const minSplit = Math.max(split - (isCode ? 10 : wrapLimit - (wrapLimit >> 2)), lastSplit - 1);
            while (split > minSplit && tokens[split] < PLACEHOLDER_START) {
                split--;
            }
            if (isCode) {
                while (split > minSplit && tokens[split] < PLACEHOLDER_START) {
                    split--;
                }
                while (split > minSplit && tokens[split] === PUNCTUATION) {
                    split--;
                }
            } else {
                while (split > minSplit && tokens[split] < SPACE) {
                    split--;
                }
            }
            // If we found one, then add the split.
            if (split > minSplit) {
                addSplit(++split);
                continue;
            }

            // === ELSE ===
            split = lastSplit + wrapLimit;
            // The split is inside of a CHAR or CHAR_EXT token and no space
            // around -> force a split.
            addSplit(split);
        }
        return splits;
    }

    /**
     * Given a string, returns an array of the display characters, including tabs and spaces.
     *
     * @param str The string to check
     * @param offset The value to start at
     */
    private $getDisplayTokens(str: string, offset?: number): number[] {
        const arr: number[] = [];
        let tabSize: number;
        offset = offset || 0;

        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i);
            // Tab
            if (c === 9) {
                tabSize = this.getScreenTabSize(arr.length + offset);
                arr.push(TAB);
                for (let n = 1; n < tabSize; n++) {
                    arr.push(TAB_SPACE);
                }
            }
            // Space
            else if (c === 32) {
                arr.push(SPACE);
            }
            else if ((c > 39 && c < 48) || (c > 57 && c < 64)) {
                arr.push(PUNCTUATION);
            }
            // full width characters
            else if (c >= 0x1100 && isFullWidth(c)) {
                arr.push(CHAR, CHAR_EXT);
            }
            else {
                arr.push(CHAR);
            }
        }
        return arr;
    }

    /**
     * Calculates the width of the string `str` on the screen while assuming that the string starts at the first column on the screen.
     *
     * @param str The string to calculate the screen width of
     * @param maxScreenColumn
     * @param screenColumn
     * @returns Returns an `int[]` array with two elements:<br/>
     * The first position indicates the number of columns for `str` on screen.<br/>
     * The second value contains the position of the document column that this function read until.
     */
    public $getStringScreenWidth(str: string, maxScreenColumn?: number, screenColumn?: number): number[] {
        if (maxScreenColumn === 0)
            return [0, 0];
        if (maxScreenColumn == null)
            maxScreenColumn = Infinity;
        screenColumn = screenColumn || 0;

        let c: number;
        let column: number;
        for (column = 0; column < str.length; column++) {
            c = str.charCodeAt(column);
            // tab
            if (c === 9) {
                screenColumn += this.getScreenTabSize(screenColumn);
            }
            // full width characters
            else if (c >= 0x1100 && isFullWidth(c)) {
                screenColumn += 2;
            } else {
                screenColumn += 1;
            }
            if (screenColumn > maxScreenColumn) {
                break;
            }
        }

        return [screenColumn, column];
    }

    private getLineWidgetRowCount(row: number): number {
        if (this.lineWidgets) {
            const lineWidget = this.lineWidgets[row];
            if (lineWidget) {
                const rowCount = lineWidget.rowCount;
                if (typeof rowCount === 'number') {
                    return rowCount;
                }
                else {
                    return 0;
                }
            }
            else {
                return 0;
            }
        }
        else {
            return 0;
        }
    }

    /**
     * Returns number of screen rows in a wrapped line.
     */
    public getRowLength(row: number): number {
        const h = this.getLineWidgetRowCount(row);
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1 + h;
        }
        else {
            return this.$wrapData[row].length + 1 + h;
        }
    }

    /**
     *
     */
    public getRowLineCount(row: number): number {
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1;
        }
        else {
            return this.$wrapData[row].length + 1;
        }
    }

    /**
     *
     */
    public getRowWrapIndent(screenRow: number): number {
        if (this.$useWrapMode) {
            const pos = this.screenToDocumentPosition(screenRow, Number.MAX_VALUE);
            const splits: number[] = this.$wrapData[pos.row];
            // FIXME: indent does not exists on number[]
            return splits.length && splits[0] < pos.column ? splits['indent'] : 0;
        }
        else {
            return 0;
        }
    }

    /**
     * Returns the position (on screen) for the last character in the provided screen row.
     */
    public getScreenLastRowColumn(screenRow: number): number {
        const pos = this.screenToDocumentPosition(screenRow, Number.MAX_VALUE);
        return this.documentToScreenColumn(pos.row, pos.column);
    }

    /**
     * For the given document row and column, this returns the column position of the last screen row.
     */
    public getDocumentLastRowColumn(docRow: number, docColumn: number): number {
        const screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.getScreenLastRowColumn(screenRow);
    }

    /**
     * For the given document row and column, this returns the document position of the last row.
     */
    public getDocumentLastRowColumnPosition(docRow: number, docColumn: number): Position {
        const screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.screenToDocumentPosition(screenRow, Number.MAX_VALUE / 10);
    }

    /**
     * For the given row, this returns the split data.
     *
     * @param row
     */
    public getRowSplitData(row: number): number[] | undefined {
        if (!this.$useWrapMode) {
            return undefined;
        }
        else {
            return this.$wrapData[row];
        }
    }

    /**
     * The distance to the next tab stop at the specified screen column.
     */
    public getScreenTabSize(screenColumn: number): number {
        return this.$tabSize - screenColumn % this.$tabSize;
    }

    public screenToDocumentRow(screenRow: number, screenColumn: number): number {
        return this.screenToDocumentPosition(screenRow, screenColumn).row;
    }


    public screenToDocumentColumn(screenRow: number, screenColumn: number): number {
        return this.screenToDocumentPosition(screenRow, screenColumn).column;
    }

    /**
     * Converts characters coordinates on the screen to characters coordinates within the document.
     * This takes into account code folding, word wrap, tab size, and any other visual modifications.
     *
     * @method screenToDocumentPosition
     * @param screenRow {number} The screen row to check
     * @param screenColumn {number} The screen column to check
     * @returns {Position} The object returned has two properties: `row` and `column`.
     */
    public screenToDocumentPosition(screenRow: number, screenColumn: number): Position {
        if (screenRow < 0) {
            return { row: 0, column: 0 };
        }

        let line: string;
        let docRow = 0;
        let docColumn = 0;
        let column: number | undefined;
        let row = 0;
        let rowLength = 0;

        const rowCache = this.$screenRowCache;
        const i = this.$getRowCacheIndex(rowCache, screenRow);
        const l = rowCache.length;
        let doCache: boolean;
        if (l && i >= 0) {
            row = rowCache[i];
            docRow = this.$docRowCache[i];
            doCache = screenRow > rowCache[l - 1];
        }
        else {
            doCache = !l;
        }

        const maxRow = this.getLength() - 1;
        let foldLine = this.getNextFoldLine(docRow);
        let foldStart = foldLine ? foldLine.start.row : Infinity;

        while (row <= screenRow) {
            rowLength = this.getRowLength(docRow);
            if (row + rowLength > screenRow || docRow >= maxRow) {
                break;
            }
            else {
                row += rowLength;
                docRow++;
                if (docRow > foldStart) {
                    if (foldLine) {
                        docRow = foldLine.end.row + 1;
                        foldLine = this.getNextFoldLine(docRow, foldLine);
                        foldStart = foldLine ? foldLine.start.row : Infinity;
                    }
                }
            }

            if (doCache) {
                this.$docRowCache.push(docRow);
                this.$screenRowCache.push(row);
            }
        }

        if (foldLine && foldLine.start.row <= docRow) {
            line = this.getFoldDisplayLine(foldLine);
            docRow = foldLine.start.row;
        }
        else if (row + rowLength <= screenRow || docRow > maxRow) {
            // clip at the end of the document
            return {
                row: maxRow,
                column: this.getLine(maxRow).length
            };
        }
        else {
            line = this.getLine(docRow);
            foldLine = null;
        }

        if (this.$useWrapMode) {
            const splits = this.$wrapData[docRow];
            if (splits) {
                const splitIndex = Math.floor(screenRow - row);
                column = splits[splitIndex];
                if (splitIndex > 0 && splits.length) {
                    docColumn = splits[splitIndex - 1] || splits[splits.length - 1];
                    line = line.substring(docColumn);
                }
            }
        }

        docColumn += this.$getStringScreenWidth(line, screenColumn)[1];

        // We remove one character at the end so that the docColumn
        // position returned is not associated to the next row on the screen.
        if (this.$useWrapMode && typeof column === 'number' && docColumn >= column)
            docColumn = column - 1;

        if (foldLine)
            return foldLine.idxToPosition(docColumn);

        return { row: docRow, column: docColumn };
    }

    /**
     * Converts document coordinates to screen coordinates.
     *
     * @method documentToScreenPosition
     * @param docRow {number} The document row to check
     * @param docColumn {number} The document column to check
     * @returns {Position} The object returned by this method has two properties: `row` and `column`.
     */
    public documentToScreenPosition(docRow: number, docColumn: number): Position {

        if (typeof docRow !== 'number') {
            throw new TypeError("docRow must be a number");
        }
        if (typeof docColumn !== 'number') {
            throw new TypeError("docColumn must be a number");
        }

        const pos = this.$clipPositionToDocument(docRow, docColumn);

        docRow = pos.row;
        docColumn = pos.column;

        if (typeof docRow !== 'number') {
            throw new TypeError("docRow must be a number");
        }
        if (typeof docColumn !== 'number') {
            throw new TypeError("docColumn must be a number");
        }

        let screenRow = 0;
        let fold: Fold | null | undefined = null;

        // Clamp the docRow position in case it's inside of a folded block.
        fold = this.getFoldAt(docRow, docColumn, 1);
        if (fold) {
            docRow = fold.start.row;
            docColumn = fold.start.column;
        }

        let rowEnd: number | undefined;
        let row = 0;

        const rowCache = this.$docRowCache;
        const i = this.$getRowCacheIndex(rowCache, docRow);
        const l = rowCache.length;
        let doCache: boolean;
        if (l && i >= 0) {
            row = rowCache[i];
            screenRow = this.$screenRowCache[i];
            doCache = docRow > rowCache[l - 1];
        }
        else {
            doCache = !l;
        }

        let foldLine = this.getNextFoldLine(row);
        let foldStart = foldLine ? foldLine.start.row : Infinity;

        while (row < docRow) {
            if (row >= foldStart) {
                if (foldLine) {
                    rowEnd = foldLine.end.row + 1;
                    if (rowEnd > docRow)
                        break;
                    foldLine = this.getNextFoldLine(rowEnd, foldLine);
                    foldStart = foldLine ? foldLine.start.row : Infinity;
                }
            }
            else {
                rowEnd = row + 1;
            }

            screenRow += this.getRowLength(row);
            if (typeof rowEnd === 'number') {
                row = rowEnd;
            }

            if (doCache) {
                this.$docRowCache.push(row);
                this.$screenRowCache.push(screenRow);
            }
        }

        // Calculate the text line that is displayed in docRow on the screen.
        let textLine = "";
        // Check if the final row we want to reach is inside of a fold.
        let foldStartRow: number | null = null;
        if (foldLine && row >= foldStart) {
            textLine = this.getFoldDisplayLine(foldLine, docRow, docColumn);
            foldStartRow = foldLine.start.row;
        }
        else {
            textLine = this.getLine(docRow).substring(0, docColumn);
            foldStartRow = docRow;
        }
        // Clamp textLine if in wrapMode.
        if (this.$useWrapMode) {
            const wrapRow = this.$wrapData[foldStartRow];
            if (wrapRow) {
                let screenRowOffset = 0;
                while (textLine.length >= wrapRow[screenRowOffset]) {
                    screenRow++;
                    screenRowOffset++;
                }
                textLine = textLine.substring(wrapRow[screenRowOffset - 1] || 0, textLine.length);
            }
        }

        return {
            row: screenRow,
            column: this.$getStringScreenWidth(textLine)[0]
        };
    }

    /**
     * For the given document row and column, returns the screen column.
     *
     * @method documentToScreenColumn
     * @param {Number} docRow
     * @param {Number} docColumn
     * @returns {Number}
     */
    public documentToScreenColumn(docRow: number, docColumn: number): number {
        return this.documentToScreenPosition(docRow, docColumn).column;
    }

    /**
     * For the given document row and column, returns the screen row.
     *
     * @method documentToScreenRow
     * @param {Number} docRow
     * @param {Number} docColumn
     * @returns {number}
     */
    public documentToScreenRow(docRow: number, docColumn: number): number {
        return this.documentToScreenPosition(docRow, docColumn).row;
    }

    /**
     *
     */
    public documentToScreenRange(range: RangeBasic): Range {
        const screenPosStart = this.documentToScreenPosition(range.start.row, range.start.column);
        const screenPosEnd = this.documentToScreenPosition(range.end.row, range.end.column);
        return new Range(screenPosStart.row, screenPosStart.column, screenPosEnd.row, screenPosEnd.column);
    }

    /**
     * Returns the length of the screen.
     */
    public getScreenLength(): number {
        let screenRows = 0;
        // let fold: FoldLine = null;
        if (!this.$useWrapMode) {
            screenRows = this.getLength();

            // Remove the folded lines again.
            const foldData = this.foldLines_;
            for (let i = 0; i < foldData.length; i++) {
                const foldLine = foldData[i];
                screenRows -= foldLine.end.row - foldLine.start.row;
            }
        }
        else {
            const lastRow = this.$wrapData.length;
            let row = 0;
            let i = 0;
            let fold = this.foldLines_[i++];
            let foldStart = fold ? fold.start.row : Infinity;

            while (row < lastRow) {
                const splits = this.$wrapData[row];
                screenRows += splits ? splits.length + 1 : 1;
                row++;
                if (row > foldStart) {
                    row = fold.end.row + 1;
                    fold = this.foldLines_[i++];
                    foldStart = fold ? fold.start.row : Infinity;
                }
            }
        }

        if (this.lineWidgets) {
            screenRows += this.$getWidgetScreenLength();
        }

        return screenRows;
    }

    /**
     *
     */
    findMatchingBracket(position: Position, chr?: string): Position | null {
        return this.$bracketMatcher.findMatchingBracket(position, chr);
    }

    /**
     *
     */
    getBracketRange(position: Position): OrientedRange | null {
        return this.$bracketMatcher.getBracketRange(position);
    }

    /**
     *
     */
    findOpeningBracket(bracket: string, position: Position, typeRe?: RegExp): Position | null {
        return this.$bracketMatcher.findOpeningBracket(bracket, position, typeRe);
    }

    /**
     *
     */
    findClosingBracket(bracket: string, position: Position, typeRe?: RegExp): Position | null {
        return this.$bracketMatcher.findClosingBracket(bracket, position, typeRe);
    }

    private $foldMode: FoldMode | null;

    // structured folding
    $foldStyles = {
        "manual": 1,
        "markbegin": 1,
        "markbeginend": 1
    };
    $foldStyle: FoldStyle = "markbegin";

    /**
     * Looks up a fold at a given row/column. Possible values for side:
     *   -1: ignore a fold if fold.start = row/column
     *   +1: ignore a fold if fold.end = row/column
     *
     * @param row
     * @param column
     * @param side
     */
    getFoldAt(row: number, column: number, side?: number): Fold | undefined | null {
        const foldLine = this.getFoldLine(row);
        if (!foldLine) {
            return null;
        }

        const folds = foldLine.folds;
        for (let i = 0; i < folds.length; i++) {
            const fold = folds[i];
            if (contains(fold.range, row, column)) {
                if (side === 1 && isEnd(fold.range, row, column)) {
                    continue;
                }
                else if (side === -1 && isStart(fold.range, row, column)) {
                    continue;
                }
                return fold;
            }
        }
        return void 0;
    }

    /**
     * Returns all folds in the given range.
     */
    getFoldsInRange(range: RangeBasic): Fold[] {
        const start = range.start;
        const end = range.end;
        const foldLines = this.foldLines_;
        const foundFolds: Fold[] = [];

        start.column += 1;
        end.column -= 1;

        for (let i = 0; i < foldLines.length; i++) {
            let cmp = compareRange(foldLines[i].range, range);
            if (cmp === 2) {
                // Range is before foldLine. No intersection. This means,
                // there might be other foldLines that intersect.
                continue;
            }
            else if (cmp === -2) {
                // Range is after foldLine. There can't be any other foldLines then,
                // so let's give up.
                break;
            }

            const folds = foldLines[i].folds;
            for (let j = 0; j < folds.length; j++) {
                const fold = folds[j];
                cmp = compareRange(fold.range, range);
                if (cmp === -2) {
                    break;
                }
                else if (cmp === 2) {
                    continue;
                }
                else
                    // WTF-state: Can happen due to -1/+1 to start/end column.
                    if (cmp === 42) {
                        break;
                    }
                foundFolds.push(fold);
            }
        }
        start.column -= 1;
        end.column += 1;

        return foundFolds;
    }

    /**
     * @param ranges
     */
    getFoldsInRangeList(ranges: RangeBasic[]): Fold[] {
        let folds: Fold[] = [];
        if (Array.isArray(ranges)) {
            ranges.forEach((range) => {
                folds = folds.concat(this.getFoldsInRange(range));
            });
        }
        else {
            throw new TypeError("ranges must be a RangeBasic[]");
        }
        return folds;
    }

    /**
     * Returns all folds in the document
     */
    getAllFolds(): Fold[] {
        const folds: Fold[] = [];
        for (const foldLine of this.foldLines_) {
            for (const fold of foldLine.folds) {
                folds.push(fold);
            }
        }
        return folds;
    }

    /*
     * Returns the string between folds at the given position.
     * E.g.
     *  foo<fold>b|ar<fold>wolrd -> "bar"
     *  foo<fold>bar<fold>wol|rd -> "world"
     *  foo<fold>bar<fo|ld>wolrd -> <null>
     *
     * where | means the position of row/column
     *
     * The trim option determs if the return string should be trimed according
     * to the "side" passed with the trim value:
     *
     * E.g.
     *  foo<fold>b|ar<fold>wolrd -trim=-1> "b"
     *  foo<fold>bar<fold>wol|rd -trim=+1> "rld"
     *  fo|o<fold>bar<fold>wolrd -trim=00> "foo"
     */
    getFoldStringAt(row: number, column: number, trim: number, foldLine?: FoldLine | null): string | null | undefined {
        foldLine = foldLine || this.getFoldLine(row);
        if (!foldLine)
            return null;

        let lastFold = {
            end: { column: 0 }
        };
        // TODO: Refactor to use getNextFoldTo function.
        let str: string | undefined;
        let fold: Fold | undefined;
        for (let i = 0; i < foldLine.folds.length; i++) {
            fold = foldLine.folds[i];
            const cmp = compareEnd(fold.range, row, column);
            if (cmp === -1) {
                str = this.getLine(fold.start.row).substring(lastFold.end.column, fold.start.column);
                break;
            }
            else if (cmp === 0) {
                return null;
            }
            lastFold = fold;
        }
        if (!str) {
            if (fold) {
                str = this.getLine(fold.start.row).substring(lastFold.end.column);
            }
        }

        if (trim === -1) {
            if (str) {
                return str.substring(0, column - lastFold.end.column);
            }
            else {
                return undefined;
            }
        }
        else if (trim === 1) {
            if (str) {
                return str.substring(column - lastFold.end.column);
            }
            else {
                return undefined;
            }
        }
        else {
            return str;
        }
    }

    getFoldLine(docRow: number, startFoldLine?: FoldLine | null): FoldLine | null {
        const foldLines = this.foldLines_;
        let i = 0;
        if (startFoldLine) {
            i = foldLines.indexOf(startFoldLine);
        }
        if (i === -1) {
            i = 0;
        }
        for (i; i < foldLines.length; i++) {
            const foldLine = foldLines[i];
            if (foldLine.start.row <= docRow && foldLine.end.row >= docRow) {
                return foldLine;
            }
            else if (foldLine.end.row > docRow) {
                return null;
            }
        }
        return null;
    }

    // returns the fold which starts after or contains docRow
    getNextFoldLine(docRow: number, startFoldLine?: FoldLine): FoldLine | null {
        const foldData = this.foldLines_;
        let i = 0;
        if (startFoldLine)
            i = foldData.indexOf(startFoldLine);
        if (i === -1)
            i = 0;
        for (i; i < foldData.length; i++) {
            const foldLine = foldData[i];
            if (foldLine.end.row >= docRow) {
                return foldLine;
            }
        }
        return null;
    }

    getFoldedRowCount(first: number, last: number): number {
        const foldData = this.foldLines_;
        let rowCount = last - first + 1;
        for (let i = 0; i < foldData.length; i++) {
            const foldLine = foldData[i];
            const end = foldLine.end.row;
            const start = foldLine.start.row;
            if (end >= last) {
                if (start < last) {
                    if (start >= first)
                        rowCount -= last - start;
                    else
                        rowCount = 0; // in one fold
                }
                break;
            } else if (end >= first) {
                if (start >= first) // fold inside range
                    rowCount -= end - start;
                else
                    rowCount -= end - first + 1;
            }
        }
        return rowCount;
    }

    private $addFoldLine(foldLine: FoldLine) {
        this.foldLines_.push(foldLine);
        this.foldLines_.sort(function (a, b) {
            return a.start.row - b.start.row;
        });
        return foldLine;
    }

    addPlaceholderFold(placeholder: string, range: RangeWithCollapseChildren): Fold | undefined {
        const fold = new Fold(range, placeholder);
        fold.collapseChildren = range.collapseChildren;
        return this.addFold(fold);
    }

    /**
     * Adds a new fold.
     *
     * @returns
     *      The new created Fold object or an existing fold object in case the
     *      passed in range fits an existing fold exactly.
     */
    private addFold(fold: Fold): Fold | undefined {
        const foldData = this.foldLines_;
        let added = false;

        this.$clipRangeToDocument(fold.range);

        const startRow = fold.start.row;
        const startColumn = fold.start.column;
        const endRow = fold.end.row;
        const endColumn = fold.end.column;

        // --- Some checking ---
        if (!(startRow < endRow ||
            startRow === endRow && startColumn <= endColumn - 2))
            throw new Error("The range has to be at least 2 characters width");

        const startFold = this.getFoldAt(startRow, startColumn, 1);
        const endFold = this.getFoldAt(endRow, endColumn, -1);
        if (startFold && endFold === startFold)
            return startFold.addSubFold(fold);

        if (startFold && !isStart(startFold.range, startRow, startColumn))
            this.removeFold(startFold);

        if (endFold && !isEnd(endFold.range, endRow, endColumn))
            this.removeFold(endFold);

        // Check if there are folds in the range we create the new fold for.
        const folds = this.getFoldsInRange(fold.range);
        if (folds.length > 0) {
            // Remove the folds from fold data.
            this.removeFolds(folds);
            // Add the removed folds as subfolds on the new fold.
            folds.forEach(function (subFold) {
                fold.addSubFold(subFold);
            });
        }

        let foldLine: FoldLine | undefined;
        for (let i = 0; i < foldData.length; i++) {
            foldLine = foldData[i];
            if (endRow === foldLine.start.row) {
                foldLine.addFold(fold);
                added = true;
                break;
            } else if (startRow === foldLine.end.row) {
                foldLine.addFold(fold);
                added = true;
                if (!fold.sameRow) {
                    // Check if we might have to merge two FoldLines.
                    const foldLineNext = foldData[i + 1];
                    if (foldLineNext && foldLineNext.start.row === endRow) {
                        // We need to merge!
                        foldLine.merge(foldLineNext);
                        break;
                    }
                }
                break;
            } else if (endRow <= foldLine.start.row) {
                break;
            }
        }

        if (!added) {
            foldLine = this.$addFoldLine(new FoldLine(this.foldLines_, [fold]));
        }

        if (foldLine) {
            if (this.$useWrapMode)
                this.$updateWrapData(foldLine.start.row, foldLine.start.row);
            else
                this.$updateRowLengthCache(foldLine.start.row, foldLine.start.row);
        }

        // Notify that fold data has changed.
        this.$modified = true;
        this._signal("changeFold", { data: fold, action: "add" });

        return fold;
    }

    setModified(modified: boolean) {
        this.$modified = modified;
    }

    addFolds(folds: Fold[]) {
        folds.forEach((fold) => {
            this.addFold(fold);
        });
    }

    removeFold(fold: Fold): void {
        const foldLine = fold.foldLine;
        if (foldLine) {
            const startRow = foldLine.start.row;
            const endRow = foldLine.end.row;

            const foldLines = this.foldLines_;
            let folds = foldLine.folds;
            // Simple case where there is only one fold in the FoldLine such that
            // the entire fold line can get removed directly.
            if (folds.length === 1) {
                foldLines.splice(foldLines.indexOf(foldLine), 1);
            }
            else
                // If the fold is the last fold of the foldLine, just remove it.
                if (isEnd(foldLine.range, fold.end.row, fold.end.column)) {
                    folds.pop();
                    foldLine.end.row = folds[folds.length - 1].end.row;
                    foldLine.end.column = folds[folds.length - 1].end.column;
                }
                else
                    // If the fold is the first fold of the foldLine, just remove it.
                    if (isStart(foldLine.range, fold.start.row, fold.start.column)) {
                        folds.shift();
                        foldLine.start.row = folds[0].start.row;
                        foldLine.start.column = folds[0].start.column;
                    }
                    else
                        // We know there are more then 2 folds and the fold is not at the edge.
                        // This means, the fold is somewhere in between.
                        //
                        // If the fold is in one row, we just can remove it.
                        if (fold.sameRow) {
                            folds.splice(folds.indexOf(fold), 1);
                        } else {
                            // The fold goes over more then one row. This means remvoing this fold
                            // will cause the fold line to get splitted up. newFoldLine is the second part
                            const newFoldLine = foldLine.split(fold.start.row, fold.start.column);
                            if (newFoldLine) {
                                folds = newFoldLine.folds;
                                folds.shift();
                                newFoldLine.start.row = folds[0].start.row;
                                newFoldLine.start.column = folds[0].start.column;
                            }
                        }

            if (!this.$updating) {
                if (this.$useWrapMode)
                    this.$updateWrapData(startRow, endRow);
                else
                    this.$updateRowLengthCache(startRow, endRow);
            }

            // Notify that fold data has changed.
            this.setModified(true);
            /**
             * @event changeFold
             * @param foldEvent
             */
            const foldEvent: FoldEvent = { data: fold, action: "remove" };
            this.eventBus._emit("changeFold", foldEvent);
        }
    }

    removeFolds(folds: Fold[]): void {
        // We need to clone the folds array passed in as it might be the folds
        // array of a fold line and as we call this.removeFold(fold), folds
        // are removed from folds and changes the current index.
        const cloneFolds: Fold[] = [];
        for (let i = 0; i < folds.length; i++) {
            cloneFolds.push(folds[i]);
        }

        cloneFolds.forEach((fold) => {
            this.removeFold(fold);
        });
        this.setModified(true);
    }

    expandFold(fold: Fold): void {
        this.removeFold(fold);
        fold.subFolds.forEach((subFold) => {
            fold.restoreRange(subFold);
            this.addFold(subFold);
        });
        if (fold.collapseChildren > 0) {
            this.foldAll(fold.start.row + 1, fold.end.row, fold.collapseChildren - 1);
        }
        fold.subFolds = [];
    }

    expandFolds(folds: Fold[]) {
        folds.forEach((fold) => {
            this.expandFold(fold);
        });
    }

    getFirstLineNumber(): number {
        return this.firstLineNumber_;
    }

    setFirstLineNumber(firstLineNumber: number) {
        this.firstLineNumber_ = firstLineNumber;
        this._signal("changeBreakpoint");
    }

    /**
     *
     */
    unfold(location?: number | Position | RangeBasic, expandInner?: boolean): Fold[] | undefined {
        let range: RangeBasic;
        let folds: Fold[];
        // FIXME: Not handling undefined.
        if (location == null) {
            range = new Range(0, 0, this.getLength(), 0);
            expandInner = true;
        }
        else if (typeof location === "number")
            range = new Range(location, 0, location, this.getLine(location).length);
        else if (isPosition(location))
            range = Range.fromPoints(<Position>location, <Position>location);
        else if (isRange(location)) {
            range = location;
        }
        else {
            throw new TypeError("location must be one of number | Position | Range");
        }

        folds = this.getFoldsInRangeList([range]);
        if (expandInner) {
            this.removeFolds(folds);
        }
        else {
            let subFolds = folds;
            // TODO: might be better to remove and add folds in one go instead of using
            // expandFolds several times.
            while (subFolds.length) {
                this.expandFolds(subFolds);
                subFolds = this.getFoldsInRangeList([range]);
            }
        }
        if (folds.length) {
            return folds;
        }
        return void 0;
    }

    /*
     * Checks if a given documentRow is folded. This is true if there are some
     * folded parts such that some parts of the line is still visible.
     **/
    isRowFolded(docRow: number, startFoldRow: FoldLine): boolean {
        return !!this.getFoldLine(docRow, startFoldRow);
    }

    getRowFoldEnd(docRow: number, startFoldRow?: FoldLine): number {
        const foldLine = this.getFoldLine(docRow, startFoldRow);
        return foldLine ? foldLine.end.row : docRow;
    }

    getRowFoldStart(docRow: number, startFoldRow?: FoldLine): number {
        const foldLine = this.getFoldLine(docRow, startFoldRow);
        return foldLine ? foldLine.start.row : docRow;
    }

    getFoldDisplayLine(foldLine: FoldLine, endRow = foldLine.end.row, endColumn = this.getLine(endRow).length, startRow = foldLine.start.row, startColumn = 0): string {
        // Build the textline using the FoldLine walker.
        let textLine = "";

        foldLine.walk((placeholder: string, row: number, column: number, lastColumn: number) => {
            if (row < startRow)
                return;
            if (row === startRow) {
                if (column < startColumn)
                    return;
                lastColumn = Math.max(startColumn, lastColumn);
            }

            if (placeholder != null) {
                textLine += placeholder;
            }
            else {
                textLine += this.getLine(row).substring(lastColumn, column);
            }
        }, endRow, endColumn);
        return textLine;
    }

    getDisplayLine(row: number, endColumn: number | undefined, startRow: number, startColumn: number): string {
        const foldLine = this.getFoldLine(row);
        if (!foldLine) {
            const line = this.getLine(row);
            return line.substring(startColumn || 0, endColumn || line.length);
        }
        else {
            return this.getFoldDisplayLine(foldLine, row, endColumn, startRow, startColumn);
        }
    }

    toggleFold(tryToUnfold: boolean): void {
        const selection = this.selection;
        if (selection) {
            let range: RangeWithCollapseChildren = selection.getRange();
            let fold: Fold | null | undefined;
            let bracketPos: Position | null;

            if (isEmpty(range)) {
                const cursor = range.start;
                fold = this.getFoldAt(cursor.row, cursor.column);

                if (fold) {
                    this.expandFold(fold);
                    return;
                } else if (bracketPos = this.findMatchingBracket(cursor)) {
                    if (comparePoint(range, bracketPos) === 1) {
                        range.end = bracketPos;
                    }
                    else {
                        range.start = bracketPos;
                        range.start.column++;
                        range.end.column--;
                    }
                }
                else if (bracketPos = this.findMatchingBracket({ row: cursor.row, column: cursor.column + 1 })) {
                    if (comparePoint(range, bracketPos) === 1)
                        range.end = bracketPos;
                    else
                        range.start = bracketPos;

                    range.start.column++;
                }
                else {
                    range = this.getCommentFoldRange(cursor.row, cursor.column) || range;
                }
            }
            else {
                const folds = this.getFoldsInRange(range);
                if (tryToUnfold && folds.length) {
                    this.expandFolds(folds);
                    return;
                }
                else if (folds.length === 1) {
                    fold = folds[0];
                }
            }

            if (!fold)
                fold = this.getFoldAt(range.start.row, range.start.column);

            if (fold && fold.range.toString() === range.toString()) {
                this.expandFold(fold);
                return;
            }

            let placeholder = "...";
            if (!isMultiLine(range)) {
                placeholder = this.getTextRange(range);
                if (placeholder.length < 4) {
                    return;
                }
                placeholder = placeholder.trim().substring(0, 2) + "..";
            }

            this.addPlaceholderFold(placeholder, range);
        }
    }

    getCommentFoldRange(row: number, column: number, dir?: number): RangeWithCollapseChildren | undefined {
        const startTokens = new TokenIterator(this, row, column);
        let token: Token | null = startTokens.getCurrentToken();
        if (token) {
            const type = token.type;
            if (/^comment|string/.test(type)) {
                const matches = type.match(/comment|string/);
                if (matches) {
                    let type = matches[0];
                    if (type === "comment") {
                        type += "|doc-start";
                    }
                    const re = new RegExp(type);
                    if (dir !== 1) {
                        do {
                            token = startTokens.stepBackward();
                        }
                        while (token && re.test(token.type));
                        startTokens.stepForward();
                    }
                    const startRow = startTokens.getCurrentTokenRow();
                    const startColumn = startTokens.getCurrentTokenColumn() + 2;

                    const endTokens = new TokenIterator(this, row, column);

                    if (dir !== -1) {
                        let lastRow = -1;
                        do {
                            token = endTokens.stepForward();
                            if (lastRow === -1) {
                                const state = this.getState(endTokens.getCurrentTokenRow());
                                if (!re.test(state)) {
                                    lastRow = endTokens.getCurrentTokenRow();
                                }
                            }
                            else if (endTokens.getCurrentTokenRow() > lastRow) {
                                break;
                            }
                        }
                        while (token && re.test(token.type));
                        token = endTokens.stepBackward();
                    }
                    else {
                        token = endTokens.getCurrentToken();
                    }
                    if (token) {
                        const endRow = endTokens.getCurrentTokenRow();
                        const endColumn = endTokens.getCurrentTokenColumn() + token.value.length - 2;
                        return new Range(startRow, startColumn, endRow, endColumn);
                    }
                }
            }
        }
        return void 0;
    }

    /**
     *
     */
    foldAll(startRow?: number, endRow?: number, depth?: number): void {
        if (depth === void 0) {
            depth = 100000; // JSON.stringify doesn't handle Infinity
        }
        const foldWidgets = this.foldWidgets;
        if (!foldWidgets) {
            return; // mode doesn't support folding
        }
        endRow = endRow || this.getLength();
        startRow = startRow || 0;
        for (let row = startRow; row < endRow; row++) {
            // TODO: Check this out.
            if (foldWidgets[row] == null)
                foldWidgets[row] = this.getFoldWidget(row);
            if (foldWidgets[row] !== "start")
                continue;

            const range = this.getFoldWidgetRange(row);
            // sometimes range can be incompatible with existing fold
            // TODO change addFold to return null istead of throwing
            if (range && isMultiLine(range)
                && range.end.row <= endRow
                && range.start.row >= startRow
            ) {
                row = range.end.row;
                try {
                    // addFold can change the range
                    const fold = this.addPlaceholderFold("...", range);
                    if (fold)
                        fold.collapseChildren = depth;
                } catch (e) {
                    // Do nothing.
                }
            }
        }
    }

    setFoldStyle(style: FoldStyle) {
        if (!this.$foldStyles[style])
            throw new Error("invalid fold style: " + style + "[" + Object.keys(this.$foldStyles).join(", ") + "]");

        if (this.$foldStyle === style)
            return;

        this.$foldStyle = style;

        if (style === "manual")
            this.unfold();

        // reset folding
        const mode = this.$foldMode;
        this.$setFolding(null);
        this.$setFolding(mode);
    }

    private $setFolding(foldMode: FoldMode | null) {
        if (this.$foldMode === foldMode)
            return;

        this.$foldMode = foldMode;

        this.eventBus.off('change', this.$updateFoldWidgets);
        this.eventBus._emit("changeAnnotation");

        if (!foldMode || this.$foldStyle === "manual") {
            this.foldWidgets = null;
            return;
        }

        this.foldWidgets = [];
        this.getFoldWidget = foldMode.getFoldWidget.bind(foldMode, this, this.$foldStyle);
        this.getFoldWidgetRange = foldMode.getFoldWidgetRange.bind(foldMode, this, this.$foldStyle);

        this.$updateFoldWidgets = this.updateFoldWidgets.bind(this);
        this.eventBus.on('change', this.$updateFoldWidgets);

    }

    getParentFoldRangeData(row: number, ignoreCurrent?: boolean): { range?: RangeWithCollapseChildren; firstRange?: RangeWithCollapseChildren } {
        const fw = this.foldWidgets;
        if (!fw || (ignoreCurrent && fw[row])) {
            return {};
        }

        let i = row - 1;
        let firstRange: RangeWithCollapseChildren | undefined;
        let range: RangeWithCollapseChildren | undefined;
        while (i >= 0) {
            let c = fw[i];
            if (c == null)
                c = fw[i] = this.getFoldWidget(i);

            if (c === "start") {
                range = this.getFoldWidgetRange(i);
                if (!firstRange)
                    firstRange = range;
                if (range && range.end.row >= row)
                    break;
            }
            i--;
        }

        if (i !== -1) {
            return { range: range, firstRange: firstRange };
        }
        else {
            return { range: void 0, firstRange: firstRange };
        }
    }

    /**
     * 
     */
    onFoldWidgetClick(row: number, e: EditorMouseEvent) {
        const domEvent = e.domEvent;
        const options = {
            children: domEvent.shiftKey,
            all: domEvent.ctrlKey || domEvent.metaKey,
            siblings: domEvent.altKey
        };

        const range = this.$toggleFoldWidget(row, options);
        if (!range) {
            const el = (domEvent.target || domEvent.srcElement);
            // domEvent.srcElement.className but not on domEvent.target!
            if (el && /ace_fold-widget/.test(el['className'])) {
                el['className'] += " ace_invalid";
            }
        }
    }

    /**
     * 
     */
    private $toggleFoldWidget(row: number, options: { children?: boolean; all?: boolean; siblings?: boolean }): RangeWithCollapseChildren | undefined {
        // Dead code
        if (!this.getFoldWidget) {
            return void 0;
        }

        const type = this.getFoldWidget(row);
        const line = this.getLine(row);
        const dir = (type === "end") ? -1 : 1;
        const fold = this.getFoldAt(row, dir === -1 ? 0 : line.length, dir);

        if (fold) {
            if (options.children || options.all) {
                this.removeFold(fold);
            }
            else {
                this.expandFold(fold);
            }
            return void 0;
        }

        const range = this.getFoldWidgetRange(row, true);
        // sometimes singleline folds can be missed by the code above
        if (range && !isMultiLine(range)) {
            const fold = this.getFoldAt(range.start.row, range.start.column, 1);
            if (fold && isEqual(range, fold.range)) {
                this.removeFold(fold);
                return void 0;
            }
        }

        let startRow: number | undefined;
        let endRow: number | undefined;

        if (options.siblings) {
            const data = this.getParentFoldRangeData(row);
            if (data.range) {
                startRow = data.range.start.row + 1;
                endRow = data.range.end.row;
            }
            this.foldAll(startRow, endRow, options.all ? 10000 : 0);
        }
        else if (options.children) {
            endRow = range ? range.end.row : this.getLength();
            this.foldAll(row + 1, range.end.row, options.all ? 10000 : 0);
        }
        else if (range) {
            if (options.all) {
                // This is a bit ugly, but it corresponds to some code elsewhere.
                range.collapseChildren = 10000;
            }
            this.addPlaceholderFold("...", range);
        }
        return range;
    }

    /**
     * @param toggleParent WARNING: unused
     */
    toggleFoldWidget(toggleParent?: boolean): void {
        const selection = this.selectionOrThrow();
        let row = selection.getCursor().row;
        row = this.getRowFoldStart(row);
        let range = this.$toggleFoldWidget(row, {});

        if (range) {
            return;
        }
        // handle toggleParent
        const data = this.getParentFoldRangeData(row, true);
        range = data.range || data.firstRange;

        if (range) {
            row = range.start.row;
            const fold = this.getFoldAt(row, this.getLine(row).length, 1);

            if (fold) {
                this.removeFold(fold);
            }
            else {
                this.addPlaceholderFold("...", range);
            }
        }
    }

    updateFoldWidgets(delta: Delta, editSession: EditSession): void {
        const firstRow = delta.start.row;
        const len = delta.end.row - firstRow;

        if (this.foldWidgets) {
            if (len === 0) {
                this.foldWidgets[firstRow] = null;
            }
            else if (delta.action === "remove") {
                this.foldWidgets.splice(firstRow, len + 1, null);
            }
            else {
                const args = Array<number>(len + 1);
                args.unshift(firstRow, 1);
                this.foldWidgets.splice.apply(this.foldWidgets, args);
            }
        }
    }

    /**
     *
     */
    tokenizerUpdateFoldWidgets = (event: { data: FirstAndLast }) => {
        const rows = event.data;
        if (rows.first !== rows.last) {
            if (this.foldWidgets && this.foldWidgets.length > rows.first) {
                this.foldWidgets.splice(rows.first, this.foldWidgets.length);
            }
        }
    }

    setWrap(value: string) {
        let val: boolean | number | string;
        if (!value || value === "off")
            val = false;
        else if (value === "free")
            val = true;
        else if (value === "printMargin")
            val = -1;
        else if (typeof value === "string")
            val = parseInt(value, 10) || false;
        else
            val = value;

        if (this.$wrap === val)
            return;
        if (!val) {
            this.setUseWrapMode(false);
        } else {
            const col = typeof val === "number" ? val : null;
            this.setWrapLimitRange(col, col);
            this.setUseWrapMode(true);
        }
        this.$wrap = val;
    }
    getWrap(): boolean | string | number {
        if (this.getUseWrapMode()) {
            if (this.$wrap === -1)
                return "printMargin";
            if (!this.getWrapLimitRange().min)
                return "free";
            return this.$wrap;
        }
        return "off";
    }
}
