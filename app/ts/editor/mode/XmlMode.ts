import TextMode from './TextMode';
import XmlHighlightRules from './XmlHighlightRules';
import XmlBehaviour from './behaviour/XmlBehaviour';
import XmlFoldMode from './folding/XmlFoldMode';
import { arrayToMap } from '../lib/lang';

const voidElements: string[] = [];

/**
 *
 */
export default class XmlMode extends TextMode {

    /**
     *
     */
    protected voidElements: { [name: string]: number };

    /**
     *
     */
    protected blockComment = { start: "<!--", end: "-->" };

    /**
     *
     */
    public $id = "ace/mode/xml";

    /**
     * @param workerUrl
     * @param scriptImports
     */
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.highlighter = XmlHighlightRules;
        this.$behaviour = new XmlBehaviour();
        this.foldingRules = new XmlFoldMode();
        // What is the significance of the 1, if anything?
        this.voidElements = arrayToMap(voidElements, 1);
    }
}
