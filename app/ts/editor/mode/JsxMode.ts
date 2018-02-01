import { JsxHighlightRules } from './JsxHighlightRules';
import { TextMode } from './TextMode';
import { CstyleBehaviour } from "./behaviour/CstyleBehaviour";
import { CstyleFoldMode } from "./folding/CstyleFoldMode";
import { MatchingBraceOutdent } from "./MatchingBraceOutdent";
import { EditSession } from '../EditSession';

/**
 * TODO: Interesting that jsx mode does not extend the JavaScript mode (similar to the TypeScript approach).
 */
export class JsxMode extends TextMode {
    private readonly $outdent = new MatchingBraceOutdent();

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "JSX";
        this.blockComment = { start: "/*", end: "*/" };
        this.lineCommentStart = "//";
        this.HighlightRules = JsxHighlightRules;
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CstyleFoldMode();
    }

    getNextLineIndent(state: string, line: string, tab: string): string {
        let indent = this.$getIndent(line);

        const tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        const tokens = tokenizedLine.tokens;

        if (tokens.length && tokens[tokens.length - 1].type === "comment") {
            return indent;
        }

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
