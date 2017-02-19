import Range from "../Range";
import EditSession from "../EditSession";

/**
 * @class MatchingBraceOutdent
 */
export default class MatchingBraceOutdent {

    /**
     * @class MatchingBraceOutdent
     * @constructor
     */
    constructor() {
        // Do nothing.
    }

    /**
     * @method checkOutdent
     * @param line {string}
     * @param text {string}
     * @return {boolean}
     */
    checkOutdent(line: string, text: string): boolean {
        if (! /^\s+$/.test(line)) {
            return false;
        }
        return /^\s*\}/.test(text);
    }

    /**
     * @param session
     * @param row
     */
    autoOutdent(session: EditSession, row: number): void {
        const line = session.getLine(row);
        const match = line.match(/^(\s*\})/);

        if (!match) {
            return;
        }

        const column = match[1].length;
        const openBracePos = session.findMatchingBracket({ row: row, column: column });

        if (!openBracePos || openBracePos.row === row) {
            return;
        }

        const indent = this.$getIndent(session.getLine(openBracePos.row));
        session.replace(new Range(row, 0, row, column - 1), indent);
    }

    /**
     * FIXME: Why isn't this a static method?
     * @param line
     */
    $getIndent(line: string): string {
        const match = line.match(/^\s*/);
        if (match) {
            return <string>match[0];
        }
        else {
            return "";
        }
    }
}
