export declare enum ErrorCode {
    /**
     * Unexpected apostrophe.
     */
    E001 = 1,
    /**
     * Unexpected quote.
     */
    E002 = 2,
    /**
     * Unexpected character.
     */
    E003 = 3,
    /**
     * Unexpected digit.
     */
    E004 = 4,
    /**
     * Missing closing apostrophe.
     */
    E005 = 5,
    /**
     * Missing closing quote.
     */
    E006 = 6,
}
export interface CodeAndDesc {
    code: string;
    desc: string;
}
export declare const messages: {
    [code: number]: CodeAndDesc;
};
