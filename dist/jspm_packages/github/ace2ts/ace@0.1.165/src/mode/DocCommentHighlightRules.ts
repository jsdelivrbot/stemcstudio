import Rule from '../Rule';
import TextHighlightRules from "./TextHighlightRules";

/**
 * @class DocCommentHighlightRules
 * @extends TextHighlightRules
 */
export default class DocCommentHighlightRules extends TextHighlightRules {

    /**
     * @class DocCommentHighlightRules
     * @constructor
     */
    constructor() {
        super();
        this.$rules = {
            "start": [
                {
                    token: "comment.doc.tag",
                    regex: "@[\\w\\d_]+" // TODO: fix email addresses
                },
                {
                    token: "comment.doc.tag",
                    regex: "\\bTODO\\b"
                },
                {
                    defaultToken: "comment.doc"
                }
            ]
        };
    }

    /**
     * @method getStartRule
     * @param start {string}
     * @return {Rule}
     * @static
     */
    public static getStartRule(start: string): Rule {
        return {
            token: "comment.doc", // doc comment
            regex: "\\/\\*(?=\\*)",
            next: start
        };
    }

    /**
     * @method getEndRule
     * @param start {string}
     * @return {Rule}
     * @static
     */
    public static getEndRule(start: string): Rule {
        return {
            token: "comment.doc", // closing comment
            regex: "\\*\\/",
            next: start
        };
    }
}
