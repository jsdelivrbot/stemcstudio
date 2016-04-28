/**
 * @class Token
 */
interface Token {

    /**
     * @property start
     * @type number
     */
    start?: number;

    /**
     * @property type
     * @type string
     */
    type: string;

    /**
     * @property value
     * @type string
     */
    value: string;

    /**
     * @property index
     * @type number
     */
    index?: number;
}

export default Token;