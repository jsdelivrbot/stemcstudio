System.register(['src/mode/glsl/NodeWalker', 'src/mode/glsl/DefaultNodeEventHandler', 'src/mode/glsl/parse'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var NodeWalker_1, DefaultNodeEventHandler_1, parse_1;
    var vertexShaderSrc;
    return {
        setters:[
            function (NodeWalker_1_1) {
                NodeWalker_1 = NodeWalker_1_1;
            },
            function (DefaultNodeEventHandler_1_1) {
                DefaultNodeEventHandler_1 = DefaultNodeEventHandler_1_1;
            },
            function (parse_1_1) {
                parse_1 = parse_1_1;
            }],
        execute: function() {
            vertexShaderSrc = [
                "attribute vec3 aVertexPosition, aVertexThing;",
                "attribute vec3 aVertexColor;",
                "attribute vec3 aVertexNormal;",
                "",
                "uniform mat4 uMVMatrix;",
                "uniform mat3 uNormalMatrix;",
                "uniform mat4 uPMatrix;",
                "",
                "varying highp vec4 vColor;",
                "varying highp vec3 vLight;",
                "",
                "void main(void) {",
                "  gl_Position = aVertexPosition;",
                "}"
            ].join("");
            describe("NodeWalker", function () {
                it("constructor", function () {
                    var walker = new NodeWalker_1.default();
                    var handler = new DefaultNodeEventHandler_1.default();
                    var program = parse_1.default(vertexShaderSrc);
                    walker.walk(program, handler);
                    expect(1).toBe(1);
                });
            });
        }
    }
});
