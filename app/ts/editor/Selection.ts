import Document from "./Document";
import {stringReverse} from "./lib/lang";
import EventEmitterClass from "./lib/EventEmitterClass";
import Position from "./Position";
import Range from "./Range";
import RangeList from "./RangeList";
import EditSession from "./EditSession";
import Fold from "./Fold";
import Anchor from "./Anchor";
import AnchorChangeEvent from "./events/AnchorChangeEvent";
import EventBus from "./EventBus";
import SelectionAddRangeEvent from "./events/SelectionAddRangeEvent";
import SelectionRemoveRangeEvent from "./events/SelectionRemoveRangeEvent";

/**
 * Contains the cursor position and the text selection of an edit session.
 *
 * The row/columns used in the selection are in document coordinates representing
 * the coordinates as they appear in the document before applying soft wrap and folding.
 *
 * @class Selection
 */
export default class Selection implements EventBus<any, Selection> {
    private session: EditSession;
    // FIXME: Maybe Selection should only couple to the EditSession?
    // FIXME: This appears to be cached for convenience. Replace with a private getter?
    private doc: Document;

    /**
     * @property lead
     * @type Anchor
     */
    public lead: Anchor;

    /**
     * @property anchor
     * @type Anchor
     */
    public anchor: Anchor;

    private selectionLead: Anchor;
    private selectionAnchor: Anchor;
    private $isEmpty: boolean;
    private $keepDesiredColumnOnChange: boolean;

    /**
     * @property $desiredColumn
     * @type number
     */
    public $desiredColumn: number;

    /**
     * @property index
     * @type number
     */
    public index: number;

    /**
     * @property _eventRegistry
     */
    public _eventRegistry: {};

    /**
     * @property inMultiSelectMode
     * @type boolean
     */
    public inMultiSelectMode: boolean;

    /**
     * @property rangeCount
     * @type number
     */
    public rangeCount: number = 0;

    /**
     * List of ranges in reverse addition order.
     *
     * @property ranges
     * @type Range[]
     */
    public ranges: Range[] = [];

    /**
     * Automatically sorted list of ranges.
     *
     * @property rangeList
     * @type RangeList
     */
    public rangeList: RangeList = new RangeList();

    /**
     * @property inVirtualMode
     * @type boolean
     */
    public inVirtualMode: boolean;

    private eventBus: EventEmitterClass<any, Selection>;

    /**
     * Creates a new `Selection` object.
     *
     * @class Selection
     * @constructor
     * @param session {EditSession} The session to use.
     */
    constructor(session: EditSession) {
        this.eventBus = new EventEmitterClass<any, Selection>(this);
        this.session = session;
        this.doc = session.getDocument();

        this.clearSelection();
        this.lead = this.selectionLead = new Anchor(this.doc, 0, 0);
        this.anchor = this.selectionAnchor = new Anchor(this.doc, 0, 0);

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

    // adds multicursor support to selection
    public $initRangeList() {
        if (this.rangeList)
            return;

        this.rangeList = new RangeList();
        this.ranges = [];
        this.rangeCount = 0;
    };

    /**
     * Removes a Range containing pos (if it exists).
     *
     * @method substractPoint
     * @param pos {Position} The position to remove.
     * @return {Range}
     */
    substractPoint(pos: Position): Range {
        var removed: Range[] = this.rangeList.substractPoint(pos);
        if (removed) {
            this.$onRemoveRange(removed);
            return removed[0];
        }
    };

    /**
     * Returns a concatenation of all the ranges.
     *
     * @method getAllRanges
     * @returns {Range[]}
     */
    public getAllRanges(): Range[] {
        return this.rangeCount ? this.rangeList.ranges.concat() : [this.getRange()];
    }

    /**
     * Splits all the ranges into lines.
     *
     * @method splitIntoLines
     * @return {void}
     */
    splitIntoLines(): void {
        if (this.rangeCount > 1) {
            var ranges = this.rangeList.ranges;
            var lastRange = ranges[ranges.length - 1];
            var range = Range.fromPoints(ranges[0].start, lastRange.end);

            this.toSingleRange();
            this.setSelectionRange(range, lastRange.cursor === lastRange.start);
        }
        else {
            var range = this.getRange();
            var isBackwards = this.isBackwards();
            var startRow = range.start.row;
            var endRow = range.end.row;
            if (startRow === endRow) {
                if (isBackwards)
                    var start = range.end, end = range.start;
                else
                    var start = range.start, end = range.end;

                this.addRange(Range.fromPoints(end, end));
                this.addRange(Range.fromPoints(start, start));
                return;
            }

            var rectSel: Range[] = [];
            var r = this.getLineRange(startRow, true);
            r.start.column = range.start.column;
            rectSel.push(r);

            for (var i = startRow + 1; i < endRow; i++) {
                rectSel.push(this.getLineRange(i, true));
            }

            r = this.getLineRange(endRow, true);
            r.end.column = range.end.column;
            rectSel.push(r);

            rectSel.forEach((range: Range) => { this.addRange(range); });
        }
    };

    /**
     * Returns `true` if the selection is empty.
     *
     * @method isEmpty
     * @return {boolean}
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
     *
     * @method isMultiLine
     * @return {boolean}
     */
    isMultiLine(): boolean {
        if (this.isEmpty()) {
            return false;
        }

        return this.getRange().isMultiLine();
    }

    /**
     * Returns the current position of the cursor.
     *
     * @method getCursor
     * @return {Position}
     */
    getCursor(): Position {
        return this.lead.getPosition();
    }

    /**
     * Sets the row and column position of the anchor.
     * This function also emits the `'changeSelection'` event.
     *
     * @method setSelectionAnchor
     * @param row {number} The new row
     * @param column {number} The new column
     * @return {void}
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
     *
     * @method getSelectionAnchor
     * @return {Position}
     * @related Anchor.getPosition
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
     *
     * @method getSelectionLead
     * @return {Position}
     */
    getSelectionLead(): Position {
        return this.lead.getPosition();
    }

    /**
     * Shifts the selection up (or down, if [[Selection.isBackwards `isBackwards()`]] is true) the given number of columns.
     *
     * @method shiftSelection
     * @param columns {number} The number of columns to shift by.
     * @return {void}
     */
    shiftSelection(columns: number): void {
        if (this.$isEmpty) {
            this.moveCursorTo(this.lead.row, this.lead.column + columns);
            return;
        }

        const anchor = this.getSelectionAnchor();
        const lead = this.getSelectionLead();

        var isBackwards = this.isBackwards();

        if (!isBackwards || anchor.column !== 0)
            this.setSelectionAnchor(anchor.row, anchor.column + columns);

        if (isBackwards || lead.column !== 0) {
            this.$moveSelection(function() {
                this.moveCursorTo(lead.row, lead.column + columns);
            });
        }
    }

    /**
     * Returns `true` if the selection is going backwards in the document.
     *
     * @method isBackwards
     * @return {boolean}
     */
    isBackwards(): boolean {
        const anchor: Anchor = this.anchor;
        const lead: Anchor = this.lead;
        return (anchor.row > lead.row || (anchor.row === lead.row && anchor.column > lead.column));
    }

    /**
     * Returns the range for the selected text.
     *
     * @method getRange
     * @return {Range}
     */
    getRange() {

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
     *
     * @method clearSelection
     * @return {void}
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
     *
     * @method selectAll
     * @return {void}
     */
    selectAll(): void {
        var lastRow = this.doc.getLength() - 1;
        this.setSelectionAnchor(0, 0);
        this.moveCursorTo(lastRow, this.doc.getLine(lastRow).length);
    }

    /**
     * Sets the selection to the provided range.
     *
     * @method setRange
     * @param {Range} range The range of text to select
     * @param {Boolean} reverse Indicates if the range should go backwards (`true`) or not
     */
    public setRange(range: Range, reverse?: boolean): void {
        this.setSelectionRange(range, reverse);
    }

    public setSelectionRange(range: Range, reverse?: boolean): void {
        if (reverse) {
            this.setSelectionAnchor(range.end.row, range.end.column);
            this.selectTo(range.start.row, range.start.column);
        }
        else {
            this.setSelectionAnchor(range.start.row, range.start.column);
            this.selectTo(range.end.row, range.end.column);
        }
        if (this.getRange().isEmpty())
            this.$isEmpty = true;
        this.$desiredColumn = null;
    }

    $moveSelection(mover) {
        var lead = this.lead;
        if (this.$isEmpty)
            this.setSelectionAnchor(lead.row, lead.column);

        mover.call(this);
    }

    /**
     * Moves the selection cursor to the indicated row and column.
     *
     * @method selectTo
     * @param {Number} row The row to select to
     * @param {Number} column The column to select to
     * @return {void}
     */
    selectTo(row: number, column: number): void {
        this.$moveSelection(function() {
            this.moveCursorTo(row, column);
        });
    }

    /**
     * Moves the selection cursor to the row and column indicated by `pos`.
     *
     * @method selectToPosition
     * @param position {Position} An object containing the row and column
     * @return {void}
     */
    selectToPosition(position: Position): void {
        var self = this;
        this.$moveSelection(function() {
            self.moveCursorToPosition(position);
        });
    }

    /**
     * Moves the selection cursor to the indicated row and column.
     *
     * @method moveTo
     * @param {Number} row The row to select to
     * @param {Number} column The column to select to
     * @return {void}
     */
    moveTo(row: number, column: number): void {
        this.clearSelection();
        this.moveCursorTo(row, column);
    }

    /**
     * Moves the selection cursor to the row and column indicated by `pos`.
     *
     * @method moveToPosition
     * @param {Object} pos An object containing the row and column.
     * @return {void}
     */
    moveToPosition(pos: Position): void {
        this.clearSelection();
        this.moveCursorToPosition(pos);
    }


    /**
     * Moves the selection up one row.
     *
     * @method selectUp
     * @return {void}
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
     *
     * @method selectFileEnd
     * @return {void}
     */
    selectFileEnd(): void {
        this.$moveSelection(this.moveCursorFileEnd);
    }

    /**
     * Moves the selection to the start of the file.
     *
     * @method selectFileStart
     * @return {void}
     */
    selectFileStart(): void {
        this.$moveSelection(this.moveCursorFileStart);
    }

    /**
     * Moves the selection to the first word on the right.
     *
     * @method selectWordRight
     * @return {void}
     */
    selectWordRight(): void {
        this.$moveSelection(this.moveCursorWordRight);
    }

    /**
     * Moves the selection to the first word on the left.
     *
     * @method selectWordLeft
     * @return {void}
     */
    selectWordLeft(): void {
        this.$moveSelection(this.moveCursorWordLeft);
    }

    /**
     * Moves the selection to highlight the entire word.
     *
     * @method getWordRange
     * @param [row] {number}
     * @param [column] {number}
     * @return {Range}
     */
    getWordRange(row?: number, column?: number): Range {
        if (typeof column === "undefined") {
            var cursor: Anchor = this.lead;
            row = cursor.row;
            column = cursor.column;
        }
        return this.session.getWordRange(row, column);
    }

    /**
     * Selects an entire word boundary.
     *
     * @method selectWord
     * @return {void}
     */
    selectWord(): void {
        this.setSelectionRange(this.getWordRange(this.lead.row, this.lead.column));
    }

    /**
     * Selects a word, including its right whitespace.
     *
     * @method selectAWord
     * @return {void}
     */
    selectAWord(): void {
        const cursor = this.getCursor();
        const range = this.session.getAWordRange(cursor.row, cursor.column);
        this.setSelectionRange(range);
    }

    /**
     * @method getLineRange
     * @param [row] {number}
     * @param [excludeLastChar] {boolean}
     * @return {Range}
     */
    getLineRange(row?: number, excludeLastChar?: boolean): Range {
        let rowStart = typeof row === "number" ? row : this.lead.row;
        let rowEnd: number;

        var foldLine = this.session.getFoldLine(rowStart);
        if (foldLine) {
            rowStart = foldLine.start.row;
            rowEnd = foldLine.end.row;
        }
        else {
            rowEnd = rowStart;
        }

        if (excludeLastChar) {
            return new Range(rowStart, 0, rowEnd, this.session.getLine(rowEnd).length);
        }
        else {
            return new Range(rowStart, 0, rowEnd + 1, 0);
        }
    }

    /**
     * Selects the entire line.
     *
     * @method selectLine
     * @return {void}
     */
    selectLine(): void {
        this.setSelectionRange(this.getLineRange());
    }

    /**
     * Merges overlapping ranges ensuring consistency after changes.
     *
     * @method mergeOverlappingRanges
     * @return {void}
     */
    mergeOverlappingRanges(): void {
        var removed = this.rangeList.merge();
        if (removed.length) {
            this.$onRemoveRange(removed);
        }
        else if (this.ranges[0]) {
            this.fromOrientedRange(this.ranges[0]);
        }
    };

    /**
     * Moves the cursor up one row.
     *
     * @method moveCursorUp
     * @return {void}
     */
    moveCursorUp(): void {
        this.moveCursorBy(-1, 0);
    }

    /**
     * Moves the cursor down one row.
     *
     * @method moveCursorDown
     * @return {void}
     */
    moveCursorDown(): void {
        this.moveCursorBy(1, 0);
    }

    /**
     * Moves the cursor left one column.
     *
     * @method moveCursorLeft
     * @return {void}
     */
    moveCursorLeft(): void {
        const cursor = this.lead.getPosition();
        let fold: Fold;

        if (fold = this.session.getFoldAt(cursor.row, cursor.column, -1)) {
            this.moveCursorTo(fold.start.row, fold.start.column);
        }
        else if (cursor.column === 0) {
            // cursor is a line (start
            if (cursor.row > 0) {
                this.moveCursorTo(cursor.row - 1, this.doc.getLine(cursor.row - 1).length);
            }
        }
        else {
            var tabSize = this.session.getTabSize();
            if (this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column - tabSize, cursor.column).split(" ").length - 1 === tabSize)
                this.moveCursorBy(0, -tabSize);
            else
                this.moveCursorBy(0, -1);
        }
    }

    /**
     * Moves the cursor right one column.
     *
     * @method moveCursorRight
     * @return {void}
     */
    moveCursorRight(): void {
        var pos = this.lead.getPosition();
        var fold = this.session.getFoldAt(pos.row, pos.column, 1);
        if (fold) {
            this.moveCursorTo(fold.end.row, fold.end.column);
        }
        else if (this.lead.column === this.doc.getLine(this.lead.row).length) {
            if (this.lead.row < this.doc.getLength() - 1) {
                this.moveCursorTo(this.lead.row + 1, 0);
            }
        }
        else {
            var tabSize = this.session.getTabSize();
            var cursor = this.lead;
            if (this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column, cursor.column + tabSize).split(" ").length - 1 === tabSize) {
                this.moveCursorBy(0, tabSize);
            }
            else {
                this.moveCursorBy(0, 1);
            }
        }
    }

    /**
     * Moves the cursor to the start of the line.
     *
     * @method moveCursorLineStart
     * @return {void}
     */
    moveCursorLineStart(): void {
        const row = this.lead.row;
        const column = this.lead.column;
        const screenRow = this.session.documentToScreenRow(row, column);

        // Determ the doc-position of the first character at the screen line.
        const firstColumnPosition = this.session.screenToDocumentPosition(screenRow, 0);

        // Determ the line
        // How does getDisplayLine get from folding onto session?
        const beforeCursor = this.session.getDisplayLine(
            row, null, firstColumnPosition.row,
            firstColumnPosition.column
        );

        const leadingSpace = beforeCursor.match(/^\s*/);
        // TODO find better way for emacs mode to override selection behaviors
        if (leadingSpace[0].length !== column && !this.session.$useEmacsStyleLineStart)
            firstColumnPosition.column += leadingSpace[0].length;
        this.moveCursorToPosition(firstColumnPosition);
    }

    /**
     * Moves the cursor to the end of the line.
     *
     * @method moveCursorLineEnd
     * @return {void}
     */
    moveCursorLineEnd(): void {
        const lead = this.lead;
        const lineEnd = this.session.getDocumentLastRowColumnPosition(lead.row, lead.column);
        if (this.lead.column === lineEnd.column) {
            const line = this.session.getLine(lineEnd.row);
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
     *
     * @method moveCursorFileEnd
     * @return {void}
     */
    moveCursorFileEnd(): void {
        const row = this.doc.getLength() - 1;
        const column = this.doc.getLine(row).length;
        this.moveCursorTo(row, column);
    }

    /**
     * Moves the cursor to the start of the file.
     *
     * @method moveCursorFileStart
     * @return {void}
     */
    moveCursorFileStart(): void {
        this.moveCursorTo(0, 0);
    }

    /**
     * Moves the cursor to the word on the right.
     *
     * @method moveCursorLongWordRight
     * @return {void}
     */
    moveCursorLongWordRight(): void {
        const row = this.lead.row;
        let column = this.lead.column;
        const line = this.doc.getLine(row);
        let rightOfCursor = line.substring(column);

        let match: RegExpExecArray;
        this.session.nonTokenRe.lastIndex = 0;
        this.session.tokenRe.lastIndex = 0;

        // skip folds
        const fold = this.session.getFoldAt(row, column, 1);
        if (fold) {
            this.moveCursorTo(fold.end.row, fold.end.column);
            return;
        }

        // first skip space
        if (match = this.session.nonTokenRe.exec(rightOfCursor)) {
            column += this.session.nonTokenRe.lastIndex;
            this.session.nonTokenRe.lastIndex = 0;
            rightOfCursor = line.substring(column);
        }

        // if at line end proceed with next line
        if (column >= line.length) {
            this.moveCursorTo(row, line.length);
            this.moveCursorRight();
            if (row < this.doc.getLength() - 1)
                this.moveCursorWordRight();
            return;
        }

        // advance to the end of the next token
        if (match = this.session.tokenRe.exec(rightOfCursor)) {
            column += this.session.tokenRe.lastIndex;
            this.session.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    }

    /**
     * Moves the cursor to the word on the left.
     *
     * @method moveCursorLongWordLeft
     * @return {void}
     */
    moveCursorLongWordLeft(): void {
        const row = this.lead.row;
        let column = this.lead.column;

        // skip folds
        let fold: Fold;
        if (fold = this.session.getFoldAt(row, column, -1)) {
            this.moveCursorTo(fold.start.row, fold.start.column);
            return;
        }

        // How does this get from the folding adapter onto the session?
        var str = this.session.getFoldStringAt(row, column, -1);
        if (str == null) {
            str = this.doc.getLine(row).substring(0, column);
        }

        let leftOfCursor = stringReverse(str);
        let match: RegExpMatchArray;
        this.session.nonTokenRe.lastIndex = 0;
        this.session.tokenRe.lastIndex = 0;

        // skip whitespace
        if (match = this.session.nonTokenRe.exec(leftOfCursor)) {
            column -= this.session.nonTokenRe.lastIndex;
            leftOfCursor = leftOfCursor.slice(this.session.nonTokenRe.lastIndex);
            this.session.nonTokenRe.lastIndex = 0;
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
        if (match = this.session.tokenRe.exec(leftOfCursor)) {
            column -= this.session.tokenRe.lastIndex;
            this.session.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    }

    /**
     * @method $shortWordEndIndex
     * @param rightOfCursor {string}
     * @return {number}
     * @private
     */
    private $shortWordEndIndex(rightOfCursor: string): number {
        let match: RegExpMatchArray;
        let index = 0;
        let ch: string;
        const whitespaceRe = /\s/;
        const tokenRe = this.session.tokenRe;

        tokenRe.lastIndex = 0;
        if (match = this.session.tokenRe.exec(rightOfCursor)) {
            index = this.session.tokenRe.lastIndex;
        } else {
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
        var row = this.lead.row;
        var column = this.lead.column;
        var line = this.doc.getLine(row);
        var rightOfCursor = line.substring(column);

        var fold = this.session.getFoldAt(row, column, 1);
        if (fold)
            return this.moveCursorTo(fold.end.row, fold.end.column);

        if (column === line.length) {
            var l = this.doc.getLength();
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

    moveCursorShortWordLeft() {
        var row = this.lead.row;
        var column = this.lead.column;

        var fold;
        if (fold = this.session.getFoldAt(row, column, -1))
            return this.moveCursorTo(fold.start.row, fold.start.column);

        var line = this.session.getLine(row).substring(0, column);
        if (column === 0) {
            do {
                row--;
                line = this.doc.getLine(row);
            } while (row > 0 && /^\s*$/.test(line));

            column = line.length;
            if (!/\s+$/.test(line))
                line = "";
        }

        var leftOfCursor = stringReverse(line);
        var index = this.$shortWordEndIndex(leftOfCursor);

        return this.moveCursorTo(row, column - index);
    }

    moveCursorWordRight(): void {
        // See keyboard/emacs.js
        if (this.session.$selectLongWords) {
            this.moveCursorLongWordRight();
        }
        else {
            this.moveCursorShortWordRight();
        }
    }

    moveCursorWordLeft(): void {
        // See keyboard/emacs.js
        if (this.session.$selectLongWords) {
            this.moveCursorLongWordLeft();
        }
        else {
            this.moveCursorShortWordLeft();
        }
    }

    /**
     * Moves the cursor to position indicated by the parameters.
     * Negative numbers move the cursor backwards in the document.
     *
     * @method moveCursorBy
     * @param rows {number} The number of rows to move by
     * @param chars {number} The number of characters to move by
     * @return {void}
     */
    moveCursorBy(rows: number, chars: number): void {
        const screenPos = this.session.documentToScreenPosition(this.lead.row, this.lead.column);

        if (chars === 0) {
            if (this.$desiredColumn)
                screenPos.column = this.$desiredColumn;
            else
                this.$desiredColumn = screenPos.column;
        }

        const docPos = this.session.screenToDocumentPosition(screenPos.row + rows, screenPos.column);

        if (rows !== 0 && chars === 0 && docPos.row === this.lead.row && docPos.column === this.lead.column) {
            if (this.session.lineWidgets && this.session.lineWidgets[docPos.row])
                docPos.row++;
        }

        // move the cursor and update the desired column
        this.moveCursorTo(docPos.row, docPos.column + chars, chars === 0);
    }

    /**
     * Moves the selection to the position indicated by its `row` and `column`.
     *
     * @method moveCursorToPosition
     * @param position {Position} The position to move to.
     * @return {void}
     */
    moveCursorToPosition(position: Position): void {
        this.moveCursorTo(position.row, position.column);
    }

    /**
     * Moves the cursor to the row and column provided.
     * [If `preventUpdateDesiredColumn` is `true`, then the cursor stays in the same column position as its original point.]{: #preventUpdateBoolDesc}
     * @param {number} row The row to move to
     * @param {number} column The column to move to
     * @param {boolean} keepDesiredColumn [If `true`, the cursor move does not respect the previous column]{: #preventUpdateBool}
     */
    moveCursorTo(row: number, column: number, keepDesiredColumn?: boolean): void {
        // Ensure the row/column is not inside of a fold.
        var fold = this.session.getFoldAt(row, column, 1);
        if (fold) {
            row = fold.start.row;
            column = fold.start.column;
        }

        this.$keepDesiredColumnOnChange = true;
        this.lead.setPosition(row, column);
        this.$keepDesiredColumnOnChange = false;

        if (!keepDesiredColumn)
            this.$desiredColumn = null;
    }

    /**
     * Moves the cursor to the screen position indicated by row and column.
     *
     * @method moveCursorToScreen
     * @param row {number} The row to move to
     * @param column {number} The column to move to
     * @param keepDesiredColumn {boolean}
     * @return {void}
     */
    moveCursorToScreen(row: number, column: number, keepDesiredColumn: boolean): void {
        var pos = this.session.screenToDocumentPosition(row, column);
        this.moveCursorTo(pos.row, pos.column, keepDesiredColumn);
    }

    /**
     * @method on
     * @param eventName {string}
     * @param callback {(event, source: Selection) => any}
     * @return {void}
     */
    on(eventName: string, callback: (event: any, source: Selection) => any): void {
        this.eventBus.on(eventName, callback, false);
    }

    /**
     * @method off
     * @param eventName {string}
     * @param callback {(event, source: Selection) => any}
     * @return {void}
     */
    off(eventName: string, callback: (event: any, source: Selection) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * Remove listeners from document.
     *
     * @method detach
     * @return {void}
     */
    detach(): void {
        this.lead.detach();
        this.anchor.detach();
        this.session = this.doc = null;
    }

    fromOrientedRange(range: Range) {
        // FIXME: How can this work? start: Position
        this.setSelectionRange(range, range.cursor === range.start);
        this.$desiredColumn = range.desiredColumn || this.$desiredColumn;
    }

    /**
     * @method toOrientedRange
     */
    toOrientedRange(range?: Range) {
        var r = this.getRange();
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
     *
     * @method getRangeOfMovements
     * @param {Function} The callback that should change the cursor position
     * @return {Range}
     */
    getRangeOfMovements(func): Range {
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

    toJSON(): Range[] {
        if (this.rangeCount) {
            const ranges: Range[] = this.ranges.map(function(r) {
                const r1 = r.clone();
                r1.isBackwards = r.cursor === r.start;
                return r1;
            });
            return ranges;
        }
        else {
            const range: Range = this.getRange();
            range.isBackwards = this.isBackwards();
            return [range];
        }
    }

    /**
     * @method toSingleRange
     * @param [range] {Range}
     * @return {void}
     */
    public toSingleRange(range?: Range): void {
        range = range || this.ranges[0];
        var removed = this.rangeList.removeAll();
        if (removed.length) {
            this.$onRemoveRange(removed);
        }
        if (range) {
            this.fromOrientedRange(range);
        }
    }

    /** 
     * Adds a range to a selection by entering multiselect mode, if necessary.
     *
     * @method addRange
     * @param range {Range} The new range to add.
     * @param $blockChangeEvents {boolean} Whether or not to block changing events.
     * @return {boolean}
     */
    public addRange(range: Range, $blockChangeEvents?: boolean): boolean | void {

        if (!range) {
            return;
        }

        if (!this.inMultiSelectMode && this.rangeCount === 0) {
            var oldRange = this.toOrientedRange();
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
            this.session.$undoSelect = false;
            this.rangeList.attachXYZ(this.session);
        }

        return $blockChangeEvents || this.fromOrientedRange(range);
    }

    /**
     * @method $onAddRange
     * @param range {Range}
     * @return {void}
     * @private
     */
    private $onAddRange(range: Range): void {
        this.rangeCount = this.rangeList.ranges.length;
        this.ranges.unshift(range);
        const event: SelectionAddRangeEvent = { range: range };
        this.eventBus._signal("addRange", event);
    };

    /**
     * @method $onRemoveRange
     * @param removed {Range[]}
     * @return {void}
     * @private
     */
    private $onRemoveRange(removed: Range[]): void {
        this.rangeCount = this.rangeList.ranges.length;
        if (this.rangeCount === 1 && this.inMultiSelectMode) {
            var lastRange: Range = this.rangeList.ranges.pop();
            removed.push(lastRange);
            this.rangeCount = 0;
        }

        for (var i = removed.length; i--;) {
            var index = this.ranges.indexOf(removed[i]);
            this.ranges.splice(index, 1);
        }

        const event: SelectionRemoveRangeEvent = { ranges: removed };
        this.eventBus._signal("removeRange", event);

        if (this.rangeCount === 0 && this.inMultiSelectMode) {
            this.inMultiSelectMode = false;
            this.eventBus._signal("singleSelect");
            this.session.$undoSelect = true;
            this.rangeList.detachXYZ();
        }

        lastRange = lastRange || this.ranges[0];
        if (lastRange && !lastRange.isEqual(this.getRange())) {
            this.fromOrientedRange(lastRange);
        }
    };

    // FIXME
    fromJSON(data/*: {start;length;isBackards}*/) {
        if (data.start === void 0) {
            if (this.rangeList) {
                this.toSingleRange(data[0]);
                for (var i = data.length; i--;) {
                    var r: any = Range.fromPoints(data[i].start, data[i].end);
                    if (data.isBackwards)
                        r.cursor = r.start;
                    this.addRange(r, true);
                }
                return;
            } else
                data = data[0];
        }
        if (this.rangeList)
            this.toSingleRange(data);
        this.setSelectionRange(data, data.isBackwards);
    }

    // FIXME
    isEqual(data) {
        if ((data.length || this.rangeCount) && data.length !== this.rangeCount)
            return false;
        if (!data.length || !this.ranges)
            return this.getRange().isEqual(data);

        for (var i = this.ranges.length; i--;) {
            if (!this.ranges[i].isEqual(data[i]))
                return false;
        }
        return true;
    }
}
