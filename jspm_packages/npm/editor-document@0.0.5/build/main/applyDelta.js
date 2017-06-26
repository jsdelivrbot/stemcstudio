/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function applyDelta(docLines, delta, doNotValidate) {
    // Disabled validation since it breaks autocompletion popup.
    /*
    if (!doNotValidate) {
        validateDelta(docLines, delta);
    }
    */
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
                var args = [row, 1];
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
                docLines.splice(row, endRow - row + 1, line.substring(0, startColumn) + docLines[endRow].substring(endColumn));
            }
            break;
        default: {
            // Do nothing.
        }
    }
}
exports.applyDelta = applyDelta;
//# sourceMappingURL=applyDelta.js.map