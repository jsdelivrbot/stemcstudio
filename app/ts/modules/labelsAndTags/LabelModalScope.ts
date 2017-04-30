/**
 * 
 */
export interface LabelModalScope {

    /**
     * form
     */
    f: {
        /**
         * title
         */
        t: string;
        /**
         * abstract
         */
        a: string;
        /**
         * keywords
         */
        k: string;
    };

    ok(): void;
    submit(): void;
    cancel(): void;
}
