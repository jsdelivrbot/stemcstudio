import Delta from './Delta';

interface DeltaGroup {
    /**
     * FIXME: This might also allow 'fold'?
     */
    group: 'doc';

    /**
     * 
     */
    deltas: Delta[];
}

export default DeltaGroup;
