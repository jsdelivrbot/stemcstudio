import Annotation from "../Annotation";
import TextMode from "./TextMode";
import JavaScriptHighlightRules from "./JavaScriptHighlightRules";
import MatchingBraceOutdent from "./MatchingBraceOutdent";
import WorkerClient from "../worker/WorkerClient";
import CstyleBehaviour from "./behaviour/CstyleBehaviour";
import CStyleFoldMode from "./folding/CstyleFoldMode";
import EditSession from "../EditSession";

/**
 *
 */
export default class JavaScriptMode extends TextMode {
    $outdent: MatchingBraceOutdent;
    blockComment: { start: string; end: string };

    /**
     *
     */
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        // The Tokenizer will be built using these rules.
        this.highlighter = JavaScriptHighlightRules;

        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CStyleFoldMode();
        this.lineCommentStart = "//";
        this.blockComment = { start: "/*", end: "*/" };

        this.$id = "ace/mode/javascript";
    }

    /**
     * @param state
     * @param line
     * @param tab
     */
    getNextLineIndent(state: string, line: string, tab: string): string {
        let indent = this.$getIndent(line);

        const tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        const tokens = tokenizedLine.tokens;
        // Looks like we can have a string or string[] here.
        const endState = tokenizedLine.state;

        // If the type of the last token is a comment, there is no change of indentation.
        if (tokens.length && tokens[tokens.length - 1].type === "comment") {
            return indent;
        }

        if (state === "start" || state === "no_regex") {
            // Indent for case statements or things like opening braces.
            const match = line.match(/^.*(?:\bcase\b.*\:|[\{\(\[])\s*$/);
            if (match) {
                indent += tab;
            }
        }
        else if (state === "doc-start") {
            if (endState === "start" || endState === "no_regex") {
                return "";
            }
            // Indent for block comments.
            const match = line.match(/^\s*(\/?)\*/);
            if (match) {
                if (match[1]) {
                    indent += " ";
                }
                indent += "* ";
            }
        }

        return indent;
    }

    checkOutdent(state: string, line: string, text: string): boolean {
        return this.$outdent.checkOutdent(line, text);
    };

    autoOutdent(state: string, session: EditSession, row: number): void {
        this.$outdent.autoOutdent(session, row);
    };

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
            worker.init(this.scriptImports, moduleName, 'JavaScriptWorker', function (err: any) {
                if (!err) {
                    worker.attachToDocument(session.getDocument());
                    callback(void 0, worker);
                }
                else {
                    console.warn(`JavaScriptWorker init fail: ${err}`);
                    callback(err, void 0);
                }
            });
        }
        catch (e) {
            callback(e, void 0);
        }
    }
}
