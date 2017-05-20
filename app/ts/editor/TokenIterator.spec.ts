import { Document } from './Document';
import { EditSession } from './EditSession';
import { HighlighterToken } from './mode/Highlighter';
import { JavaScriptMode } from './mode/JavaScriptMode';
import TokenIterator from './TokenIterator';

function expectNotNull<T>(x: T | null): T {
    if (x) {
        return x;
    }
    else {
        expect(x).not.toBeNull();
        throw new Error("");
    }
}

describe("TokenIterator", function () {
    describe("initialization in JavaScript document", function () {
        const lines = [
            "function foo(items) {",
            "    for (var i=0; i<items.length; i++) {",
            "        alert(items[i] + \"juhu\");",
            "    } // Real Tab.",
            "}"
        ];
        const doc = new Document(lines);
        const session = new EditSession(doc, new JavaScriptMode('', []));
        it("(session, 0, 0)", function () {
            const iterator = new TokenIterator(session, 0, 0);
            expect(expectNotNull(iterator.getCurrentToken()).value).toBe("function");
            expect(iterator.getCurrentTokenRow()).toBe(0);
            expect(iterator.getCurrentTokenColumn()).toBe(0);

            iterator.stepForward();
            expect(expectNotNull(iterator.getCurrentToken()).value).toBe(" ");
            expect(iterator.getCurrentTokenRow()).toBe(0);
            expect(iterator.getCurrentTokenColumn()).toBe(8);
        });
        it("(session, 0, 4)", function () {
            const iterator = new TokenIterator(session, 0, 4);
            expect(expectNotNull(iterator.getCurrentToken()).value).toBe("function");
            expect(iterator.getCurrentTokenRow()).toBe(0);
            expect(iterator.getCurrentTokenColumn()).toBe(0);

            iterator.stepForward();
            expect(expectNotNull(iterator.getCurrentToken()).value).toBe(" ");
            expect(iterator.getCurrentTokenRow()).toBe(0);
            expect(iterator.getCurrentTokenColumn()).toBe(8);
        });
        it("(session, 2, 18)", function () {
            const iterator = new TokenIterator(session, 2, 18);
            expect(expectNotNull(iterator.getCurrentToken()).value).toBe("items");
            expect(iterator.getCurrentTokenRow()).toBe(2);
            expect(iterator.getCurrentTokenColumn()).toBe(14);

            iterator.stepForward();
            expect(expectNotNull(iterator.getCurrentToken()).value).toBe("[");
            expect(iterator.getCurrentTokenRow()).toBe(2);
            expect(iterator.getCurrentTokenColumn()).toBe(19);
        });
        it("(session, 4, 0)", function () {
            const iterator = new TokenIterator(session, 4, 0);
            expect(expectNotNull(iterator.getCurrentToken()).value).toBe("}");
            expect(iterator.getCurrentTokenRow()).toBe(4);
            expect(iterator.getCurrentTokenColumn()).toBe(0);

            iterator.stepBackward();
            expect(expectNotNull(iterator.getCurrentToken()).value).toBe("// Real Tab.");
            expect(iterator.getCurrentTokenRow()).toBe(3);
            expect(iterator.getCurrentTokenColumn()).toBe(6);
        });
        it("(session, 5, 0)", function () {
            const iterator = new TokenIterator(session, 5, 0);
            expect(iterator.getCurrentToken()).toBe(null);
        });
    });
    describe("initialization in text document", function () {
        const lines = [
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
            "sed do eiusmod tempor incididunt ut labore et dolore magna",
            "aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            "ullamco laboris nisi ut aliquip ex ea commodo consequat."
        ];
        const doc = new Document(lines);
        const session = new EditSession(doc);
        it("(session, 0, 0)", function () {
            const iterator = new TokenIterator(session, 0, 0);
            expect(expectNotNull(iterator.getCurrentToken()).value).toBe(lines[0]);
            expect(iterator.getCurrentTokenRow()).toBe(0);
            expect(iterator.getCurrentTokenColumn()).toBe(0);
        });
        it("(session, 0, 4)", function () {
            const iterator = new TokenIterator(session, 0, 4);
            expect(expectNotNull(iterator.getCurrentToken()).value).toBe(lines[0]);
            expect(iterator.getCurrentTokenRow()).toBe(0);
            expect(iterator.getCurrentTokenColumn()).toBe(0);
        });
        it("(session, 2, 18)", function () {
            const iterator = new TokenIterator(session, 2, 18);
            expect(expectNotNull(iterator.getCurrentToken()).value).toBe(lines[2]);
            expect(iterator.getCurrentTokenRow()).toBe(2);
            expect(iterator.getCurrentTokenColumn()).toBe(0);
        });
        it("(session, 3, lines[3].length - 1)", function () {
            const iterator = new TokenIterator(session, 3, lines[3].length - 1);
            expect(expectNotNull(iterator.getCurrentToken()).value).toBe(lines[3]);
            expect(iterator.getCurrentTokenRow()).toBe(3);
            expect(iterator.getCurrentTokenColumn()).toBe(0);
        });
        xit("(session, 4, 0)", function () {
            const iterator = new TokenIterator(session, 4, 0);
            expect(iterator.getCurrentToken()).toBe(null);
        });
    });
    describe("step forward in JavaScript document", function () {
        const lines = [
            "function foo(items) {",
            "    for (var i=0; i<items.length; i++) {",
            "        alert(items[i] + \"juhu\");",
            "    } // Real Tab.",
            "}"
        ];
        const session = new EditSession(lines.join("\n"), new JavaScriptMode());

        let tokens: HighlighterToken[] = [];
        const len = session.getLength();
        for (let i = 0; i < len; i++) {
            tokens = tokens.concat(<HighlighterToken[]>session.getTokens(i));
        }

        const iterator = new TokenIterator(session, 0, 0);
        it("", function () {
            for (let i = 1; i < tokens.length; i++) {
                expect(iterator.stepForward()).toBe(tokens[i]);
            }
            expect(iterator.stepForward()).toBe(null);
            expect(iterator.getCurrentToken()).toBe(null);
        });
    });
    describe("step backward in JavaScript document", function () {
        const lines = [
            "function foo(items) {",
            "     for (var i=0; i<items.length; i++) {",
            "         alert(items[i] + \"juhu\");",
            "     } // Real Tab.",
            "}"
        ];
        const session = new EditSession(lines.join("\n"), new JavaScriptMode());

        let tokens: HighlighterToken[] = [];
        const len = session.getLength();
        for (let i = 0; i < len; i++) {
            tokens = tokens.concat(<HighlighterToken[]>session.getTokens(i));
        }

        const iterator = new TokenIterator(session, 4, 0);
        it("", function () {
            for (let i = tokens.length - 2; i >= 0; i--) {
                expect(iterator.stepBackward()).toBe(tokens[i]);
            }
            expect(iterator.stepBackward()).toBe(null);
            expect(iterator.getCurrentToken()).toBe(null);
        });
    });
    describe("", function () {
        const lines = [
            "function foo(items) {",
            "    for (var i=0; i<items.length; i++) {",
            "        alert(items[i] + \"juhu\");",
            "    } // Real Tab.",
            "}"
        ];
        const session = new EditSession(lines.join("\n"), new JavaScriptMode());

        const iterator = new TokenIterator(session, 0, 0);

        it("", function () {
            iterator.stepForward();
            iterator.stepForward();

            expect(expectNotNull(iterator.getCurrentToken()).value).toBe("foo");
            expect(iterator.getCurrentTokenRow()).toBe(0);
            expect(iterator.getCurrentTokenColumn()).toBe(9);

            iterator.stepForward();
            iterator.stepForward();
            iterator.stepForward();
            iterator.stepForward();
            iterator.stepForward();
            iterator.stepForward();
            iterator.stepForward();

            expect(expectNotNull(iterator.getCurrentToken()).value).toBe("for");
            expect(iterator.getCurrentTokenRow()).toBe(1);
            expect(iterator.getCurrentTokenColumn()).toBe(4);
        });
    });
});

