import SymbolDisplayPart from './SymbolDisplayPart';
import TextSpan from './TextSpan';

/**
 * @class QuickInfo
 */
interface QuickInfo {

    /**
     * @property kind
     * @type string
     */
    kind: string;

    /**
     * @property kindModifiers
     * @type string
     */
    kindModifiers: string;

    /**
     * @property textSpan
     * @type TextSpan
     */
    textSpan: TextSpan;

    /**
     * @property displayParts
     * @type SymbolDisplayPart[]
     */
    displayParts: SymbolDisplayPart[];

    /**
     * @property documentation
     * @type SymbolDisplayPart[]
     */
    documentation: SymbolDisplayPart[];
}

export default QuickInfo;
