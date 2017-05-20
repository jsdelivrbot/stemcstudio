import { HighlighterFactory } from './HighlighterFactory';
import { TextHighlightRules } from "./TextHighlightRules";
import { HighlighterRule, HighlighterStack } from './Highlighter';
import { POP_STATE } from "./TextHighlightRules";

export class XmlHighlightRules extends TextHighlightRules {
    constructor(normalize?: boolean) {
        super();
        // http://www.w3.org/TR/REC-xml/#NT-NameChar
        // NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
        // NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
        const tagRegex = "[_:a-zA-Z\xc0-\uffff][-_:.a-zA-Z0-9\xc0-\uffff]*";

        this.$rules = {
            start: [
                { token: "string.cdata.xml", regex: "<\\!\\[CDATA\\[", next: "cdata" },
                {
                    token: ["punctuation.xml-decl.xml", "keyword.xml-decl.xml"],
                    regex: "(<\\?)(xml)(?=[\\s])", next: "xml_decl", caseInsensitive: true
                },
                {
                    token: ["punctuation.instruction.xml", "keyword.instruction.xml"],
                    regex: "(<\\?)(" + tagRegex + ")", next: "processing_instruction"
                },
                { token: "comment.start.xml", regex: "<\\!--", next: "comment" },
                {
                    token: ["xml-pe.doctype.xml", "xml-pe.doctype.xml"],
                    regex: "(<\\!)(DOCTYPE)(?=[\\s])", next: "doctype", caseInsensitive: true
                },
                { include: "tag" },
                { token: "text.end-tag-open.xml", regex: "</" },
                { token: "text.tag-open.xml", regex: "<" },
                { include: "reference" },
                { defaultToken: "text.xml" }
            ],

            xml_decl: [
                {
                    token: "entity.other.attribute-name.decl-attribute-name.xml",
                    regex: "(?:" + tagRegex + ":)?" + tagRegex + ""
                },
                {
                    token: "keyword.operator.decl-attribute-equals.xml",
                    regex: "="
                },
                {
                    include: "whitespace"
                },
                {
                    include: "string"
                },
                {
                    token: "punctuation.xml-decl.xml",
                    regex: "\\?>",
                    next: "start"
                }
            ],

            processing_instruction: [
                { token: "punctuation.instruction.xml", regex: "\\?>", next: "start" },
                { defaultToken: "instruction.xml" }
            ],

            doctype: [
                { include: "whitespace" },
                { include: "string" },
                { token: "xml-pe.doctype.xml", regex: ">", next: "start" },
                { token: "xml-pe.xml", regex: "[-_a-zA-Z0-9:]+" },
                { token: "punctuation.int-subset", regex: "\\[", push: "int_subset" }
            ],

            int_subset: [
                {
                    token: "text.xml",
                    regex: "\\s+"
                },
                {
                    token: "punctuation.int-subset.xml",
                    regex: "]",
                    next: POP_STATE
                },
                {
                    token: ["punctuation.markup-decl.xml", "keyword.markup-decl.xml"],
                    regex: "(<\\!)(" + tagRegex + ")",
                    push: [
                        {
                            token: "text",
                            regex: "\\s+"
                        },
                        {
                            token: "punctuation.markup-decl.xml",
                            regex: ">",
                            next: POP_STATE
                        },
                        {
                            include: "string"
                        }
                    ]
                }
            ],

            cdata: [
                { token: "string.cdata.xml", regex: "\\]\\]>", next: "start" },
                { token: "text.xml", regex: "\\s+" },
                { token: "text.xml", regex: "(?:[^\\]]|\\](?!\\]>))+" }
            ],

            comment: [
                { token: "comment.end.xml", regex: "-->", next: "start" },
                { defaultToken: "comment.xml" }
            ],

            reference: [{
                token: "constant.language.escape.reference.xml",
                regex: "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
            }],

            attr_reference: [{
                token: "constant.language.escape.reference.attribute-value.xml",
                regex: "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
            }],

            tag: [
                {
                    token: ["meta.tag.punctuation.tag-open.xml", "meta.tag.punctuation.end-tag-open.xml", "meta.tag.tag-name.xml"],
                    regex: "(?:(<)|(</))((?:" + tagRegex + ":)?" + tagRegex + ")",
                    next: [
                        { include: "attributes" },
                        { token: "meta.tag.punctuation.tag-close.xml", regex: "/?>", next: "start" }
                    ]
                }
            ],

            tag_whitespace: [
                { token: "text.tag-whitespace.xml", regex: "\\s+" }
            ],
            // for doctype and processing instructions
            whitespace: [
                { token: "text.whitespace.xml", regex: "\\s+" }
            ],

            // for doctype and processing instructions
            string: [{
                token: "string.xml",
                regex: "'",
                push: [
                    { token: "string.xml", regex: "'", next: POP_STATE },
                    { defaultToken: "string.xml" }
                ]
            }, {
                token: "string.xml",
                regex: '"',
                push: [
                    { token: "string.xml", regex: '"', next: POP_STATE },
                    { defaultToken: "string.xml" }
                ]
            }],

            attributes: [{
                token: "entity.other.attribute-name.xml",
                regex: "(?:" + tagRegex + ":)?" + tagRegex + ""
            }, {
                token: "keyword.operator.attribute-equals.xml",
                regex: "="
            }, {
                include: "tag_whitespace"
            }, {
                include: "attribute_value"
            }],

            attribute_value: [{
                token: "string.attribute-value.xml",
                regex: "'",
                push: [
                    { token: "string.attribute-value.xml", regex: "'", next: POP_STATE },
                    { include: "attr_reference" },
                    { defaultToken: "string.attribute-value.xml" }
                ]
            }, {
                token: "string.attribute-value.xml",
                regex: '"',
                push: [
                    { token: "string.attribute-value.xml", regex: '"', next: POP_STATE },
                    { include: "attr_reference" },
                    { defaultToken: "string.attribute-value.xml" }
                ]
            }]
        };

        if (this.constructor === XmlHighlightRules) {
            this.normalizeRules();
        }
    }

    embedTagRules(highlightRules: HighlighterFactory | { [stateName: string]: HighlighterRule[] }, prefix: string, tag: string): void {
        this.$rules['tag'].unshift({
            token: ["meta.tag.punctuation.tag-open.xml", "meta.tag." + tag + ".tag-name.xml"],
            regex: "(<)(" + tag + "(?=\\s|>|$))",
            next: [
                { include: "attributes" },
                { token: "meta.tag.punctuation.tag-close.xml", regex: "/?>", next: prefix + "start" }
            ]
        });

        this.$rules[tag + "-end"] = [
            { include: "attributes" },
            {
                token: "meta.tag.punctuation.tag-close.xml", regex: "/?>", next: "start",
                onMatch: function (this: HighlighterRule, value: string, currentState: string, stack: HighlighterStack) {
                    stack.splice(0);
                    return this.token;
                }
            }
        ];

        this.embedRules(highlightRules, prefix, [{
            token: ["meta.tag.punctuation.end-tag-open.xml", "meta.tag." + tag + ".tag-name.xml"],
            regex: "(</)(" + tag + "(?=\\s|>|$))",
            next: tag + "-end"
        }, {
            token: "string.cdata.xml",
            regex: "<\\!\\[CDATA\\["
        }, {
            token: "string.cdata.xml",
            regex: "\\]\\]>"
        }]);
    }
}
