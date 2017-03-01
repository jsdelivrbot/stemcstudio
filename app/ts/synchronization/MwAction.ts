/**
 * 
 */
interface MwAction {
    c: 'R' | 'r' | 'D' | 'd' | 'N' | 'n';

    /**
     * The local version number that the diff was made from.
     */
    n: number | undefined;

    /**
     * string is for Raw, string[] is for Delta
     */
    x: string | string[] | undefined;
}

export default MwAction;
