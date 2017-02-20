import Rule from '../Rule';
import HighlighterFactory from './HighlighterFactory';

/**
 *
 */
export interface Highlighter {
    /**
     * Returns the rules for this highlighter.
     */
    getRules(): { [stateName: string]: Rule[] };

    /**
     * Adds a set of rules, prefixing all state names with the given prefix as "prefix-".
     */
    addRules(rulesByState: { [name: string]: Rule[] }, prefix?: string): void;
    /**
     * 
     */
    embedRules(highlightRules: HighlighterFactory | { [stateName: string]: Rule[] }, prefix: string, escapeRules: Rule[], states?: string[], append?: boolean): void;
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
