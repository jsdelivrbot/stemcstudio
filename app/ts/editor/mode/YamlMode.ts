import { FoldMode } from "./folding/FoldMode";
import { MatchingBraceOutdent } from "./MatchingBraceOutdent";
import { TextMode } from "./TextMode";
import { YamlHighlightRules } from "./YamlHighlightRules";
import { EditSession } from '../EditSession';

export class YamlMode extends TextMode {

    /**
     *
     */
    $outdent = new MatchingBraceOutdent();

    /**
     * 
     */
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "YAML";
        this.lineCommentStart = "#";
        this.HighlightRules = YamlHighlightRules;
        this.foldingRules = new FoldMode();
    }

    getNextLineIndent(state: string, line: string, tab: string): string {
        let indent = this.$getIndent(line);

        if (state === "start") {
            const match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    }

    checkOutdent(state: string, line: string, input: string): boolean {
        return this.$outdent.checkOutdent(line, input);
    }

    autoOutdent(state: string, session: EditSession, row: number): void {
        this.$outdent.autoOutdent(session, row);
    }
}
