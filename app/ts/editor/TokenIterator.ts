import EditSession from './EditSession';
import Token from './Token';

/**
 * This class provides an easy way to treat the document as a stream of tokens.
 * Provides methods to iterate over these tokens.
 * The heavy lifting is really being done by the edit session.
 */
export default class TokenIterator {
    private session: EditSession;
    private $row: number;
    private $rowTokens: Token[];
    private $tokenIndex: number;

    /**
     * Creates a new token iterator object. The inital token index is set to the provided row and column coordinates.
     *
     * @param session The session to associate with
     * @param initialRow The row to start the tokenizing at
     * @param initialColumn The column to start the tokenizing at
     *
     */
    constructor(session: EditSession, initialRow: number, initialColumn: number) {
        this.session = session;
        this.$row = initialRow;
        this.$rowTokens = session.getTokens(initialRow);

        const token: Token = session.getTokenAt(initialRow, initialColumn);
        this.$tokenIndex = token ? token.index : -1;
    }

    /** 
     * Tokenizes all the items from the current point to the row prior in the document.
     * 
     * @returns If the current point is not at the top of the file, this function returns `null`.
     *                 Otherwise, it returns an array of the tokenized strings.
     */
    stepBackward(): Token {
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

    /**
     * Tokenizes all the items from the current point until the next row in the document.
     *
     * @returns If the current point is at the end of the file, this function returns `null`.
     *                 Otherwise, it returns the tokenized string.
     */
    stepForward(): Token {
        if (this.$rowTokens) {
            this.$tokenIndex += 1;
            let rowCount: number;
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
            return void 0;
        }
    }

    /** 
     * Returns the current token.
     */
    getCurrentToken(): Token {
        if (this.$rowTokens) {
            return this.$rowTokens[this.$tokenIndex];
        }
        else {
            return void 0;
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
        let column = rowTokens[tokenIndex].start;
        if (column !== undefined)
            return column;

        column = 0;
        while (tokenIndex > 0) {
            tokenIndex -= 1;
            column += rowTokens[tokenIndex].value.length;
        }

        return column;
    }
}
