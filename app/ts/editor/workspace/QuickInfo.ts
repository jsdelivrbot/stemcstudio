import SymbolDisplayPart from './SymbolDisplayPart';
import TextSpan from './TextSpan';

/**
 *
 */
interface QuickInfo {

    /**
     *
     */
    kind: string;

    /**
     *
     */
    kindModifiers: string;

    /**
     *
     */
    textSpan: TextSpan;

    /**
     *
     */
    displayParts: SymbolDisplayPart[];

    /**
     *
     */
    documentation: SymbolDisplayPart[];
}

export default QuickInfo;
