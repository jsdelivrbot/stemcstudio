import Range from './Range';
import { clipRows } from './RangeHelpers';

describe("RangeHelpers", function () {
    describe("clipRows", function () {
        const range = new Range(1, 0, 10, 0);
        const firstRow = 3;
        const lastRow = 7;
        const result = clipRows(range, firstRow, lastRow);
        it("should ", function () {
            expect(result.start.row).toBe(5);
        });
    });
});
