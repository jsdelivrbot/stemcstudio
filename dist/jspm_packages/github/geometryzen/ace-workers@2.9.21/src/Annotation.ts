/**
 *
 */
export interface Annotation {

    /**
     *
     */
    className?: string;

    /**
     *
     */
    html?: string;

    /**
     *
     */
    row: number;

    /**
     *
     */
    column?: number;

    /**
     * FIXME: If this were a string[] we would have consistency with the Gutter?
     */
    text: string;

    /**
     * "error", "info", or "warning".
     */
    type: string;
}
