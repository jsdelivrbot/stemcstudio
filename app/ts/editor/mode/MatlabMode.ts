import { TextMode } from "./TextMode";
import { MatlabHighlightRules } from "./MatlabHighlightRules";
import { MatchingBraceOutdent } from "./MatchingBraceOutdent";

export class MatlabMode extends TextMode {
    $outdent: MatchingBraceOutdent;

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "MATLAB";
        this.lineCommentStart = "%";
        this.blockComment = { start: "%{", end: "%}" };
        this.HighlightRules = MatlabHighlightRules;
    }
}

