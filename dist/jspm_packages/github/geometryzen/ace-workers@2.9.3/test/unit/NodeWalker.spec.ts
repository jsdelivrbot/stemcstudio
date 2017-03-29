import NodeWalker from 'src/mode/glsl/NodeWalker';
import DefaultNodeEventHandler from 'src/mode/glsl/DefaultNodeEventHandler';
import parse from 'src/mode/glsl/parse';
import Node from 'src/mode/glsl/Node';

const vertexShaderSrc = [
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

xdescribe("NodeWalker", function () {
    it("constructor", function () {
        const walker = new NodeWalker();
        const handler = new DefaultNodeEventHandler();
        const program = <Node>parse(vertexShaderSrc);
        walker.walk(program, handler);
        expect(1).toBe(1);
    });
});
