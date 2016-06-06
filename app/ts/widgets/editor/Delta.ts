import Fold from "./Fold";
import Position from "./Position";

/**
 * @class Delta
 */
interface Delta {

    /**
     * @property action
     * @type string
     */
    action: string;

    /**
     * @property end
     * @type Position
     */
    end: Position;

    /**
     * @property ignore
     * @type boolean
     * @optional
     */
    ignore?: boolean;

    /**
     * @property lines
     * @type string[]
     */
    lines: string[];

    /**
     * @property start
     * @type Position
     */
    start: Position;

    /**
     * @property group
     * @type string
     * @optional
     */
    group?: string;

    /**
     * @property deltas
     * @type Delta[]
     * @optional
     */
    deltas?: Delta[];

    /**
     * @property folds
     * @type Fold[]
     * @optional
     */
    folds?: Fold[];
}

export default Delta;
