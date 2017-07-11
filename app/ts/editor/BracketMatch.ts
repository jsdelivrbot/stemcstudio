import { TokenIterator } from "./TokenIterator";
import { HighlighterToken } from './mode/Highlighter';
import { Position } from "editor-document";
import { OrientedRange } from "../editor/RangeBasic";
import { fromPoints } from "./RangeHelpers";
import { TokenWithIndex } from '../editor/Token';

/**
 * Maps an opening(closing) bracket string to the corresponding closing(opening) bracket.
 */
const $brackets: { [bracket: string]: '(' | ')' | '[' | ']' | '{' | '}' } = {
    ")": "(",
    "(": ")",
    "]": "[",
    "[": "]",
    "{": "}",
    "}": "{"
};

export interface BracketMatchEditSession {
    getLength(): number;
    getLine(row: number): string;
    getTokens(row: number): HighlighterToken[];
    getTokenAt(row: number, column?: number): TokenWithIndex | null | undefined;
}

/**
 *
 */
export class BracketMatch {

    /**
     *
     */
    private editSession: BracketMatchEditSession;

    /**
     * @param editSession
     */
    constructor(editSession: BracketMatchEditSession) {
        this.editSession = editSession;
    }

    /**
     *
     */
    findMatchingBracket(position: Position, chr?: string): Position | null {
        if (position.column === 0) return null;

        const charBeforeCursor: string = chr || this.editSession.getLine(position.row).charAt(position.column - 1);
        if (charBeforeCursor === "") return null;

        const match = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
        if (!match)
            return null;

        if (match[1])
            return this.findClosingBracket(match[1], position);
        else
            return this.findOpeningBracket(match[2], position);
    }

    /**
     * @param pos
     */
    getBracketRange(pos: Position): OrientedRange | null {
        const line = this.editSession.getLine(pos.row);
        let before = true;
        let range: OrientedRange;

        let chr = line.charAt(pos.column - 1);
        let match = chr && chr.match(/([\(\[\{])|([\)\]\}])/);
        if (!match) {
            chr = line.charAt(pos.column);
            pos = { row: pos.row, column: pos.column + 1 };
            match = chr && chr.match(/([\(\[\{])|([\)\]\}])/);
            before = false;
        }
        if (!match)
            return null;

        if (match[1]) {
            const closingPos = this.findClosingBracket(match[1], pos);
            if (!closingPos)
                return null;
            range = fromPoints(pos, closingPos) as OrientedRange;
            if (!before) {
                range.end.column++;
                range.start.column--;
            }
            range.cursor = range.end;
        }
        else {
            const openingPos = this.findOpeningBracket(match[2], pos);
            if (!openingPos)
                return null;
            range = fromPoints(openingPos, pos) as OrientedRange;
            if (!before) {
                range.start.column++;
                range.end.column--;
            }
            range.cursor = range.start;
        }

        return range;
    }

    /**
     * @param bracket
     * @param position
     * @param typeRe
     */
    findOpeningBracket(closingBracket: string, position: Position, typeRe?: RegExp): Position | null {
        const openingBracket = $brackets[closingBracket];
        let depth = 1;

        const iterator = new TokenIterator(this.editSession, position.row, position.column);
        let token = iterator.getCurrentToken();
        if (!token) {
            token = iterator.stepForward();
        }
        if (!token) {
            return null;
        }

        if (!typeRe && token.type) {
            let pattern = token.type.replace(".", "\\.");
            pattern = pattern.replace("rparen", ".paren");
            pattern = pattern.replace(/\b(?:end)\b/, "(?:start|begin|end)");
            pattern = `(\\.?${pattern})+`;
            typeRe = new RegExp(pattern);
        }

        // Start searching in token, just before the character at position.column
        let valueIndex = position.column - iterator.getCurrentTokenColumn() - 2;
        let value = token.value;

        while (true) {
            while (valueIndex >= 0) {
                const chr = value.charAt(valueIndex);
                if (chr === openingBracket) {
                    depth -= 1;
                    if (depth === 0) {
                        return {
                            row: iterator.getCurrentTokenRow(),
                            column: valueIndex + iterator.getCurrentTokenColumn()
                        };
                    }
                }
                else if (chr === closingBracket) {
                    depth += 1;
                }
                valueIndex -= 1;
            }

            // Scan backward through the document, looking for the next token
            // whose type matches typeRe
            do {
                token = iterator.stepBackward();
            } while (token && token.type && typeRe && !typeRe.test(token.type));

            if (token === null)
                break;

            value = token.value;
            valueIndex = value.length - 1;
        }

        return null;
    }

    /**
     * Finds the position of the closing bracket corresponding to the provided opening bracket and position.
     */
    findClosingBracket(openingBracket: string, position: Position, typeRe?: RegExp): Position | null {
        const closingBracket = $brackets[openingBracket];
        let depth = 1;

        const iterator = new TokenIterator(this.editSession, position.row, position.column);
        let token = iterator.getCurrentToken();
        if (!token) {
            token = iterator.stepForward();
        }
        if (token) {
            if (!typeRe && token.type) {
                let pattern: string = token.type.replace(".", "\\.");
                pattern = pattern.replace("lparen", ".paren");
                pattern = pattern.replace(/\b(?:start|begin)\b/, "(?:start|begin|end)");
                pattern = `(\\.?${pattern})+`;
                typeRe = new RegExp(pattern);
            }

            // Start searching in token, after the character at position.column
            let valueIndex = position.column - iterator.getCurrentTokenColumn();

            while (true) {

                if (token) {
                    const value = token.value;
                    const valueLength = value.length;
                    while (valueIndex < valueLength) {
                        const chr = value.charAt(valueIndex);
                        if (chr === closingBracket) {
                            depth -= 1;
                            if (depth === 0) {
                                return {
                                    row: iterator.getCurrentTokenRow(),
                                    column: valueIndex + iterator.getCurrentTokenColumn()
                                };
                            }
                        }
                        else if (chr === openingBracket) {
                            depth += 1;
                        }
                        valueIndex += 1;
                    }
                }

                // Scan forward through the document, looking for the next token
                // whose type matches typeRe
                do {
                    token = iterator.stepForward();
                }
                while (token && token.type && typeRe && !typeRe.test(token.type));

                if (token === null) {
                    break;
                }

                valueIndex = 0;
            }
        }
        return null;
    }
}
