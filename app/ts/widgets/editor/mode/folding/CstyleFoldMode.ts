import Range from "../../Range";
import FoldMode from "./FoldMode";
import EditSession from "../../EditSession";

/**
 * @class CstyleFoldMode
 */
export default class CstyleFoldMode extends FoldMode {
    foldingStartMarker: RegExp = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/;
    foldingStopMarker: RegExp = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;

    /**
     * @class CstyleFoldMode
     * @constructor
     * @param commentRegex
     */
    constructor(commentRegex?: { start: RegExp; end: RegExp }) {
        super();
        if (commentRegex) {
            this.foldingStartMarker = new RegExp(
                this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
            );
            this.foldingStopMarker = new RegExp(
                this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
            );
        }
    }

    /**
     * @method getFoldWidgetRange
     * @param session {EditSession}
     * @param foldStyle {string} "markbegin" or
     * @param row {number} zero-based row number.
     * @param forceMultiline {boolean}
     * @return {Range}
     */
    getFoldWidgetRange(session: EditSession, foldStyle: string, row: number, forceMultiline?: boolean): Range {
        /**
         * The text on the line where the folding was requested.
         */
        const line = session.getLine(row);
        // Find where to start the fold marker.
        let match = line.match(this.foldingStartMarker);
        if (match) {
            const i = match.index;

            if (match[1]) {
                return this.openingBracketBlock(session, match[1], row, i);
            }

            let range: Range = session.getCommentFoldRange(row, i + match[0].length, 1);

            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                }
                else if (foldStyle !== "all") {
                    range = null;
                }
            }

            return range;
        }

        if (foldStyle === "markbegin") {
            return;
        }

        match = line.match(this.foldingStopMarker);
        if (match) {
            const i = match.index + match[0].length;

            if (match[1]) {
                return this.closingBracketBlock(session, match[1], row, i);
            }

            return session.getCommentFoldRange(row, i, -1);
        }
    }
    getSectionRange(session: EditSession, row: number): Range {
        let line = session.getLine(row);
        const startIndent = line.search(/\S/);
        const startRow = row;
        const startColumn = line.length;
        row = row + 1;
        let endRow = row;
        const maxRow = session.getLength();
        while (++row < maxRow) {
            line = session.getLine(row);
            const indent = line.search(/\S/);
            if (indent === -1)
                continue;
            if (startIndent > indent)
                break;
            var subRange = this.getFoldWidgetRange(session, "all", row);

            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                }
                else if (subRange.isMultiLine()) {
                    row = subRange.end.row;
                }
                else if (startIndent === indent) {
                    break;
                }
            }
            endRow = row;
        }
        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    }
}
