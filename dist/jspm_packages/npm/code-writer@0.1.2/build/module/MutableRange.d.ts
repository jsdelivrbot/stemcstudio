import { MutablePosition } from './MutablePosition';
export declare class MutableRange {
    readonly begin: MutablePosition;
    readonly end: MutablePosition;
    /**
     *
     */
    constructor(begin: MutablePosition, end: MutablePosition);
    offset(rows: number, cols: number): void;
    toString(): string;
}
