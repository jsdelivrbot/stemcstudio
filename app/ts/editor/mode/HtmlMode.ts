import { arrayToMap } from "../lib/lang";
import Annotation from "../Annotation";
import Completion from "../Completion";
import Position from "../Position";
import TextMode from "./TextMode";
import JavaScriptMode from "./JavaScriptMode";
import CssMode from "./CssMode";
import HtmlHighlightRules from "./HtmlHighlightRules";
import HtmlBehaviour from "./behaviour/HtmlBehaviour";
import HtmlFoldMode from "./folding/HtmlFoldMode";
import HtmlCompletions from "./HtmlCompletions";
import WorkerClient from "../worker/WorkerClient";
import EditSession from "../EditSession";

// http://www.w3.org/TR/html5/syntax.html#void-elements
const voidElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
const optionalEndTags = ["li", "dt", "dd", "p", "rt", "rp", "optgroup", "option", "colgroup", "td", "th"];

/**
 *
 */
export default class HtmlMode extends TextMode {
    private voidElements: { [name: string]: number } = arrayToMap(voidElements, 1);

    /**
     * The name of the element for fragment parsing.
     */
    private fragmentContext: string | undefined;

    $completer: HtmlCompletions;

    constructor(workerUrl: string, scriptImports: string[], options?: { fragmentContext: string }) {
        super(workerUrl, scriptImports);
        this.$id = "ace/mode/html";
        this.blockComment = { start: "<!--", end: "-->" };
        this.fragmentContext = options && options.fragmentContext;
        this.HighlightRules = HtmlHighlightRules;
        this.$behaviour = new HtmlBehaviour();
        this.$completer = new HtmlCompletions();

        this.createModeDelegates({ "js-": JavaScriptMode, "css-": CssMode });

        this.foldingRules = new HtmlFoldMode(this.voidElements, arrayToMap(optionalEndTags, 1));
    }

    getNextLineIndent(state: string, line: string, tab: string): string {
        return this.$getIndent(line);
    }

    checkOutdent(state: string, line: string, text: string): boolean {
        return false;
    }

    getCompletions(state: string, session: EditSession, pos: Position, prefix: string): Completion[] {
        return this.$completer.getCompletions(state, session, pos, prefix);
    }

    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient | undefined) => any): void {

        const workerUrl = this.workerUrl;
        const scriptImports = this.scriptImports;

        const worker = new WorkerClient(workerUrl);

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
            worker.init(scriptImports, moduleName, 'HtmlWorker', (err: any) => {
                if (!err) {
                    worker.attachToDocument(session.docOrThrow());
                    if (this.fragmentContext) {
                        worker.call("setOptions", [{ context: this.fragmentContext }], function (data: any) {
                            // Do nothing?
                        });
                    }
                    callback(void 0, worker);
                }
                else {
                    console.warn(`HtmlWorker init failed: ${err}`);
                    callback(err);
                }
            });
        }
        catch (e) {
            callback(e);
        }
    }
}
