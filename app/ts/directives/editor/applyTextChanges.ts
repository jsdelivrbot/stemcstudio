import { EditSession } from '../../virtual/editor';
import { Position } from '../../virtual/editor';
import TextChange from '../../editor/workspace/TextChange';

function removeWhitespace(text: string): string {
    return text.replace(/\s/g, "");
}

export default function applyTextChanges(edits: TextChange[], session: EditSession): void {

    // The text changes are relative to the initial document.
    // We apply them one by one in document order.
    edits = edits.sort((a, b) => a.span.start - b.span.start);

    /**
     * Keeps track of the need to adjust the replacement Position
     * to account for prior replacements. 
     */
    let runningOffset = 0;

    const document = session.getDocument();
    if (document) {
        for (const edit of edits) {
            const oldTextLength = edit.span.length;
            const editStartIndex = edit.span.start + runningOffset;
            const editEndIndex = editStartIndex + oldTextLength;
            const start: Position = document.indexToPosition(editStartIndex);
            const end: Position = document.indexToPosition(editEndIndex);
            const range = { start, end };

            // If these are formatting edits then we ensure that the text being replaced is whitespace only.
            const oldText = session.getTextRange(range);
            const newText = edit.newText;
            if (removeWhitespace(oldText).length > 0) {
                console.warn(`Abandoning formatting edits because non-whitespace detected in old text, '${oldText}'.`);
                return;
            }
            if (removeWhitespace(newText).length > 0) {
                console.warn(`Abandoning formatting edits because non-whitespace detected in new text, '${newText}'.`);
                return;
            }

            session.replace(range, newText);

            const offset = newText.length - oldTextLength;
            runningOffset += offset;
        }
    }
}
