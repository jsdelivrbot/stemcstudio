import Range from './Range';

export default function createRange(startRow: number, startColumn: number, endRow: number, endColumn: number): Range {
    return new Range(startRow, startColumn, endRow, endColumn);
}
