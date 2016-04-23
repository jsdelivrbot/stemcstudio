import TextMode from "./TextMode";
import CssHighlightRules from "./CssHighlightRules";
import MatchingBraceOutdent from "./MatchingBraceOutdent";
import WorkerClient from "../worker/WorkerClient";
import CssBehaviour from "./behaviour/CssBehaviour";
import CStyleFoldMode from "./folding/CstyleFoldMode";
import Annotation from "../Annotation";
import EditSession from "../EditSession";

/**
 * @class CssMode
 * @extends TextMode
 */
export default class CssMode extends TextMode {
    $id = "ace/mode/css";
    $outdent: MatchingBraceOutdent;
    blockComment = { start: "/*", end: "*/" };

    /**
     * @class CssMode
     * @constructor
     * @param workerUrl {string}
     * @param scriptImports {string[]}
     */
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.HighlightRules = CssHighlightRules;
        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CssBehaviour();
        this.foldingRules = new CStyleFoldMode();
    }


    getNextLineIndent(state: string, line: string, tab: string) {
        let indent = this.$getIndent(line);

        // ignore braces in comments
        const tokens = this.getTokenizer().getLineTokens(line, state).tokens;
        if (tokens.length && tokens[tokens.length - 1].type === "comment") {
            return indent;
        }

        var match = line.match(/^.*\{\s*$/);
        if (match) {
            indent += tab;
        }

        return indent;
    }

    checkOutdent(state: string, line: string, text: string): boolean {
        return this.$outdent.checkOutdent(line, text);
    }

    autoOutdent(state: string, session: EditSession, row: number): number {
        return this.$outdent.autoOutdent(session, row);
    }

    createWorker(session: EditSession, callback: (err: any, worker: WorkerClient) => any): void {

        const workerUrl = this.workerUrl;
        const scriptImports = this.scriptImports;

        const worker = new WorkerClient(workerUrl);

        worker.on('annotations', function(event: { data: Annotation[] }) {
            var annotations: Annotation[] = event.data;
            if (annotations.length > 0) {
                session.setAnnotations(annotations);
            }
            else {
                session.clearAnnotations();
            }
            session._emit("annotations", { data: annotations });
        });

        worker.on("terminate", function() {
            worker.detachFromDocument();
            session.clearAnnotations();
        });

        const moduleName = 'ace-workers.js';
        try {
            worker.init(scriptImports, moduleName, 'CssWorker', function(err: any) {
                if (!err) {
                    worker.attachToDocument(session.getDocument());
                    callback(void 0, worker);
                }
                else {
                    console.warn(`CssWorker $err => ${err}`);
                    callback(err, void 0);
                }
            });
        }
        catch (e) {
            callback(e, void 0);
        }
    }
}
