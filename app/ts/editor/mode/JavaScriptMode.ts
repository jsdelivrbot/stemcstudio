import { TextMode } from "./TextMode";
import { hookAnnotations, hookTerminate, initWorker } from './TextMode';
import { JavaScriptHighlightRules } from "./JavaScriptHighlightRules";
import { MatchingBraceOutdent } from "./MatchingBraceOutdent";
import { WorkerClient } from "../worker/WorkerClient";
import { CstyleBehaviour } from "./behaviour/CstyleBehaviour";
import { CstyleFoldMode } from "./folding/CstyleFoldMode";
import { EditSession } from '../EditSession';

/**
 *
 */
export class JavaScriptMode extends TextMode {

    private readonly $outdent = new MatchingBraceOutdent();

    /**
     *
     */
    constructor(workerUrl = '', scriptImports: string[] = []) {
        super(workerUrl, scriptImports);
        this.$id = "JavaScript";
        // The Tokenizer will be built using these rules.
        this.HighlightRules = JavaScriptHighlightRules;
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CstyleFoldMode();
        this.lineCommentStart = "//";
        this.blockComment = { start: "/*", end: "*/" };
    }

    /**
     * 
     */
    getNextLineIndent(state: string, line: string, tab: string): string {
        let indent = this.$getIndent(line);

        const tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        const tokens = tokenizedLine.tokens;
        // Looks like we can have a string or (string | number)[] here.
        const endState = tokenizedLine.state;

        // If the type of the last token is a comment, there is no change of indentation.
        if (tokens.length && tokens[tokens.length - 1].type === "comment") {
            return indent;
        }

        if (state === "start" || state === "no_regex") {
            // Indent for case statements or things like opening braces.
            const match = line.match(/^.*(?:\bcase\b.*\:|[\{\(\[])\s*$/);
            if (match) {
                indent += tab;
            }
        }
        else if (state === "doc-start") {
            if (endState === "start" || endState === "no_regex") {
                return "";
            }
            // Indent for block comments.
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

    createWorker(session: EditSession, callback: (err: any, worker: WorkerClient | undefined) => any): void {
        const worker = new WorkerClient(this.workerUrl);
        const tearDown = hookAnnotations(worker, session, true);
        hookTerminate(worker, session, tearDown);
        initWorker(worker, 'stemcstudio-workers.js', 'JavaScriptWorker', this.scriptImports, session, callback);
    }
}
