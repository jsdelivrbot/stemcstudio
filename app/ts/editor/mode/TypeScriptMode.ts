import { hookAnnotations, hookTerminate, initWorker } from './TextMode';
import { JavaScriptMode } from "./JavaScriptMode";
import { TypeScriptHighlightRules } from "./TypeScriptHighlightRules";
import { CstyleBehaviour } from "./behaviour/CstyleBehaviour";
import { CstyleFoldMode } from "./folding/CstyleFoldMode";
import { WorkerClient } from "../worker/WorkerClient";
import { EditSession } from '../EditSession';

export class TypeScriptMode extends JavaScriptMode {

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "TypeScript";
        this.HighlightRules = TypeScriptHighlightRules;
        this.$highlightRuleConfig = { jsx: false };
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CstyleFoldMode();
    }

    createWorker(session: EditSession, callback: (err: any | null, worker?: WorkerClient) => any): void {
        const worker = new WorkerClient(this.workerUrl);
        // TypeScript is unusual in the it does not use the event to update the session.
        // This is because annotations come from the Language Service.
        // Instead, the session update is bypassed and the session forwards the event.
        const tearDown = hookAnnotations(worker, session, false);
        hookTerminate(worker, session, tearDown);
        initWorker(worker, 'stemcstudio-worker-ts.js', 'TypeScriptWorker', this.scriptImports, session, callback);
    }
}
