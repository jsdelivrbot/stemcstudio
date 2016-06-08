import Fold from "./Fold";
import Position from "./Position";

/**
 *
 */
interface Delta {

    /**
     *
     */
    action: 'insert' | 'remove';

    /**
     *
     */
    end: Position;

    /**
     *
     */
    ignore?: boolean;

    /**
     *
     */
    lines: string[];

    /**
     *
     */
    start: Position;

    /**
     *
     */
    folds?: Fold[];
}

export default Delta;
