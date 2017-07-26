import { arrayToMap } from "../lib/lang";
import { Completion } from "../Completion";
import { Position } from "editor-document";
import { TextMode } from "./TextMode";
import { hookAnnotations, hookTerminate } from './TextMode';
import { JavaScriptMode } from "./JavaScriptMode";
import { CssMode } from "./CssMode";
import { HtmlHighlightRules } from "./HtmlHighlightRules";
import { HtmlBehaviour } from "./behaviour/HtmlBehaviour";
import { HtmlFoldMode } from "./folding/HtmlFoldMode";
import { HtmlCompletions } from "./HtmlCompletions";
import { WorkerClient } from "../worker/WorkerClient";
import { EditSession } from '../EditSession';

// http://www.w3.org/TR/html5/syntax.html#void-elements
const voidElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
const optionalEndTags = ["li", "dt", "dd", "p", "rt", "rp", "optgroup", "option", "colgroup", "td", "th"];

interface VoidElementsMap {
    [name: string]: number;
}

/**
 *
 */
export class HtmlMode extends TextMode {
    private voidElements: VoidElementsMap = arrayToMap(voidElements, 1) as VoidElementsMap;

    /**
     * The name of the element for fragment parsing.
     */
    private fragmentContext: string | undefined;

    $completer: HtmlCompletions;

    constructor(workerUrl: string, scriptImports: string[], options?: { fragmentContext: string }) {
        super(workerUrl, scriptImports);
        this.$id = "HTML";
        this.blockComment = { start: "<!--", end: "-->" };
        this.fragmentContext = options && options.fragmentContext;
        this.HighlightRules = HtmlHighlightRules;
        this.$behaviour = new HtmlBehaviour();
        this.$completer = new HtmlCompletions();

        this.createModeDelegates({ "js-": JavaScriptMode, "css-": CssMode });

        this.foldingRules = new HtmlFoldMode(this.voidElements, arrayToMap(optionalEndTags, 1) as VoidElementsMap);
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

        const worker = new WorkerClient(this.workerUrl);
        const tearDown = hookAnnotations(worker, session, true);
        hookTerminate(worker, session, tearDown);
        // We have a slight exception here due to the setOptions call.
        try {
            worker.init(this.scriptImports, 'stemcstudio-workers.js', 'HtmlWorker', (err: any) => {
                if (!err) {
                    if (session) {
                        worker.attachToSession(session);
                        if (this.fragmentContext) {
                            worker.call("setOptions", [{ context: this.fragmentContext }], function (data: any) {
                                // Do nothing?
                            });
                        }
                        callback(void 0, worker);
                    }
                    else {
                        // We have to do it this way to handle race conditions.
                        callback(new Error("Unable to initialize worker because session is undefined."));
                    }
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
