import { TextMode } from "./TextMode";
import { hookAnnotations, hookTerminate, initWorker } from './TextMode';
import { CssCompletions } from './CssCompletions';
import { CssHighlightRules } from "./CssHighlightRules";
import { MatchingBraceOutdent } from "./MatchingBraceOutdent";
import { WorkerClient } from "../worker/WorkerClient";
import { CssBehaviour } from "./behaviour/CssBehaviour";
import { CstyleFoldMode } from "./folding/CstyleFoldMode";
import { Position } from 'editor-document';
import { EditSession } from '../../editor/EditSession';

export class CssMode extends TextMode {
    $outdent: MatchingBraceOutdent;
    $completer: CssCompletions;

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "CSS";
        this.blockComment = { start: "/*", end: "*/" };
        this.HighlightRules = CssHighlightRules;
        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CssBehaviour();
        this.$completer = new CssCompletions();
        this.foldingRules = new CstyleFoldMode();
    }

    getNextLineIndent(state: string, line: string, tab: string): string {
        let indent = this.$getIndent(line);

        // ignore braces in comments
        const tokens = this.getTokenizer().getLineTokens(line, state).tokens;
        if (tokens.length && tokens[tokens.length - 1].type === "comment") {
            return indent;
        }

        const match = line.match(/^.*\{\s*$/);
        if (match) {
            indent += tab;
        }

        return indent;
    }

    checkOutdent(state: string, line: string, text: string): boolean {
        return this.$outdent.checkOutdent(line, text);
    }

    autoOutdent(state: string, session: EditSession, row: number): void {
        this.$outdent.autoOutdent(session, row);
    }

    getCompletions(state: string, session: EditSession, pos: Position, prefix: string) {
        return this.$completer.getCompletions(state, session, pos, prefix);
    }

    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient) => any): void {
        const worker = new WorkerClient(this.workerUrl);
        const tearDown = hookAnnotations(worker, session, true);
        hookTerminate(worker, session, tearDown);
        initWorker(worker, 'stemcstudio-workers.js', 'CssWorker', this.scriptImports, session, callback);
    }
}
