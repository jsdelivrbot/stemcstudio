import { CppMode } from './CppMode';
import { CstyleBehaviour } from './behaviour/CstyleBehaviour';
import { CstyleFoldMode } from './folding/CstyleFoldMode';
import { GlslHighlightRules } from './GlslHighlightRules';
import { hookAnnotations, hookTerminate, initWorker } from './TextMode';
import { MatchingBraceOutdent } from "./MatchingBraceOutdent";
import { WorkerClient } from "../worker/WorkerClient";
import { EditSession } from '../EditSession';

export class GlslMode extends CppMode {

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "GLSL";
        this.HighlightRules = GlslHighlightRules;
        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CstyleFoldMode();
    }

    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient) => any): void {
        const worker = new WorkerClient(this.workerUrl);
        const tearDown = hookAnnotations(worker, session, true);
        hookTerminate(worker, session, tearDown);
        initWorker(worker, 'stemcstudio-workers.js', 'GlslWorker', this.scriptImports, session, callback);
    }
}
