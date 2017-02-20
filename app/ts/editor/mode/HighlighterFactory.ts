import Highlighter from './Highlighter';

export interface HighlighterFactory {
    new (): Highlighter;
}

export default HighlighterFactory;
