import { Tokenizer } from './Tokenizer';
import { createSplitterRegexp } from './Tokenizer';
import { removeCapturingGroups } from './Tokenizer';

describe("Tokenizer", function () {
    it("constructor", function () {
        const t = new Tokenizer({});
        expect(t).toBeDefined();
    });
});

describe("createSplitterRegexp", function () {
    it("should...(1)", function () {
        const re = createSplitterRegexp("(a)(b)(?=[x)(])");
        expect(re.source).toBe("^(a)(b)$");
    });
    it("should...(2)", function () {
        const re = createSplitterRegexp("xc(?=([x)(]))");
        expect(re.source).toBe("^xc$");
    });
    it("should...(3)", function () {
        const re = createSplitterRegexp("(xc(?=([x)(])))");
        expect(re.source).toBe("^(xc)$");
    });
    it("should...(4)", function () {
        const re = createSplitterRegexp("(?=r)[(?=)](?=([x)(]))");
        expect(re.source).toBe("^(?=r)[(?=)]$");
    });
    it("should...(5)", function () {
        const re = createSplitterRegexp("(?=r)[(?=)](\\?=t)");
        expect(re.source).toBe("^(?=r)[(?=)](\\?=t)$");
    });
    it("should...(6)", function () {
        const re = createSplitterRegexp("[(?=)](\\?=t)");
        expect(re.source).toBe("^[(?=)](\\?=t)$");
    });
});

describe("removeCapturingGroups", function () {
    it("should add '?:' in appropriate places", function () {
        const re = removeCapturingGroups("(ax(by))[()]");
        expect(re).toBe("(?:ax(?:by))[()]");
    });
});
