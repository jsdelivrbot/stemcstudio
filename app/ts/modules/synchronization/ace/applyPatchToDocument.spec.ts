import applyPatch from './applyPatchToDocument';
import Diff from '../Diff';
import Patch from '../Patch';
import DIFF_EQUAL from '../DIFF_EQUAL';
import DIFF_INSERT from '../DIFF_INSERT';
import DIFF_DELETE from '../DIFF_DELETE';
import Document from './Document';

describe("applyPatchToDocument", function() {
    it("INSERT", function() {
        const diffs: Diff[] = [
            [DIFF_EQUAL, "Mac"],
            [DIFF_INSERT, "intoshe"],
            [DIFF_EQUAL, "s had th"]
        ];
        const patch: Patch = {
            diffs,
            start1: 0,
            start2: 0,
            length1: 11,
            length2: 18
        };
        const doc = new Document("Macs had the original point and click UI.");
        const result = applyPatch(patch, doc);
        expect(result.start).toBe(patch.start2);
        expect(result.length).toBe(patch.length2);
        expect(result.applied.length).toBe(diffs.length);
        expect(result.applied[0]).toBe(true);
        expect(result.applied[1]).toBe(true);
        expect(result.applied[2]).toBe(true);
        expect(doc.getValue()).toBe("Macintoshes had the original point and click UI.");
    });
    it("DELETE", function() {
        const diffs: Diff[] = [
            [DIFF_EQUAL, "ick "],
            [DIFF_DELETE, "UI"],
            [DIFF_INSERT, "interface"],
            [DIFF_EQUAL, "."]
        ];
        const patch: Patch = {
            diffs,
            start1: 44,
            start2: 44,
            length1: 7,
            length2: 14
        };
        const doc = new Document("Smith & Wesson had the original point and click UI.");
        const result = applyPatch(patch, doc);
        expect(result.start).toBe(patch.start2);
        expect(result.length).toBe(patch.length2);
        expect(result.applied.length).toBe(diffs.length);
        expect(result.applied[0]).toBe(true);
        expect(result.applied[1]).toBe(true);
        expect(result.applied[2]).toBe(true);
        expect(result.applied[3]).toBe(true);
        expect(doc.getValue()).toBe("Smith & Wesson had the original point and click interface.");
    });
});
