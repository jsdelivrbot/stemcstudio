import Rule from '../Rule';
import HighlighterFactory from './HighlighterFactory';

/**
 * The number possibility enters when using JSX or TSX.
 */
export type HighlighterStackElement = number | string;
export type HighlighterRule = Rule<HighlighterStackElement>;

/**
 *
 */
export interface Highlighter {
    /**
     * Returns the rules for this highlighter.
     */
    getRules(): { [stateName: string]: HighlighterRule[] };

    /**
     * Adds a set of rules, prefixing all state names with the given prefix as "prefix-".
     */
    addRules(rulesByState: { [name: string]: HighlighterRule[] }, prefix?: string): void;
    /**
     * 
     */
    embedRules(highlightRules: HighlighterFactory | { [stateName: string]: HighlighterRule[] }, prefix: string, escapeRules: HighlighterRule[], states?: string[], append?: boolean): void;
    /**
     * 
     */
    getEmbeds(): string[];
    /**
     * 
     */
    getKeywords(): string[];
}

export default Highlighter;
