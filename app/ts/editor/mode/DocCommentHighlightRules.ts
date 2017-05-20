import { TextHighlightRules } from "./TextHighlightRules";
import { HighlighterRule } from './Highlighter';

/**
 * 
 */
export class DocCommentHighlightRules extends TextHighlightRules {
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

    public static getStartRule(start: string): HighlighterRule {
        return {
            token: "comment.doc", // doc comment
            regex: "\\/\\*(?=\\*)",
            next: start
        };
    }

    public static getEndRule(start: string): HighlighterRule {
        return {
            token: "comment.doc", // closing comment
            regex: "\\*\\/",
            next: start
        };
    }

    public static getTagRule(start?: string): HighlighterRule {
        return {
            token: "comment.doc.tag.storage.type",
            regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b"
        };
    }
}
