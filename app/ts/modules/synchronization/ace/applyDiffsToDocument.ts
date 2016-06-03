import Diff from '../Diff';
import DIFF_DELETE from '../DIFF_DELETE';
import DIFF_EQUAL from '../DIFF_EQUAL';
import DIFF_INSERT from '../DIFF_INSERT';
import Document from './Document';
import Range from './Range';

/**
 * Demonstrates how to apply diffs to a Document.
 * This function is not intended for production use.
 */
export default function applyDiffsToDocument(diffs: Diff[], doc: Document) {
    const start = 0;
    let offset = 0;
    diffs.forEach(function(chunk) {
        const op = <number>chunk[0];
        const text = <string>chunk[1];
        if (op === DIFF_EQUAL) {
            // Advance by the length of the text.
            // TODO: We should check that they actually are equal.
            const existing = doc.getTextRange(Range.fromPoints(doc.indexToPosition(offset, 0), doc.indexToPosition(offset + text.length, 0)));
            if (existing === text) {
                offset += text.length;
            }
            else {
                // Uh Oh.
            }
        }
        else if (op === DIFF_DELETE) {
            // Remove from the document.
            // The offset does not change.
            // We should check that the removed text matches.
            doc.remove(Range.fromPoints(doc.indexToPosition(offset, 0), doc.indexToPosition(offset + text.length, 0)));
        }
        else if (op === DIFF_INSERT) {
            // Insert the text into the document.
            doc.insert(doc.indexToPosition(offset, 0), text);
            // Advance the offset.
            offset += text.length;
        }
    });
    return { start, length: offset - start };
}
