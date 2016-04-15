/**
 * @class CompletionEntry
 */
interface CompletionEntry {

    /**
     * @property name
     * @type string
     */
    name: string;

    /**
     * "property", or "method".
     *
     * @property kind
     * @type string
     */
    kind: string;

    /**
     * @property kindModifiers
     * @type string
     */
    kindModifiers: string;

    /**
     * @property sortText
     * @type string
     */
    sortText: string;
}

export default CompletionEntry;