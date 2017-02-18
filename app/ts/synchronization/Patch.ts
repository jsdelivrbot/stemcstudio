import DIFF_DELETE from './DIFF_DELETE';
import DIFF_INSERT from './DIFF_INSERT';
import DIFF_EQUAL from './DIFF_EQUAL';
import Diff from './Diff';

/**
 * Class representing one patch operation.
 */
export default class Patch {

    /**
     * The first element of Diff is a number indicating DELETE, INSERT, EQUAL.
     * The second element of Diff is a string, the test.
     */
    diffs: Diff[];

    /**
     * Start position in the original file.
     */
    start1: number;

    /**
     * Start position in the new file.
     */
    start2: number;

    /**
     * Length in the original file.
     */
    length1: number;

    /**
     * Length in the new file.
     */
    length2: number;

    constructor() {
        this.diffs = [];
        this.start1 = null;
        this.start2 = null;
        this.length1 = 0;
        this.length2 = 0;
    }

    /**
     * Emmulate GNU diff's format.
     * Header: @@ -382,8 +481,9 @@
     * Indicies are printed as 1-based, not 0-based.
     *
     * @returns The GNU diff string.
     */
    toString(): string {
        let coords1: string;
        let coords2: string;
        if (this.length1 === 0) {
            coords1 = this.start1 + ',0';
        } else if (this.length1 === 1) {
            coords1 = (this.start1 + 1).toString();
        } else {
            coords1 = (this.start1 + 1) + ',' + this.length1;
        }
        if (this.length2 === 0) {
            coords2 = this.start2 + ',0';
        } else if (this.length2 === 1) {
            coords2 = (this.start2 + 1).toString();
        } else {
            coords2 = (this.start2 + 1) + ',' + this.length2;
        }
        const text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
        let op: string;
        // Escape the body of the patch with %xx notation.
        for (let x = 0; x < this.diffs.length; x++) {
            switch (this.diffs[x][0]) {
                case DIFF_INSERT:
                    op = '+';
                    break;
                case DIFF_DELETE:
                    op = '-';
                    break;
                case DIFF_EQUAL:
                    op = ' ';
                    break;
                default: {
                    // Do nothing.
                }
            }
            // The cast is required because of the way diiffs is declared.
            text[x + 1] = op + encodeURI(<string>this.diffs[x][1]) + '\n';
        }
        // Opera doesn't know how to encode char 0.
        return text.join('').replace(/\x00/g, '%00').replace(/%20/g, ' ');
    }
}
