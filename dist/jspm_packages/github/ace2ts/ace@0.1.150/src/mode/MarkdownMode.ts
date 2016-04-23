import TextMode from "./TextMode";
import JavaScriptMode from "./JavaScriptMode";
import XmlMode from "./XmlMode";
import HtmlMode from './HtmlMode';
import MarkdownHighlightRules from './MarkdownHighlightRules';
import MarkdownFoldMode from './folding/MarkdownFoldMode';

/**
 * @class MarkdownMode
 * @extends TextMode
 */
export default class MarkdownMode extends TextMode {
    protected type = "text";
    protected blockComment = { start: "<!--", end: "-->" };
    public $id = "ace/mode/markdown";

    /**
     * @class MarkdownMode
     * @constructor
     * @param workerUrl {string}
     * @param scriptImports {string[]}
     */
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.HighlightRules = MarkdownHighlightRules;

        this.createModeDelegates({
            "js-": JavaScriptMode,
            "xml-": XmlMode,
            "html-": HtmlMode
        });

        this.foldingRules = new MarkdownFoldMode();
    }

    /**
     * @method getLineIndent
     * @param state {string}
     * @param line {string}
     * @param tab {string}
     * @return {string}
     */
    getNextLineIndent(state: string, line: string, tab: string): string {
        if (state === "listblock") {
            const match = /^(\s*)(?:([-+*])|(\d+)\.)(\s+)/.exec(line);
            if (!match) {
                return "";
            }
            let marker = match[2];
            if (!marker) {
                marker = parseInt(match[3], 10) + 1 + ".";
            }
            return match[1] + marker + match[4];
        }
        else {
            return this.$getIndent(line);
        }
    }
}
