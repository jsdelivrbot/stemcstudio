import { DeltaWithFolds } from './DeltaWithFolds';

export interface DeltaGroup {
    /**
     * FIXME: This might also allow 'fold'?
     */
    group: 'doc';

    /**
     * 
     */
    deltas: DeltaWithFolds[];
}
