//
// https://neil.fraser.name/writing/sync/
// https://code.google.com/archive/p/google-mobwrite/wikis/Protocol.wiki
//
/**
 * The provided content should overwrite the receiver's content.
 */
export const ACTION_RAW_OVERWRITE = 'R';
/**
 * The provided content should only be used to get in synch and should not overwrite the receiver's content.
 */
export const ACTION_RAW_SYNCHONLY = 'r';
/**
 * Request that an edit be made to a previously specified file (used for numeric/enum content).
 */
export const ACTION_DELTA_OVERWRITE = 'D';
/**
 * Request that an edit be merged with a preiously specified file (used for text content).
 */
export const ACTION_DELTA_MERGE = 'd';
/**
 * Nullify. If the server recognizes the file identifier then it should be deleted.
 * Deletion is distinct from saving the empty string in that after a deletion the server stores no state for the file.
 * No answer is expected for a nullification command.
 * The uppercase and lowercase variants are equivaluent.
 */
export const ACTION_NULLIFY_UPPERCASE = 'N';
export const ACTION_NULLIFY_LOWERCASE = 'n';

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
    n?: number;

    /**
     * string is for Raw, string[] is for Delta
     */
    x?: string | string[];
}

export default MwAction;
