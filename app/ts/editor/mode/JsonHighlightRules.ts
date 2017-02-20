import TextHighlightRules from "./TextHighlightRules";

/**
 *
 */
export default class JsonHighlightRules extends TextHighlightRules {
    /**
     *
     */
    constructor() {
        super();
        // regexp must not have capturing parentheses. Use (?:) instead.
        // regexps are ordered -> the first match is used
        this.$rules = {
            "start": [
                {
                    token: "variable", // single line
                    regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]\\s*(?=:)'
                },
                {
                    token: "string", // single line
                    regex: '"',
                    next: "string"
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
                    token: "invalid.illegal", // single quoted strings are not allowed
                    regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
                },
                {
                    token: "invalid.illegal", // comments are not allowed
                    regex: "\\/\\/.*$"
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
            "string": [
                {
                    token: "constant.language.escape",
                    regex: /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\\\/bfnrt])/
                },
                {
                    token: "string",
                    regex: '[^"\\\\]+'
                },
                {
                    token: "string",
                    regex: '"',
                    next: "start"
                },
                {
                    token: "string",
                    regex: "",
                    next: "start"
                }
            ]
        };
    }
}
