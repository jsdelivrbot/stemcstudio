import { Delta } from 'editor-document';
import { Position } from 'editor-document';

function throwDeltaError(delta: Delta, errorText: string) {
    throw "Invalid Delta: " + errorText;
}

function positionInDocument(docLines: string[], position: Position): boolean {
    return position.row >= 0 && position.row < docLines.length &&
        position.column >= 0 && position.column <= docLines[position.row].length;
}

export function validateDelta(docLines: string[], delta: Delta): void {

    const action = delta.action;

    // Validate action string.
    if (action !== "insert" && action !== "remove") {
        throwDeltaError(delta, "delta.action must be 'insert' or 'remove'");
    }

    // Validate lines type.
    if (!(delta.lines instanceof Array)) {
        throwDeltaError(delta, "delta.lines must be an Array");
    }

    // Validate range type.
    if (!delta.start || !delta.end) {
        throwDeltaError(delta, "delta.start/end must be an present");
    }

    // Validate that the start point is contained in the document.
    const start = delta.start;
    if (!positionInDocument(docLines, delta.start)) {
        throwDeltaError(delta, "delta.start must be contained in document");
    }

    // Validate that the end point is contained in the document (remove deltas only).
    const end = delta.end;
    if (action === "remove" && !positionInDocument(docLines, end))
        throwDeltaError(delta, `delta.end ${JSON.stringify(end)} must be contained in document for 'remove' actions`);

    // Validate that the .range size matches the .lines size.
    const numRangeRows = end.row - start.row;
    const numRangeLastLineChars = (end.column - (numRangeRows === 0 ? start.column : 0));
    if (numRangeRows !== delta.lines.length - 1 || delta.lines[numRangeRows].length !== numRangeLastLineChars)
        throwDeltaError(delta, "delta.range must match delta lines");
}
