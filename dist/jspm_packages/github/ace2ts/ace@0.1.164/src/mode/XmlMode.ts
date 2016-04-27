import TextMode from './TextMode';
import XmlHighlightRules from './XmlHighlightRules';
import XmlBehaviour from './behaviour/XmlBehaviour';
import XmlFoldMode from './folding/XmlFoldMode';
import {arrayToMap} from '../lib/lang';

const voidElements: string[] = [];

/**
 * @class XmlMode
 * @extends TextMode
 */
export default class XmlMode extends TextMode {

    /**
     * @property voidElements
     * @type name => number
     * @protected
     */
    protected voidElements: { [name: string]: number };

    /**
     * @property blockComment
     * @type {start: string; end: string}
     * @protected
     */
    protected blockComment = { start: "<!--", end: "-->" };

    /**
     * @property $id
     * @type string
     */
    public $id = "ace/mode/xml";

    /**
     * @class XmlMode
     * @constructor
     * @param workerUrl {string}
     * @param scriptImports {string[]}
     */
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.HighlightRules = XmlHighlightRules;
        this.$behaviour = new XmlBehaviour();
        this.foldingRules = new XmlFoldMode();
        // What is the significance of the 1, if anything?
        this.voidElements = arrayToMap(voidElements, 1);
    }
}
