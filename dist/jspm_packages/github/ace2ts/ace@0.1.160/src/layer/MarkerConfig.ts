import LayerConfig from "./LayerConfig";

/**
 * @class MarkerConfig
 * @extends LayerConfig
 */
interface MarkerConfig extends LayerConfig {

    /**
     * TODO: Is this distinct from firstRowScreen?
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

export default MarkerConfig
