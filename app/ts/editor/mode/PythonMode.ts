import Annotation from "../Annotation";
import TextMode from "./TextMode";
import PythonHighlightRules from "./PythonHighlightRules";
import MatchingBraceOutdent from "./MatchingBraceOutdent";
import WorkerClient from "../worker/WorkerClient";
import EditSession from "../EditSession";
import Range from '../Range';
import PythonFoldMode from './folding/PythonFoldMode';

const outdents = {
    "pass": 1,
    "return": 1,
    "raise": 1,
    "break": 1,
    "continue": 1
};

/**
 * @class PythonMode
 * @extends TextMode
 */
export default class PythonMode extends TextMode {
    $outdent: MatchingBraceOutdent;
    blockComment: { start: string; end: string };
    lineCommentStart = "#";
    $id = "ace/mode/python";
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.HighlightRules = PythonHighlightRules;
        this.foldingRules = new PythonFoldMode("\\:");
    }
    getNextLineIndent(state: string, line: string, tab: string): string {
        let indent = this.$getIndent(line);

        const tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        const tokens = tokenizedLine.tokens;

        if (tokens.length && tokens[tokens.length - 1].type === "comment") {
            return indent;
        }

        if (state === "start") {
            const match = line.match(/^.*[\{\(\[\:]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    }

    checkOutdent(state: string, line: string, input: string): boolean {
        if (input !== "\r\n" && input !== "\r" && input !== "\n")
            return false;

        const tokens = this.getTokenizer().getLineTokens(line.trim(), state).tokens;

        if (!tokens)
            return false;

        // ignore trailing comments
        do {
            var last = tokens.pop();
        } while (last && (last.type === "comment" || (last.type === "text" && last.value.match(/^\s+$/))));

        if (!last)
            return false;

        return (last.type === "keyword" && outdents[last.value]);
    }

    autoOutdent(state: string, doc: EditSession, row: number): number {
        // outdenting in python is slightly different because it always applies
        // to the next line and only of a new line is inserted

        row += 1;
        var indent = this.$getIndent(doc.getLine(row));
        var tab = doc.getTabString();
        if (indent.slice(-tab.length) === tab)
            doc.remove(new Range(row, indent.length - tab.length, row, indent.length));
        // TODO
        return 0;
    }

    createWorker(session: EditSession, callback: (err: any, worker: WorkerClient) => any): void {
        const worker = new WorkerClient(this.workerUrl);

        worker.on('annotations', function(event: { data: Annotation[] }) {
            const annotations: Annotation[] = event.data;
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

        // FIXME: Must be able to inject the module name.
        const moduleName = 'ace-workers.js';
        try {
            worker.init(this.scriptImports, moduleName, 'PythonWorker', function(err: any) {
                if (!err) {
                    worker.attachToDocument(session.getDocument());
                    callback(void 0, worker);
                }
                else {
                    console.warn(`PythonWorker init fail: ${err}`);
                    callback(err, void 0);
                }
            });
        }
        catch (e) {
            callback(e, void 0);
        }
    }
}
