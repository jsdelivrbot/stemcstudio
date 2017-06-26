import { Delta } from './Delta';
import { Document } from './Document';
import { position } from './Position';
import { range } from './Range';

function range4(startRow: number, startColumn: number, endRow: number, endColumn: number) {
    return range(position(startRow, startColumn), position(endRow, endColumn));
}

describe("Document", function () {
    describe("constructor-release", function () {
        const doc = new Document(["123"]);
        it("should cleanup", function () {
            const refCount = doc.release();
            expect(refCount).toBe(0);
        });
    });
    describe("constructor-addRef-release-release", function () {
        const doc = new Document(["123"]);
        it("should cleanup", function () {
            let refCount = doc.addRef();
            expect(refCount).toBe(2);
            refCount = doc.release();
            expect(refCount).toBe(1);
            refCount = doc.release();
            expect(refCount).toBe(0);
        });
    });
    describe("constructor-zombie-release", function () {
        const doc = new Document(["123"]);
        it("should assert", function () {
            const refCount = doc.release();
            expect(refCount).toBe(0);
            expect(function () { doc.release(); }).toThrow(new Error("Document refCount is negative."));
        });
    });
    describe("insert text in line", function () {
        const doc = new Document(["12", "34"]);
        const deltas: Delta[] = [];
        doc.addChangeListener(function (delta) { deltas.push(delta); });
        const endPosition = doc.insert({ row: 0, column: 1 }, "juhu");
        it("should create correct deltas", function () {
            expect(doc.getValue()).toBe(["1juhu2", "34"].join("\n"));

            expect(endPosition.row).toBe(0);
            expect(endPosition.column).toBe(5);

            const ds = deltas.concat();
            doc.revertDeltas(ds);
            expect(doc.getValue()).toBe(["12", "34"].join("\n"));

            doc.applyDeltas(ds);
            expect(doc.getValue()).toBe(["1juhu2", "34"].join("\n"));
        });
    });
    describe("insert new line", function () {
        const doc = new Document(["12", "34"]);

        const deltas: Delta[] = [];
        const cleanUp = doc.addChangeListener(function (delta) { deltas.push(delta); });

        // TODO: Check the returned position
        doc.insertMergedLines({ row: 0, column: 1 }, ['', '']);
        it("", function () {
            expect(doc.getValue()).toBe(["1", "2", "34"].join("\n"));

            const d = deltas.concat();
            doc.revertDeltas(d);
            expect(doc.getValue()).toBe(["12", "34"].join("\n"));

            doc.applyDeltas(d);
            expect(doc.getValue()).toBe(["1", "2", "34"].join("\n"));

            cleanUp();
        });
    });
    describe("insert lines at the beginning", function () {
        const doc = new Document(["12", "34"]);

        const deltas: Delta[] = [];
        const cleanUp = doc.on("change", function (e) { deltas.push(e); });

        doc.insertFullLines(0, ["aa", "bb"]);
        it("", function () {
            expect(doc.getValue()).toBe(["aa", "bb", "12", "34"].join("\n"));

            const d = deltas.concat();
            doc.revertDeltas(d);
            expect(doc.getValue()).toBe(["12", "34"].join("\n"));

            doc.applyDeltas(d);
            expect(doc.getValue()).toBe(["aa", "bb", "12", "34"].join("\n"));

            cleanUp();
        });
    });
    describe("insert lines at the end", function () {
        const doc = new Document(["12", "34"]);

        const deltas: Delta[] = [];
        const cleanUp = doc.on("change", function (e) { deltas.push(e); });

        doc.insertFullLines(2, ["aa", "bb"]);
        it("", function () {
            expect(doc.getValue()).toBe(["12", "34", "aa", "bb"].join("\n"));

            cleanUp();
        });
    });
    describe("insert lines in the middle", function () {
        const doc = new Document(["12", "34"]);

        const deltas: Delta[] = [];
        const cleanUp = doc.on("change", function (e) { deltas.push(e); });

        doc.insertFullLines(1, ["aa", "bb"]);
        it("", function () {
            expect(doc.getValue()).toBe(["12", "aa", "bb", "34"].join("\n"));

            const d = deltas.concat();
            doc.revertDeltas(d);
            expect(doc.getValue()).toBe(["12", "34"].join("\n"));

            doc.applyDeltas(d);
            expect(doc.getValue()).toBe(["12", "aa", "bb", "34"].join("\n"));

            cleanUp();
        });
    });
    describe("insert multi line string at the start", function () {
        const doc = new Document(["12", "34"]);

        const deltas: Delta[] = [];
        const cleanUp = doc.on("change", function (e) { deltas.push(e); });

        doc.insert({ row: 0, column: 0 }, "aa\nbb\ncc");
        it("", function () {
            expect(doc.getValue()).toBe(["aa", "bb", "cc12", "34"].join("\n"));

            const d = deltas.concat();
            doc.revertDeltas(d);
            expect(doc.getValue()).toBe(["12", "34"].join("\n"));

            doc.applyDeltas(d);
            expect(doc.getValue()).toBe(["aa", "bb", "cc12", "34"].join("\n"));

            cleanUp();
        });
    });
    describe("insert multi line string at the end", function () {
        const doc = new Document(["12", "34"]);

        const deltas: Delta[] = [];
        const cleanUp = doc.on("change", function (e) { deltas.push(e); });

        doc.insert({ row: 1, column: 2 }, "aa\nbb\ncc");
        it("", function () {
            expect(doc.getValue()).toBe(["12", "34aa", "bb", "cc"].join("\n"));

            const d = deltas.concat();
            doc.revertDeltas(d);
            expect(doc.getValue()).toBe(["12", "34"].join("\n"));

            doc.applyDeltas(d);
            expect(doc.getValue()).toBe(["12", "34aa", "bb", "cc"].join("\n"));

            cleanUp();
        });
    });
    describe("insert multi line string in the middle", function () {
        const doc = new Document(["12", "34"]);

        const deltas: Delta[] = [];
        const cleanUp = doc.on("change", function (e) { deltas.push(e); });

        doc.insert({ row: 0, column: 1 }, "aa\nbb\ncc");
        it("", function () {
            expect(doc.getValue()).toBe(["1aa", "bb", "cc2", "34"].join("\n"));

            const d = deltas.concat();
            doc.revertDeltas(d);
            expect(doc.getValue()).toBe(["12", "34"].join("\n"));

            doc.applyDeltas(d);
            expect(doc.getValue()).toBe(["1aa", "bb", "cc2", "34"].join("\n"));

            cleanUp();
        });
    });
    describe("delete in line", function () {
        const doc = new Document(["1234", "5678"]);

        const deltas: Delta[] = [];
        const cleanUp = doc.on("change", function (e) { deltas.push(e); });

        doc.remove(range4(0, 1, 0, 3));
        it("", function () {
            expect(doc.getValue()).toBe(["14", "5678"].join("\n"));

            const d = deltas.concat();
            doc.revertDeltas(d);
            expect(doc.getValue()).toBe(["1234", "5678"].join("\n"));

            doc.applyDeltas(d);
            expect(doc.getValue()).toBe(["14", "5678"].join("\n"));

            cleanUp();
        });
    });
    describe("delete new line", function () {
        const doc = new Document(["1234", "5678"]);

        const deltas: Delta[] = [];
        const cleanUp = doc.on("change", function (e) { deltas.push(e); });

        doc.remove(range4(0, 4, 1, 0));
        it("", function () {
            expect(doc.getValue()).toBe(["12345678"].join("\n"));

            const d = deltas.concat();
            doc.revertDeltas(d);
            expect(doc.getValue()).toBe(["1234", "5678"].join("\n"));

            doc.applyDeltas(d);
            expect(doc.getValue()).toBe(["12345678"].join("\n"));

            cleanUp();
        });
    });
    describe("delete multi line range line", function () {
        const doc = new Document(["1234", "5678", "abcd"]);

        const deltas: Delta[] = [];
        const cleanUp = doc.on("change", function (e) { deltas.push(e); });

        doc.remove(range4(0, 2, 2, 2));
        it("", function () {
            expect(doc.getValue()).toBe(["12cd"].join("\n"));

            const d = deltas.concat();
            doc.revertDeltas(d);
            expect(doc.getValue()).toBe(["1234", "5678", "abcd"].join("\n"));

            doc.applyDeltas(d);
            expect(doc.getValue()).toBe(["12cd"].join("\n"));

            cleanUp();
        });
    });
    describe("delete full lines", function () {
        const doc = new Document(["1234", "5678", "abcd"]);

        const deltas: Delta[] = [];
        const cleanUp = doc.on("change", function (e) { deltas.push(e); });

        doc.remove(range4(1, 0, 3, 0));
        it("", function () {
            expect(doc.getValue()).toBe(["1234", ""].join("\n"));

            cleanUp();
        });
    });
    describe("remove lines should return the removed lines", function () {
        const doc = new Document(["1234", "5678", "abcd"]);

        const removed = doc.removeFullLines(1, 2);
        it("", function () {
            expect(removed.join("\n")).toBe(["5678", "abcd"].join("\n"));
        });
    });
    describe("should handle unix style new lines", function () {
        const doc = new Document(["1", "2", "3"]);
        it("", function () {
            expect(doc.getValue()).toBe(["1", "2", "3"].join("\n"));
        });
    });
    describe("should handle windows style new lines", function () {
        const doc = new Document(["1", "2", "3"].join("\r\n"));

        doc.setNewLineMode("unix");
        it("", function () {
            expect(doc.getValue()).toBe(["1", "2", "3"].join("\n"));
        });
    });
    describe("set new line mode to 'windows'", function () {
        const doc = new Document(["1", "2", "3"].join("\n"));
        doc.setNewLineMode("windows");
        it("should use '\\r\\n' as new lines", function () {
            expect(doc.getValue()).toBe(["1", "2", "3"].join("\r\n"));
        });
    });
    describe("set new line mode to 'unix'", function () {
        const doc = new Document(["1", "2", "3"].join("\r\n"));

        doc.setNewLineMode("unix");
        it("should use '\\n' as new lines", function () {
            expect(doc.getValue()).toBe(["1", "2", "3"].join("\n"));
        });
    });
    describe("set new line mode to 'auto'", function () {
        describe("with unix-style new line characters", function () {
            const doc = new Document(["1", "2", "3"].join("\n"));
            doc.setNewLineMode("auto");
            it("should detect the incoming newLineMode as 'unix'", function () {
                expect(doc.getValue()).toBe(["1", "2", "3"].join("\n"));
            });
        });
        describe("with windows-style new line characters", function () {
            const doc = new Document(["1", "2", "3"].join("\r\n"));
            doc.setNewLineMode("auto");
            it("should detect the incoming newLineMode as 'windows'", function () {
                expect(doc.getValue()).toBe(["1", "2", "3"].join("\r\n"));
                doc.replace(range4(0, 0, 2, 1), ["4", "5", "6"].join("\n"));
                expect(["4", "5", "6"].join("\n")).toBe(doc.getValue());
            });
        });
    });
    describe("setValue", function () {
        describe("without new lines", function () {
            const doc = new Document("1");
            it("should be consistent with getValue", function () {
                expect(doc.getValue()).toBe("1");
                doc.setValue(doc.getValue());
                expect(doc.getValue()).toBe("1");
            });
        });
        describe("with new lines", function () {
            const doc = new Document("1\n2");
            it("should be consistent with getValue", function () {
                expect(doc.getValue()).toBe("1\n2");
                doc.setValue(doc.getValue());
                expect(doc.getValue()).toBe("1\n2");
            });
        });
    });
    describe("empty document has to contain one line", function () {
        const doc = new Document("");
        it("", function () {
            expect(doc.getLength()).toBe(1);
        });
    });
    describe("ignore empty delta", function () {
        const doc = new Document("");
        const spy = jasmine.createSpy('changeSpy');
        doc.on("change", spy);
        doc.insert({ row: 0, column: 0 }, "");
        doc.insert({ row: 1, column: 1 }, "");
        doc.remove({ start: { row: 1, column: 1 }, end: { row: 1, column: 1 } });
        it("", function () {
            expect(spy).not.toHaveBeenCalled();
        });
    });
    describe("indexToPosition", function () {
        const sourceText = [
            "123",
            "456"
        ].join('\n');
        const doc = new Document(sourceText);
        it("should account for line endings", function () {
            // FIXME. Not consistent with end behaviour!
            // expect(doc.indexToPosition(-1).row).toBe(0);
            // expect(doc.indexToPosition(-1).column).toBe(0);
            expect(doc.indexToPosition(0).row).toBe(0);
            expect(doc.indexToPosition(0).column).toBe(0);
            expect(doc.indexToPosition(1).row).toBe(0);
            expect(doc.indexToPosition(1).column).toBe(1);
            expect(doc.indexToPosition(2).row).toBe(0);
            expect(doc.indexToPosition(2).column).toBe(2);
            expect(doc.indexToPosition(3).row).toBe(0);
            expect(doc.indexToPosition(3).column).toBe(3);
            expect(doc.indexToPosition(4).row).toBe(1);
            expect(doc.indexToPosition(4).column).toBe(0);
            expect(doc.indexToPosition(5).row).toBe(1);
            expect(doc.indexToPosition(5).column).toBe(1);
            expect(doc.indexToPosition(6).row).toBe(1);
            expect(doc.indexToPosition(6).column).toBe(2);
            expect(doc.indexToPosition(7).row).toBe(1);
            expect(doc.indexToPosition(7).column).toBe(3);
            // Appears to be clipping...
            expect(doc.indexToPosition(8).row).toBe(1);
            expect(doc.indexToPosition(8).column).toBe(3);
            expect(doc.indexToPosition(9).row).toBe(1);
            expect(doc.indexToPosition(9).column).toBe(3);
        });
        it("should account for start row", function () {
            // FIXME. Not consistent with end behaviour!
            // expect(doc.indexToPosition(-1).row).toBe(0);
            // expect(doc.indexToPosition(-1).column).toBe(0);
            expect(doc.indexToPosition(0, 1).row).toBe(1);
            expect(doc.indexToPosition(0, 1).column).toBe(0);
            expect(doc.indexToPosition(1, 1).row).toBe(1);
            expect(doc.indexToPosition(1, 1).column).toBe(1);
            expect(doc.indexToPosition(2, 1).row).toBe(1);
            expect(doc.indexToPosition(2, 1).column).toBe(2);
            expect(doc.indexToPosition(3, 1).row).toBe(1);
            expect(doc.indexToPosition(3, 1).column).toBe(3);
            expect(doc.indexToPosition(4, 1).row).toBe(1);
            expect(doc.indexToPosition(4, 1).column).toBe(3);
            expect(doc.indexToPosition(5, 1).row).toBe(1);
            expect(doc.indexToPosition(5, 1).column).toBe(3);
            expect(doc.indexToPosition(6, 1).row).toBe(1);
            expect(doc.indexToPosition(6, 1).column).toBe(3);
            expect(doc.indexToPosition(7, 1).row).toBe(1);
            expect(doc.indexToPosition(7, 1).column).toBe(3);
            // Appears to be clipping...
            expect(doc.indexToPosition(8, 1).row).toBe(1);
            expect(doc.indexToPosition(8, 1).column).toBe(3);
            expect(doc.indexToPosition(9, 1).row).toBe(1);
            expect(doc.indexToPosition(9, 1).column).toBe(3);
        });
    });
    describe("positionToIndex", function () {
        const sourceText = [
            "123",
            "456"
        ].join('\n');
        const doc = new Document(sourceText);
        it("should account for line endings", function () {
            expect(doc.positionToIndex(position(0, 0))).toBe(0);
            expect(doc.positionToIndex(position(0, 1))).toBe(1);
            expect(doc.positionToIndex(position(0, 2))).toBe(2);
            expect(doc.positionToIndex(position(0, 3))).toBe(3);

            // FIXME?
            expect(doc.positionToIndex(position(0, 4))).toBe(4);
            // FIXME?
            expect(doc.positionToIndex(position(0, 5))).toBe(5);

            expect(doc.positionToIndex(position(1, 0))).toBe(4);
            expect(doc.positionToIndex(position(1, 1))).toBe(5);
            expect(doc.positionToIndex(position(1, 2))).toBe(6);
            expect(doc.positionToIndex(position(1, 3))).toBe(7);

            // FIXME?
            expect(doc.positionToIndex(position(1, 4))).toBe(8);
        });
        it("should account for start row", function () {
            // FIXME?
            expect(doc.positionToIndex(position(0, 0), 1)).toBe(0);
            // FIXME?
            expect(doc.positionToIndex(position(0, 1), 1)).toBe(1);
            // FIXME?
            expect(doc.positionToIndex(position(0, 2), 1)).toBe(2);
            // FIXME?
            expect(doc.positionToIndex(position(0, 3), 1)).toBe(3);

            // FIXME?
            expect(doc.positionToIndex(position(0, 4), 1)).toBe(4);
            // FIXME?
            expect(doc.positionToIndex(position(0, 5), 1)).toBe(5);

            expect(doc.positionToIndex(position(1, 0), 1)).toBe(0);
            expect(doc.positionToIndex(position(1, 1), 1)).toBe(1);
            expect(doc.positionToIndex(position(1, 2), 1)).toBe(2);
            expect(doc.positionToIndex(position(1, 3), 1)).toBe(3);

            // FIXME?
            expect(doc.positionToIndex(position(1, 4), 1)).toBe(4);
        });
    });
    describe("inserting huge delta", function () {
        const doc = new Document("");
        let val = "";
        const MAX = 0xF000;
        for (let i = 0; i < 10 * MAX; i++) {
            val += i + "\n";
        }
        doc.setValue(val);
        it("", function () {
            expect(doc.getValue()).toBe(val);

            for (let i = 3 * MAX + 2; i >= 3 * MAX - 2; i--) {
                val = doc.getLines(0, i).join("\n");
                doc.setValue("\nab");
                expect(doc.getValue()).toBe("\nab");
                doc.insert({ row: 1, column: 1 }, val);
                expect(doc.getValue()).toBe("\na" + val + "b");
            }
        });
    });
});
