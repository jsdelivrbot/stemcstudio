import Range from "../../Range";
import FoldMode from "./FoldMode";
import EditSession from "../../EditSession";
import Token from "../../Token";

/**
 *
 */
export default class MarkdownFoldMode extends FoldMode {
    /**
     *
     */
    foldingStartMarker: RegExp = /^(?:[=-]+\s*$|#{1,6} |`{3})/;

    /**
     *
     */
    constructor() {
        super();
    }

    /**
     * @param session
     * @param foldStyle
     * @param row
     */
    getFoldWidget(session: EditSession, foldStyle: string, row: number): string {
        const line = session.getLine(row);
        if (!this.foldingStartMarker.test(line))
            return "";

        if (line[0] === "`") {
            if (session.bgTokenizer.getState(row) === "start")
                return "end";
            return "start";
        }

        return "start";
    }

    /**
     * @param session
     * @param foldStyle
     * @param row
     */
    getFoldWidgetRange(session: EditSession, foldStyle: string, row: number): Range {
        let line = session.getLine(row);
        const startColumn = line.length;
        const maxRow = session.getLength();
        const startRow = row;
        let endRow = row;
        if (!line.match(this.foldingStartMarker))
            return;

        if (line[0] === "`") {
            if (session.bgTokenizer.getState(row) !== "start") {
                while (++row < maxRow) {
                    line = session.getLine(row);
                    if (line[0] === "`" && line.substring(0, 3) === "```")
                        break;
                }
                return new Range(startRow, startColumn, row, 0);
            } else {
                while (row-- > 0) {
                    line = session.getLine(row);
                    if (line[0] === "`" && line.substring(0, 3) === "```")
                        break;
                }
                return new Range(row, line.length, startRow, 0);
            }
        }

        let token: Token;
        const heading = "markup.heading";
        function isHeading(row: number): boolean {
            token = session.getTokens(row)[0];
            return token && token.type.lastIndexOf(heading, 0) === 0;
        }

        function getLevel(): number {
            const ch = token.value[0];
            if (ch === "=") return 6;
            if (ch === "-") return 5;
            return 7 - token.value.search(/[^#]/);
        }

        if (isHeading(row)) {
            const startHeadingLevel = getLevel();
            while (++row < maxRow) {
                if (!isHeading(row))
                    continue;
                const level = getLevel();
                if (level >= startHeadingLevel)
                    break;
            }

            endRow = row - (!token || ["=", "-"].indexOf(token.value[0]) === -1 ? 1 : 2);

            if (endRow > startRow) {
                while (endRow > startRow && /^\s*$/.test(session.getLine(endRow)))
                    endRow--;
            }

            if (endRow > startRow) {
                const endColumn = session.getLine(endRow).length;
                return new Range(startRow, startColumn, endRow, endColumn);
            }
        }
    }
}

