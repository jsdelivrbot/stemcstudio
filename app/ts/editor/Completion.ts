import Completer from './autocomplete/Completer';

/**
 *
 */
interface Completion {

    /**
     * 
     */
    className?: string;

    /**
     *
     */
    value?: string;

    /**
     *
     */
    caption?: string;

    /**
     *
     */
    snippet?: string;

    /**
     *
     */
    matchMask?: number;

    name?: string;

    /**
     *
     */
    exactMatch?: number;

    /**
     *
     */
    score?: number;

    /**
     *
     */
    identifierRegex?: RegExp;

    /**
     *
     */
    meta?: string;

    /**
     * An optional completer for a completion that allows the completion to
     * specify how it wants the match to be inserted into the editor.
     */
    completer?: Completer;
}

export default Completion;
