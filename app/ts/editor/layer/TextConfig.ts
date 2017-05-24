import { LayerConfig } from "./LayerConfig";

export interface TextConfig extends LayerConfig {

    firstRow: number;

    lastRow: number;

    characterWidth: number;
}
