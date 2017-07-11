import { Range } from "../Range";
import { EditSession } from '../EditSession';

/**
 *
 */
export class MatchingBraceOutdent {

    /**
     *
     */
    constructor() {
        // Do nothing.
    }

    /**
     * @param line
     * @param text
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
