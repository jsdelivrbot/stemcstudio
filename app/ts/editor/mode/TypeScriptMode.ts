import { hookAnnotations, hookTerminate, initWorker } from './TextMode';
import JavaScriptMode from "./JavaScriptMode";
import TypeScriptHighlightRules from "./TypeScriptHighlightRules";
import CstyleBehaviour from "./behaviour/CstyleBehaviour";
import CStyleFoldMode from "./folding/CstyleFoldMode";
import WorkerClient from "../worker/WorkerClient";
import { EditSession } from "../EditSession";
import { EditSessionEventName } from "../EditSession";

export default class TypeScriptMode extends JavaScriptMode {

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "ace/mode/typescript";
        this.HighlightRules = TypeScriptHighlightRules;
        this.$highlightRuleConfig = { jsx: false };
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CStyleFoldMode();
    }

    createWorker(session: EditSession, callback: (err: any | null, worker?: WorkerClient) => any): void {

        const worker = new WorkerClient(this.workerUrl);
        // TypeScript is unusual in the it does not use the event to update the session.
        // This is because annotations come from the Language Service.
        // Instead, the session update is bypassed and the session forwards the event.
        const tearDown = hookAnnotations(worker, session, false);
        hookTerminate(worker, session, tearDown);

        //
        // FIXME: Does the TypeScript worker thread really emit this event?
        //
        worker.on("getFileNames", function (event) {
            // Dangerous but casting away the problem fo now.
            session._emit("getFileNames" as EditSessionEventName, { data: event.data });
        });

        initWorker(worker, 'TypeScriptWorker', this.scriptImports, session, callback);
    }
}
