import MarkerConfig from './layer/MarkerConfig';
import MarkerLayer from './layer/MarkerLayer';
import MarkerRenderer from './layer/MarkerRenderer';
import EditSession from './EditSession';
import Range from './Range';

export type MarkerType = 'fullLine' | 'line' | 'text' | 'screenLine';

/**
 *
 */
export interface Marker {

    /**
     *
     */
    clazz: string;

    /**
     *
     */
    id?: number;

    /**
     *
     */
    inFront?: boolean;

    /**
     *
     */
    range?: Range;

    /**
     *
     */
    renderer?: MarkerRenderer;

    /**
     * One of "fullLine", "line", "text", or "screenLine".
     */
    type: MarkerType;

    /**
     *
     */
    update?: (html: (number | string)[], markerLayer: MarkerLayer, session: EditSession, config: MarkerConfig) => void;
}

export default Marker;
