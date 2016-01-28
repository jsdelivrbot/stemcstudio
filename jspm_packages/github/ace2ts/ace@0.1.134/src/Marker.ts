import MarkerConfig from './layer/MarkerConfig';
import MarkerLayer from './layer/MarkerLayer';
import MarkerRenderer from './layer/MarkerRenderer';
import EditSession from './EditSession';
import Range from './Range';

/**
 * @class Marker
 */
interface Marker {

  /**
   * @property clazz
   * @type string
   */
  clazz: string;

  /**
   * @property id
   * @type number
   * @optional
   */
  id?: number;

  /**
   * @property inFront
   * @type boolean
   * @optional
   */
  inFront?: boolean;

  /**
   * @property range
   * @type Range
   */
  range?: Range;

  /**
   * @property renderer
   * @type MarkerRenderer
   */
  renderer?: MarkerRenderer;

  /**
   * One of "fullLine", "line", "text", or "screenLine".
   *
   * @property type
   * @type string
   */
  type: string;

  /**
   * @property update
   * @type (html: (number | string)[], markerLayer: MarkerLayer, session: EditSession, config: MarkerConfig) => void
   * @optional
   */
  update?: (html: (number | string)[], markerLayer: MarkerLayer, session: EditSession, config: MarkerConfig) => void;
}

export default Marker;