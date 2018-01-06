import { Range } from '../editor/Range';

describe("Range", function () {
    const startRow = 1;
    const startColumn = 0;
    const endRow = 5;
    const endColumn = 10;
    const range = new Range(startRow, startColumn, endRow, endColumn);
    it("test should", function () {
        expect(range.start.row).toBe(startRow);
        expect(range.start.column).toBe(startColumn);
        expect(range.end.row).toBe(endRow);
        expect(range.end.column).toBe(endColumn);
    });
});
