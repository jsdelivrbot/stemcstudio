import { TextMode } from "./TextMode";
import { LatexHighlightRules } from './LatexHighlightRules';
import { LatexFoldMode } from './folding/LatexFoldMode';

/**
 *
 */
export class LatexMode extends TextMode {
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        // this.type = "text";
        this.lineCommentStart = "%";
        this.$id = "LaTeX";
        this.HighlightRules = LatexHighlightRules;
        this.foldingRules = new LatexFoldMode();
    }
}
