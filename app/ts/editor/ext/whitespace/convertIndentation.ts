import { stringRepeat } from "../../lib/lang";
import { Document } from 'editor-document';
import { EditSession } from '../../EditSession';

export function convertIndentation(session: EditSession, ch: string, len: number): void {
    const oldCh = session.getTabString()[0];
    const oldLen = session.getTabSize();
    if (!len) len = oldLen;
    if (!ch) ch = oldCh;

    const tab = ch === "\t" ? ch : stringRepeat(ch, len);

    const doc: Document = session.doc;
    const lines: string[] = doc.getAllLines();

    const cache: { [tabCount: number]: string } = {};
    const spaceCache: { [remainder: number]: string } = {};
    const iLen = lines.length;
    for (let i = 0; i < iLen; i++) {
        const line = lines[i];
        const match = line.match(/^\s*/)[0];
        if (match) {
            const w = session.$getStringScreenWidth(match)[0];
            const tabCount = Math.floor(w / oldLen);
            const remainder = w % oldLen;
            let toInsert = cache[tabCount] || (cache[tabCount] = stringRepeat(tab, tabCount));
            toInsert += spaceCache[remainder] || (spaceCache[remainder] = stringRepeat(" ", remainder));

            if (toInsert !== match) {
                doc.removeInLine(i, 0, match.length);
                doc.insertInLine({ row: i, column: 0 }, toInsert);
            }
        }
    }
    session.setTabSize(len);
    session.setUseSoftTabs(ch === " ");
}
