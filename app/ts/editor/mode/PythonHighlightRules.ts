import { TextHighlightRules } from "./TextHighlightRules";

export class PythonHighlightRules extends TextHighlightRules {
    constructor() {
        super();

        const keywords = (
            "and|as|assert|break|class|continue|def|del|elif|else|except|exec|" +
            "finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|" +
            "raise|return|try|while|with|yield"
        );

        const builtinConstants = (
            "True|False|None|NotImplemented|Ellipsis|__debug__"
        );

        const builtinFunctions = (
            "abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|" +
            "eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|" +
            "binfile|iter|property|tuple|bool|filter|len|range|type|bytearray|" +
            "float|list|raw_input|unichr|callable|format|locals|reduce|unicode|" +
            "chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|" +
            "cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|" +
            "__import__|complex|hash|min|set|apply|delattr|help|next|setattr|" +
            "buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern"
        );

        // const futureReserved = "";
        const keywordMapper = this.createKeywordMapper({
            "invalid.deprecated": "debugger",
            "support.function": builtinFunctions,
            // "invalid.illegal": futureReserved,
            "constant.language": builtinConstants,
            "keyword": keywords
        }, "identifier");

        const strPre = "(?:r|u|ur|R|U|UR|Ur|uR)?";

        const decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
        const octInteger = "(?:0[oO]?[0-7]+)";
        const hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
        const binInteger = "(?:0[bB][01]+)";
        const integer = "(?:" + decimalInteger + "|" + octInteger + "|" + hexInteger + "|" + binInteger + ")";

        const exponent = "(?:[eE][+-]?\\d+)";
        const fraction = "(?:\\.\\d+)";
        const intPart = "(?:\\d+)";
        const pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
        const exponentFloat = "(?:(?:" + pointFloat + "|" + intPart + ")" + exponent + ")";
        const floatNumber = "(?:" + exponentFloat + "|" + pointFloat + ")";

        const stringEscape = "\\\\(x[0-9A-Fa-f]{2}|[0-7]{3}|[\\\\abfnrtv'\"]|U[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})";

        this.$rules = {
            "start": [{
                token: "comment",
                regex: "#.*$"
            }, {
                token: "string",           // multi line """ string start
                regex: strPre + '"{3}',
                next: "qqstring3"
            }, {
                token: "string",           // " string
                regex: strPre + '"(?=.)',
                next: "qqstring"
            }, {
                token: "string",           // multi line ''' string start
                regex: strPre + "'{3}",
                next: "qstring3"
            }, {
                token: "string",           // ' string
                regex: strPre + "'(?=.)",
                next: "qstring"
            }, {
                token: "constant.numeric", // imaginary
                regex: "(?:" + floatNumber + "|\\d+)[jJ]\\b"
            }, {
                token: "constant.numeric", // float
                regex: floatNumber
            }, {
                token: "constant.numeric", // long integer
                regex: integer + "[lL]\\b"
            }, {
                token: "constant.numeric", // integer
                regex: integer + "\\b"
            }, {
                token: keywordMapper,
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token: "keyword.operator",
                regex: "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="
            }, {
                token: "paren.lparen",
                regex: "[\\[\\(\\{]"
            }, {
                token: "paren.rparen",
                regex: "[\\]\\)\\}]"
            }, {
                token: "text",
                regex: "\\s+"
            }],
            "qqstring3": [{
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                token: "string", // multi line """ string end
                regex: '"{3}',
                next: "start"
            }, {
                defaultToken: "string"
            }],
            "qstring3": [{
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                token: "string",  // multi line ''' string end
                regex: "'{3}",
                next: "start"
            }, {
                defaultToken: "string"
            }],
            "qqstring": [{
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                token: "string",
                regex: "\\\\$",
                next: "qqstring"
            }, {
                token: "string",
                regex: '"|$',
                next: "start"
            }, {
                defaultToken: "string"
            }],
            "qstring": [{
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                token: "string",
                regex: "\\\\$",
                next: "qstring"
            }, {
                token: "string",
                regex: "'|$",
                next: "start"
            }, {
                defaultToken: "string"
            }]
        };
    }
}
