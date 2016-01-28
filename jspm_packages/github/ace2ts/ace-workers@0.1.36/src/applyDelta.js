System.register([], function(exports_1) {
    function throwDeltaError(delta, errorText) {
        throw "Invalid Delta: " + errorText;
    }
    function positionInDocument(docLines, position) {
        return position.row >= 0 && position.row < docLines.length &&
            position.column >= 0 && position.column <= docLines[position.row].length;
    }
    function validateDelta(docLines, delta) {
        if (delta.action !== "insert" && delta.action !== "remove")
            throwDeltaError(delta, "delta.action must be 'insert' or 'remove'");
        if (!(delta.lines instanceof Array))
            throwDeltaError(delta, "delta.lines must be an Array");
        if (!delta.start || !delta.end)
            throwDeltaError(delta, "delta.start/end must be an present");
        var start = delta.start;
        if (!positionInDocument(docLines, delta.start))
            throwDeltaError(delta, "delta.start must be contained in document");
        var end = delta.end;
        if (delta.action === "remove" && !positionInDocument(docLines, end))
            throwDeltaError(delta, "delta.end must contained in document for 'remove' actions");
        var numRangeRows = end.row - start.row;
        var numRangeLastLineChars = (end.column - (numRangeRows == 0 ? start.column : 0));
        if (numRangeRows != delta.lines.length - 1 || delta.lines[numRangeRows].length != numRangeLastLineChars)
            throwDeltaError(delta, "delta.range must match delta lines");
    }
    function applyDelta(docLines, delta, doNotValidate) {
        if (!doNotValidate) {
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
        }
    }
    exports_1("default", applyDelta);
    return {
        setters:[],
        execute: function() {
        }
    }
});
