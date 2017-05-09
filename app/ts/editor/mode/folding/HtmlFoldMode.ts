import MixedFoldMode from "./MixedFoldMode";
import XmlFoldMode from "./XmlFoldMode";
import CStyleFoldMode from "./CstyleFoldMode";

export interface HtmlElementsMap {
    [name: string]: number;
}

/**
 *
 */
export default class HtmlFoldMode extends MixedFoldMode {
    /**
     * @param voidElements
     * @param optionalTags
     */
    constructor(voidElements: HtmlElementsMap, optionalTags?: HtmlElementsMap) {
        super(new XmlFoldMode(voidElements, optionalTags), { "js-": new CStyleFoldMode(), "css-": new CStyleFoldMode() });
    }
}
