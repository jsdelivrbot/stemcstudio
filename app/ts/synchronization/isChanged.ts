import Diff from './Diff';
import DIFF_EQUAL from './DIFF_EQUAL';

/**
 * Determines whether the diffs represent any changes.
 * A single Diff with a type of DIFF_EQUAL represents an unchanged text.
 */
export default function isChanged(diffs: Diff[]): boolean {
    return diffs.length !== 1 || diffs[0][0] !== DIFF_EQUAL;
}
