import { HighlighterToken } from './mode/Highlighter';
import { BasicToken } from '../editor/Token';
import { TokenWithIndex } from '../editor/Token';

/**
 * Temporary check for undefined token values. 
 */
/*
function check<T>(xs: T[], where: string): T[] {
    for (const x of xs) {
        if (typeof x === 'undefined') {
            console.warn(`undefined token value at ${where}`);
        }
    }
    return xs;
}
*/

export interface TokenIteratorEditSession {
    getLength(): number;
    getTokens(row: number): HighlighterToken[];
    getTokenAt(row: number, column?: number): TokenWithIndex | null | undefined;
}

/**
 * This class provides an easy way to treat the document as a stream of tokens.
 * Provides methods to iterate over these tokens.
 * The heavy lifting is really being done by the edit session.
 */
export class TokenIterator {
    private session: TokenIteratorEditSession;
    private $row: number;
    private $rowTokens: BasicToken[];
    private $tokenIndex: number;

    /**
     * Creates a new token iterator object. The inital token index is set to the provided row and column coordinates.
     *
     * @param session The session to associate with
     * @param initialRow The row to start the tokenizing at
     * @param initialColumn The column to start the tokenizing at
     *
     */
    constructor(session: TokenIteratorEditSession, initialRow: number, initialColumn: number) {
        this.session = session;
        this.$row = initialRow;
        this.$rowTokens = session.getTokens(initialRow);

        const token = session.getTokenAt(initialRow, initialColumn);
        this.$tokenIndex = token ? token.index : -1;
    }

    /** 
     * Tokenizes all the items from the current point to the row prior in the document.
     * 
     * @returns If the current point is not at the top of the file, this function returns `null`.
     *                 Otherwise, it returns an array of the tokenized strings.
     */
    stepBackward(): BasicToken | null {
        if (typeof this.$tokenIndex === 'number') {
            this.$tokenIndex -= 1;

            while (this.$tokenIndex < 0) {
                this.$row -= 1;
                if (this.$row < 0) {
                    this.$row = 0;
                    return null;
                }

                this.$rowTokens = this.session.getTokens(this.$row);
                this.$tokenIndex = this.$rowTokens.length - 1;
            }

            return this.$rowTokens[this.$tokenIndex];
        }
        else {
            return null;
        }
    }

    /**
     * Tokenizes all the items from the current point until the next row in the document.
     *
     * @returns If the current point is at the end of the file, this function returns `null`.
     *                 Otherwise, it returns the tokenized string.
     */
    stepForward(): BasicToken | null {
        if (this.$rowTokens) {
            if (typeof this.$tokenIndex === 'number') {
                this.$tokenIndex += 1;
                let rowCount: number | undefined;
                while (this.$tokenIndex >= this.$rowTokens.length) {
                    this.$row += 1;
                    if (!rowCount) {
                        rowCount = this.session.getLength();
                    }
                    if (this.$row >= rowCount) {
                        this.$row = rowCount - 1;
                        return null;
                    }

                    this.$rowTokens = this.session.getTokens(this.$row);
                    this.$tokenIndex = 0;
                }

                return this.$rowTokens[this.$tokenIndex];
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }

    /** 
     * Returns the current token.
     * If the token index is out of bounds, returns null.
     * If there is no token index, throws an exception.
     */
    getCurrentToken(): BasicToken | null {
        const tokenIndex = this.$tokenIndex;
        if (typeof tokenIndex === 'number') {
            const rowTokens = this.$rowTokens;
            if (tokenIndex >= 0 && tokenIndex < rowTokens.length) {
                const token = rowTokens[tokenIndex];
                if (typeof token !== 'undefined') {
                    return token;
                }
                else {
                    // Assertion.
                    throw new Error(`token[${tokenIndex}] has type ${typeof token} [0, ${rowTokens.length}]`);
                }
            }
            else {
                return null;
            }
        }
        else {
            // Assertion.
            throw new Error(`tokenIndex has type ${typeof tokenIndex}`);
        }
    }

    /**
     * Returns the current row.
     */
    getCurrentTokenRow(): number {
        return this.$row;
    }

    /** 
     * Returns the current column.
     */
    getCurrentTokenColumn(): number {
        const rowTokens = this.$rowTokens;
        let tokenIndex = this.$tokenIndex;

        // If a column was cached by EditSession.getTokenAt, then use it.
        // If this is the case, the token will have been extended to have index and start.
        let column = (typeof tokenIndex === 'number') ? (rowTokens[tokenIndex] as TokenWithIndex).start : undefined;
        if (column !== undefined) {
            return column;
        }

        column = 0;
        if (typeof tokenIndex === 'number') {
            while (tokenIndex > 0) {
                tokenIndex -= 1;
                column += rowTokens[tokenIndex].value.length;
            }
        }

        return column;
    }
}
