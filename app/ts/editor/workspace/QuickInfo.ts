import { SymbolDisplayPart } from './SymbolDisplayPart';
import { TextSpan } from './TextSpan';

/**
 *
 */
export interface QuickInfo {

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
    textSpan: TextSpan<number>;

    /**
     *
     */
    displayParts: SymbolDisplayPart[];

    /**
     *
     */
    documentation: SymbolDisplayPart[];
}
