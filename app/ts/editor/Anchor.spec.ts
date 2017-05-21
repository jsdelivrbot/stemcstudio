import Anchor from './Anchor';
import AnchorChangeEvent from './events/AnchorChangeEvent';
import { Document } from './Document';
import { Range } from './Range';

describe("Anchor", function () {
    describe("constructor", function () {
        const doc = new Document("juhu");
        const anchor = new Anchor(doc, 0, 0);
        it("should set the position to zero", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(0);
            expect(position.column).toBe(0);
        });
        it("should cache the document", function () {
            expect(anchor.getDocument()).toBe(doc);
        });
    });
    describe("insert text in same row before cursor", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 1, 4);
        doc.insert({ row: 1, column: 1 }, "123");
        it("should move anchor column", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(1);
            expect(position.column).toBe(7);
        });
    });
    describe("insert text at anchor", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 1, 4);
        anchor.insertRight = true;
        doc.insert({ row: 1, column: 4 }, "123");
        it("should not move anchor when insertRight is true", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(1);
            expect(position.column).toBe(4);
        });
    });
    describe("insert lines before cursor", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 1, 4);
        doc.insertFullLines(1, ["123", "456"]);
        it("should move anchor row", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(3);
            expect(position.column).toBe(4);
        });
    });
    describe("insert lines at anchor position", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 1, 0);
        doc.insertFullLines(1, ["line"]);
        it("should move anchor down", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(2);
            expect(position.column).toBe(0);
        });
    });
    describe("insert lines at anchor position", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 1, 0);
        anchor.insertRight = true;
        doc.insertFullLines(1, ["line"]);
        it("should not move anchor down when insertRight is true and column is 0", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(1);
            expect(position.column).toBe(0);
        });
    });
    describe("insert lines at anchor row", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 1, 2);
        anchor.insertRight = true;
        doc.insertFullLines(1, ["line"]);
        it("should move anchor down when column > 0", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(2);
            expect(position.column).toBe(2);
        });
    });
    describe("insert new line before cursor", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 1, 4);
        doc.insertMergedLines({ row: 0, column: 0 }, ['', '']);
        it("should move anchor column", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(2);
            expect(position.column).toBe(4);
        });
    });
    describe("insert new line in anchor line before anchor", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 1, 4);
        doc.insertMergedLines({ row: 1, column: 2 }, ['', '']);
        it("should move anchor column and row", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(2);
            expect(position.column).toBe(2);
        });
    });
    describe("delete text in anchor line before anchor", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 1, 4);
        doc.remove(new Range(1, 1, 1, 3));
        it("should move anchor column", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(1);
            expect(position.column).toBe(2);
        });
    });
    describe("remove range which contains the anchor", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 0, 3);
        doc.remove(new Range(0, 1, 1, 3));
        it("should move the anchor to the start of the range", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(0);
            expect(position.column).toBe(1);
        });
    });
    describe("delete character before the anchor", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 1, 4);
        doc.remove(new Range(1, 4, 1, 5));
        it("should have no effect", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(1);
            expect(position.column).toBe(4);
        });
    });
    describe("delete lines in anchor line before anchor", function () {
        const doc = new Document("juhu\n1\n2\nkinners");
        const anchor = new Anchor(doc, 3, 4);
        doc.removeFullLines(1, 2);
        it("should move anchor row", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(1);
            expect(position.column).toBe(4);
        });
    });
    describe("remove new line before the cursor", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 1, 4);
        doc.removeNewLine(0);
        it("", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(0);
            expect(position.column).toBe(8);
        });
    });
    describe("delete range which contains the anchor", function () {
        const doc = new Document("juhu\nkinners");
        const anchor = new Anchor(doc, 1, 4);
        doc.remove(new Range(0, 2, 1, 2));
        it("should move anchor to the end of the range", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(0);
            expect(position.column).toBe(4);
        });
    });
    describe("delete line which contains the anchor", function () {
        const doc = new Document("juhu\nkinners\n123");
        const anchor = new Anchor(doc, 1, 5);
        doc.removeFullLines(1, 1);
        it("should move anchor to the end of the range", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(1);
            expect(position.column).toBe(0);
        });
    });
    describe("remove after the anchor", function () {
        const doc = new Document("juhu\nkinners\n123");
        const anchor = new Anchor(doc, 1, 2);
        doc.remove(new Range(1, 4, 2, 2));
        it("should have no effect", function () {
            const position = anchor.getPosition();
            expect(position.row).toBe(1);
            expect(position.column).toBe(2);
        });
    });
    describe("anchor changes triggered by document changes", function () {
        const doc = new Document("juhu\nkinners\n123");
        const anchor = new Anchor(doc, 1, 5);
        it("should emit change event", function () {
            const foo = jasmine.createSpy('foo');
            anchor.on("change", foo);
            doc.remove(new Range(0, 0, 2, 1));
            expect(foo).toHaveBeenCalledTimes(1);
            const event: AnchorChangeEvent = { oldPosition: { row: 1, column: 5 }, position: { row: 0, column: 0 } };
            const source = anchor;
            expect(foo).toHaveBeenCalledWith(event, source);
        });
    });
    describe("only fire change event if position changes", function () {
        const doc = new Document("juhu\nkinners\n123");
        const anchor = new Anchor(doc, 1, 5);
        it("", function () {
            const foo = jasmine.createSpy('foo');
            anchor.on("change", foo);
            doc.remove(new Range(2, 0, 2, 1));
            expect(foo).not.toHaveBeenCalled();
        });
    });
    describe("insert/remove lines at the end of the document", function () {
        const doc = new Document("juhu\nkinners\n123");
        const anchor = new Anchor(doc, 2, 4);
        it("", function () {
            doc.removeFullLines(0, 3);
            expect(anchor.getPosition().row).toBe(0);
            expect(anchor.getPosition().column).toBe(0);
            doc.insertFullLines(0, ["a", "b", "c"]);
            expect(anchor.getPosition().row).toBe(3);
            expect(anchor.getPosition().column).toBe(0);
            expect(doc.getValue()).toBe("a\nb\nc\n");
        });
    });
});
