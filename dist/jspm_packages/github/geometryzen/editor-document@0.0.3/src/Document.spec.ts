import { Delta } from './Delta';
import { Document } from './Document';
import { position } from './Position';
import { range } from './Range';

function range4(startRow: number, startColumn: number, endRow: number, endColumn: number) {
    return range(position(startRow, startColumn), position(endRow, endColumn));
}

describe("Document", function () {
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
