/**
 * @class Diagnostic
 */
interface Diagnostic {

    /**
     * @property message
     * @type string
     */
    message: string;

    /**
     * @property start
     * @type number
     */
    start: number;

    /**
     * @property: length
     * @type number
     */
    length: number;
}

export default Diagnostic;