import {stringRepeat} from "../../lib/lang";
import Document from '../../Document';
import EditSession from '../../EditSession';

export default function convertIndentation(session: EditSession, ch: string, len: number): void {
    var oldCh = session.getTabString()[0];
    var oldLen = session.getTabSize();
    if (!len) len = oldLen;
    if (!ch) ch = oldCh;

    var tab = ch == "\t" ? ch : stringRepeat(ch, len);

    var doc: Document = session.doc;
    var lines: string[] = doc.getAllLines();

    var cache: { [tabCount: number]: string } = {};
    var spaceCache: { [remainder: number]: string } = {};
    for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i];
        var match = line.match(/^\s*/)[0];
        if (match) {
            var w = session.$getStringScreenWidth(match)[0];
            var tabCount = Math.floor(w / oldLen);
            var remainder = w % oldLen;
            var toInsert = cache[tabCount] || (cache[tabCount] = stringRepeat(tab, tabCount));
            toInsert += spaceCache[remainder] || (spaceCache[remainder] = stringRepeat(" ", remainder));

            if (toInsert != match) {
                doc.removeInLine(i, 0, match.length);
                doc.insertInLine({ row: i, column: 0 }, toInsert);
            }
        }
    }
    session.setTabSize(len);
    session.setUseSoftTabs(ch == " ");
}