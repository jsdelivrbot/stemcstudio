import LayerConfig from "./LayerConfig";

/**
 * @class CursorConfig
 * @extends LayerConfig
 */
interface CursorConfig extends LayerConfig {

    /**
     * @property characterWidth
     * @type number
     */
    characterWidth: number;

    /**
     * @property height
     * @type number
     */
    height: number;

    /**
     * @property offset
     * @type number
     */
    offset: number;
}

export default CursorConfig;
