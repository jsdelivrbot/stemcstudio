import {createMap} from "../lib/lang";
import CssHighlightRules from "./CssHighlightRules";
import JavaScriptHighlightRules from "./JavaScriptHighlightRules";
import XmlHighlightRules from "./XmlHighlightRules";

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
 * @class HtmlHighlightRules
 * @extends XmlHighlightRules
 */
export default class HtmlHighlightRules extends XmlHighlightRules {
    /**
     * @class HtmlHighlightRules
     * @constructor
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
                            next: "pop"
                        },
                        {
                            token: "empty",
                            regex: "",
                            next: "pop"
                        }
                    ]
                },
                {
                    include: "attribute_value"
                }
            ],
            tag: [
                {
                    token: function(start: string, tag: string) {
                        var group = tagMap[tag];
                        return ["meta.tag.punctuation." + (start === "<" ? "" : "end-") + "tag-open.xml",
                            "meta.tag" + (group ? "." + group : "") + ".tag-name.xml"];
                    },
                    regex: "(</?)([-_a-zA-Z0-9:]+)",
                    next: "tag_stuff"
                }],
            tag_stuff: [
                { include: "attributes" },
                { token: "meta.tag.punctuation.tag-close.xml", regex: "/?>", next: "start" }
            ],
        });

        this.embedTagRules(CssHighlightRules, "css-", "style");
        this.embedTagRules(JavaScriptHighlightRules, "js-", "script");

        if (this.constructor === HtmlHighlightRules)
            this.normalizeRules();
    }
}
