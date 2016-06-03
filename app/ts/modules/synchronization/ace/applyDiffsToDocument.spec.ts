import applyDiffsToDocument from './applyDiffsToDocument';
import Diff from '../Diff';
import DIFF_EQUAL from '../DIFF_EQUAL';
import DIFF_INSERT from '../DIFF_INSERT';
import DIFF_DELETE from '../DIFF_DELETE';
import Document from './Document';

describe("applyDiffsToDocument", function() {
    it("noop on empty document", function() {
        const diffs: Diff[] = [];
        const doc = new Document("");
        applyDiffsToDocument(diffs, doc);
        expect(doc.getValue()).toBe("");
    });
    it("INSERT", function() {
        const diffs: Diff[] = [[DIFF_INSERT, 'a']];
        const doc = new Document("");
        applyDiffsToDocument(diffs, doc);
        expect(doc.getValue()).toBe("a");
    });
    it("DELETE", function() {
        const diffs: Diff[] = [[DIFF_DELETE, 'a']];
        const doc = new Document("abc");
        applyDiffsToDocument(diffs, doc);
        expect(doc.getValue()).toBe("bc");
    });
    it("EQUAL", function() {
        const diffs: Diff[] = [[DIFF_EQUAL, 'a']];
        const doc = new Document("abc");
        applyDiffsToDocument(diffs, doc);
        expect(doc.getValue()).toBe("abc");
    });
    it("should work for a sequence", function() {
        const diffs: Diff[] = [
            [DIFF_EQUAL, 'abcd'],
            [DIFF_INSERT, 'e'],
            [DIFF_EQUAL, 'fg'],
            [DIFF_DELETE, 'h'],
            [DIFF_INSERT, 'i'],
            [DIFF_EQUAL, 'j'],
            [DIFF_INSERT, 'k'],
            [DIFF_DELETE, 'q'],
            [DIFF_INSERT, 'rxy']
        ];
        const doc = new Document("abcdfghjqz");
        applyDiffsToDocument(diffs, doc);
        expect(doc.getValue()).toBe("abcdefgijkrxyz");
    });
});
