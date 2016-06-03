import MwChange from './MwChange';

interface MwEdit {

    /**
     * The source node identifier.
     */
    s: string;

    /**
     * The destination node identifier.
     * TODO: Does this parameter make sense?
     * When we ask for edits we ask by nodeId.
     */
    t: string;

    /**
     * 
     */
    x: MwChange[];
}

export default MwEdit;
