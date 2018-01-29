import { TextMode } from "./TextMode";
// import { hookAnnotations, hookTerminate/*, initWorker*/ } from './TextMode';
import { GoLangHighlightRules } from "./GoLangHighlightRules";
import { MatchingBraceOutdent } from "./MatchingBraceOutdent";
// import { WorkerClient } from "../worker/WorkerClient";
import { CstyleFoldMode } from "./folding/CstyleFoldMode";
import { EditSession } from '../EditSession';

export class GoLangMode extends TextMode {

    private readonly $outdent = new MatchingBraceOutdent();

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.lineCommentStart = "//";
        this.blockComment = { start: "/*", end: "*/" };
        this.$id = "Go";
        this.HighlightRules = GoLangHighlightRules;
        this.foldingRules = new CstyleFoldMode();
    }

    getNextLineIndent(state: string, line: string, tab: string) {
        let indent = this.$getIndent(line);

        const tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        const tokens = tokenizedLine.tokens;
        // const endState = tokenizedLine.state;

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
    /*
    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient) => any): void {
        const worker = new WorkerClient(this.workerUrl);
        const tearDown = hookAnnotations(worker, session, true);
        hookTerminate(worker, session, tearDown);
        // We don't yet have a GoLang worker. Or do we have to comment out this entire createWorker method?
        // initWorker(worker, 'stemcstudio-workers.js', 'GoLangWorker', this.scriptImports, session, callback);
    }
    */
}

