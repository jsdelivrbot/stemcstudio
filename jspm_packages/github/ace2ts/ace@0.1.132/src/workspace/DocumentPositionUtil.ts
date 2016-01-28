"use strict";

import Document from '../Document';
import Position from '../Position';

export function getLinesChars(lines: string[]): number {
    var count = 0;
    lines.forEach(function(line) {
        count += line.length + 1;
        return;
    });
    return count;
}

export function getChars(doc: Document, pos: Position): number {
    return getLinesChars(doc.getLines(0, pos.row - 1)) + pos.column;
}
