import { Document } from 'editor-document';
import { Position } from 'editor-document';

export function getLinesChars(lines: string[]): number {
    let count = 0;
    lines.forEach(function (line) {
        count += line.length + 1;
        return;
    });
    return count;
}

export function getChars(doc: Document, pos: Position): number {
    return getLinesChars(doc.getLines(0, pos.row - 1)) + pos.column;
}
