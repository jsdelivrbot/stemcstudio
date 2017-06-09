export declare class MutablePosition {
    line: number;
    column: number;
    constructor(line: number, column: number);
    offset(rows: number, cols: number): void;
    toString(): string;
}
