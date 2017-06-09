import { CodeWriter } from './CodeWriter';
import { Position } from './Position';
import { Range } from './Range';

describe("CodeWriter", function () {
    describe("comma", function () {
        it("should only write the comma if there is no...", function () {
            const cw = new CodeWriter(1, 0);
            cw.comma(null, null);
            const result = cw.snapshot();
            const text = result.text;
            const tree = result.tree;
            expect(text).toBe(",");
            expect(tree).toBeNull();
        });
        it("should map the source range to the target range", function () {
            const cw = new CodeWriter(1, 0);
            const sourceBegin = new Position(2, 3);
            const sourceEnd = new Position(5, 7);
            cw.comma(sourceBegin, sourceEnd);
            const result = cw.snapshot();
            const text = result.text;
            expect(text).toBe(",");
            const tree = result.tree;
            expect(tree.children).toBeNull();
            const source = tree.source;
            const target = tree.target;
            expect(source.begin.line).toBe(sourceBegin.line);
            expect(source.begin.column).toBe(sourceBegin.column);
            expect(source.end.line).toBe(sourceEnd.line);
            expect(source.end.column).toBe(sourceEnd.column);
            expect(target.begin.line).toBe(1);
            expect(target.begin.column).toBe(0);
            expect(target.end.line).toBe(1);
            expect(target.end.column).toBe(1);
        });
        describe("insertSpaceAfterCommaDelimiter", function () {
            it("true", function () {
                const cw = new CodeWriter(1, 0, { insertSpaceAfterCommaDelimiter: true });
                cw.comma(null, null);
                expect(cw.snapshot().text).toBe(", ");
            });
            it("false", function () {
                const cw = new CodeWriter(1, 0, { insertSpaceAfterCommaDelimiter: false });
                cw.comma(null, null);
                expect(cw.snapshot().text).toBe(",");
            });
        });
    });
    describe("Braces", function () {
        it("{}", function () {
            const cw = new CodeWriter(1, 0);
            cw.beginObject();
            cw.endObject();
            const result = cw.snapshot();
            const text = result.text;
            const tree = result.tree;
            expect(text).toBe("{}");
            expect(tree).toBeNull();
        });
        it("{a}", function () {
            const cw = new CodeWriter(1, 0);
            cw.beginObject();
            const sourceBegin = new Position(2, 3);
            const sourceEnd = new Position(5, 7);
            cw.name("a", new Range(sourceBegin, sourceEnd));
            cw.endObject();
            const result = cw.snapshot();
            const text = result.text;
            const tree = result.tree;
            expect(text).toBe("{a}");
            expect(tree.children).toBeNull();

            expect(tree.source.begin.line).toBe(sourceBegin.line);
            expect(tree.source.begin.column).toBe(sourceBegin.column);
            expect(tree.source.end.line).toBe(sourceEnd.line);
            expect(tree.source.end.column).toBe(sourceEnd.column);

            expect(tree.target.begin.line).toBe(1);
            expect(tree.target.begin.column).toBe(1);
            expect(tree.target.end.line).toBe(1);
            expect(tree.target.end.column).toBe(2);
        });
        it("[a,b]", function () {
            const cw = new CodeWriter(1, 0);
            cw.beginBracket();
            const aBegin = new Position(1, 1);
            const aEnd = new Position(1, 2);
            cw.name("a", new Range(aBegin, aEnd));
            cw.comma(null, null);
            const bBegin = new Position(1, 3);
            const bEnd = new Position(1, 4);
            cw.name("b", new Range(bBegin, bEnd));
            cw.endBracket();
            const result = cw.snapshot();
            const text = result.text;
            // const tree = result.tree;
            // console.lg(JSON.stringify(tree, null, 2));
            expect(text).toBe("[a,b]");
        });
        describe("insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets", function () {
            it("true", function () {
                const cw = new CodeWriter(1, 0, { insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: true });
                cw.beginBracket();
                const sourceBegin = new Position(2, 3);
                const sourceEnd = new Position(5, 7);
                cw.name("a", new Range(sourceBegin, sourceEnd));
                cw.endBracket();
                const result = cw.snapshot();
                const text = result.text;
                // const tree = result.tree;
                expect(text).toBe("[ a ]");
                // console.lg(JSON.stringify(tree, null, 2));
                // expect(tree.length).toBe(1);
            });
            it("false", function () {
                const cw = new CodeWriter(1, 0, { insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false });
                cw.beginBracket();
                cw.name("a", null);
                cw.endBracket();
                expect(cw.snapshot().text).toBe("[a]");
            });
        });
        it("[a,b]", function () {
            const cw = new CodeWriter(1, 0, {
                insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
                insertSpaceAfterCommaDelimiter: true
            });
            cw.beginBracket();
            const aBegin = new Position(1, 1);
            const aEnd = new Position(1, 2);
            cw.name("a", new Range(aBegin, aEnd));
            cw.comma(null, null);
            const bBegin = new Position(1, 3);
            const bEnd = new Position(1, 4);
            cw.name("b", new Range(bBegin, bEnd));
            cw.endBracket();
            const result = cw.snapshot();
            const text = result.text;
            // const tree = result.tree;
            // console.lg(JSON.stringify(tree, null, 2));
            expect(text).toBe("[a, b]");
        });
    });
    describe("Brackets", function () {
        it("[]", function () {
            const cw = new CodeWriter(1, 0);
            cw.beginBracket();
            cw.endBracket();
            expect(cw.snapshot().text).toBe("[]");
        });
        it("[a]", function () {
            const cw = new CodeWriter(1, 0);
            cw.beginBracket();
            const sourceBegin = new Position(2, 3);
            const sourceEnd = new Position(5, 7);
            cw.name("a", new Range(sourceBegin, sourceEnd));
            cw.endBracket();
            const result = cw.snapshot();
            const text = result.text;
            // const tree = result.tree;
            expect(text).toBe("[a]");
            // expect(tree.length).toBe(1);
            // console.lg(JSON.stringify(mappings));
        });
        it("[a,b]", function () {
            const cw = new CodeWriter(1, 0);
            cw.beginBracket();
            cw.name("a", null);
            cw.comma(null, null);
            cw.name("b", null);
            cw.endBracket();
            expect(cw.snapshot().text).toBe("[a,b]");
        });
        describe("insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets", function () {
            it("true", function () {
                const cw = new CodeWriter(1, 0, { insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: true });
                cw.beginBracket();
                const sourceBegin = new Position(2, 3);
                const sourceEnd = new Position(5, 7);
                cw.name("a", new Range(sourceBegin, sourceEnd));
                cw.endBracket();
                const result = cw.snapshot();
                const text = result.text;
                const tree = result.tree;
                // console.lg(JSON.stringify(tree, null, 2));
                expect(text).toBe("[ a ]");
                expect(tree.children).toBeNull();

                expect(tree.source.begin.line).toBe(sourceBegin.line);
                expect(tree.source.begin.column).toBe(sourceBegin.column);
                expect(tree.source.end.line).toBe(sourceEnd.line);
                expect(tree.source.end.column).toBe(sourceEnd.column);

                expect(tree.target.begin.line).toBe(1);
                expect(tree.target.begin.column).toBe(2);
                expect(tree.target.end.line).toBe(1);
                expect(tree.target.end.column).toBe(3);
            });
            it("false", function () {
                const cw = new CodeWriter(1, 0, { insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false });
                cw.beginBracket();
                const sourceBegin = new Position(2, 3);
                const sourceEnd = new Position(5, 7);
                cw.name("a", new Range(sourceBegin, sourceEnd));
                cw.endBracket();
                const result = cw.snapshot();
                const text = result.text;
                const tree = result.tree;
                // console.lg(JSON.stringify(tree, null, 2));
                expect(text).toBe("[a]");

                expect(tree.source.begin.line).toBe(sourceBegin.line);
                expect(tree.source.begin.column).toBe(sourceBegin.column);
                expect(tree.source.end.line).toBe(sourceEnd.line);
                expect(tree.source.end.column).toBe(sourceEnd.column);

                expect(tree.target.begin.line).toBe(1);
                expect(tree.target.begin.column).toBe(1);
                expect(tree.target.end.line).toBe(1);
                expect(tree.target.end.column).toBe(2);
            });
        });
    });
});
