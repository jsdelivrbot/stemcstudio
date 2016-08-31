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
     * @property value
     * @type string
     */
    value?: string;

    /**
     * @property caption
     * @type string
     */
    caption?: string;

    /**
     * @property snippet
     * @type string
     */
    snippet?: string;

    /**
     * @property matchMask
     * @type number
     */
    matchMask?: number;

    name?: string;

    /**
     * @property exactMatch
     * @type number
     */
    exactMatch?: number;

    /**
     * @property score
     * @type number
     */
    score?: number;

    /**
     * @property identifierRegex
     * @type RegExp
     */
    identifierRegex?: RegExp;

    /**
     * @property meta
     * @type string
     */
    meta?: string;

    /**
     * An optional completer for a completion that allows the completion to
     * specify how it wants the match to be inserted into the editor.
     */
    completer?: Completer;
}

export default Completion;
