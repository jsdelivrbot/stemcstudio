import Range from "../../Range";
import EditSession from "../../EditSession";

/**
 *
 */
export default class FoldMode {

    /**
     *
     */
    foldingStartMarker: RegExp = null;

    /**
     *
     */
    foldingStopMarker: RegExp = null;

    /**
     *
     */
    constructor() {
        // Do nothing.
    }

    /**
     * must return "" if there's no fold, to enable caching
     *
     * @param session
     * @param foldStyle "markbeginend"
     * @param row
     */
    getFoldWidget(session: EditSession, foldStyle: string, row: number): string {
        const line = session.getLine(row);
        if (this.foldingStartMarker.test(line)) {
            return "start";
        }
        if (foldStyle === "markbeginend" && this.foldingStopMarker && this.foldingStopMarker.test(line)) {
            return "end";
        }
        return "";
    }

    /**
     * @param session
     * @param foldStyle
     * @param row
     */
    getFoldWidgetRange(session: EditSession, foldStyle: string, row: number): Range {
        return null;
    }

    /**
     * @method indentationBlock
     * @param session
     * @param row
     * @param column
     */
    indentationBlock(session: EditSession, row: number, column?: number): Range {
        const re = /\S/;
        const line = session.getLine(row);
        const startLevel = line.search(re);
        if (startLevel === -1) {
            return void 0;
        }

        const startColumn = column || line.length;
        const maxRow = session.getLength();
        const startRow = row;
        let endRow = row;

        while (++row < maxRow) {
            const level = session.getLine(row).search(re);

            if (level === -1) {
                continue;
            }

            if (level <= startLevel) {
                break;
            }

            endRow = row;
        }

        if (endRow > startRow) {
            const endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
        }
        return void 0;
    }

    /**
     * @param session
     * @param bracket
     * @param row
     * @param column
     * @param typeRe
     */
    openingBracketBlock(session: EditSession, bracket: string, row: number, column: number, typeRe?: RegExp): Range {
        const start = { row: row, column: column + 1 };
        const end = session.findClosingBracket(bracket, start, typeRe);
        if (!end) {
            // We cant find the close to the block, so the range is undefined.
            return void 0;
        }

        let fw: string = session.foldWidgets[end.row];
        if (fw === null) {
            fw = session.getFoldWidget(end.row);
        }

        if (fw === "start" && end.row > start.row) {
            end.row--;
            end.column = session.getLine(end.row).length;
        }
        return Range.fromPoints(start, end);
    }

    /**
     * @param session
     * @param bracket
     * @param row
     * @param column
     * @param typeRe
     */
    closingBracketBlock(session: EditSession, bracket: string, row: number, column: number, typeRe?: RegExp): Range {
        const end = { row: row, column: column };
        const start = session.findOpeningBracket(bracket, end);

        if (!start) {
            return void 0;
        }

        start.column++;
        end.column--;

        return Range.fromPoints(start, end);
    }
}
