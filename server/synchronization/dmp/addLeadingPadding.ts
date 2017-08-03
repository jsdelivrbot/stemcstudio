import { DIFF_EQUAL } from '../DIFF_EQUAL';
import { Patch } from '../Patch';

/**
 * Add some padding on start of first diff.
 * 
 * This is a helper function for the full add Padding
 */
export function addLeadingPadding(patches: Patch[], paddingLength: number, nullPadding: string): void {
    const patch = patches[0];
    const diffs = patch.diffs;
    if (diffs.length === 0 || diffs[0][0] !== DIFF_EQUAL) {
        // Add nullPadding equality.
        diffs.unshift([DIFF_EQUAL, nullPadding]);
        patch.start1 -= paddingLength;  // Should be 0.
        patch.start2 -= paddingLength;  // Should be 0.
        patch.length1 += paddingLength;
        patch.length2 += paddingLength;
    }
    else if (paddingLength > (<string>diffs[0][1]).length) {
        // Grow first equality.
        const extraLength = paddingLength - (<string>diffs[0][1]).length;
        diffs[0][1] = nullPadding.substring((<string>diffs[0][1]).length) + diffs[0][1];
        patch.start1 -= extraLength;
        patch.start2 -= extraLength;
        patch.length1 += extraLength;
        patch.length2 += extraLength;
    }
}
