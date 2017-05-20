import { Highlighter } from './Highlighter';

export interface HighlighterFactory {
    new (highlightRuleConfig?: {}): Highlighter;
}
