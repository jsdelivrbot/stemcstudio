//// <reference path="../../../../typings/main/ambient/jasmine/index.d.ts" />

import parseSnippetFile from './parseSnippetFile';
import { Snippet } from '../Snippet';

describe("parseSnippetFile", function () {
    const expected: Snippet[] = [
        {
            name: "a",
            guard: "(?:(=)|(:))?\\s*)",
            trigger: "\\(?f",
            endTrigger: "\\)",
            endGuard: "",
            content: "{$0}\n"
        },
        {
            tabTrigger: "f",
            name: "f function",
            content: "function"
        }
    ];
    const parsed: Snippet[] = parseSnippetFile(
        "name a\nregex /(?:(=)|(:))?\\s*)/\\(?f/\\)/\n\t{$0}" +
        "\n\t\n\n#function\nsnippet f function\n\tfunction"
    );

    it("...", function () {
        expect(expected).toEqual(parsed);
    });
});
