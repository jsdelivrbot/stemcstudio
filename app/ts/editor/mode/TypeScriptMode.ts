import { ACE_WORKER_MODULE_NAME } from '../../constants';
import Annotation from "../Annotation";
import JavaScriptMode from "./JavaScriptMode";
import TypeScriptHighlightRules from "./TypeScriptHighlightRules";
import CstyleBehaviour from "./behaviour/CstyleBehaviour";
import CStyleFoldMode from "./folding/CstyleFoldMode";
import WorkerClient from "../worker/WorkerClient";
import EditSession from "../EditSession";

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

        const workerUrl = this.workerUrl;
        const scriptImports = this.scriptImports;

        const worker = new WorkerClient(workerUrl);

        worker.on("terminate", function () {
            worker.detachFromDocument();
            session.clearAnnotations();
        });

        worker.on('annotations', function (event: { data: Annotation[] }) {
            const annotations: Annotation[] = event.data;
            if (annotations.length > 0) {
                // session.setAnnotations(annotations);
            }
            else {
                // session.clearAnnotations();
            }
            session._emit("annotations", { data: annotations });
        });

        worker.on("getFileNames", function (event) {
            session._emit("getFileNames", { data: event.data });
        });

        try {
            worker.init(scriptImports, ACE_WORKER_MODULE_NAME, 'TypeScriptWorker', function (err: any) {
                if (!err) {
                    worker.attachToDocument(session.docOrThrow());
                    callback(void 0, worker);
                }
                else {
                    console.warn(`TypeScriptWorker init failed. Cause: ${err}.`);
                    callback(err);
                }
            });
        }
        catch (e) {
            callback(e);
        }
    };
}
