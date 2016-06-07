import uniqueId from './uniqueId';

describe("uniqueId", function() {
    it("should be an 8 digit string", function() {
        const id = uniqueId();
        expect(typeof id).toBe('string');
        expect(id.length).toBe(8);
    });
});
