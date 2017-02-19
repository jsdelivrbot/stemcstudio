import MixedFoldMode from "./MixedFoldMode";
import XmlFoldMode from "./XmlFoldMode";
import CStyleFoldMode from "./CstyleFoldMode";

/**
 *
 */
export default class HtmlFoldMode extends MixedFoldMode {
    /**
     * @param voidElements
     * @param optionalTags
     */
    constructor(voidElements: { [name: string]: number }, optionalTags?: { [name: string]: number }) {
        super(new XmlFoldMode(voidElements, optionalTags), { "js-": new CStyleFoldMode(), "css-": new CStyleFoldMode() });
    }
}
