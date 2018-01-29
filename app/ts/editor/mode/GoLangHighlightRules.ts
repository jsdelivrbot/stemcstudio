import { TextHighlightRules } from "./TextHighlightRules";
import { DocCommentHighlightRules } from "./DocCommentHighlightRules";

export class GoLangHighlightRules extends TextHighlightRules {
    constructor() {
        super();

        const keywords = (
            "else|break|case|return|goto|if|const|select|" +
            "continue|struct|default|switch|for|range|" +
            "func|import|package|chan|defer|fallthrough|go|interface|map|range|" +
            "select|type|var"
        );

        const builtinTypes = (
            "string|uint8|uint16|uint32|uint64|int8|int16|int32|int64|float32|" +
            "float64|complex64|complex128|byte|rune|uint|int|uintptr|bool|error"
        );

        const builtinFunctions = (
            "make|close|new|panic|recover"
        );

        const builtinConstants = ("nil|true|false|iota");

        const keywordMapper = this.createKeywordMapper({
            "keyword": keywords,
            "constant.language": builtinConstants,
            "support.function": builtinFunctions,
            "support.type": builtinTypes
        }, "identifier");

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
                    token: "string", // single line
                    regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                },
                {
                    token: "string", // single line
                    regex: '[`](?:[^`]*)[`]'
                },
                {
                    token: "string", // multi line string start
                    merge: true,
                    regex: '[`](?:[^`]*)$',
                    next: "bqstring"
                },
                {
                    token: "constant.numeric", // rune
                    regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))[']"
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
                    token: keywordMapper,
                    regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
                },
                {
                    token: "keyword.operator",
                    regex: "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^="
                },
                {
                    token: "punctuation.operator",
                    regex: "\\?|\\:|\\,|\\;|\\."
                },
                {
                    token: "paren.lparen",
                    regex: "[[({]"
                },
                {
                    token: "paren.rparen",
                    regex: "[\\])}]"
                },
                {
                    token: "text",
                    regex: "\\s+"
                }
            ],
            "comment": [
                {
                    token: "comment", // closing comment
                    regex: ".*?\\*\\/",
                    next: "start"
                },
                {
                    token: "comment", // comment spanning whole line
                    regex: ".+"
                }
            ],
            "bqstring": [
                {
                    token: "string",
                    regex: '(?:[^`]*)`',
                    next: "start"
                },
                {
                    token: "string",
                    regex: '.+'
                }
            ]
        };

        this.embedRules(DocCommentHighlightRules, "doc-",
            [DocCommentHighlightRules.getEndRule("start")]);
    }
}
