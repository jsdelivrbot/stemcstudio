import { app } from '../../app';
import { ITemplate } from './template';

/**
 * The `templates` service provides starting point doodles.
 * A template is essentially a doodle that is copied.
 */
app.factory('templates', [
    function (): ITemplate[] {

        const CANVAS: ITemplate = {
            name: "canvas",
            description: "HTML5 Canvas (2D Graphics)",
            gistId: 'e4d76915686897969534e3e3d322623c'
        };

        const EIGHT: ITemplate = {
            name: "eight",
            description: "eight - 3D Library",
            gistId: '394d7777f6d3c37bd6fc6a1fe35748bf'
        };

        const THREE: ITemplate = {
            name: "three",
            description: "three.js - 3D Library",
            gistId: 'bc000661a0c371bea96c947527c80ef2'
        };

        const PLOTLY: ITemplate = {
            name: "plotly",
            description: "plotly - Modern Visualization for the Data Era",
            gistId: '8191c1070bc5d68cd223a33f01ce4d53'
        };

        const REACT: ITemplate = {
            name: "react",
            description: "React UI Component Framework",
            gistId: 'a2619810614f8456eb03e4e2e823691e'
        };

        const JASMINE: ITemplate = {
            name: "jasmine",
            description: "Jasmine Testing Framework",
            gistId: '4e8f60648db35d3b0de46ca7e407b86d'
        };

        const JSXGRAPH: ITemplate = {
            name: "jsxgraph",
            description: "JSXGraph - Dynamic Mathematics with JavaScript",
            gistId: 'fed119d51cb5f9a02e7364e7f3b2805e'
        };

        const TWO: ITemplate = {
            name: "two",
            description: "Two.js - 2D drawing api",
            gistId: '7c37b7df818e517aed382323d161756f'
        };

        const WEBGL: ITemplate = {
            name: "webgl",
            description: "WebGL Fundamentals",
            gistId: '1dcbba51432a67156a99774237aa4b16'
        };

        return [EIGHT, PLOTLY, CANVAS, REACT, THREE, JSXGRAPH, JASMINE, WEBGL, TWO];
    }]);
