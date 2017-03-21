import hyphenate from './hyphenate';

describe("hyphenate", function () {
    it("should convert to lower case", function () {
        expect(hyphenate("FooBar")).toBe("foobar");
    });
    it("should trim leading spaces", function () {
        expect(hyphenate(" FooBar")).toBe("foobar");
    });
    it("should trim trailing spaces", function () {
        expect(hyphenate("FooBar ")).toBe("foobar");
    });
    it("should convert space to hyphens", function () {
        expect(hyphenate("foo bar")).toBe("foo-bar");
    });
    it("should convert multiple spaces to hyphens and convert to lower case", function () {
        expect(hyphenate("My Fabulous Project")).toBe("my-fabulous-project");
    });
});
