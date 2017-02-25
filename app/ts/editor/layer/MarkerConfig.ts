import LayerConfig from "./LayerConfig";

/**
 *
 */
interface MarkerConfig extends LayerConfig {

    /**
     * TODO: Is this distinct from firstRowScreen?
     */
    firstRow: number;

    /**
     *
     */
    lastRow: number;

    /**
     *
     */
    characterWidth: number;
}

export default MarkerConfig;
