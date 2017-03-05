import Annotation from "../Annotation";
import TextMode from "./TextMode";
import HaskellHighlightRules from "./HaskellHighlightRules";
import CstyleFoldMode from "./folding/CstyleFoldMode";
import WorkerClient from "../worker/WorkerClient";
import EditSession from "../EditSession";

export default class HaskellMode extends TextMode {

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "ace/mode/haskell";
        this.blockComment = { start: "/*", end: "*/" };
        this.lineCommentStart = "--";
        this.HighlightRules = HaskellHighlightRules;
        this.foldingRules = new CstyleFoldMode();
    }

    createWorker(session: EditSession, callback: (err: any, worker: WorkerClient) => any): void {
        const worker = new WorkerClient(this.workerUrl);

        worker.on('annotations', function (event: { data: Annotation[] }) {
            const annotations: Annotation[] = event.data;
            if (annotations.length > 0) {
                session.setAnnotations(annotations);
            }
            else {
                session.clearAnnotations();
            }
            session._emit("annotations", { data: annotations });
        });

        worker.on("terminate", function () {
            worker.detachFromDocument();
            session.clearAnnotations();
        });

        // FIXME: Must be able to inject the module name.
        const moduleName = 'ace-workers.js';
        try {
            worker.init(this.scriptImports, moduleName, 'HaskellWorker', function (err: any) {
                if (!err) {
                    worker.attachToDocument(session.getDocument());
                    callback(void 0, worker);
                }
                else {
                    console.warn(`HaskellWorker init fail: ${err}`);
                    callback(err, void 0);
                }
            });
        }
        catch (e) {
            callback(e, void 0);
        }
    }
}
