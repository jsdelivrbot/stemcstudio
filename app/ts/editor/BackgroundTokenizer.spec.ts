import { Document } from './Document';
import { EditSession } from './EditSession';
import Range from './Range';
import JavaScriptMode from './mode/JavaScriptMode';

function forceTokenize(session: EditSession, startLine = 0): void {
    for (let i = startLine, l = session.getLength(); i < l; i++) {
        session.getTokens(i);
    }
}

function testStates(session: EditSession, states: (string | null | undefined)[]) {
    for (let i = 0, l = session.getLength(); i < l; i++) {
        expect(session.bgTokenizer.states[i]).toBe(states[i] as string);
    }
    // expect(states.length).toBe(1)
    // assert.ok(l == states.length);
}

describe("background tokenizer update on session change", function () {
    const doc = new Document([
        "/*",
        "*/",
        "var juhu"
    ]);
    const session = new EditSession(doc);
    const jsMode = new JavaScriptMode('', []);
    session.setLanguageMode(jsMode, function (err) {
        // We are not using the worker, so we don't need to wait.
    });

    // The FSM for the JavaScript mode appears to have changed.
    xit("", function () {
        forceTokenize(session);
        testStates(session, ["comment1", "start", "no_regex"]);

        doc.remove(new Range(0, 2, 1, 2));
        testStates(session, [null, "no_regex"]);

        forceTokenize(session);
        testStates(session, ["comment1", "comment1"]);

        doc.insert({ row: 0, column: 2 }, "\n*/");
        testStates(session, [undefined, undefined, "comment1"]);

        forceTokenize(session);
        testStates(session, ["comment1", "start", "no_regex"]);
    });
});
