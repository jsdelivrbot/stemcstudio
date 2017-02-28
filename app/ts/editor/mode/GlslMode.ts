import Annotation from "../Annotation";
import CppMode from './CppMode';
import CstyleBehaviour from './behaviour/CstyleBehaviour';
import CstyleFoldMode from './folding/CstyleFoldMode';
import EditSession from "../EditSession";
import GlslHighlightRules from './GlslHighlightRules';
import MatchingBraceOutdent from "./MatchingBraceOutdent";
import WorkerClient from "../worker/WorkerClient";

export default class GlslMode extends CppMode {
    $id = "ace/mode/glsl";
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.highlighter = GlslHighlightRules;

        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CstyleFoldMode();
    }

    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient) => any): void {

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
            worker.init(this.scriptImports, moduleName, 'GlslWorker', function (err: any) {
                if (!err) {
                    worker.attachToDocument(session.docOrThrow());
                    callback(void 0, worker);
                }
                else {
                    callback(err, void 0);
                }
            });
        }
        catch (e) {
            callback(e, void 0);
        }
    }

}
