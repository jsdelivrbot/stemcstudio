import Delta from './Delta';
import Position from './Position';

function throwDeltaError(delta: Delta, errorText: string) {
    throw "Invalid Delta: " + errorText;
}

function positionInDocument(docLines: string[], position: Position): boolean {
    return position.row >= 0 && position.row < docLines.length &&
        position.column >= 0 && position.column <= docLines[position.row].length;
}

function validateDelta(docLines: string[], delta: Delta): void {

    const action = delta.action;

    // Validate action string.
    if (action !== "insert" && action !== "remove")
        throwDeltaError(delta, "delta.action must be 'insert' or 'remove'");

    // Validate lines type.
    if (!(delta.lines instanceof Array))
        throwDeltaError(delta, "delta.lines must be an Array");

    // Validate range type.
    if (!delta.start || !delta.end)
        throwDeltaError(delta, "delta.start/end must be an present");

    // Validate that the start point is contained in the document.
    var start = delta.start;
    if (!positionInDocument(docLines, delta.start))
        throwDeltaError(delta, "delta.start must be contained in document");

    // Validate that the end point is contained in the document (remove deltas only).
    const end = delta.end;
    if (action === "remove" && !positionInDocument(docLines, end))
        throwDeltaError(delta, `delta.end ${JSON.stringify(end)} must be contained in document for 'remove' actions`);

    // Validate that the .range size matches the .lines size.
    var numRangeRows = end.row - start.row;
    var numRangeLastLineChars = (end.column - (numRangeRows === 0 ? start.column : 0));
    if (numRangeRows !== delta.lines.length - 1 || delta.lines[numRangeRows].length !== numRangeLastLineChars)
        throwDeltaError(delta, "delta.range must match delta lines");
}


export default function applyDelta(docLines: string[], delta: Delta, doNotValidate?: boolean): void {

    // Disabled validation since it breaks autocompletion popup.
    if (!doNotValidate && false) {
        validateDelta(docLines, delta);
    }

    var row = delta.start.row;
    var startColumn = delta.start.column;
    var line = docLines[row] || "";
    switch (delta.action) {
        case "insert":
            var lines = delta.lines;
            if (lines.length === 1) {
                docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
            }
            else {
                var args: any[] = [row, 1];
                args = args.concat(delta.lines);
                docLines.splice.apply(docLines, args);
                docLines[row] = line.substring(0, startColumn) + docLines[row];
                docLines[row + delta.lines.length - 1] += line.substring(startColumn);
            }
            break;
        case "remove":
            var endColumn = delta.end.column;
            var endRow = delta.end.row;
            if (row === endRow) {
                docLines[row] = line.substring(0, startColumn) + line.substring(endColumn);
            }
            else {
                docLines.splice(
                    row, endRow - row + 1,
                    line.substring(0, startColumn) + docLines[endRow].substring(endColumn)
                );
            }
            break;
        default: {
            // Do nothing.
        }
    }
}
