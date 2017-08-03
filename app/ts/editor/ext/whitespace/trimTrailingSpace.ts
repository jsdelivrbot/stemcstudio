import { Document } from 'editor-document';
import { EditSession } from '../../EditSession';

export function trimTrailingSpace(session: EditSession, trimEmpty: boolean): void {
    const doc: Document = session.getDocument();
    const lines: string[] = doc.getAllLines();

    const min = trimEmpty ? -1 : 0;

    for (let row = 0, rows = lines.length; row < rows; row++) {
        const line = lines[row];

        const startColumn = line.search(/\s+$/);
        const endColumn = line.length;

        if (startColumn > min) {
            doc.removeInLine(row, startColumn, endColumn);
        }
    }
}
