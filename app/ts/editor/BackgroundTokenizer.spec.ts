import { Document } from './Document';
import { EditSession } from './EditSession';

describe("JavaScript", function () {

    describe("Numeric Literal", function () {
        const doc = new Document([
            "42"
        ]);

        const session = new EditSession(doc);
        session.setUseWorker(false);
        session.setLanguage('JavaScript');

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
        session.setLanguage('JavaScript');

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
        session.setLanguage('JavaScript');

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
        session.setLanguage('JavaScript');

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
        session.setLanguage('JavaScript');

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
        session.setLanguage('JavaScript');

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

    xdescribe("readonly", function () {

        const doc = new Document([
            'export class Vector {',
            '    public x',
            '    public y',
            '    constructor(x, y) {',
            '        this.x = x',
            '        this.y = y',
            '    }',
            '}'
        ]);

        const session = new EditSession(doc);
        session.setUseWorker(false);
        session.setLanguage('JavaScript');

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
});

describe("TypeScript", function () {

    describe("readonly and this", function () {

        const doc = new Document([
            'export class Vector {',
            '    public readonly x: number',
            '    public readonly y: number',
            '    constructor(x: number, y: number) {',
            '        this.x = x',
            '        this.y = y',
            '    }',
            '}'
        ]);

        const session = new EditSession(doc);
        // session.traceTokenizer = true;
        session.setUseWorker(false);
        session.setLanguage('TypeScript');

        describe("tokens", function () {
            describe("(row = 0)", function () {
                const tokens = session.getTokens(0);
                it("should be defined with correct number of tokens", function () {
                    expect(tokens).toBeDefined();
                    expect(tokens.length).toBe(7);
                });
                it("should have the correct tokens", function () {
                    // FIXME: This is ECMA
                    expect(tokens[0].type).toBe('keyword.operator.ts');
                    expect(tokens[0].value).toBe('export');
                    expect(tokens[1].type).toBe('text');
                    expect(tokens[1].value).toBe(' ');
                    // FIXME: This is ECMA
                    expect(tokens[2].type).toBe('keyword.operator.ts');
                    expect(tokens[2].value).toBe('class');
                    expect(tokens[3].type).toBe('text');
                    expect(tokens[3].value).toBe(' ');
                    expect(tokens[4].type).toBe('identifier');
                    expect(tokens[4].value).toBe('Vector');
                    expect(tokens[5].type).toBe('text');
                    expect(tokens[5].value).toBe(' ');
                    expect(tokens[6].type).toBe('paren.lparen');
                    expect(tokens[6].value).toBe('{');
                });
            });
            describe("(row = 1)", function () {
                const tokens = session.getTokens(1);
                // console.lg(JSON.stringify(tokens, null, 2));
                it("should be defined with correct number of tokens", function () {
                    expect(tokens).toBeDefined();
                    expect(tokens.length).toBe(8);
                });
                it("should have the correct tokens", function () {
                    expect(tokens[0].type).toBe('text');
                    expect(tokens[0].value).toBe('    ');
                    expect(tokens[1].type).toBe('keyword.operator.ts');
                    expect(tokens[1].value).toBe('public');
                    expect(tokens[2].type).toBe('text');
                    expect(tokens[2].value).toBe(' ');
                    expect(tokens[3].type).toBe('keyword.operator.ts');
                    expect(tokens[3].value).toBe('readonly');
                    expect(tokens[4].type).toBe('text');
                    expect(tokens[4].value).toBe(' ');
                    // FIXME: this is wierd.
                    expect(tokens[5].type).toBe('variable.parameter.function.ts');
                    expect(tokens[5].value).toBe('x');
                    expect(tokens[6].type).toBe('text');
                    // FIXME: I don't like the combination.
                    expect(tokens[6].value).toBe(': ');
                    // FIXME: Should be storage type?
                    expect(tokens[7].type).toBe('variable.parameter.function.ts');
                    expect(tokens[7].value).toBe('number');
                });
            });
            describe("(row = 2)", function () {
                const tokens = session.getTokens(2);
                // console.lg(JSON.stringify(tokens, null, 2));
                it("should be defined with correct number of tokens", function () {
                    expect(tokens).toBeDefined();
                    expect(tokens.length).toBe(8);
                });
                it("should have the correct tokens", function () {
                    expect(tokens[0].type).toBe('text');
                    expect(tokens[0].value).toBe('    ');
                    expect(tokens[1].type).toBe('keyword.operator.ts');
                    expect(tokens[1].value).toBe('public');
                    expect(tokens[2].type).toBe('text');
                    expect(tokens[2].value).toBe(' ');
                    // FIXME: should be keyword
                    expect(tokens[3].type).toBe('keyword.operator.ts');
                    expect(tokens[3].value).toBe('readonly');
                    expect(tokens[4].type).toBe('text');
                    expect(tokens[4].value).toBe(' ');
                    expect(tokens[5].type).toBe('variable.parameter.function.ts');
                    expect(tokens[5].value).toBe('y');
                    expect(tokens[6].type).toBe('text');
                    // FIXME: I don't like the combination.
                    expect(tokens[6].value).toBe(': ');
                    // FIXME: Should be storage type?
                    expect(tokens[7].type).toBe('variable.parameter.function.ts');
                    expect(tokens[7].value).toBe('number');
                });
            });
            describe("(row = 3)", function () {
                const tokens = session.getTokens(3);
                // console.lg(JSON.stringify(tokens, null, 2));
                it("should be defined with correct number of tokens", function () {
                    expect(tokens).toBeDefined();
                    expect(tokens.length).toBe(14);
                });
                it("should have the correct tokens", function () {
                    expect(tokens[0].type).toBe('text');
                    expect(tokens[0].value).toBe('    ');
                    expect(tokens[1].type).toBe('keyword.operator.ts');
                    expect(tokens[1].value).toBe('constructor');
                    expect(tokens[2].type).toBe('paren.lparen');
                    expect(tokens[2].value).toBe('(');
                    expect(tokens[3].type).toBe('variable.parameter.function.ts');
                    expect(tokens[3].value).toBe('x');
                    expect(tokens[4].type).toBe('text');
                    expect(tokens[4].value).toBe(': ');
                    expect(tokens[5].type).toBe('variable.parameter.function.ts');
                    expect(tokens[5].value).toBe('number');
                    expect(tokens[6].type).toBe('punctuation.operator');
                    expect(tokens[6].value).toBe(',');
                    expect(tokens[7].type).toBe('text');
                    expect(tokens[7].value).toBe(' ');
                    expect(tokens[8].type).toBe('variable.parameter.function.ts');
                    expect(tokens[8].value).toBe('y');
                    expect(tokens[9].type).toBe('text');
                    expect(tokens[9].value).toBe(': ');
                    expect(tokens[10].type).toBe('variable.parameter.function.ts');
                    expect(tokens[10].value).toBe('number');
                    expect(tokens[11].type).toBe('paren.rparen');
                    expect(tokens[11].value).toBe(')');
                    expect(tokens[12].type).toBe('text');
                    expect(tokens[12].value).toBe(' ');
                    expect(tokens[13].type).toBe('paren.lparen');
                    expect(tokens[13].value).toBe('{');
                });
            });
            describe("(row = 4)", function () {
                const tokens = session.getTokens(4);
                // console.lg(JSON.stringify(tokens, null, 2));
                it("should be defined with correct number of tokens", function () {
                    expect(tokens).toBeDefined();
                    expect(tokens.length).toBe(8);
                });
                it("should have the correct tokens", function () {
                    expect(tokens[0].type).toBe('text');
                    expect(tokens[0].value).toBe('        ');
                    expect(tokens[1].type).toBe('variable.language');
                    expect(tokens[1].value).toBe('this');
                    expect(tokens[2].type).toBe('punctuation.operator');
                    expect(tokens[2].value).toBe('.');
                    // FIXME: should be identifier.
                    expect(tokens[3].type).toBe('support.constant');
                    expect(tokens[3].value).toBe('x');
                    expect(tokens[4].type).toBe('text');
                    expect(tokens[4].value).toBe(' ');
                    expect(tokens[5].type).toBe('keyword.operator');
                    expect(tokens[5].value).toBe('=');
                    expect(tokens[6].type).toBe('text');
                    expect(tokens[6].value).toBe(' ');
                    expect(tokens[7].type).toBe('identifier');
                    expect(tokens[7].value).toBe('x');
                });
            });
            describe("(row = 5)", function () {
                const tokens = session.getTokens(5);
                // console.lg(JSON.stringify(tokens, null, 2));
                it("should be defined with correct number of tokens", function () {
                    expect(tokens).toBeDefined();
                    expect(tokens.length).toBe(8);
                });
                it("should have the correct tokens", function () {
                    expect(tokens[0].type).toBe('text');
                    expect(tokens[0].value).toBe('        ');
                    expect(tokens[1].type).toBe('variable.language');
                    expect(tokens[1].value).toBe('this');
                    expect(tokens[2].type).toBe('punctuation.operator');
                    expect(tokens[2].value).toBe('.');
                    // FIXME: should be identifier.
                    expect(tokens[3].type).toBe('support.constant');
                    expect(tokens[3].value).toBe('y');
                    expect(tokens[4].type).toBe('text');
                    expect(tokens[4].value).toBe(' ');
                    expect(tokens[5].type).toBe('keyword.operator');
                    expect(tokens[5].value).toBe('=');
                    expect(tokens[6].type).toBe('text');
                    expect(tokens[6].value).toBe(' ');
                    expect(tokens[7].type).toBe('identifier');
                    expect(tokens[7].value).toBe('y');
                });
            });
            describe("(row = 6)", function () {
                const tokens = session.getTokens(6);
                it("should be defined with correct number of tokens", function () {
                    expect(tokens).toBeDefined();
                    expect(tokens.length).toBe(2);
                });
                it("should have the correct tokens", function () {
                    expect(tokens[0].type).toBe('text');
                    expect(tokens[0].value).toBe('    ');
                    expect(tokens[1].type).toBe('paren.rparen');
                    expect(tokens[1].value).toBe('}');
                });
            });
            describe("(row = 7)", function () {
                const tokens = session.getTokens(7);
                it("should be defined with correct number of tokens", function () {
                    expect(tokens).toBeDefined();
                    expect(tokens.length).toBe(1);
                });
                it("should have the correct tokens", function () {
                    expect(tokens[0].type).toBe('paren.rparen');
                    expect(tokens[0].value).toBe('}');
                });
            });
        });
    });
});
