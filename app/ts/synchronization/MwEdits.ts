import MwChange from './MwChange';

/**
 * A list of changes to a single file.
 */
interface MwEdits {
    /**
     * The changes to this file.
     */
    x: MwChange[];
}

export default MwEdits;
