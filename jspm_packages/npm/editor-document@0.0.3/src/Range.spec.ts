import { position } from './Position';
import { range } from './Range';

describe("Range", function () {
    const startRow = 1;
    const startColumn = 0;
    const endRow = 5;
    const endColumn = 10;
    const start = position(startRow, startColumn);
    const end = position(endRow, endColumn);
    const r = range(start, end);
    it("test should", function () {
        expect(r.start.row).toBe(startRow);
        expect(r.start.column).toBe(startColumn);
        expect(r.end.row).toBe(endRow);
        expect(r.end.column).toBe(endColumn);
    });
});
