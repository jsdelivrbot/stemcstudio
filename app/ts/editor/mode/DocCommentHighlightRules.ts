import Rule from '../Rule';
import TextHighlightRules from "./TextHighlightRules";

/**
 * 
 */
export default class DocCommentHighlightRules extends TextHighlightRules {
    /**
     * 
     */
    constructor() {
        super();
        this.$rules = {
            "start": [
                {
                    token: "comment.doc.tag",
                    regex: "@[\\w\\d_]+" // TODO: fix email addresses
                },
                DocCommentHighlightRules.getTagRule(),
                {
                    defaultToken: "comment.doc",
                    caseInsensitive: true
                }
            ]
        };
    }

    public static getStartRule(start: string): Rule<string> {
        return {
            token: "comment.doc", // doc comment
            regex: "\\/\\*(?=\\*)",
            next: start
        };
    }

    public static getEndRule(start: string): Rule<string> {
        return {
            token: "comment.doc", // closing comment
            regex: "\\*\\/",
            next: start
        };
    }

    public static getTagRule(start?: string): Rule<string> {
        return {
            token: "comment.doc.tag.storage.type",
            regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b"
        };
    }
}
