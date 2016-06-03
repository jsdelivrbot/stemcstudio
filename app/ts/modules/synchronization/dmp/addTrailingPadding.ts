import DIFF_EQUAL from '../DIFF_EQUAL';
import Patch from '../Patch';

/**
 * Add some padding on end of last diff.
 * 
 * This is a helper function for the full add Padding
 */
export default function addTrailingPadding(patches: Patch[], paddingLength: number, nullPadding: string): void {
    const patch = patches[patches.length - 1];
    const diffs = patch.diffs;
    if (diffs.length === 0 || diffs[diffs.length - 1][0] !== DIFF_EQUAL) {
        // Add nullPadding equality.
        diffs.push([DIFF_EQUAL, nullPadding]);
        patch.length1 += paddingLength;
        patch.length2 += paddingLength;
    }
    else if (paddingLength > (<string>diffs[diffs.length - 1][1]).length) {
        // Grow last equality.
        const extraLength = paddingLength - (<string>diffs[diffs.length - 1][1]).length;
        diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
        patch.length1 += extraLength;
        patch.length2 += extraLength;
    }
}
