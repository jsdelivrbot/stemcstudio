import Range from './Range';

/**
 * @class Tabstop
 */
interface Tabstop extends Array<Range> {
    /**
     * @property firstNonLinked
     * @type Range
     */
    firstNonLinked: Range;

    /**
     * @property hasLinkedRanges
     * @type boolean
     */
    hasLinkedRanges: boolean;

    /**
     * @property value
     * @type string
     */
    value: string | any[];

    /**
     * @property index
     * @type number
     */
    index: number;
}

export default Tabstop;