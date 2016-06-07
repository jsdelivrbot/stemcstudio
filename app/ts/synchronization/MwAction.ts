/**
 * 
 */
interface MwAction {
    c: 'R' | 'r' | 'D' | 'd' | 'N' | 'n';

    /**
     * The local version number that the diff was made from.
     */
    n: number;

    /**
     * string is for Raw, string[] is for Delta
     */
    x: string | string[];
}

export default MwAction;
