import { MixedFoldMode } from "./MixedFoldMode";
import { XmlFoldMode } from "./XmlFoldMode";
import { CstyleFoldMode } from "./CstyleFoldMode";

export interface HtmlElementsMap {
    [name: string]: number;
}

/**
 *
 */
export class HtmlFoldMode extends MixedFoldMode {
    /**
     * @param voidElements
     * @param optionalTags
     */
    constructor(voidElements: HtmlElementsMap, optionalTags?: HtmlElementsMap) {
        super(new XmlFoldMode(voidElements, optionalTags), { "js-": new CstyleFoldMode(), "css-": new CstyleFoldMode() });
    }
}
