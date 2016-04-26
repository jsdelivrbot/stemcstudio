import MarkerConfig from "./MarkerConfig";

/**
 * @class GutterConfig
 * @extends MarkerConfig
 */
interface GutterConfig extends MarkerConfig {

    /**
     * @property minHeight
     * @type number
     */
    minHeight: number;

    /**
     * @property gutterOffset
     * @type number
     */
    gutterOffset: number;

}

export default GutterConfig;
