import { Delta } from './Delta';

export function applyDelta(docLines: string[], delta: Delta, doNotValidate?: boolean): void {

    // Disabled validation since it breaks autocompletion popup.
    /*
    if (!doNotValidate) {
        validateDelta(docLines, delta);
    }
    */

    const row = delta.start.row;
    const startColumn = delta.start.column;
    const line = docLines[row] || "";
    switch (delta.action) {
        case "insert":
            const lines = delta.lines;
            if (lines.length === 1) {
                docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
            }
            else {
                let args: any[] = [row, 1];
                args = args.concat(delta.lines);
                docLines.splice.apply(docLines, args);
                docLines[row] = line.substring(0, startColumn) + docLines[row];
                docLines[row + delta.lines.length - 1] += line.substring(startColumn);
            }
            break;
        case "remove":
            const endColumn = delta.end.column;
            const endRow = delta.end.row;
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
