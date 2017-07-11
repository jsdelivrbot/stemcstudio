import { TextMode } from "./TextMode";
import { CppHighlightRules } from "./CppHighlightRules";
import { MatchingBraceOutdent } from "./MatchingBraceOutdent";
import { CstyleBehaviour } from "./behaviour/CstyleBehaviour";
import { CstyleFoldMode } from "./folding/CstyleFoldMode";
import { EditSession } from '../EditSession';

export class CppMode extends TextMode {
    // FIXME: What is happening here?
    protected $outdent: MatchingBraceOutdent;

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "C++";
        this.lineCommentStart = "//";
        this.blockComment = { start: "/*", end: "*/" };
        this.HighlightRules = CppHighlightRules;
        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CstyleBehaviour();
        // No completer available yet.
        this.foldingRules = new CstyleFoldMode();
    }

    getNextLineIndent(state: string, line: string, tab: string): string {
        let indent = this.$getIndent(line);

        const tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        const tokens = tokenizedLine.tokens;
        const endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length - 1].type === "comment") {
            return indent;
        }

        if (state === "start") {
            const match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        }
        else if (state === "doc-start") {
            if (endState === "start") {
                return "";
            }
            const match = line.match(/^\s*(\/?)\*/);
            if (match) {
                if (match[1]) {
                    indent += " ";
                }
                indent += "* ";
            }
        }

        return indent;
    }

    checkOutdent(state: string, line: string, text: string): boolean {
        return this.$outdent.checkOutdent(line, text);
    }

    autoOutdent(state: string, session: EditSession, row: number): void {
        this.$outdent.autoOutdent(session, row);
    }
}
