import { DocCommentHighlightRules } from "./DocCommentHighlightRules";
import { TextHighlightRules } from "./TextHighlightRules";
import { arrayToMap } from "../lib/lang";

const keywords = arrayToMap(
    ("break|do|instanceof|typeof|case|else|new|var|catch|finally|return|void|continue|for|switch|default|while|function|this|" +
        "if|throw|" +
        "delete|in|try|" +
        "class|extends|super|import|from|into|implements|interface|static|mixin|override|abstract|final|" +
        "number|int|string|boolean|variant|" +
        "log|assert").split("|")
);

const buildinConstants = arrayToMap(
    ("null|true|false|NaN|Infinity|__FILE__|__LINE__|undefined").split("|")
);

const reserved = arrayToMap(
    ("debugger|with|" +
        "const|export|" +
        "let|private|public|yield|protected|" +
        "extern|native|as|operator|__fake__|__readonly__").split("|")
);

const identifierRe = "[a-zA-Z_][a-zA-Z0-9_]*\\b";

export class JsxHighlightRules extends TextHighlightRules {
    constructor() {
        super();

        this.$rules = {
            "start": [
                {
                    token: "comment",
                    regex: "\\/\\/.*$"
                },
                DocCommentHighlightRules.getStartRule("doc-start"),
                {
                    token: "comment", // multi line comment
                    regex: "\\/\\*",
                    next: "comment"
                },
                {
                    token: "string.regexp",
                    regex: "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
                },
                {
                    token: "string", // single line
                    regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                },
                {
                    token: "string", // single line
                    regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
                },
                {
                    token: "constant.numeric", // hex
                    regex: "0[xX][0-9a-fA-F]+\\b"
                },
                {
                    token: "constant.numeric", // float
                    regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
                },
                {
                    token: "constant.language.boolean",
                    regex: "(?:true|false)\\b"
                },
                {
                    token: [
                        "storage.type",
                        "text",
                        "entity.name.function"
                    ],
                    regex: "(function)(\\s+)(" + identifierRe + ")"
                },
                {
                    token: function (value) {
                        if (value === "this")
                            return "variable.language";
                        else if (value === "function")
                            return "storage.type";
                        else if (keywords.hasOwnProperty(value) || reserved.hasOwnProperty(value))
                            return "keyword";
                        else if (buildinConstants.hasOwnProperty(value))
                            return "constant.language";
                        else if (/^_?[A-Z][a-zA-Z0-9_]*$/.test(value))
                            return "language.support.class";
                        else
                            return "identifier";
                    },
                    // TODO: Unicode escape sequences
                    // TODO: Unicode identifiers
                    regex: identifierRe
                }, {
                    token: "keyword.operator",
                    regex: "!|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
                }, {
                    token: "punctuation.operator",
                    regex: "\\?|\\:|\\,|\\;|\\."
                }, {
                    token: "paren.lparen",
                    regex: "[[({<]"
                }, {
                    token: "paren.rparen",
                    regex: "[\\])}>]"
                }, {
                    token: "text",
                    regex: "\\s+"
                }
            ],
            "comment": [
                {
                    token: "comment", // closing comment
                    regex: ".*?\\*\\/",
                    next: "start"
                }, {
                    token: "comment", // comment spanning whole line
                    regex: ".+"
                }
            ]
        };

        this.embedRules(DocCommentHighlightRules, "doc-", [DocCommentHighlightRules.getEndRule("start")]);
    }
}
