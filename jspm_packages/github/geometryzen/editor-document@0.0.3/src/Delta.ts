import { Position } from "./Position";

/**
 *
 */
export interface Delta {

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
    lines: string[];

    /**
     *
     */
    start: Position;
}
