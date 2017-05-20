import { TextHighlightRules } from "./TextHighlightRules";
import { HighlighterRule, HighlighterStack, HighlighterStackElement } from './Highlighter';

export class YamlHighlightRules extends TextHighlightRules {
    constructor() {
        super();
        // regexp must not have capturing parentheses. Use (?:) instead.
        // regexps are ordered -> the first match is used
        this.$rules = {
            "start": [
                {
                    token: "comment",
                    regex: "#.*$"
                },
                {
                    token: "list.markup",
                    regex: /^(?:-{3}|\.{3})\s*(?=#|$)/
                },
                {
                    token: "list.markup",
                    regex: /^\s*[\-?](?:$|\s)/
                },
                {
                    token: "constant",
                    regex: "!![\\w//]+"
                },
                {
                    token: "constant.language",
                    regex: "[&\\*][a-zA-Z0-9-_]+"
                },
                {
                    token: ["meta.tag", "keyword"],
                    regex: /^(\s*\w.*?)(:(?:\s+|$))/
                },
                {
                    token: ["meta.tag", "keyword"],
                    regex: /(\w+?)(\s*:(?:\s+|$))/
                },
                {
                    token: "keyword.operator",
                    regex: "<<\\w*:\\w*"
                },
                {
                    token: "keyword.operator",
                    regex: "-\\s*(?=[{])"
                },
                {
                    token: "string", // single line
                    regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                },
                {
                    token: "string", // multi line string start
                    regex: '[|>][-+\\d\\s]*$',
                    onMatch: function (this: HighlighterRule, val: string, state: string, stack: HighlighterStack, line: string) {
                        const regExpArray = /^\s*(?:[-?]\s)?/.exec(line);
                        if (regExpArray) {
                            const indent = regExpArray[0];
                            if (stack.length < 1) {
                                stack.push(<HighlighterStackElement>this.next);
                            }
                            else {
                                stack[0] = "mlString";
                            }

                            if (stack.length < 2) {
                                stack.push(indent.length);
                            }
                            else {
                                stack[1] = indent.length;
                            }
                        }
                        return this.token;
                    },
                    next: "mlString"
                },
                {
                    token: "string", // single quoted string
                    regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
                },
                {
                    token: "constant.numeric", // float
                    regex: /(\b|[+\-\.])[\d_]+(?:(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)/
                },
                {
                    token: "constant.numeric", // other number
                    regex: /[+\-]?\.inf\b|NaN\b|0x[\dA-Fa-f_]+|0b[10_]+/
                },
                {
                    token: "constant.language.boolean",
                    regex: "\\b(?:true|false|TRUE|FALSE|True|False|yes|no)\\b"
                },
                {
                    token: "paren.lparen",
                    regex: "[[({]"
                },
                {
                    token: "paren.rparen",
                    regex: "[\\])}]"
                }
            ],
            "mlString": [
                {
                    token: "indent",
                    regex: /^\s*$/
                },
                {
                    token: "indent",
                    regex: /^\s*/,
                    onMatch: function (this: HighlighterRule, val: string, state: string, stack: HighlighterStack) {
                        const curIndent = stack[1];

                        if (curIndent >= val.length) {
                            this.next = "start";
                            stack.splice(0);
                        }
                        else {
                            this.next = "mlString";
                        }
                        return this.token;
                    },
                    next: "mlString"
                },
                {
                    token: "string",
                    regex: '.+'
                }
            ]
        };

    }
}
