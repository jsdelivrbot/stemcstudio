import { ACE_WORKER_MODULE_NAME } from '../../constants';
import Annotation from "../Annotation";
import TextMode from "./TextMode";
import JsonHighlightRules from "./JsonHighlightRules";
import MatchingBraceOutdent from "./MatchingBraceOutdent";
import WorkerClient from "../worker/WorkerClient";
import CstyleBehaviour from "./behaviour/CstyleBehaviour";
import CStyleFoldMode from "./folding/CstyleFoldMode";
import EditSession from "../EditSession";

export default class JsonMode extends TextMode {

    private readonly $outdent = new MatchingBraceOutdent();

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "ace/mode/json";
        this.HighlightRules = JsonHighlightRules;
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

    autoOutdent(state: string, session: EditSession, row: number): void {
        this.$outdent.autoOutdent(session, row);
    }

    /**
     * @param session
     * @param callback
     */
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

        try {
            worker.init(this.scriptImports, ACE_WORKER_MODULE_NAME, 'JsonWorker', function (err: any) {
                if (!err) {
                    worker.attachToDocument(session.getDocument());
                    callback(void 0, worker);
                }
                else {
                    callback(err);
                }
            });
        }
        catch (e) {
            callback(e);
        }
    }
}
