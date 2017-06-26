import { position } from './Position';
import { comparePositions } from './Position';
import { equalPositions } from './Position';

describe("Position", function () {
    it("constructor", function () {
        const p = position(2, 3);
        expect(p.row).toBe(2);
        expect(p.column).toBe(3);
    });
    it("comparePositions", function () {
        const p0 = position(2, 1);
        const p1 = position(2, 3);
        const p2 = position(3, 1);
        const p3 = position(3, 1);
        expect(comparePositions(p0, p0)).toBe(0);
        expect(comparePositions(p0, p1)).toBe(-1);
        expect(comparePositions(p0, p2)).toBe(-1);
        expect(comparePositions(p0, p3)).toBe(-1);
        expect(comparePositions(p1, p0)).toBe(1);
        expect(comparePositions(p2, p0)).toBe(1);
        expect(comparePositions(p3, p0)).toBe(1);
    });
    it("equalPositions", function () {
        const p0 = position(2, 1);
        const p1 = position(2, 3);
        const p2 = position(3, 1);
        const p3 = position(3, 1);
        expect(equalPositions(p0, p0)).toBe(true);
        expect(equalPositions(p0, p1)).toBe(false);
        expect(equalPositions(p0, p2)).toBe(false);
        expect(equalPositions(p0, p3)).toBe(false);
    });
});
