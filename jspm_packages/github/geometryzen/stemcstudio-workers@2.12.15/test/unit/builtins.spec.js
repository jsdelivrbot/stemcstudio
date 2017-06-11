System.register(["../../src/mode/glsl/builtins"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var builtins_1;
    return {
        setters: [
            function (builtins_1_1) {
                builtins_1 = builtins_1_1;
            }
        ],
        execute: function () {
            describe("glsl/builtins", function () {
                it("does not contain jabberwocky", function () {
                    expect(builtins_1.default.indexOf('jabberwocky') >= 0).toBe(false);
                });
                it("contains gl_Position", function () {
                    expect(builtins_1.default.indexOf('gl_Position') >= 0).toBe(true);
                });
                it("contains gl_PointSize", function () {
                    expect(builtins_1.default.indexOf('gl_PointSize') >= 0).toBe(true);
                });
            });
        }
    };
});
