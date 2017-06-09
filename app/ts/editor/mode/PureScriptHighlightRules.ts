import { POP_STATE, TextHighlightRules } from "./TextHighlightRules";

const escapeRe = /\\(\d+|['"\\&trnbvf])/;

const smallRe = /[a-z_]/.source;
const largeRe = /[A-Z]/.source;
const idRe = /[a-z_A-Z0-9']/.source;

export class PureScriptHighlightRules extends TextHighlightRules {
    constructor() {
        super();
        const keywordMapper = this.createKeywordMapper({
            "keyword": "as|case|class|data|default|deriving|do|else|export|foreign|" +
            "hiding|jsevent|if|import|in|infix|infixl|infixr|instance|let|" +
            "module|newtype|of|open|then|type|where|_|port|\u03BB"
        }, "identifier");


        this.$rules = {
            start: [
                {
                    token: "string.start",
                    regex: '"',
                    next: "string"
                },
                {
                    token: "string.character",
                    regex: "'(?:" + escapeRe.source + "|.)'?"
                },
                {
                    regex: /0(?:[xX][0-9A-Fa-f]+|[oO][0-7]+)|\d+(\.\d+)?([eE][-+]?\d*)?/,
                    token: "constant.numeric"
                },
                {
                    token: "comment",
                    regex: "--.*"
                },
                {
                    token: "keyword",
                    regex: /\.\.|\||:|=|\\|"|->|<-|\u2192/
                },
                {
                    token: "keyword.operator",
                    regex: /[-!#$%&*+.\/<=>?@\\^|~:\u03BB\u2192]+/
                },
                {
                    token: "operator.punctuation",
                    regex: /[,;`]/
                },
                {
                    token: keywordMapper,
                    regex: "[\\w\\xff-\\u218e\\u2455-\\uffff]+\\b"
                },
                {
                    regex: largeRe + idRe + "+\\.?",
                    token: function (value) {
                        if (value[value.length - 1] === ".")
                            return "entity.name.function";
                        return "constant.language";
                    }
                },
                {
                    regex: "^" + smallRe + idRe + "+",
                    token: function (value) {
                        return "constant.language";
                    }
                },
                {
                    regex: "{-#?",
                    token: "comment.start",
                    onMatch: function (value, currentState, stack) {
                        this.next = value.length === 2 ? "blockComment" : "docComment";
                        return this.token;
                    }
                },
                {
                    token: "variable.language",
                    regex: /\[markdown\|/,
                    next: "markdown"
                },
                {
                    token: "paren.lparen",
                    regex: /[\[({]/
                },
                {
                    token: "paren.rparen",
                    regex: /[\])}]/
                }
            ],
            markdown: [
                {
                    regex: /\|\]/,
                    next: "start"
                },
                {
                    defaultToken: "string"
                }
            ],
            blockComment: [
                {
                    regex: "{-",
                    token: "comment.start",
                    push: "blockComment"
                },
                {
                    regex: "-}",
                    token: "comment.end",
                    next: POP_STATE
                },
                {
                    defaultToken: "comment"
                }
            ],
            docComment: [
                {
                    regex: "{-",
                    token: "comment.start",
                    push: "docComment"
                },
                {
                    regex: "-}",
                    token: "comment.end",
                    next: POP_STATE
                },
                {
                    defaultToken: "doc.comment"
                }
            ],
            string: [
                {
                    token: "constant.language.escape",
                    regex: escapeRe
                },
                {
                    token: "text",
                    regex: /\\(\s|$)/,
                    next: "stringGap"
                },
                {
                    token: "string.end",
                    regex: '"',
                    next: "start"
                },
                {
                    defaultToken: "string"
                }
            ],
            stringGap: [
                {
                    token: "text",
                    regex: /\\/,
                    next: "string"
                },
                {
                    token: "error",
                    regex: "",
                    next: "start"
                }
            ]
        };

        this.normalizeRules();
    }
}
