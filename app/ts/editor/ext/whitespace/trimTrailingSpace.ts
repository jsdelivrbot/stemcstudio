import Document from '../../Document';
import EditSession from '../../EditSession';

export default function trimTrailingSpace(session: EditSession, trimEmpty: boolean): void {
    var doc: Document = session.getDocument();
    var lines: string[] = doc.getAllLines();

    var min = trimEmpty ? -1 : 0;

    for (var row = 0, rows = lines.length; row < rows; row++) {
        var line = lines[row];

        var startColumn = line.search(/\s+$/);
        var endColumn = line.length;

        if (startColumn > min) {
            doc.removeInLine(row, startColumn, endColumn);
        }
    }
}
