import LayerConfig from "./LayerConfig";

interface TextConfig extends LayerConfig {

    firstRow: number;

    lastRow: number;

    characterWidth: number;
}

export default TextConfig;
