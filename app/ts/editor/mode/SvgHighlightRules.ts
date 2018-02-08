import { JavaScriptHighlightRules } from './JavaScriptHighlightRules';
import { XmlHighlightRules } from './XmlHighlightRules';

export class SvgHighlightRules extends XmlHighlightRules {
    constructor() {
        super();
        this.embedTagRules(JavaScriptHighlightRules, "js-", "script");
        this.normalizeRules();
    }
}
