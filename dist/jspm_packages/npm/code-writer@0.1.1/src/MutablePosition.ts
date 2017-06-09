
export class MutablePosition {
    constructor(public line: number, public column: number) {
        // TODO
    }
    offset(rows: number, cols: number) {
        this.line += rows;
        this.column += cols;
    }
    toString(): string {
        return `[${this.line}, ${this.column}]`;
    }
}
