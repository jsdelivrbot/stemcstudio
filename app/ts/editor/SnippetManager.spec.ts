//// <reference path="../../../typings/main/ambient/jasmine/index.d.ts" />

import Document from './Document';
import Editor from './Editor';
import EditSession from './EditSession';
import SnippetManager from './SnippetManager';
import { TabstopIndex } from './Tabstop';
import { TabstopText } from './Tabstop';

describe("SnippetManager", function () {
    const snippetManager = new SnippetManager();
    /*
    xdescribe("tmStrFormat", function () {
        const formatted = snippetManager.tmStrFormat("hello", {
            guard: "(..)(.)(.)",
            flag: "g",
            fmt: "a\\UO\\l$1\\E$2"
        });
        it("...", function () {
            expect(formatted).toBe('aOHElo');
        });
    });
    */
    describe("tokenizeTmSnippet", function () {
        describe("(1)", function () {
            const content = "-\\$$2a${1:x${$2:y$3\\}\\n\\}$TM_SELECTION}";
            const fmtTokens = snippetManager.tokenizeTmSnippet(content);
            it("length", function () {
                expect(fmtTokens.length).toBe(15);
                expect(fmtTokens[0]).toBe("-");
                expect(fmtTokens[1]).toBe("$");
                expect((<TabstopIndex>fmtTokens[2]).tabstopId).toBe(2);
                expect(fmtTokens[3]).toBe("a");
                expect((<TabstopIndex>fmtTokens[4]).tabstopId).toBe(1);
                expect(fmtTokens[5]).toBe("x${");
                expect((<TabstopIndex>fmtTokens[6]).tabstopId).toBe(2);
                expect(fmtTokens[7]).toBe(":");
                expect(fmtTokens[8]).toBe("y");
                expect((<TabstopIndex>fmtTokens[9]).tabstopId).toBe(3);
                expect(fmtTokens[10]).toBe("}");
                expect(fmtTokens[11]).toBe("\\n");
                expect(fmtTokens[12]).toBe("}");
                expect((<TabstopText>fmtTokens[13]).text).toBe("TM_SELECTION");
                expect((<TabstopIndex>fmtTokens[14]).tabstopId).toBe(1);

                expect(fmtTokens[4]).toEqual(fmtTokens[14]);
            });
        });
        describe("(2)", function () {
            const content = "\\}${var/as\\/d/\\ul\\//g:s}";
            const fmtTokens = snippetManager.tokenizeTmSnippet(content);
            // console.log(`fmtTokens => ${JSON.stringify(fmtTokens, null, 2)}`);
            it("length", function () {
                expect(fmtTokens.length).toBe(4);
            });
            it("[0]", function () {
                expect(fmtTokens[0]).toBe("\\}");
            });
            it("[1]", function () {
                const fmtToken = <{ text: string; fmtString: string; guard: string; fmt: string; flag: string }>fmtTokens[1];
                expect(fmtToken.text).toBe("var");
                //              expect(fmtToken.fmtString).toBe("/as\\/f/\\ul\\//g:");
                expect(fmtToken.fmt).toBe("\\ul\\/");
                expect(fmtToken.guard).toBe("as\\/d");
                expect(fmtToken.flag).toBe("g");
            });
            it("[2]", function () {
                expect(fmtTokens[2]).toBe("s");
            });
            it("[3]", function () {
                // const fmtToken = <{ text: string; fmtString: string; guard: string; fmt: string; flag: string }>fmtTokens[3];
                // expect(fmtToken.text).toBe("var");
                // expect(fmtToken.fmtString).toBe("/as\\/f/\\ul\\//g:");
                // expect(fmtToken.guard).toBe("as\\/d");
                // expect(fmtToken.fmt).toBe("\\ul\\/");
                // expect(fmtToken.flag).toBe("g");
            });
        });
    });
    xdescribe("insertSnippet", function () {
        const doc = new Document("");
        const session = new EditSession(doc);
        const editor = new Editor(void 0, session);
        editor.setValue("");
        const content = "-${1}-${1:t\n1}--${2:2 ${3} 2}-${3:3 $1 3}-${4:4 $2 4}";
        editor.insertSnippet(content);

        it("should update the editor value correctly", function () {
            const value = editor.getValue();
            expect(value).toBe([
                "-t",
                "1-t",
                "1--2 3 t",
                "1 3 2-3 t",
                "1 3-4 2 3 t",
                "1 3 2 4"
            ].join("\n"));
        });
        it("should update the selected text", function () {
            expect(editor.getSelectedText()).toBe("t\n1\nt\n1\nt\n1\nt\n1\nt\n1");
            editor.tabNext();
        });
    });
});
