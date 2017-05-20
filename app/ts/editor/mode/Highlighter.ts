import { BasicToken } from '../Token';
import { Rule } from '../Rule';
import { HighlighterFactory } from './HighlighterFactory';

/**
 * The basic stack element is simply a string.
 * The number possibility enters when using JSX or TSX.
 */
export type HighlighterToken = BasicToken;
export type HighlighterStackElement = number | string;
export type HighlighterStack = HighlighterStackElement[];
export type HighlighterRule = Rule<HighlighterToken, HighlighterStackElement, HighlighterStack>;

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
