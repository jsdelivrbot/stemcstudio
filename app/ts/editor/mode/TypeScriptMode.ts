import Annotation from "../Annotation";
import JavaScriptMode from "./JavaScriptMode";
import TypeScriptHighlightRules from "./TypeScriptHighlightRules";
import CstyleBehaviour from "./behaviour/CstyleBehaviour";
import CStyleFoldMode from "./folding/CstyleFoldMode";
import MatchingBraceOutdent from "./MatchingBraceOutdent";
import WorkerClient from "../worker/WorkerClient";
import EditSession from "../EditSession";

/**
 *
 */
export default class TypeScriptMode extends JavaScriptMode {

    $id = "ace/mode/typescript";

    /**
     * @param workerUrl
     * @param scriptImports
     */
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.highlighter = TypeScriptHighlightRules;

        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CStyleFoldMode();
    }

    createWorker(session: EditSession, callback: (err: any, worker: WorkerClient) => any): void {

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

        // FIXME: Must be able to inject the module name.
        const moduleName = 'ace-workers.js';
        try {
            worker.init(scriptImports, moduleName, 'TypeScriptWorker', function (err: any) {
                if (!err) {
                    worker.attachToDocument(session.getDocument());
                    callback(void 0, worker);
                }
                else {
                    console.warn(`TypeScriptWorker init failed. Cause: ${err}.`);
                    callback(err, void 0);
                }
            });
        }
        catch (e) {
            callback(e, void 0);
        }
    };
}
