import LayerConfig from "./LayerConfig";

/**
 * @class TextConfig
 * @extends LayerConfig
 */
interface TextConfig extends LayerConfig {

    /**
     * @property firstRow
     * @type number
     */
    firstRow: number;

    /**
     * @property lastRow
     * @type number
     */
    lastRow: number;

    /**
     * @property characterWidth
     * @type number
     */
    characterWidth: number;
}

export default TextConfig
