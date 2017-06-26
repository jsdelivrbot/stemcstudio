import { Document } from 'editor-document';
import { EditSession } from '../EditSession';
import { HighlighterToken } from '../mode/Highlighter';

const LANGUAGE_JS = "JavaScript";

describe(LANGUAGE_JS, function () {

    describe("Numeric Literal", function () {
        const doc = new Document([
            "42"
        ]);

        const session = new EditSession(doc);
        session.setUseWorker(false);
        session.setLanguage(LANGUAGE_JS);

        describe("tokens", function () {
            describe("(0)", function () {
                const tokens = session.getTokens(0);
                it("should be defined", function () {
                    expect(tokens).toBeDefined();
                });
                it("should have 1 token", function () {
                    expect(tokens.length).toBe(1);
                });
                it("should have the correct type", function () {
                    expect(tokens[0].type).toBe('constant.numeric');
                });
                it("should have the correct value", function () {
                    expect(tokens[0].value).toBe('42');
                });
            });
        });
    });

    describe("String Literal (in single quotes)", function () {

        const doc = new Document([
            "'Hello'"
        ]);

        const session = new EditSession(doc);
        session.setUseWorker(false);
        session.setLanguage(LANGUAGE_JS);

        describe("tokens", function () {
            describe("(0)", function () {
                const tokens = session.getTokens(0);
                it("should be defined", function () {
                    expect(tokens).toBeDefined();
                });
                it("should have 1 token", function () {
                    expect(tokens.length).toBe(1);
                });
                it("should have the correct type", function () {
                    expect(tokens[0].type).toBe('string');
                });
                it("should have the correct value", function () {
                    expect(tokens[0].value).toBe("'Hello'");
                });
            });
        });
    });

    describe("String Literal (in double quotes)", function () {

        const doc = new Document([
            '"Hello"'
        ]);

        const session = new EditSession(doc);
        session.setUseWorker(false);
        session.setLanguage(LANGUAGE_JS);

        describe("tokens", function () {
            describe("(0)", function () {
                const tokens = session.getTokens(0);
                it("should be defined", function () {
                    expect(tokens).toBeDefined();
                });
                it("should have 1 token", function () {
                    expect(tokens.length).toBe(1);
                });
                it("should have the correct type", function () {
                    expect(tokens[0].type).toBe('string');
                });
                it("should have the correct value", function () {
                    expect(tokens[0].value).toBe('"Hello"');
                });
            });
        });
    });

    describe("String Literal (in back ticks)", function () {

        const doc = new Document([
            '`Hello`'
        ]);

        const session = new EditSession(doc);
        session.setUseWorker(false);
        session.setLanguage(LANGUAGE_JS);

        describe("tokens", function () {
            describe("(0)", function () {
                const tokens = session.getTokens(0);
                it("should be defined", function () {
                    expect(tokens).toBeDefined();
                });
                it("should have 3 tokens", function () {
                    expect(tokens.length).toBe(3);
                });
                it("should have the correct types", function () {
                    expect(tokens[0].type).toBe('string.quasi.start');
                    expect(tokens[1].type).toBe('string.quasi');
                    expect(tokens[2].type).toBe('string.quasi.end');
                });
                it("should have the correct values", function () {
                    expect(tokens[0].value).toBe('`');
                    expect(tokens[1].value).toBe('Hello');
                    expect(tokens[2].value).toBe('`');
                });
            });
        });
    });

    describe("Boolean Literal true", function () {

        const doc = new Document([
            'true'
        ]);

        const session = new EditSession(doc);
        session.setUseWorker(false);
        session.setLanguage(LANGUAGE_JS);

        describe("tokens", function () {
            describe("(0)", function () {
                const tokens = session.getTokens(0);
                it("should be defined", function () {
                    expect(tokens).toBeDefined();
                });
                it("should have 1 token", function () {
                    expect(tokens.length).toBe(1);
                });
                it("should have the correct type", function () {
                    expect(tokens[0].type).toBe('constant.language.boolean');
                });
                it("should have the correct value", function () {
                    expect(tokens[0].value).toBe('true');
                });
            });
        });
    });

    describe("Boolean Literal false", function () {

        const doc = new Document([
            'false'
        ]);

        const session = new EditSession(doc);
        session.setUseWorker(false);
        session.setLanguage(LANGUAGE_JS);

        describe("tokens", function () {
            describe("(0)", function () {
                const tokens = session.getTokens(0);
                it("should be defined", function () {
                    expect(tokens).toBeDefined();
                });
                it("should have 1 token", function () {
                    expect(tokens.length).toBe(1);
                });
                it("should have the correct type", function () {
                    expect(tokens[0].type).toBe('constant.language.boolean');
                });
                it("should have the correct value", function () {
                    expect(tokens[0].value).toBe('false');
                });
            });
        });
    });

    describe("function declaration", function () {

        const doc = new Document([
            'function foo(a, b) {}'
        ]);

        const eTokens: HighlighterToken[] = [
            {
                "type": "storage.type",
                "value": "function"
            },
            {
                "type": "text",
                "value": " "
            },
            {
                "type": "entity.name.function",
                "value": "foo"
            },
            {
                "type": "paren.lparen",
                "value": "("
            },
            {
                "type": "variable.parameter",
                "value": "a"
            },
            {
                "type": "punctuation.operator",
                "value": ","
            },
            {
                "type": "text",
                "value": " "
            },
            {
                "type": "variable.parameter",
                "value": "b"
            },
            {
                "type": "paren.rparen",
                "value": ")"
            },
            {
                "type": "text",
                "value": " "
            },
            {
                "type": "paren.lparen",
                "value": "{"
            },
            {
                "type": "paren.rparen",
                "value": "}"
            }
        ];

        const session = new EditSession(doc);
        session.setUseWorker(false);
        session.setLanguage(LANGUAGE_JS);
        const aTokens = session.getTokens(0);

        // console.lg(`\n${JSON.stringify(aTokens, null, 2)}\n`);

        it("should have correct number of tokens", function () {
            expect(aTokens).toBeDefined();
            expect(aTokens.length).toBe(eTokens.length);
        });
        it("should have the correct type and value", function () {
            for (let i = 0; i < eTokens.length; i++) {
                expect(aTokens[i].type).toBe(eTokens[i].type);
                expect(aTokens[i].value).toBe(eTokens[i].value);
            }
        });
    });
});
