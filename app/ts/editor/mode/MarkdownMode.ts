import TextMode from "./TextMode";
import JavaScriptMode from "./JavaScriptMode";
import TypeScriptMode from "./TypeScriptMode";
import XmlMode from "./XmlMode";
import HtmlMode from './HtmlMode';
import MarkdownHighlightRules from './MarkdownHighlightRules';
import MarkdownFoldMode from './folding/MarkdownFoldMode';

/**
 *
 */
export default class MarkdownMode extends TextMode {

    protected type = "text";
    protected blockComment = { start: "<!--", end: "-->" };
    public $id = "ace/mode/markdown";

    /**
     *
     */
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.highlighter = MarkdownHighlightRules;

        this.createModeDelegates({
            "ts-": TypeScriptMode,
            "js-": JavaScriptMode,
            "xml-": XmlMode,
            "html-": HtmlMode
        });

        this.foldingRules = new MarkdownFoldMode();
        this.$behaviour = this.$defaultBehaviour;
    }

    /**
     *
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
