import Position from '../Position';

/**
 * @class AnchorChangeEvent
 */
interface AnchorChangeEvent {

  /**
   * @property oldPosition
   * @type Position
   */
  oldPosition: Position;

  /**
   * @property position
   * @type Position
   */
  position: Position;
}

export default AnchorChangeEvent;
