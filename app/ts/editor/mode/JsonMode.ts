import Annotation from "../Annotation";
import TextMode from "./TextMode";
import JsonHighlightRules from "./JsonHighlightRules";
import MatchingBraceOutdent from "./MatchingBraceOutdent";
import WorkerClient from "../worker/WorkerClient";
import CstyleBehaviour from "./behaviour/CstyleBehaviour";
import CStyleFoldMode from "./folding/CstyleFoldMode";
import EditSession from "../EditSession";

export default class JsonMode extends TextMode {
    public $id = "ace/mode/json";
    private $outdent: MatchingBraceOutdent;

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.HighlightRules = JsonHighlightRules;
        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CStyleFoldMode();
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

    autoOutdent(state: string, session: EditSession, row: number): number {
        return this.$outdent.autoOutdent(session, row);
    }

    /**
     * @method createWorker
     * @param session {EditSession}
     * @param callback {(err: any, worker?: WorkerClient) => any}
     * @return {WorkerClient}
     */
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
            worker.init(this.scriptImports, moduleName, 'JsonWorker', function (err: any) {
                if (!err) {
                    worker.attachToDocument(session.getDocument());
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
