import Document from '../../editor/Document';
import Patch from '../../synchronization/Patch';
import DIFF_DELETE from '../../synchronization/DIFF_DELETE';
import DIFF_EQUAL from '../../synchronization/DIFF_EQUAL';
import DIFF_INSERT from '../../synchronization/DIFF_INSERT';
import Range from '../../editor/Range';
/**
 * Applies a patch to a document.
 */
export default function applyPatchToDocument(patch: Patch, doc: Document) {
    const start = patch.start1;
    let offset = start;
    const diffs = patch.diffs;
    const dLen = diffs.length;
    const applied: boolean[] = [];
    for (let d = 0; d < dLen; d++) {
        const chunk = diffs[d];
        const op = <number>chunk[0];
        const text = <string>chunk[1];
        if (op === DIFF_EQUAL) {
            const existing = doc.getTextRange(Range.fromPoints(doc.indexToPosition(offset, 0), doc.indexToPosition(offset + text.length, 0)));
            if (text === existing) {
                applied[d] = true;
            }
            else {
                applied[d] = false;
            }
            offset += text.length;
        }
        else if (op === DIFF_DELETE) {
            // Remove from the document.
            // The offset does not change.
            // We should check that the removed text matches.
            const existing = doc.getTextRange(Range.fromPoints(doc.indexToPosition(offset, 0), doc.indexToPosition(offset + text.length, 0)));
            if (text === existing) {
                doc.remove(Range.fromPoints(doc.indexToPosition(offset, 0), doc.indexToPosition(offset + text.length, 0)));
                applied[d] = true;
            }
            else {
                applied[d] = false;
            }
        }
        else if (op === DIFF_INSERT) {
            // Insert the text into the document.
            doc.insert(doc.indexToPosition(offset, 0), text);
            // Advance the offset.
            offset += text.length;
            applied[d] = true;
        }
    }
    return { start, length: offset - start, applied };
}
