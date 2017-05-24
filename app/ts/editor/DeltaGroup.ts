import { Delta } from './Delta';

export interface DeltaGroup {
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
