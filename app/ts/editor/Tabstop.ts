import Range from './Range';

/**
 *
 */
interface Tabstop extends Array<Range> {

    /**
     *
     */
    firstNonLinked: Range;

    /**
     *
     */
    hasLinkedRanges: boolean;

    /**
     *
     */
    value: string | any[];

    /**
     *
     */
    index: number;
}

export default Tabstop;
