/**
 * 
 */
export type MwActionType = 'R' | 'r' | 'D' | 'd' | 'N' | 'n';

/**
 * 
 */
export interface MwAction {
    /**
     * The type indicates how the data should be applied.
     */
    c: MwActionType;

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
