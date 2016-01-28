import Document from '../Document';
import Position from '../Position';

export default function getPosition(doc: Document, chars: number): Position {
    const lines: string[] = doc.getAllLines();
    let count = 0;
    let row = 0;
    for (let i = 0, iLength = lines.length; i < iLength; i++) {
        let line = lines[i];
        if (chars < (count + (line.length + 1))) {
            return { column: chars - count, row: row };
        }
        count += line.length + 1;
        row += 1;
    }
    return { column: chars - count, row: row };
}
