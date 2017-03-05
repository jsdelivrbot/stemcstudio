import TextMode from './TextMode';
import XmlHighlightRules from './XmlHighlightRules';
import XmlBehaviour from './behaviour/XmlBehaviour';
import XmlFoldMode from './folding/XmlFoldMode';
import { arrayToMap } from '../lib/lang';

const voidElements: string[] = [];

export default class XmlMode extends TextMode {

    protected voidElements: { [name: string]: number };

    protected blockComment = { start: "<!--", end: "-->" };

    public $id = "ace/mode/xml";

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.HighlightRules = XmlHighlightRules;
        this.$behaviour = new XmlBehaviour();
        this.foldingRules = new XmlFoldMode();
        this.voidElements = arrayToMap(voidElements, 1);
    }
}
