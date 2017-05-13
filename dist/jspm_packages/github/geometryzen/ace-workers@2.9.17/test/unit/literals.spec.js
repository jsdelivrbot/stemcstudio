System.register(["src/mode/glsl/literals"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var literals_1;
    return {
        setters: [
            function (literals_1_1) {
                literals_1 = literals_1_1;
            }
        ],
        execute: function () {
            describe("literals", function () {
                it("does not contain jabberwocky", function () {
                    expect(literals_1.default.indexOf('jabberwocky') >= 0).toBe(false);
                });
                it("contains precision", function () {
                    expect(literals_1.default.indexOf('precision') >= 0).toBe(true);
                });
                it("contains vec3", function () {
                    expect(literals_1.default.indexOf('vec3') >= 0).toBe(true);
                });
            });
        }
    };
});
