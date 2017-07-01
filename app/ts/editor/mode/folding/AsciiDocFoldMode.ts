import { Range } from "../../Range";
import { FoldMode } from "./FoldMode";
import { EditSession } from "../../EditSession";
import { FoldStyle } from "../../FoldStyle";
import { FoldWidget } from "../../FoldWidget";
import { HighlighterToken } from "../Highlighter";

/**
 *
 */
export class AsciiDocFoldMode extends FoldMode {
    private readonly singleLineHeadingRe: RegExp;
    /**
     * 
     */
    constructor() {
        super();
        this.foldingStartMarker = /^(?:\|={10,}|[\.\/=\-~^+]{4,}\s*$|={1,5} )/;
        this.singleLineHeadingRe = /^={1,5}(?=\s+\S)/;
    }
    /**
     *
     */
    getFoldWidget(session: EditSession, foldStyle: FoldStyle, row: number): FoldWidget {
        const line = session.getLine(row);
        if (!(this.foldingStartMarker as RegExp).test(line)) {
            return "";
        }

        if (line[0] === "=") {
            if (this.singleLineHeadingRe.test(line)) {
                return "start";
            }
            if (session.getLine(row - 1).length !== session.getLine(row).length) {
                return "";
            }
            return "start";
        }
        if (session.bgTokenizer.getState(row) === "dissallowDelimitedBlock") {
            return "end";
        }
        return "start";
    }
    /**
     *
     */
    getFoldWidgetRange(session: EditSession, foldStyle: FoldStyle, row: number): Range | undefined {
        const line = session.getLine(row);
        const startColumn = line.length;
        const maxRow = session.getLength();
        const startRow = row;
        let endRow = row;
        if (!line.match(this.foldingStartMarker as RegExp)) {
            return void 0;
        }

        let token: HighlighterToken | undefined = void 0;
        /**
         * Side-effect of calling this is to (maybe) define the token.
         * It plays havoc with the type-safety!
         */
        function getTokenType(row: number): string {
            token = session.getTokens(row)[0];
            return token && token.type;
        }

        const levels = ["=", "-", "~", "^", "+"];
        const heading = "markup.heading";
        const singleLineHeadingRe = this.singleLineHeadingRe;
        function getLevel() {
            const match = (token as HighlighterToken).value.match(singleLineHeadingRe);
            if (match) {
                return match[0].length;
            }
            const level = levels.indexOf((token as HighlighterToken).value[0]) + 1;
            if (level === 1) {
                if (session.getLine(row - 1).length !== session.getLine(row).length) {
                    return Infinity;
                }
            }
            return level;
        }

        if (getTokenType(row) === heading) {
            const startHeadingLevel = getLevel();
            while (++row < maxRow) {
                if (getTokenType(row) !== heading) {
                    continue;
                }
                const level = getLevel();
                if (level <= startHeadingLevel) {
                    break;
                }
            }

            const isSingleLineHeading = token && (token as HighlighterToken).value.match(this.singleLineHeadingRe);
            endRow = isSingleLineHeading ? row - 1 : row - 2;

            if (endRow > startRow) {
                while (endRow > startRow && (!getTokenType(endRow) || ((<any>token) as HighlighterToken).value[0] === "[")) {
                    endRow--;
                }
            }

            if (endRow > startRow) {
                const endColumn = session.getLine(endRow).length;
                return new Range(startRow, startColumn, endRow, endColumn);
            }
        }
        else {
            const state = session.bgTokenizer.getState(row);
            if (state === "dissallowDelimitedBlock") {
                while (row-- > 0) {
                    if (session.bgTokenizer.getState(row).lastIndexOf("Block") === -1) {
                        break;
                    }
                }
                endRow = row + 1;
                if (endRow < startRow) {
                    // TODO: This appears to be redundant.
                    // const endColumn = session.getLine(row).length;
                    return new Range(endRow, 5, startRow, startColumn - 5);
                }
            }
            else {
                while (++row < maxRow) {
                    if (session.bgTokenizer.getState(row) === "dissallowDelimitedBlock") {
                        break;
                    }
                }
                endRow = row;
                if (endRow > startRow) {
                    const endColumn = session.getLine(row).length;
                    return new Range(startRow, 5, endRow, endColumn - 5);
                }
            }
        }
        return void 0;
    }
}
