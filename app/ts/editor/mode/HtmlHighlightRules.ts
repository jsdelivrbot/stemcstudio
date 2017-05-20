import { createMap } from "../lib/lang";
import { CssHighlightRules } from "./CssHighlightRules";
import { POP_STATE } from "./TextHighlightRules";
import { JavaScriptHighlightRules } from "./JavaScriptHighlightRules";
import { TypeScriptHighlightRules } from "./TypeScriptHighlightRules";
import { XmlHighlightRules } from "./XmlHighlightRules";

const tagMap: { [tagName: string]: string } = createMap({
    a: 'anchor',
    button: 'form',
    form: 'form',
    img: 'image',
    input: 'form',
    label: 'form',
    option: 'form',
    script: 'script',
    select: 'form',
    textarea: 'form',
    style: 'style',
    table: 'table',
    tbody: 'table',
    td: 'table',
    tfoot: 'table',
    th: 'table',
    tr: 'table'
});

/**
 *
 */
export class HtmlHighlightRules extends XmlHighlightRules {
    /**
     *
     */
    constructor() {
        super();

        this.addRules({
            attributes: [
                {
                    include: "tag_whitespace"
                },
                {
                    token: "entity.other.attribute-name.xml",
                    regex: "[-_a-zA-Z0-9:]+"
                },
                {
                    token: "keyword.operator.attribute-equals.xml",
                    regex: "=",
                    push: [
                        {
                            include: "tag_whitespace"
                        },
                        {
                            token: "string.unquoted.attribute-value.html",
                            regex: "[^<>='\"`\\s]+",
                            next: POP_STATE
                        },
                        {
                            token: "empty",
                            regex: "",
                            next: POP_STATE
                        }
                    ]
                },
                {
                    include: "attribute_value"
                }
            ],
            tag: [
                {
                    token: function (start: string, tag: string) {
                        const group = tagMap[tag];
                        return [
                            "meta.tag.punctuation." + (start === "<" ? "" : "end-") + "tag-open.xml",
                            "meta.tag" + (group ? "." + group : "") + ".tag-name.xml"
                        ];
                    },
                    regex: "(</?)([-_a-zA-Z0-9:]+)",
                    next: "tag_stuff"
                }
            ],
            tag_stuff: [
                {
                    include: "attributes"
                },
                {
                    token: "meta.tag.punctuation.tag-close.xml",
                    regex: "/?>",
                    next: "start"
                }
            ],
        });

        this.embedTagRules(CssHighlightRules, "css-", "style");
        this.embedTagRules(new JavaScriptHighlightRules({ jsx: false }).getRules(), "js-", "script");
        this.embedTagRules(new TypeScriptHighlightRules({ jsx: false }).getRules(), "ts-", "script");

        if (this.constructor === HtmlHighlightRules) {
            this.normalizeRules();
        }
    }
}
