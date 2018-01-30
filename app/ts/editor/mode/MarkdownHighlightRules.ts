import { escapeRegExp } from "../lib/lang";
import { JavaScriptHighlightRules } from './JavaScriptHighlightRules';
import { TypeScriptHighlightRules } from './TypeScriptHighlightRules';
import { XmlHighlightRules } from './XmlHighlightRules';
import { HtmlHighlightRules } from './HtmlHighlightRules';
import { CssHighlightRules } from './CssHighlightRules';
import { GoLangHighlightRules } from './GoLangHighlightRules';
import { POP_STATE } from './TextHighlightRules';
import { HighlighterRule } from './Highlighter';

const escaped = function (ch: string) {
    return "(?:[^" + escapeRegExp(ch) + "\\\\]|\\\\.)*";
};

/**
 * GitHub style block i.e. using three backticks.
 */
function github_embed(tag: string, prefix: string): HighlighterRule {
    return {
        token: "support.function",
        regex: "^\\s*```" + tag + "\\s*$",
        push: prefix + "start"
    };
}

/**
 *
 */
export class MarkdownHighlightRules extends HtmlHighlightRules {
    constructor() {
        super();
        // regexp must not have capturing parentheses
        // regexps are ordered -> the first match is used
        this.$rules["start"].unshift(
            {
                token: "empty_line",
                regex: '^$',
                next: "allowBlock"
            },
            { // h1
                token: "markup.heading.1",
                regex: "^=+(?=\\s*$)"
            },
            { // h2
                token: "markup.heading.2",
                regex: "^\\-+(?=\\s*$)"
            },
            {
                token: function (value) {
                    return "markup.heading." + value.length;
                },
                regex: /^#{1,6}(?=\s*[^ #]|\s+#.)/,
                next: "header"
            },
            github_embed("(?:golang|go)", "gocode-"),
            github_embed("(?:typescript|ts)", "tscode-"),
            github_embed("(?:javascript|js)", "jscode-"),
            github_embed("xml", "xmlcode-"),
            github_embed("html", "htmlcode-"),
            github_embed("css", "csscode-"),
            { // Github style block
                token: "support.function",
                regex: "^\\s*```\\s*\\S*(?:{.*?\\})?\\s*$",
                next: "githubblock"
            }, { // block quote
                token: "string.blockquote",
                regex: "^\\s*>\\s*(?:[*+-]|\\d+\\.)?\\s+",
                next: "blockquote"
            }, { // HR * - _
                token: "constant",
                regex: "^ {0,2}(?:(?: ?\\* ?){3,}|(?: ?\\- ?){3,}|(?: ?\\_ ?){3,})\\s*$",
                next: "allowBlock"
            }, { // list
                token: "markup.list",
                regex: "^\\s{0,3}(?:[*+-]|\\d+\\.)\\s+",
                next: "listblock-start"
            }, {
                include: "basic"
            });

        this.addRules({
            "basic": [
                {
                    token: "constant.language.escape",
                    regex: /\\[\\`*_{}\[\]()#+\-.!]/
                },
                { // code span `
                    token: "support.function",
                    regex: "(`+)(.*?[^`])(\\1)"
                },
                { // reference
                    token: ["text", "constant", "text", "url", "string", "text"],
                    regex: "^([ ]{0,3}\\[)([^\\]]+)(\\]:\\s*)([^ ]+)(\\s*(?:[\"][^\"]+[\"])?(\\s*))$"
                },
                { // link by reference
                    token: ["text", "string", "text", "constant", "text"],
                    regex: "(\\[)(" + escaped("]") + ")(\\]\s*\\[)(" + escaped("]") + ")(\\])"
                },
                { // link by url
                    token: ["text", "string", "text", "markup.underline", "string", "text"],
                    regex: "(\\[)(" +                                     // [
                        escaped("]") +                                    // link text
                        ")(\\]\\()" +                                     // ](
                        '((?:[^\\)\\s\\\\]|\\\\.|\\s(?=[^"]))*)' +        // href
                        '(\\s*"' + escaped('"') + '"\\s*)?' +             // "title"
                        "(\\))"                                           // )
                },
                { // strong ** __
                    token: "string.strong",
                    regex: "([*]{2}|[_]{2}(?=\\S))(.*?\\S[*_]*)(\\1)"
                },
                { // emphasis * _
                    token: "string.emphasis",
                    regex: "([*]|[_](?=\\S))(.*?\\S[*_]*)(\\1)"
                },
                { //
                    token: ["text", "url", "text"],
                    regex: "(<)(" +
                        "(?:https?|ftp|dict):[^'\">\\s]+" +
                        "|" +
                        "(?:mailto:)?[-.\\w]+\\@[-a-z0-9]+(?:\\.[-a-z0-9]+)*\\.[a-z]+" +
                        ")(>)"
                }
            ],
            // code block
            "allowBlock": [
                { token: "support.function", regex: "^ {4}.+", next: "allowBlock" },
                { token: "empty", regex: "", next: "start" }
            ],
            "header": [
                {
                    regex: "$",
                    next: "start"
                },
                {
                    include: "basic"
                },
                {
                    defaultToken: "heading"
                }
            ],
            "listblock-start": [
                {
                    token: "support.variable",
                    regex: /(?:\[[ x]\])?/,
                    next: "listblock"
                }
            ],
            "listblock": [
                { // Lists only escape on completely blank lines.
                    token: "empty_line",
                    regex: "^$",
                    next: "start"
                },
                { // list
                    token: "markup.list",
                    regex: "^\\s{0,3}(?:[*+-]|\\d+\\.)\\s+",
                    next: "listblock-start"
                },
                {
                    include: "basic", noEscape: true
                },
                { // Github style block
                    token: "support.function",
                    regex: "^\\s*```\\s*[a-zA-Z]*(?:{.*?\\})?\\s*$",
                    next: "githubblock"
                },
                {
                    defaultToken: "list" // do not use markup.list to allow styling leading `*` differently
                }
            ],
            "blockquote": [
                { // Blockquotes only escape on blank lines.
                    token: "empty_line",
                    regex: "^\\s*$",
                    next: "start"
                },
                { // block quote
                    token: "string.blockquote",
                    regex: "^\\s*>\\s*(?:[*+-]|\\d+\\.)?\\s+",
                    next: "blockquote"
                }, {
                    include: "basic", noEscape: true
                }, {
                    defaultToken: "string.blockquote"
                }
            ],
            "githubblock": [
                {
                    token: "support.function",
                    regex: "^\\s*```",
                    next: "start"
                },
                {
                    token: "support.function",
                    regex: ".+"
                }
            ]
        });

        this.embedRules(TypeScriptHighlightRules, "tscode-", [{
            token: "support.function",
            regex: "^\\s*```",
            next: POP_STATE
        }]);

        this.embedRules(JavaScriptHighlightRules, "jscode-", [{
            token: "support.function",
            regex: "^\\s*```",
            next: POP_STATE
        }]);

        this.embedRules(HtmlHighlightRules, "htmlcode-", [{
            token: "support.function",
            regex: "^\\s*```",
            next: POP_STATE
        }]);

        this.embedRules(CssHighlightRules, "csscode-", [{
            token: "support.function",
            regex: "^\\s*```",
            next: POP_STATE
        }]);

        this.embedRules(XmlHighlightRules, "xmlcode-", [{
            token: "support.function",
            regex: "^\\s*```",
            next: POP_STATE
        }]);

        this.embedRules(GoLangHighlightRules, "gocode-", [{
            token: "support.function",
            regex: "^\\s*```",
            next: POP_STATE
        }]);

        this.normalizeRules();
    }
}
