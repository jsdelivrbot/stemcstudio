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

    /**
     * Returns the rule for the start of a document comment.
     * This is a match on forward slash star [forward slash].
     * FIXME: This could be simply a standalone function.
     */
    public static getStartRule(nextState: string): HighlighterRule {
        return {
            token: "comment.doc", // doc comment
            regex: "\\/\\*(?=\\*)",
            next: nextState
        };
    }

    /**
     * Returns the rule for the end of a document comment.
     * This is a match on star and forward slash.
     * FIXME: This could be simply a standalone function.
     */
    public static getEndRule(nextState: string): HighlighterRule {
        return {
            token: "comment.doc", // closing comment
            regex: "\\*\\/",
            next: nextState
        };
    }

    /**
     * Returns a rule for matching 'TODO' or 'FIXME' or 'XXX' or 'HACK'.
     * The next state cannot be specified so that we continue in the document comments state.
     * FIXME: This could be simply a standalone function.
     */
    public static getTagRule(): HighlighterRule {
        return {
            token: "comment.doc.tag.storage.type",
            regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b"
        };
    }
}
