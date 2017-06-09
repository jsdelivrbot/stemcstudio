/**
 *
 */
export interface BlockComment {
    /**
     *
     */
    start: '/*' | '<!--' | '%{' | "'''" | '{-';

    /**
     *
     */
    end: '*/' | '-->' | '%}' | "'''" | '-}';

    /**
     * 
     */
    nestable?: boolean;
}
