/**
 * 
 */
interface Annotation {

    /**
     * @property className
     * @type string
     * @optional
     */
    className?: string;

    /**
     * @property html
     * @type string
     */
    html?: string;

    /**
     * @property row
     * @type number
     */
    row: number;

    /**
     * @property column
     * @type number
     */
    column?: number;

    /**
     * FIXME: If this were a string[] we would have consistency with the Gutter?
     *
     * @property text
     * @type string
     */
    text: string;

    /**
     * "error", "info", or "warning".
     * @property type
     * @type string
     */
    type: string;
}

export default Annotation;
