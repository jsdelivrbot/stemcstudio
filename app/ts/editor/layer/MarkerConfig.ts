import { LayerConfig } from "./LayerConfig";

/**
 *
 */
export interface MarkerConfig extends LayerConfig {

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
