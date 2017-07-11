import { Range } from "../../Range";
import { RangeBasic } from "../../RangeBasic";
import { FoldMode } from "./FoldMode";
import { EditSession } from "../../EditSession";
import { FoldStyle } from "../../FoldStyle";
import { isMultiLine } from "../../RangeHelpers";

/**
 *
 */
export class CstyleFoldMode extends FoldMode {
    foldingStartMarker: RegExp = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/;
    foldingStopMarker: RegExp = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;

    /**
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
     * @param session
     * @param foldStyle
     * @param row zero-based row number.
     * @param forceMultiline
     */
    getFoldWidgetRange(session: EditSession, foldStyle: FoldStyle, row: number, forceMultiline?: boolean): RangeBasic | null | undefined {
        /**
         * The text on the line where the folding was requested.
         */
        const line = session.getLine(row);
        // Find where to start the fold marker.
        let match = line.match(this.foldingStartMarker);
        if (match) {
            if (match[1]) {
                return this.openingBracketBlock(session, match[1], row, <number>match.index);
            }

            let range: RangeBasic | null | undefined = session.getCommentFoldRange(row, <number>match.index + match[0].length, 1);

            if (range && !isMultiLine(range)) {
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
            return void 0;
        }

        match = line.match(this.foldingStopMarker);
        if (match) {
            const i = <number>match.index + match[0].length;

            if (match[1]) {
                return this.closingBracketBlock(session, match[1], row, i);
            }

            return session.getCommentFoldRange(row, i, -1);
        }
        return void 0;
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
            const subRange = this.getFoldWidgetRange(session, "all", row);

            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                }
                else if (isMultiLine(subRange)) {
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
