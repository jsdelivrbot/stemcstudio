import { Completer } from './Completer';

/**
 * TODO: Why do we have caption, value, and name? caption should be enough?
 */
export interface Completion {

    /**
     * 
     */
    className?: string;

    /**
     *
     */
    value?: string;

    /**
     * Caption is required because the CompletionManager sorts based upon the caption.toLowerCase()
     */
    caption: string;

    /**
     *
     */
    matchMask?: number;

    /**
     *
     */
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
