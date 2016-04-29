define(["require", "exports", "../../Range"], function (require, exports, Range_1) {
    "use strict";
    var FoldMode = (function () {
        function FoldMode() {
            this.foldingStartMarker = null;
            this.foldingStopMarker = null;
        }
        FoldMode.prototype.getFoldWidget = function (session, foldStyle, row) {
            var line = session.getLine(row);
            if (this.foldingStartMarker.test(line)) {
                return "start";
            }
            if (foldStyle === "markbeginend" && this.foldingStopMarker && this.foldingStopMarker.test(line)) {
                return "end";
            }
            return "";
        };
        FoldMode.prototype.getFoldWidgetRange = function (session, foldStyle, row) {
            return null;
        };
        FoldMode.prototype.indentationBlock = function (session, row, column) {
            var re = /\S/;
            var line = session.getLine(row);
            var startLevel = line.search(re);
            if (startLevel === -1) {
                return;
            }
            var startColumn = column || line.length;
            var maxRow = session.getLength();
            var startRow = row;
            var endRow = row;
            while (++row < maxRow) {
                var level = session.getLine(row).search(re);
                if (level === -1) {
                    continue;
                }
                if (level <= startLevel) {
                    break;
                }
                endRow = row;
            }
            if (endRow > startRow) {
                var endColumn = session.getLine(endRow).length;
                return new Range_1.default(startRow, startColumn, endRow, endColumn);
            }
        };
        FoldMode.prototype.openingBracketBlock = function (session, bracket, row, column, typeRe) {
            var start = { row: row, column: column + 1 };
            var end = session.findClosingBracket(bracket, start, typeRe);
            if (!end)
                return;
            var fw = session.foldWidgets[end.row];
            if (fw == null)
                fw = session.getFoldWidget(end.row);
            if (fw == "start" && end.row > start.row) {
                end.row--;
                end.column = session.getLine(end.row).length;
            }
            return Range_1.default.fromPoints(start, end);
        };
        FoldMode.prototype.closingBracketBlock = function (session, bracket, row, column, typeRe) {
            var end = { row: row, column: column };
            var start = session.findOpeningBracket(bracket, end);
            if (!start) {
                return;
            }
            start.column++;
            end.column--;
            return Range_1.default.fromPoints(start, end);
        };
        return FoldMode;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FoldMode;
});
