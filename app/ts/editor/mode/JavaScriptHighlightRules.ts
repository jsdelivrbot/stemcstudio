import { DocCommentHighlightRules } from "./DocCommentHighlightRules";
import { POP_STATE, TextHighlightRules } from "./TextHighlightRules";
import { HighlighterRule, HighlighterStack, HighlighterStackElement } from './Highlighter';

// keywords which can be followed by regular expressions
const kwBeforeRe = "case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void";

// TODO: Unicode escape sequences
/**
 * Identifier regular expression.
 * Usual rules allowing identifiers to begin-with and contain $ (dollar) and _ (underscore).
 * Identifiers can contain numbers, but cannot begin with a number.
 */
const identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*\\b";

const escapedRe = "\\\\(?:x[0-9a-fA-F]{2}|" + // hex
    "u[0-9a-fA-F]{4}|" + // unicode
    "u{[0-9a-fA-F]{1,6}}|" + // es6 unicode
    "[0-2][0-7]{0,2}|" + // oct
    "3[0-6][0-7]?|" + // oct
    "37[0-7]?|" + // oct
    "[4-7][0-7]?|" + // oct
    ".)";

// const constructors = 'Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|';
/*
function escapeMetacharacter(ch: string): string {
    return `\${ch}`;
}
*/

// const META_WS = "\s";

// const META_RPAREN = ")";
// const LITERAL_RPAREN = escapeMetacharacter(META_RPAREN);

import { STATE_START } from "./TextHighlightRules";

export { STATE_START } from "./TextHighlightRules";
export const STATE_NO_REGEXP = 'no_regex';
export const STATE_REGEXP = 'regex';
export const STATE_REGEXPCC = 'regexcc';
export const STATE_PARAMS = 'params';
export const STATE_PROPERTY = 'property';
export const STATE_QQSTRING = 'qqstring';
export const STATE_QSTRING = 'qstring';

export const TOKEN_VARIABLE_PARAMETER = 'variable.parameter';

export class JavaScriptHighlightRules extends TextHighlightRules {
    constructor(options?: { noES6?: boolean; jsx?: boolean }) {
        super();
        // see: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects
        /**
         * Categorize keywords according to their use.
         */
        const keywordMapper = this.createKeywordMapper({
            "variable.language":
            "Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|" + // Constructors
            "Namespace|QName|XML|XMLList|" + // E4X
            "ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|" +
            "Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|" +
            "Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|" + // Errors
            "SyntaxError|TypeError|URIError|" +
            "decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|" + // Non-constructor functions
            "isNaN|parseFloat|parseInt|" +
            "JSON|Math|" + // Other
            "this|arguments|prototype|window|document", // Pseudo
            "keyword":
            "await|break|case|catch|continue|debugger|default|get|set|async|" +
            "delete|do|else|finally|for|" +
            "if|in|of|instanceof|new|return|switch|throw|try|typeof|while|with|yield|" +
            "import|as|from|" +
            // invalid or reserved
            "__parent__|__count__|escape|unescape|with|__proto__|" +
            "extends|super|export|implements|private|public|package|protected|static",
            /**
             * Storage Type are all the kinds of things which can be exported by name.
             */
            "storage.type": "class|const|enum|interface|let|function|type|var",
            /**
             * 
             */
            "constant.language": "null|Infinity|NaN|undefined",
            /**
             * 
             */
            "constant.language.boolean": "true|false",
            /**
             * 
             */
            "support.function": "alert",
        }, "identifier");

        // regexp must not have capturing parentheses. Use (?:) instead.
        // regexps are ordered -> the first match is used

        this.$rules = {};

        // regular expressions are only allowed after certain tokens. This
        // makes sure we don't mix up regexps with the divison operator.
        this.$rules[STATE_START] = [
            DocCommentHighlightRules.getStartRule("doc-start"),
            commentsML(STATE_START),
            commentsSL(STATE_START),
            {
                token: "string.regexp",
                regex: "\\/",
                next: STATE_REGEXP
            },
            whitespaceRule('text'),
            emptyLineRule('text'),
            fallbackNext(STATE_NO_REGEXP)
        ];

        this.$rules[STATE_NO_REGEXP] = [
            DocCommentHighlightRules.getStartRule("doc-start"),
            commentsML(STATE_NO_REGEXP),
            commentsSL(STATE_NO_REGEXP),
            {
                token: "string",
                regex: "'(?=.)",
                next: STATE_QSTRING
            },
            {
                token: "string",
                regex: '"(?=.)',
                next: STATE_QQSTRING
            },
            {
                token: "constant.numeric", // hex
                regex: /0(?:[xX][0-9a-fA-F]+|[bB][01]+)\b/
            },
            {
                token: "constant.numeric", // float
                regex: /[+-]?\d[\d_]*(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
            },
            {
                // FIXME
                // Identifier '.' 'prototype' '.' Identifier '='
                token: [
                    "storage.type", "punctuation.operator", "support.function",
                    "punctuation.operator", "entity.name.function", "text", "keyword.operator"
                ],
                // TODO: Are we missing something here?
                // We should not enter the parameters state with an opening left paren.
                regex: "(" + identifierRe + ")(\\.)(prototype)(\\.)(" + identifierRe + ")(\\s*)(=)",
                next: STATE_PARAMS
            },
            {
                // Identifier '.' Identifier '=' 'function' '('
                token: [
                    "storage.type", "punctuation.operator", "entity.name.function", "text",
                    "keyword.operator", "text", "storage.type", "text", "paren.lparen"
                ],
                regex: "(" + identifierRe + ")(\\.)(" + identifierRe + ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                next: STATE_PARAMS
            },
            {
                // Identifier '=' 'function' '('
                token: [
                    "entity.name.function", "text", "keyword.operator", "text", "storage.type",
                    "text", "paren.lparen"
                ],
                regex: "(" + identifierRe + ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                next: STATE_PARAMS
            },
            {
                // Identifier '.' Identifier '=' 'function' Word '('
                token: [
                    "storage.type", "punctuation.operator", "entity.name.function", "text",
                    "keyword.operator", "text",
                    "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                ],
                regex: "(" + identifierRe + ")(\\.)(" + identifierRe + ")(\\s*)(=)(\\s*)(function)(\\s+)(\\w+)(\\s*)(\\()",
                next: STATE_PARAMS
            },
            {
                // 'function' Identifier '('
                token: [
                    "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                ],
                regex: "(function)(\\s+)(" + identifierRe + ")(\\s*)(\\()",
                next: STATE_PARAMS
            },
            {
                // 'function' '('
                token: [
                    "storage.type", "text", "paren.lparen"
                ],
                regex: "(function)(\\s*)(\\()",
                next: STATE_PARAMS
            },
            {
                // Identifier ':' 'function' '('
                token: [
                    "entity.name.function", "text", "punctuation.operator",
                    "text", "storage.type", "text", "paren.lparen"
                ],
                regex: "(" + identifierRe + ")(\\s*)(:)(\\s*)(function)(\\s*)(\\()",
                next: STATE_PARAMS
            },
            {
                // ':' 'function' '('
                token: [
                    // TODO: Why don't we use "punctuation.operator" for the first token?
                    "text", "text", "storage.type", "text", "paren.lparen"
                ],
                regex: "(:)(\\s*)(function)(\\s*)(\\()",
                next: STATE_PARAMS
            },
            {
                token: "keyword",
                regex: "(?:" + kwBeforeRe + ")\\b",
                next: STATE_START
            },
            {
                // TODO; This looks bogus.
                token: ["support.constant"],
                regex: /that\b/
            },
            {
                // 'console' '.' 'warn' etc...
                token: ["storage.type", "punctuation.operator", "support.function.firebug"],
                // TODO: Shouldn't we allow whitespace around the period punctuation operator?
                regex: /(console)(\.)(warn|info|log|error|time|trace|timeEnd|assert)\b/
            },
            {
                token: keywordMapper,
                regex: identifierRe
            },
            {
                // '.' if not followed by '.'
                token: "punctuation.operator",
                regex: /[.](?![.])/,
                next: STATE_PROPERTY
            },
            {
                token: "keyword.operator",
                // Because this is a RegExp, only single escapes are required.
                regex: /--|\+\+|\.{3}|===|==|=|!=|!==|<+=?|>+=?|!|&&|\|\||\?:|[!$%&*+\-~\/^|]=?/,
                next: STATE_START
            },
            {
                token: "punctuation.operator",
                regex: /[?:,;.]/,
                next: STATE_START
            },
            /*
            {
                token: "punctuation.operator",
                regex: /[,]/,
                next: POP_STATE
            },
            */
            {
                token: "paren.lparen",
                regex: /[\[({]/,
                next: STATE_START
            },
            {
                token: "paren.rparen",
                regex: /[\])}]/
            },
            {
                token: "comment",
                regex: /^#!.*$/
            }
        ];

        // The transition to the function parameters state should only happen if the last token was a left paren.
        this.$rules[STATE_PARAMS] = [
            {
                token: TOKEN_VARIABLE_PARAMETER,
                regex: identifierRe
            },
            {
                token: "punctuation.operator",
                regex: "[,]+"
            },
            whitespaceRule('text'),
            {
                // TODO: Why is this here? $ matches the end of input string.
                token: "punctuation.operator",
                regex: "$"
            },
            fallbackNext(STATE_NO_REGEXP)
        ];

        this.$rules[STATE_PROPERTY] = [
            whitespaceRule('text'),
            {
                // Identifier '.' Identifier '=' 'function' [Word] '('
                token: [
                    "storage.type", "punctuation.operator", "entity.name.function", "text",
                    "keyword.operator", "text",
                    "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                ],
                // TODO: Why do we use a word and not an identifier?
                // Identifier '.' Identifier '=' 'function' Word '('
                regex: "(" + identifierRe + ")(\\.)(" + identifierRe + ")(\\s*)(=)(\\s*)(function)(?:(\\s+)(\\w+))?(\\s*)(\\()",
                next: STATE_PARAMS
            },
            {
                token: "punctuation.operator",
                regex: /[.](?![.])/
            },
            {
                token: "support.function",
                // FIXME: This RegExp is completely un-maintainable.
                regex: /(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:op|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/
            },
            {
                token: "support.function.dom",
                // FIXME: This RegExp is completely un-maintainable.
                regex: /(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName|ClassName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/
            },
            {
                token: "identifier",
                regex: identifierRe
            },
            {
                regex: "",
                token: "empty",
                next: STATE_NO_REGEXP
            }
        ];

        this.$rules[STATE_QQSTRING] = [
            {
                token: "constant.language.escape",
                regex: escapedRe
            },
            {
                token: "string",
                regex: "\\\\$",
                next: STATE_QQSTRING
            },
            {
                token: "string",
                regex: '"|$',
                next: STATE_NO_REGEXP
            },
            {
                defaultToken: "string"
            }
        ];

        this.$rules[STATE_QSTRING] = [
            {
                token: "constant.language.escape",
                regex: escapedRe
            },
            {
                token: "string",
                regex: "\\\\$",
                next: STATE_QSTRING
            },
            {
                token: "string",
                regex: "'|$",
                next: STATE_NO_REGEXP
            },
            {
                defaultToken: "string"
            }
        ];

        this.$rules[STATE_REGEXP] = [
            {
                // escapes
                token: "regexp.keyword.operator",
                regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
            },
            {
                // flag
                token: "string.regexp",
                regex: "/[sxngimy]*",
                next: STATE_NO_REGEXP
            },
            {
                // invalid operators
                token: "invalid",
                regex: /\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/
            },
            {
                // operators
                token: "constant.language.escape",
                regex: /\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/
            },
            {
                token: "constant.language.delimiter",
                regex: /\|/
            },
            {
                // '[' ['^']
                token: "constant.language.escape",
                regex: /\[\^?/,
                next: STATE_REGEXPCC
            },
            {
                token: "empty",
                regex: "$",
                next: STATE_NO_REGEXP
            },
            {
                defaultToken: "string.regexp"
            }
        ];

        // This state us entered from the regular expression state upon receipt of a '[' (regular expression character class).
        this.$rules[STATE_REGEXPCC] = [
            {
                token: "regexp.charclass.keyword.operator",
                regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
            },
            {
                token: "constant.language.escape",
                regex: "]",
                next: STATE_REGEXP
            },
            {
                token: "constant.language.escape",
                regex: "-"
            },
            {
                // Regular expressions can't straddle lines so if we end up here there is a syntax error.
                // Why do we go to the STATE_NO_REGEXP state instead of "start"?
                token: "empty",
                regex: "$",
                next: STATE_NO_REGEXP
            },
            {
                // TODO: Surely we have a mis-spelling?
                defaultToken: "string.regexp.charachterclass"
            }
        ];

        if (!options || !options.noES6) {
            this.$rules['no_regex'].unshift(
                {
                    regex: "[{}]",
                    onMatch: function (this: HighlighterRule, value: string, state: string, stack: HighlighterStack) {
                        this.next = value === "{" ? this.nextState : "";
                        if (value === "{" && stack.length) {
                            stack.unshift(STATE_START, state);
                            return "paren.lparen";
                        }
                        else if (value === "}" && stack.length) {
                            stack.shift();
                            this.next = stack.shift();
                            if ((<string>this.next).indexOf("string") !== -1) {
                                return "paren.quasi.end";
                            }
                        }
                        return value === "{" ? "paren.lparen" : "paren.rparen";
                    },
                    nextState: STATE_START
                },
                {
                    token: "string.quasi.start",
                    regex: /`/,
                    push: [
                        {
                            token: "constant.language.escape",
                            regex: escapedRe
                        },
                        {
                            token: "paren.quasi.start",
                            regex: /\${/,
                            push: STATE_START
                        },
                        {
                            token: "string.quasi.end",
                            regex: /`/,
                            next: POP_STATE
                        },
                        {
                            defaultToken: "string.quasi"
                        }
                    ]
                });
        }

        if (!options || options.jsx !== false) {
            JSX.call(this);
        }

        this.embedRules(DocCommentHighlightRules, "doc-", [DocCommentHighlightRules.getEndRule(STATE_NO_REGEXP)]);

        this.normalizeRules();
    }
}

function JSX(this: JavaScriptHighlightRules) {
    const tagRegex = identifierRe.replace("\\d", "\\d\\-");
    const jsxTag = {
        onMatch: function (this: HighlighterRule, value: string, state: string, stack: HighlighterStackElement[]) {
            const offset = value.charAt(1) === "/" ? 2 : 1;
            if (offset === 1) {
                if (state !== this.nextState) {
                    stack.unshift(<HighlighterStackElement>this.next, <HighlighterStackElement>this.nextState, 0);
                }
                else {
                    stack.unshift(<HighlighterStackElement>this.next);
                }
                const elementTwo = <number>stack[2];
                stack[2] = elementTwo + 1;
            }
            else if (offset === 2) {
                if (state === this.nextState) {
                    const elementOne = <number>stack[1];
                    stack[1] = elementOne - 1;
                    if (!stack[1] || stack[1] < 0) {
                        stack.shift();
                        stack.shift();
                    }
                }
            }
            return [{
                type: "meta.tag.punctuation." + (offset === 1 ? "" : "end-") + "tag-open.xml",
                value: value.slice(0, offset)
            }, {
                type: "meta.tag.tag-name.xml",
                value: value.substr(offset)
            }];
        },
        regex: "</?" + tagRegex + "",
        next: "jsxAttributes",
        nextState: "jsx"
    };
    this.$rules.start.unshift(jsxTag);
    const jsxJsRule: HighlighterRule = {
        regex: "{",
        token: "paren.quasi.start",
        push: STATE_START
    };
    this.$rules.jsx = [
        jsxJsRule,
        jsxTag,
        { include: "reference" },
        { defaultToken: "string" }
    ];
    const jsxAttributes: HighlighterRule[] = [];
    this.$rules.jsxAttributes = jsxAttributes;
    this.$rules.jsxAttributes = [
        {
            token: "meta.tag.punctuation.tag-close.xml",
            regex: "/?>",
            onMatch: function (this: HighlighterRule, value: string, currentState: string, stack: any[]) {
                if (currentState === stack[0])
                    stack.shift();
                if (value.length === 2) {
                    if (stack[0] === this.nextState)
                        stack[1]--;
                    if (!stack[1] || stack[1] < 0) {
                        stack.splice(0, 2);
                    }
                }
                this.next = stack[0] || STATE_START;
                return [{ type: this.token, value: value }];
            },
            nextState: "jsx"
        },
        jsxJsRule,
        commentsML("jsxAttributes"),
        commentsSL("jsxAttributes"),
        {
            token: "entity.other.attribute-name.xml",
            regex: tagRegex
        },
        {
            token: "keyword.operator.attribute-equals.xml",
            regex: "="
        },
        {
            token: "text.tag-whitespace.xml",
            regex: "\\s+"
        },
        {
            token: "string.attribute-value.xml",
            regex: "'",
            stateName: "jsx_attr_q",
            push: [
                {
                    token: "string.attribute-value.xml",
                    regex: "'",
                    next: POP_STATE
                },
                { include: "reference" },
                { defaultToken: "string.attribute-value.xml" }
            ]
        },
        {
            token: "string.attribute-value.xml",
            regex: '"',
            stateName: "jsx_attr_qq",
            push: [
                { token: "string.attribute-value.xml", regex: '"', next: POP_STATE },
                { include: "reference" },
                { defaultToken: "string.attribute-value.xml" }
            ]
        },
        jsxTag
    ];
    this.$rules.reference = [{
        token: "constant.language.escape.reference.xml",
        regex: "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
    }];
}

function commentsML(next: string): HighlighterRule {
    return {
        token: "comment", // multi line comment
        regex: /\/\*/,
        next: [
            DocCommentHighlightRules.getTagRule(),
            { token: "comment", regex: "\\*\\/", next: next || POP_STATE },
            { defaultToken: "comment", caseInsensitive: true }
        ]
    };
}

function commentsSL(next: string): HighlighterRule {
    return {
        token: "comment",
        regex: "\\/\\/",
        next: [
            DocCommentHighlightRules.getTagRule(),
            { token: "comment", regex: "$|^", next: next || POP_STATE },
            { defaultToken: "comment", caseInsensitive: true }
        ]
    };
}

/**
 * Matches one or more whitespace characters, does not change the state.
 */
function whitespaceRule(token: 'text'): HighlighterRule {
    return { token, regex: "\\s+" };
}

/**
 * Matches a zero-length line, does not change the state.
 */
function emptyLineRule(token: 'text'): HighlighterRule {
    return { token, regex: "^$" };
}

function fallbackNext(next: string): HighlighterRule {
    return {
        token: "empty",
        regex: "",
        next
    };
}
