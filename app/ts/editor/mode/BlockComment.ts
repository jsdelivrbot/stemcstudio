/**
 *
 */
export interface BlockComment {
    /**
     *
     */
    start: '/*' | '<!--' | '%{' | "'''";

    /**
     *
     */
    end: '*/' | '-->' | '%}' | "'''";
}
