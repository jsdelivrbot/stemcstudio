import MwEditor from '../../modules/synchronization/MwEditor';
import Patch from '../../modules/synchronization/Patch';
import DIFF_EQUAL from '../../modules/synchronization/DIFF_EQUAL';
import DIFF_DELETE from '../../modules/synchronization/DIFF_DELETE';
import DIFF_INSERT from '../../modules/synchronization/DIFF_INSERT';
import Editor from '../../widgets/editor/Editor';
import Document from '../../widgets/editor/Document';
import Range from '../../widgets/editor/Range';

/**
 * Applies a patch to a document.
 */
function applyPatchToDocument(patch: Patch, doc: Document) {
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


export default class EditorAdapter implements MwEditor {
    constructor(public editor: Editor) {
        // Do nothing yet.
    }
    getText(): string {
        return this.editor.getValue();
    }
    setText(text: string): void {
        this.editor.setValue(text/*, cursorPos*/);
    }
    patch(patches: Patch[]): boolean[] {
        const document = this.editor.getSession().getDocument();
        for (let i = 0; i < patches.length; i++) {
            const patch = patches[i];
            /* const {start, length, applied} = */ applyPatchToDocument(patch, document);
            // The results of aplying the patch as a collection of diffs.
        }
        // this.editor.
        return [];
    }
    onSentDiff() {
        // Ignore.
    }
    release(): number {
        return 0;
    }
}
