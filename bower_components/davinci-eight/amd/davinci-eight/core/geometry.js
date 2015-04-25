// The compiler needs the reference comment to find the eightAPI module.
/// <reference path="./things.d.ts" />
// We're using an interface so it vanishes in the generated JavaScript.
define(["require", "exports"], function (require, exports) {
    var geometry = function (spec) {
        var that = {
            primitives: [],
            vertices: [],
            vertexIndices: [],
            colors: [],
            normals: [],
            primitiveMode: function (gl) {
                return gl.TRIANGLES;
            }
        };
        return that;
    };
    return geometry;
});
