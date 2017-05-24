import { Range } from "../../Range";
import { FoldMode } from "./FoldMode";
import { EditSession } from "../../EditSession";
import { FoldStyle } from "../../FoldStyle";
import { FoldWidget } from "../../FoldWidget";
import { Token } from "../../Token";

/**
 *
 */
export class MarkdownFoldMode extends FoldMode {
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

    getFoldWidget(session: EditSession, foldStyle: FoldStyle, row: number): FoldWidget {
        const line = session.getLine(row);
        if (!this.foldingStartMarker.test(line))
            return "";

        if (line[0] === "`") {
            if (session.getState(row) === "start") {
                return "end";
            }
            return "start";
        }

        return "start";
    }

    getFoldWidgetRange(session: EditSession, foldStyle: FoldStyle, row: number): Range | undefined {
        let line = session.getLine(row);
        const startColumn = line.length;
        const maxRow = session.getLength();
        const startRow = row;
        let endRow = row;
        if (!line.match(this.foldingStartMarker)) {
            return void 0;
        }

        if (line[0] === "`") {
            if (session.getState(row) !== "start") {
                while (++row < maxRow) {
                    line = session.getLine(row);
                    if (line[0] === "`" && line.substring(0, 3) === "```")
                        break;
                }
                return new Range(startRow, startColumn, row, 0);
            }
            else {
                while (row-- > 0) {
                    line = session.getLine(row);
                    if (line[0] === "`" && line.substring(0, 3) === "```")
                        break;
                }
                return new Range(row, line.length, startRow, 0);
            }
        }

        let token: Token | undefined;
        const heading = "markup.heading";
        function isHeading(row: number): boolean {
            token = session.getTokens(row)[0];
            return token && token.type.lastIndexOf(heading, 0) === 0;
        }

        function getLevel(): number {
            if (token) {
                const ch = token.value[0];
                if (ch === "=") return 6;
                if (ch === "-") return 5;
                return 7 - token.value.search(/[^#]/);
            }
            else {
                throw new Error(`token is ${typeof token}`);
            }
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
        return void 0;
    }
}

