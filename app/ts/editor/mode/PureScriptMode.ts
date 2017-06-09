import { TextMode } from "./TextMode";
import { PureScriptHighlightRules } from "./PureScriptHighlightRules";
import { CstyleFoldMode } from "./folding/CstyleFoldMode";

/**
 *
 */
export class PureScriptMode extends TextMode {
    constructor(workerUrl?: string, scriptImports?: string[]) {
        super(workerUrl, scriptImports);
        this.lineCommentStart = "--";
        this.blockComment = { start: "{-", end: "-}", nestable: true };
        this.$id = 'PureScript';
        this.HighlightRules = PureScriptHighlightRules;
        this.foldingRules = new CstyleFoldMode();
        this.$behaviour = this.$defaultBehaviour;
    }
}
