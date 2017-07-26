import { TextMode } from "./TextMode";
import { hookAnnotations, hookTerminate, initWorker } from './TextMode';
import { CsvHighlightRules } from "./CsvHighlightRules";
import { MatchingBraceOutdent } from "./MatchingBraceOutdent";
import { WorkerClient } from "../worker/WorkerClient";
import { CstyleBehaviour } from "./behaviour/CstyleBehaviour";
import { CstyleFoldMode } from "./folding/CstyleFoldMode";
import { EditSession } from '../EditSession';

export class CsvMode extends TextMode {

    private readonly $outdent = new MatchingBraceOutdent();

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "CSV";
        this.HighlightRules = CsvHighlightRules;
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CstyleFoldMode();
    }

    getNextLineIndent(state: string, line: string, tab: string) {
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

    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient) => any): void {
        const worker = new WorkerClient(this.workerUrl);
        const tearDown = hookAnnotations(worker, session, true);
        hookTerminate(worker, session, tearDown);
        initWorker(worker, 'stemcstudio-workers.js', 'CsvWorker', this.scriptImports, session, callback);
    }
}
