export interface MwOptions {
    /**
     * Determines the strategy for synchronization.
     * This is usually fixed. For text use `true`, for numeric/enum use `false`.
     */
    merge: boolean;
    /**
     * Determines whether logging will be verbose.
     */
    verbose: boolean;
}
