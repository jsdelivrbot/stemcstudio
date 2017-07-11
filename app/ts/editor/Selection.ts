import { Document, Position } from "editor-document";
import { stringReverse } from "./lib/lang";
import { EventEmitterClass } from "./lib/EventEmitterClass";
import { Range } from "./Range";
import { RangeBasic } from "./RangeBasic";
import { clone, isEmpty, isEqual, isMultiLine } from "./RangeHelpers";
import { RangeList } from "./RangeList";
import { EditSession } from "./EditSession";
import { Anchor } from "./Anchor";
import { AnchorChangeEvent } from "./events/AnchorChangeEvent";
import { EventBus } from "./EventBus";
import { SelectionAddRangeEvent } from "./events/SelectionAddRangeEvent";
import { SelectionRemoveRangeEvent } from "./events/SelectionRemoveRangeEvent";
import { OrientedRange } from '../editor/RangeBasic';

/**
 * Nothing (void 0).
 */
const NOTHING: undefined = void 0;

export type SelectionEventName = 'addRange'
    | 'changeCursor'
    | 'changeSelection'
    | 'removeRange'
    | 'multiSelect'
    | 'singleSelect';

/**
 * Contains the cursor position and the text selection of an edit session.
 *
 * The row/columns used in the selection are in document coordinates representing
 * the coordinates as they appear in the document before applying soft wrap and folding.
 */
export class Selection implements EventBus<SelectionEventName, any, Selection> {
    private session: EditSession | null;
    private doc: Document | null | undefined;

    /**
     *
     */
    public lead: Anchor;

    /**
     *
     */
    public anchor: Anchor;

    private selectionLead: Anchor;
    private selectionAnchor: Anchor;
    private $isEmpty: boolean;
    private $keepDesiredColumnOnChange: boolean;

    /**
     *
     */
    public $desiredColumn: number | null;

    /**
     *
     */
    public index: number;

    /**
     *
     */
    public _eventRegistry: {};

    /**
     *
     */
    public inMultiSelectMode: boolean;

    /**
     *
     */
    public rangeCount = 0;

    /**
     * List of ranges in reverse addition order.
     */
    public ranges: OrientedRange[] = [];

    /**
     * Automatically sorted list of ranges.
     */
    public rangeList = new RangeList<OrientedRange>();

    /**
     *
     */
    public inVirtualMode: boolean;

    private eventBus: EventEmitterClass<SelectionEventName, any, Selection>;

    constructor(session: EditSession) {
        this.eventBus = new EventEmitterClass<SelectionEventName, any, Selection>(this);
        this.session = session;
        this.doc = session.getDocument();

        this.clearSelection();
        if (this.doc) {
            this.lead = this.selectionLead = new Anchor(this.doc, 0, 0);
            this.anchor = this.selectionAnchor = new Anchor(this.doc, 0, 0);
        }

        // FIXME: This isn't removed.
        this.lead.on("change", (event: AnchorChangeEvent, source: Anchor) => {
            /**
             * @event changeCursor
             */
            this.eventBus._emit("changeCursor");
            if (!this.$isEmpty) {
                /**
                 * @event changeSelection
                 */
                this.eventBus._emit("changeSelection");
            }
            if (!this.$keepDesiredColumnOnChange && event.oldPosition.column !== event.position.column) {
                this.$desiredColumn = null;
            }
        });

        // FIXME: This isn't removed.
        this.selectionAnchor.on("change", (event: AnchorChangeEvent, source: Anchor) => {
            if (!this.$isEmpty) {
                /**
                 * @event changeSelection
                 */
                this.eventBus._emit("changeSelection");
            }
        });
    }

    /**
     * adds multicursor support to selection
     */
    public ensureRangeList(): RangeList<RangeBasic> {
        if (this.rangeList) {
            return this.rangeList;
        }

        this.rangeList = new RangeList<OrientedRange>();
        this.ranges = [];
        this.rangeCount = 0;
        return this.rangeList;
    }

    /**
     * Removes a Range containing pos (if it exists).
     * If the selection contains a Range that contains the point, the Range is returned.
     * Otherwise, nothing is returned.
     */
    substractPoint(pos: Position): RangeBasic | undefined {
        const removed = this.rangeList.substractPoint(pos);
        if (removed) {
            this.$onRemoveRange(removed);
            return removed[0];
        }
        return NOTHING;
    }

    /**
     * Returns a concatenation of all the ranges.
     */
    public getAllRanges(): OrientedRange[] {
        return this.rangeCount ? this.rangeList.ranges.concat() : [this.getRange()];
    }

    /**
     * Splits all the ranges into lines.
     */
    splitIntoLines(): void {
        if (this.rangeCount > 1) {
            const ranges = this.rangeList.ranges;
            const lastRange = ranges[ranges.length - 1];
            const range = Range.fromPoints(ranges[0].start, lastRange.end);

            this.toSingleRange();
            this.setSelectionRange(range, lastRange.cursor === lastRange.start);
        }
        else {
            const range = this.getRange();
            const isBackwards = this.isBackwards();
            const startRow = range.start.row;
            const endRow = range.end.row;
            let start: Position;
            let end: Position;
            if (startRow === endRow) {
                if (isBackwards) {
                    start = range.end;
                    end = range.start;
                }
                else {
                    start = range.start;
                    end = range.end;
                }

                this.addRange(Range.fromPoints(end, end));
                this.addRange(Range.fromPoints(start, start));
                return;
            }

            const rectSel: Range[] = [];
            let r = this.getLineRange(startRow, true);
            r.start.column = range.start.column;
            rectSel.push(r);

            for (let i = startRow + 1; i < endRow; i++) {
                rectSel.push(this.getLineRange(i, true));
            }

            r = this.getLineRange(endRow, true);
            r.end.column = range.end.column;
            rectSel.push(r);

            rectSel.forEach((range: Range) => { this.addRange(range); });
        }
    }

    /**
     * Returns `true` if the selection is empty.
     */
    isEmpty(): boolean {
        // What is the difference between $isEmpty and what this function returns?
        return (this.$isEmpty || (
            this.anchor.row === this.lead.row &&
            this.anchor.column === this.lead.column
        ));
    }

    /**
     * Returns `true` if the selection is a multi-line.
     */
    isMultiLine(): boolean {
        if (this.isEmpty()) {
            return false;
        }

        return isMultiLine(this.getRange());
    }

    /**
     * Returns the current position of the cursor.
     */
    getCursor(): Position {
        return this.lead.getPosition();
    }

    /**
     * Sets the row and column position of the anchor.
     * This function also emits the `'changeSelection'` event.
     */
    setSelectionAnchor(row: number, column: number): void {

        if (typeof row !== 'number') {
            throw new TypeError("row must be a number");
        }

        if (typeof column !== 'number') {
            throw new TypeError("column must be a number");
        }

        this.anchor.setPosition(row, column);

        if (this.$isEmpty) {
            this.$isEmpty = false;
            /**
             * @event changeSelection
             */
            this.eventBus._emit("changeSelection");
        }
    }

    /**
     * Returns the position of the calling selection anchor.
     */
    getSelectionAnchor(): Position {
        if (this.$isEmpty) {
            return this.getSelectionLead();
        }
        else {
            return this.anchor.getPosition();
        }
    }

    /**
     * Returns an object containing the `row` and `column` of the calling selection lead.
     */
    getSelectionLead(): Position {
        return this.lead.getPosition();
    }

    /**
     * Shifts the selection up (or down, if [[Selection.isBackwards `isBackwards()`]] is true) the given number of columns.
     */
    shiftSelection(columns: number): void {
        if (this.$isEmpty) {
            this.moveCursorTo(this.lead.row, this.lead.column + columns);
            return;
        }

        const anchor = this.getSelectionAnchor();
        const lead = this.getSelectionLead();

        const isBackwards = this.isBackwards();

        if (!isBackwards || anchor.column !== 0)
            this.setSelectionAnchor(anchor.row, anchor.column + columns);

        if (isBackwards || lead.column !== 0) {
            this.$moveSelection(function () {
                this.moveCursorTo(lead.row, lead.column + columns);
            });
        }
    }

    /**
     * Returns `true` if the selection is going backwards in the document.
     */
    isBackwards(): boolean {
        const anchor: Anchor = this.anchor;
        const lead: Anchor = this.lead;
        return (anchor.row > lead.row || (anchor.row === lead.row && anchor.column > lead.column));
    }

    /**
     * Returns the range for the selected text.
     */
    getRange(): OrientedRange {

        const anchor: Anchor = this.anchor;
        const lead: Anchor = this.lead;

        if (typeof anchor.row !== 'number') {
            throw new TypeError();
        }
        if (typeof anchor.column !== 'number') {
            throw new TypeError();
        }

        if (typeof lead.row !== 'number') {
            throw new TypeError();
        }
        if (typeof lead.column !== 'number') {
            throw new TypeError();
        }

        if (this.isEmpty())
            return Range.fromPoints(lead, lead);

        if (this.isBackwards()) {
            return Range.fromPoints(lead, anchor);
        }
        else {
            return Range.fromPoints(anchor, lead);
        }
    }

    /**
     * Empties the selection (by de-selecting it).
     * This function also emits the `'changeSelection'` event.
     */
    clearSelection(): void {
        if (!this.$isEmpty) {
            this.$isEmpty = true;
            /**
             * @event changeSelection
             */
            this.eventBus._emit("changeSelection");
        }
    }

    /**
     * Selects all the text in the document.
     */
    selectAll(): void {
        if (this.doc) {
            const lastRow = this.doc.getLength() - 1;
            this.setSelectionAnchor(0, 0);
            this.moveCursorTo(lastRow, this.doc.getLine(lastRow).length);
        }
    }

    /**
     * Sets the selection to the provided range.
     *
     * @param The range of text to select
     * @param reverse Indicates if the range should go backwards (`true`) or not
     */
    public setRange(range: RangeBasic, reverse?: boolean): void {
        this.setSelectionRange(range, reverse);
    }

    public setSelectionRange(range: Readonly<RangeBasic>, reverse?: boolean): void {
        if (reverse) {
            this.setSelectionAnchor(range.end.row, range.end.column);
            this.selectTo(range.start.row, range.start.column);
        }
        else {
            this.setSelectionAnchor(range.start.row, range.start.column);
            this.selectTo(range.end.row, range.end.column);
        }
        if (isEmpty(this.getRange())) {
            this.$isEmpty = true;
        }
        this.$desiredColumn = null;
    }

    public $moveSelection(mover: (this: Selection) => any): void {
        const lead = this.lead;
        if (this.$isEmpty) {
            this.setSelectionAnchor(lead.row, lead.column);
        }

        mover.call(this);
    }

    /**
     * Moves the selection cursor to the indicated row and column.
     */
    selectTo(row: number, column: number): void {
        this.$moveSelection(function () {
            this.moveCursorTo(row, column);
        });
    }

    /**
     * Moves the selection cursor to the row and column indicated by `pos`.
     */
    selectToPosition(position: Position): void {
        this.$moveSelection(() => {
            this.moveCursorToPosition(position);
        });
    }

    /**
     * Moves the selection cursor to the indicated row and column.
     */
    moveTo(row: number, column: number): void {
        this.clearSelection();
        this.moveCursorTo(row, column);
    }

    /**
     * Moves the selection cursor to the row and column indicated by `pos`.
     */
    moveToPosition(pos: Position): void {
        this.clearSelection();
        this.moveCursorToPosition(pos);
    }


    /**
     * Moves the selection up one row.
     */
    selectUp(): void {
        this.$moveSelection(this.moveCursorUp);
    }

    /**
     * Moves the selection down one row.
     */
    selectDown(): void {
        this.$moveSelection(this.moveCursorDown);
    }

    /**
     * Moves the selection right one column.
     */
    selectRight() {
        this.$moveSelection(this.moveCursorRight);
    }

    /**
     * Moves the selection left one column.
     */
    selectLeft() {
        this.$moveSelection(this.moveCursorLeft);
    }

    /**
     * Moves the selection to the beginning of the current line.
     */
    selectLineStart() {
        this.$moveSelection(this.moveCursorLineStart);
    }

    /**
     * Moves the selection to the end of the current line.
     */
    selectLineEnd() {
        this.$moveSelection(this.moveCursorLineEnd);
    }

    /**
     * Moves the selection to the end of the file.
     */
    selectFileEnd(): void {
        this.$moveSelection(this.moveCursorFileEnd);
    }

    /**
     * Moves the selection to the start of the file.
     */
    selectFileStart(): void {
        this.$moveSelection(this.moveCursorFileStart);
    }

    /**
     * Moves the selection to the first word on the right.
     */
    selectWordRight(): void {
        this.$moveSelection(this.moveCursorWordRight);
    }

    /**
     * Moves the selection to the first word on the left.
     */
    selectWordLeft(): void {
        this.$moveSelection(this.moveCursorWordLeft);
    }

    sessionOrThrow(): EditSession {
        if (this.session) {
            return this.session;
        }
        else {
            throw new Error("session must exist");
        }
    }

    /**
     * Moves the selection to highlight the entire word.
     */
    getWordRange(row?: number, column?: number): OrientedRange {
        const session = this.sessionOrThrow();
        if (typeof row === 'undefined' || typeof column === 'undefined') {
            const cursor: Anchor = this.lead;
            row = cursor.row;
            column = cursor.column;
        }
        return session.getWordRange(row, column);
    }

    /**
     * Selects an entire word boundary.
     */
    selectWord(): void {
        this.setSelectionRange(this.getWordRange(this.lead.row, this.lead.column));
    }

    /**
     * Selects a word, including its right whitespace.
     */
    selectAWord(): void {
        const session = this.sessionOrThrow();
        const cursor = this.getCursor();
        const range = session.getAWordRange(cursor.row, cursor.column);
        this.setSelectionRange(range);
    }

    /**
     *
     */
    getLineRange(row?: number, excludeLastChar?: boolean): Range {
        const session = this.sessionOrThrow();
        let rowStart = typeof row === "number" ? row : this.lead.row;
        let rowEnd: number;

        const foldLine = session.getFoldLine(rowStart);
        if (foldLine) {
            rowStart = foldLine.start.row;
            rowEnd = foldLine.end.row;
        }
        else {
            rowEnd = rowStart;
        }

        if (excludeLastChar) {
            return new Range(rowStart, 0, rowEnd, session.getLine(rowEnd).length);
        }
        else {
            return new Range(rowStart, 0, rowEnd + 1, 0);
        }
    }

    /**
     * Selects the entire line.
     */
    selectLine(): void {
        this.setSelectionRange(this.getLineRange());
    }

    /**
     * Merges overlapping ranges ensuring consistency after changes.
     */
    mergeOverlappingRanges(): void {
        const removed = this.rangeList.merge();
        if (removed.length) {
            this.$onRemoveRange(removed);
        }
        else if (this.ranges[0]) {
            this.fromOrientedRange(this.ranges[0]);
        }
    }

    /**
     * Moves the cursor up one row.
     */
    moveCursorUp(): void {
        this.moveCursorBy(-1, 0);
    }

    /**
     * Moves the cursor down one row.
     */
    moveCursorDown(): void {
        this.moveCursorBy(1, 0);
    }

    /**
     * Moves the cursor left one column.
     */
    moveCursorLeft(): void {
        const session = this.sessionOrThrow();
        const cursor = this.lead.getPosition();

        const fold = session.getFoldAt(cursor.row, cursor.column, -1);
        if (fold) {
            this.moveCursorTo(fold.start.row, fold.start.column);
        }
        else if (cursor.column === 0) {
            // cursor is a line (start
            if (this.doc && cursor.row > 0) {
                this.moveCursorTo(cursor.row - 1, this.doc.getLine(cursor.row - 1).length);
            }
        }
        else if (this.doc) {
            const tabSize = session.getTabSize();
            if (session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column - tabSize, cursor.column).split(" ").length - 1 === tabSize)
                this.moveCursorBy(0, -tabSize);
            else
                this.moveCursorBy(0, -1);
        }
    }

    /**
     * Moves the cursor right one column.
     */
    moveCursorRight(): void {
        const session = this.sessionOrThrow();
        const pos = this.lead.getPosition();
        const fold = session.getFoldAt(pos.row, pos.column, 1);
        if (fold) {
            this.moveCursorTo(fold.end.row, fold.end.column);
        }
        else if (this.doc) {
            if (this.lead.column === this.doc.getLine(this.lead.row).length) {
                if (this.lead.row < this.doc.getLength() - 1) {
                    this.moveCursorTo(this.lead.row + 1, 0);
                }
            }
            else {
                const tabSize = session.getTabSize();
                const cursor = this.lead;
                if (session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column, cursor.column + tabSize).split(" ").length - 1 === tabSize) {
                    this.moveCursorBy(0, tabSize);
                }
                else {
                    this.moveCursorBy(0, 1);
                }
            }

        }
    }

    /**
     * Moves the cursor to the start of the line.
     */
    moveCursorLineStart(): void {
        const session = this.sessionOrThrow();
        const row = this.lead.row;
        const column = this.lead.column;
        const screenRow = session.documentToScreenRow(row, column);

        // Determine the document position of the first character at the screen line.
        const firstColumnPosition = session.screenToDocumentPosition(screenRow, 0);

        // Determine the line
        // How does getDisplayLine get from folding onto session?
        const beforeCursor = session.getDisplayLine(row, void 0, firstColumnPosition.row, firstColumnPosition.column);

        const leadingSpace = beforeCursor.match(/^\s*/);
        if (leadingSpace) {
            // TODO find better way for emacs mode to override selection behaviors
            if (leadingSpace[0].length !== column && !session.$useEmacsStyleLineStart) {
                firstColumnPosition.column += leadingSpace[0].length;
            }
        }
        this.moveCursorToPosition(firstColumnPosition);
    }

    /**
     * Moves the cursor to the end of the line.
     */
    moveCursorLineEnd(): void {
        const session = this.sessionOrThrow();
        const lead = this.lead;
        const lineEnd = session.getDocumentLastRowColumnPosition(lead.row, lead.column);
        if (this.lead.column === lineEnd.column) {
            const line = session.getLine(lineEnd.row);
            if (lineEnd.column === line.length) {
                const textEnd = line.search(/\s+$/);
                if (textEnd > 0)
                    lineEnd.column = textEnd;
            }
        }
        this.moveCursorTo(lineEnd.row, lineEnd.column);
    }

    /**
     * Moves the cursor to the end of the file.
     */
    moveCursorFileEnd(): void {
        if (this.doc) {
            const row = this.doc.getLength() - 1;
            const column = this.doc.getLine(row).length;
            this.moveCursorTo(row, column);
        }
    }

    /**
     * Moves the cursor to the start of the file.
     */
    moveCursorFileStart(): void {
        this.moveCursorTo(0, 0);
    }

    /**
     * Moves the cursor to the word on the right.
     */
    moveCursorLongWordRight(): void {
        const session = this.sessionOrThrow();
        if (this.doc) {
            const row = this.lead.row;
            let column = this.lead.column;
            const line = this.doc.getLine(row);
            let rightOfCursor = line.substring(column);

            let match: RegExpExecArray | null;
            session.nonTokenRe.lastIndex = 0;
            session.tokenRe.lastIndex = 0;

            // skip folds
            const fold = session.getFoldAt(row, column, 1);
            if (fold) {
                this.moveCursorTo(fold.end.row, fold.end.column);
                return;
            }

            // first skip space
            if (match = session.nonTokenRe.exec(rightOfCursor)) {
                column += session.nonTokenRe.lastIndex;
                session.nonTokenRe.lastIndex = 0;
                rightOfCursor = line.substring(column);
            }

            // if at line end proceed with next line
            if (column >= line.length) {
                this.moveCursorTo(row, line.length);
                this.moveCursorRight();
                if (row < this.doc.getLength() - 1) {
                    this.moveCursorWordRight();
                }
                return;
            }

            // advance to the end of the next token
            if (match = session.tokenRe.exec(rightOfCursor)) {
                column += session.tokenRe.lastIndex;
                session.tokenRe.lastIndex = 0;
            }

            this.moveCursorTo(row, column);
        }
    }

    /**
     * Moves the cursor to the word on the left.
     */
    moveCursorLongWordLeft(): void {
        const session = this.sessionOrThrow();
        if (this.doc) {
            const row = this.lead.row;
            let column = this.lead.column;

            // Skip folds.
            const fold = session.getFoldAt(row, column, -1);
            if (fold) {
                this.moveCursorTo(fold.start.row, fold.start.column);
                return;
            }

            // How does this get from the folding adapter onto the session?
            let str = session.getFoldStringAt(row, column, -1);
            if (str == null) {
                str = this.doc.getLine(row).substring(0, column);
            }

            let leftOfCursor = stringReverse(str);
            let match: RegExpMatchArray | null;
            session.nonTokenRe.lastIndex = 0;
            session.tokenRe.lastIndex = 0;

            // skip whitespace
            if (match = session.nonTokenRe.exec(leftOfCursor)) {
                column -= session.nonTokenRe.lastIndex;
                leftOfCursor = leftOfCursor.slice(session.nonTokenRe.lastIndex);
                session.nonTokenRe.lastIndex = 0;
            }

            // if at begin of the line proceed in line above
            if (column <= 0) {
                this.moveCursorTo(row, 0);
                this.moveCursorLeft();
                if (row > 0)
                    this.moveCursorWordLeft();
                return;
            }

            // move to the begin of the word
            if (match = session.tokenRe.exec(leftOfCursor)) {
                column -= session.tokenRe.lastIndex;
                session.tokenRe.lastIndex = 0;
            }

            this.moveCursorTo(row, column);
        }
    }

    /**
     *
     */
    private $shortWordEndIndex(rightOfCursor: string): number {
        const session = this.sessionOrThrow();
        let match: RegExpMatchArray | null;
        let index = 0;
        let ch: string;
        const whitespaceRe = /\s/;
        const tokenRe = session.tokenRe;

        tokenRe.lastIndex = 0;
        if (match = session.tokenRe.exec(rightOfCursor)) {
            index = session.tokenRe.lastIndex;
        }
        else {
            while ((ch = rightOfCursor[index]) && whitespaceRe.test(ch))
                index++;

            if (index < 1) {
                tokenRe.lastIndex = 0;
                while ((ch = rightOfCursor[index]) && !tokenRe.test(ch)) {
                    tokenRe.lastIndex = 0;
                    index++;
                    if (whitespaceRe.test(ch)) {
                        if (index > 2) {
                            index--;
                            break;
                        } else {
                            while ((ch = rightOfCursor[index]) && whitespaceRe.test(ch))
                                index++;
                            if (index > 2)
                                break;
                        }
                    }
                }
            }
        }
        tokenRe.lastIndex = 0;

        return index;
    }

    moveCursorShortWordRight() {
        const session = this.sessionOrThrow();
        if (this.doc) {
            let row = this.lead.row;
            let column = this.lead.column;
            const line = this.doc.getLine(row);
            let rightOfCursor = line.substring(column);

            const fold = session.getFoldAt(row, column, 1);
            if (fold)
                return this.moveCursorTo(fold.end.row, fold.end.column);

            if (column === line.length) {
                const l = this.doc.getLength();
                do {
                    row++;
                    rightOfCursor = this.doc.getLine(row);
                } while (row < l && /^\s*$/.test(rightOfCursor));

                if (!/^\s+/.test(rightOfCursor))
                    rightOfCursor = "";
                column = 0;
            }

            const index = this.$shortWordEndIndex(rightOfCursor);

            this.moveCursorTo(row, column + index);
        }
    }

    moveCursorShortWordLeft() {
        const session = this.sessionOrThrow();
        if (this.doc) {
            let row = this.lead.row;
            let column = this.lead.column;

            const fold = session.getFoldAt(row, column, -1);
            if (fold) {
                return this.moveCursorTo(fold.start.row, fold.start.column);
            }

            let line = session.getLine(row).substring(0, column);
            if (column === 0) {
                do {
                    row--;
                    line = this.doc.getLine(row);
                } while (row > 0 && /^\s*$/.test(line));

                column = line.length;
                if (!/\s+$/.test(line))
                    line = "";
            }

            const leftOfCursor = stringReverse(line);
            const index = this.$shortWordEndIndex(leftOfCursor);

            return this.moveCursorTo(row, column - index);
        }
    }

    moveCursorWordRight(): void {
        const session = this.sessionOrThrow();
        if (session.$selectLongWords) {
            this.moveCursorLongWordRight();
        }
        else {
            this.moveCursorShortWordRight();
        }
    }

    moveCursorWordLeft(): void {
        const session = this.sessionOrThrow();
        if (session.$selectLongWords) {
            this.moveCursorLongWordLeft();
        }
        else {
            this.moveCursorShortWordLeft();
        }
    }

    /**
     * Moves the cursor to position indicated by the parameters.
     * Negative numbers move the cursor backwards in the document.
     */
    moveCursorBy(rows: number, chars: number): void {
        const session = this.sessionOrThrow();
        const screenPos = session.documentToScreenPosition(this.lead.row, this.lead.column);

        if (chars === 0) {
            if (this.$desiredColumn)
                screenPos.column = this.$desiredColumn;
            else
                this.$desiredColumn = screenPos.column;
        }

        const docPos = session.screenToDocumentPosition(screenPos.row + rows, screenPos.column);

        if (rows !== 0 && chars === 0 && docPos.row === this.lead.row && docPos.column === this.lead.column) {
            if (session.lineWidgets && session.lineWidgets[docPos.row])
                docPos.row++;
        }

        // move the cursor and update the desired column
        this.moveCursorTo(docPos.row, docPos.column + chars, chars === 0);
    }

    /**
     * Moves the selection to the position indicated by its `row` and `column`.
     */
    moveCursorToPosition(position: Position): void {
        this.moveCursorTo(position.row, position.column);
    }

    /**
     * Moves the cursor to the row and column provided.
     */
    moveCursorTo(row: number, column: number, keepDesiredColumn?: boolean): void {
        const session = this.sessionOrThrow();
        // Ensure the row/column is not inside of a fold.
        const fold = session.getFoldAt(row, column, 1);
        if (fold) {
            row = fold.start.row;
            column = fold.start.column;
        }

        this.$keepDesiredColumnOnChange = true;
        this.lead.setPosition(row, column);
        this.$keepDesiredColumnOnChange = false;

        if (!keepDesiredColumn) {
            this.$desiredColumn = null;
        }
    }

    /**
     * Moves the cursor to the screen position indicated by row and column.
     */
    moveCursorToScreen(row: number, column: number, keepDesiredColumn: boolean): void {
        const session = this.sessionOrThrow();
        const pos = session.screenToDocumentPosition(row, column);
        this.moveCursorTo(pos.row, pos.column, keepDesiredColumn);
    }

    /**
     *
     */
    on(eventName: SelectionEventName, callback: (event: any, source: Selection) => any): () => void {
        this.eventBus.on(eventName, callback, false);
        return () => {
            this.off(eventName, callback);
        };
    }

    /**
     *
     */
    off(eventName: SelectionEventName, callback: (event: any, source: Selection) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * Remove listeners from document.
     */
    detach(): void {
        this.lead.detach();
        this.anchor.detach();
        this.session = this.doc = null;
    }

    fromOrientedRange(range: OrientedRange): void {
        this.setSelectionRange(range, range.cursor === range.start);
        this.$desiredColumn = range.desiredColumn || this.$desiredColumn;
    }

    /**
     * Constructs a new OrientedRange if one is not passed in as an argument.
     */
    toOrientedRange(range?: OrientedRange): OrientedRange {
        const r = this.getRange();
        if (range) {
            range.start.column = r.start.column;
            range.start.row = r.start.row;
            range.end.column = r.end.column;
            range.end.row = r.end.row;
        }
        else {
            range = r;
        }

        range.cursor = this.isBackwards() ? range.start : range.end;
        range.desiredColumn = this.$desiredColumn;
        return range;
    }

    /**
     * Saves the current cursor position and calls `func` that can change the cursor
     * postion. The result is the range of the starting and eventual cursor position.
     * Will reset the cursor position.
     */
    getRangeOfMovements(func: Function): Range {
        const start = this.getCursor();
        try {
            func.call(null, this);
            const end = this.getCursor();
            return Range.fromPoints(start, end);
        }
        catch (e) {
            return Range.fromPoints(start, start);
        }
        finally {
            this.moveCursorToPosition(start);
        }
    }

    /**
     *
     */
    public toSingleRange(range?: OrientedRange): void {
        range = range || this.ranges[0];
        const removed = this.rangeList.removeAll();
        if (removed.length) {
            this.$onRemoveRange(removed);
        }
        if (range) {
            this.fromOrientedRange(range);
        }
    }

    /** 
     * Adds a range to a selection by entering multiselect mode, if necessary.
     */
    public addRange(range: OrientedRange, $blockChangeEvents?: boolean): boolean | void {

        if (!range) {
            return;
        }

        const session = this.sessionOrThrow();

        if (!this.inMultiSelectMode && this.rangeCount === 0) {
            const oldRange = this.toOrientedRange();
            this.rangeList.add(oldRange);
            this.rangeList.add(range);
            if (this.rangeList.ranges.length !== 2) {
                this.rangeList.removeAll();
                return $blockChangeEvents || this.fromOrientedRange(range);
            }
            this.rangeList.removeAll();
            this.rangeList.add(oldRange);
            this.$onAddRange(oldRange);
        }

        if (!range.cursor) {
            range.cursor = range.end;
        }

        const removed = this.rangeList.add(range);

        this.$onAddRange(range);

        if (removed.length) {
            this.$onRemoveRange(removed);
        }

        if (this.rangeCount > 1 && !this.inMultiSelectMode) {
            this.eventBus._signal("multiSelect");
            this.inMultiSelectMode = true;
            session.$undoSelect = false;
            this.rangeList.attach(session);
        }

        return $blockChangeEvents || this.fromOrientedRange(range);
    }

    /**
     *
     */
    private $onAddRange(range: OrientedRange): void {
        this.rangeCount = this.rangeList.ranges.length;
        this.ranges.unshift(range);
        const event: SelectionAddRangeEvent = { range: range };
        this.eventBus._signal("addRange", event);
    }

    /**
     *
     */
    private $onRemoveRange(removed: OrientedRange[]): void {
        const session = this.sessionOrThrow();
        this.rangeCount = this.rangeList.ranges.length;
        let lastRange: OrientedRange | undefined;
        if (this.rangeCount === 1 && this.inMultiSelectMode) {
            lastRange = this.rangeList.ranges.pop();
            if (lastRange) {
                removed.push(lastRange);
                this.rangeCount = 0;
            }
        }

        for (let i = removed.length; i--;) {
            const index = this.ranges.indexOf(removed[i]);
            this.ranges.splice(index, 1);
        }

        // When the event is fired, it appears that we only have OrientedRange[].
        const event: SelectionRemoveRangeEvent = { ranges: removed };
        this.eventBus._signal("removeRange", event);

        if (this.rangeCount === 0 && this.inMultiSelectMode) {
            this.inMultiSelectMode = false;
            this.eventBus._signal("singleSelect");
            session.$undoSelect = true;
            this.rangeList.detach();
        }

        lastRange = lastRange || this.ranges[0];
        if (lastRange && !isEqual(lastRange, this.getRange())) {
            this.fromOrientedRange(lastRange);
        }
    }

    /**
     * Used by the Editor
     */
    toJSON(): OrientedRange[] {
        if (this.rangeCount) {
            const ranges: OrientedRange[] = this.ranges.map(function (r) {
                // This will only copy the start and end positions.u 
                const r1 = clone(r) as OrientedRange;
                r1.isBackwards = r.cursor === r.start;
                return r1;
            });
            return ranges;
        }
        else {
            const range = this.getRange();
            range.isBackwards = this.isBackwards();
            return [range];
        }
    }

    /**
     * Used by the Editor. Only ever called with a single range.
     */
    fromJSON(range: Range) {
        if (this.rangeList) {
            this.toSingleRange(range);
        }
        this.setSelectionRange(range, range.isBackwards);
    }

    /*
    private isEqual(data: Range | Range[]) {
        if (Array.isArray(data)) {
            if (this.rangeCount && data.length !== this.rangeCount) {
                return false;
            }
        }
        else if (!this.ranges) {
            return this.getRange().isEqual(data);
        }

        for (let i = this.ranges.length; i--;) {
            if (!this.ranges[i].isEqual(data[i]))
                return false;
        }
        return true;
    }
    */
}
