import app from '../../app';
import Doodle from '../doodles/Doodle';
import ITemplate from './ITemplate';
import ITemplateFile from './ITemplateFile';
import IUuidService from '../uuid/IUuidService';
import modeFromName from '../../utils/modeFromName';

// import BOOTSTRAP_HTML from './BOOTSTRAP_HTML';
// import BOOTSTRAP_CODE from './BOOTSTRAP_CODE';
// import BOOTSTRAP_LIBS from './BOOTSTRAP_LIBS';
// import BOOTSTRAP_LESS from './BOOTSTRAP_LESS';

import EIGHTJS_HTML from './EIGHTJS_HTML';
import EIGHTJS_CODE from './EIGHTJS_CODE';
import EIGHTJS_LIBS from './EIGHTJS_LIBS';
import EIGHTJS_LESS from './EIGHTJS_LESS';

import MINIMAL_HTML from './MINIMAL_HTML';
import MINIMAL_BOOTSTRAP from './MINIMAL_BOOTSTRAP';
import MINIMAL_GREETING from './MINIMAL_GREETING';
import MINIMAL_CSS from './MINIMAL_CSS';
import MINIMAL_README from './MINIMAL_README';

import SINGLE_VIEW_HTML from './SINGLE_VIEW_HTML';
import SINGLE_VIEW_CODE from './SINGLE_VIEW_CODE';
import SINGLE_VIEW_LIBS from './SINGLE_VIEW_LIBS';
import SINGLE_VIEW_LESS from './SINGLE_VIEW_LESS';

/**
 * The `templates` service provides starting point doodles.
 * A template is essentially a doodle that is copied.
 */
app.factory('templates', [
    '$location',
    'uuid4',
    'CODE_MARKER',
    'LIBS_MARKER',
    'STYLE_MARKER',
    'SCRIPTS_MARKER',
    'FILENAME_HTML',
    'FILENAME_CODE',
    'FILENAME_LIBS',
    'FILENAME_LESS',
    function(
        $location: angular.ILocationService,
        uuid: IUuidService,
        CODE_MARKER: string,
        LIBS_MARKER: string,
        STYLE_MARKER: string,
        SCRIPTS_MARKER: string,
        FILENAME_HTML: string,
        FILENAME_CODE: string,
        FILENAME_LIBS: string,
        FILENAME_LESS: string
    ): ITemplate[] {

        function makeFiles(html: string, code: string, libs: string, less: string): { [name: string]: ITemplateFile } {
            const files: { [name: string]: ITemplateFile } = {}
            files[FILENAME_HTML] = { content: html, language: modeFromName(FILENAME_HTML) }
            files[FILENAME_CODE] = { content: code, language: modeFromName(FILENAME_CODE) }
            files[FILENAME_LIBS] = { content: libs, language: modeFromName(FILENAME_LIBS) }
            files[FILENAME_LESS] = { content: less, language: modeFromName(FILENAME_LESS) }
            return files
        }

        function newLine(s: string) { return s + "\n" }
        function indent(s: string) { return "    " + s }

        function styleMarker(): string { return ['<style>', STYLE_MARKER, '</style>'].map(indent).map(newLine).join(""); }
        function scriptsMarker(): string { return [SCRIPTS_MARKER].map(indent).map(newLine).join(""); }
        function codeMarker(): string { return ['<script>', CODE_MARKER, '</script>'].map(indent).map(newLine).join(""); }
        function libsMarker(): string { return ['<script>', LIBS_MARKER, '</script>'].map(indent).map(newLine).join(""); }

        const HTML_TEMPLATE_CALCULATION = "" +
            "<!doctype html>\n" +
            "<html>\n" +
            "  <head>\n" +
            styleMarker() +
            scriptsMarker() +
            "  </head>\n" +
            "  <body>\n" +
            "    <pre id='info'></pre>\n" +
            libsMarker() +
            codeMarker() +
            "  </body>\n" +
            "</html>\n";

        const CODE_TEMPLATE_CALCULATION = [
            "/**",
            " * Executed when the DOM is ready...",
            " */",
            "function main() {",
            "  const g = -9.81 * e3 * newton / kilogram",
            "  const mass = 70 * kilogram",
            "  const F = mass * g",
            "  const d = -2 * e3 * meter",
            "  const W = F << d",
            "",
            "  printvar('g', g)",
            "  printvar('g.direction()', g.direction())",
            "  printvar('g.magnitude()', g.magnitude())",
            "  printvar('mass', mass)",
            "  printvar('F = mass * g', F.toFixed(2))",
            "  printvar('d', d)",
            "  printvar('W = F << d', W.toPrecision(6))",
            "}",
            ""
        ].join('\n');

        const LIBS_TEMPLATE_CALCULATION = [
            "// Create shortcuts for some values.",
            "const e1 = EIGHT.G3.e1",
            "const e2 = EIGHT.G3.e2",
            "const e3 = EIGHT.G3.e3",
            "const meter    = EIGHT.G3.meter",
            "const kilogram = EIGHT.G3.kilogram",
            "const second   = EIGHT.G3.second",
            "const coulomb  = EIGHT.G3.coulomb",
            "const ampere   = EIGHT.G3.ampere",
            "const kelvin   = EIGHT.G3.kelvin",
            "const mole     = EIGHT.G3.mole",
            "const candela  = EIGHT.G3.candela",
            "const newton   = meter * kilogram / (second * second)",
            "const joule    = newton * meter",
            "const volt     = joule / coulomb",
            "",
            "// Wait for the DOM to be loaded.",
            "DomReady.ready(function() {",
            "  try {",
            "    main();",
            "  }",
            "  catch(e) {",
            "    function colorize(arg: any, color: string) {",
            "      return \"<span style='color:\"+color+\"'>\" + arg + \"</span>\";",
            "    }",
            "    println(colorize(e.message, 'red'));",
            "  }",
            "});",
            "",
            "/**",
            " * Print the HTML string without a line ending.",
            " */",
            "function print(html: string): void {",
            "  const element = document.getElementById('info');",
            "  element.innerHTML = element.innerHTML + html;",
            "}",
            "",
            "/**",
            " * Print the HTML string and go to the next line.",
            " */",
            "function println(html: string): void {",
            "  print(html + '\\n');",
            "}",
            "",
            "/**",
            " * Print the value of a variable.",
            " */",
            "function printvar(name: string, value): void {",
            "  println('<b>' + name + '</b> => ' + value);",
            "}",
            ""
        ].join('\n');

        const LESS_TEMPLATE_CALCULATION = [
            "body {",
            "  background-color: #000000;",
            "}",
            "",
            "#info {",
            "  position: absolute;",
            "  left: 20px;",
            "  top: 20px;",
            "  font-size: 26px;",
            "  color: #00FF00;",
            "}"
        ].join('\n');

        const HTML_TEMPLATE_JSXGRAPH_DEMO = "" +
            "<!doctype html>\n" +
            "<html>\n" +
            "  <head>\n" +
            styleMarker() +
            scriptsMarker() +
            "  </head>\n" +
            "  <body>\n" +
            "    <div id='box' class='jxgbox' style='width:500px; height:500px'></div>\n" +
            "    <ul>\n" +
            "      <li>\n" +
            "        <a href='http://jsxgraph.uni-bayreuth.de' target='_blank' class='JXGtext'>JSXGraph Home Page</a>\n" +
            "      </li>\n" +
            "    </ul>\n" +
            libsMarker() +
            codeMarker() +
            "  </body>\n" +
            "</html>\n";

        const CODE_TEMPLATE_JSXGRAPH_DEMO = "" +
            "var graph = JXG.JSXGraph;\n" +
            "var brd = JXG.JSXGraph.initBoard('box',{boundingbox:[-5,5,5,-5], keepaspectratio:true, axis:true});\n" +
            "var i;\n" +
            "var p: JXG.Point[] = [];\n" +
            "var angle: number;\n" +
            "var co: number;\n" +
            "var si: number;\n" +
            "/**\n" +
            " * Parameter affecting the spread of the points around the circle.\n" +
            " */\n" +
            "var delta = 0.8;\n" +
            "\n" +
            "// Random points are constructed which lie roughly on a circle\n" +
            "// of radius 4 having the origin as center.\n" +
            "// delta*0.5 is the maximal distance in x- and y- direction of the random\n" +
            "// points from the circle line.\n" +
            "brd.suspendUpdate();\n" +
            "for (i=0;i<10;i++) {\n" +
            "  angle = Math.random()*2*Math.PI;\n" +
            "\n" +
            "  co = 4*Math.cos(angle)+delta*(Math.random()-0.5);\n" +
            "  si = 4*Math.sin(angle)+delta*(Math.random()-0.5);\n" +
            "  p.push(brd.create('point',[co, si], {withLabel:false}));\n" +
            "}\n" +
            "brd.unsuspendUpdate();\n" +
            "\n" +
            "// Having constructed the points, we can fit a circle\n" +
            "// through the point set, consisting of n points.\n" +
            "// The (n times 3) matrix consists of\n" +
            "//   x_1, y_1, 1\n" +
            "//   x_2, y_2, 1\n" +
            "//\n" +
            "//   x_n, y_n, 1\n" +
            "// where x_i, y_i is the position of point p_i\n" +
            "// The vector y of length n consists of\n" +
            "//    x_i*x_i+y_i*y_i\n" +
            "// for i=1,...n\n" +
            "var M: number[][] = [];\n" +
            "var y: number[] = [];\n" +
            "var n = p.length;\n" +
            "\n" +
            "for (i=0;i<n;i++) {\n" +
            "  M.push([p[i].X(), p[i].Y(), 1.0]);\n" +
            "  y.push(p[i].X()*p[i].X() + p[i].Y()*p[i].Y());\n" +
            "}\n" +
            "\n" +
            "// Now, the general linear least-square fitting problem\n" +
            "//    min_z || M*z - y||_2^2\n" +
            "// is solved by solving the system of linear equations\n" +
            "//    (M^T*M) * z = (M^T*y)\n" +
            "// with Gauss elimination.\n" +
            "var MT = JXG.Math.transpose(M);\n" +
            "var B = JXG.Math.matMatMult(MT, M);\n" +
            "var c = JXG.Math.matVecMult(MT, y);\n" +
            "var z = JXG.Math.Numerics.Gauss(B, c);\n" +
            "\n" +
            "// Finally, we can read from the solution vector z the coordinates [xm, ym] of the center\n" +
            "// and the radius r and draw the circle.\n" +
            "var xm = z[0]*0.5;\n" +
            "var ym = z[1]*0.5;\n" +
            "var r = Math.sqrt(z[2]+xm*xm+ym*ym);\n" +
            "\n" +
            "brd.create('circle',[ [xm,ym], r]);\n";

        const LIBS_TEMPLATE_JSXGRAPH_DEMO = "";

        const LESS_TEMPLATE_JSXGRAPH_DEMO = "" +
            ".jxgbox {\n" +
            "  position: relative;\n" +
            "  overflow: hidden;\n" +
            "  background-color: #ffffff;\n" +
            "  border-style: solid;\n" +
            "  border-width: 1px;\n" +
            "  border-color: #356AA0;\n" +
            "  border-radius: 6px;\n" +
            "  -webkit-border-radius: 6px;\n" +
            "  -ms-touch-action: none;\n" +
            "}\n" +
            "\n" +
            ".JXGtext {\n" +
            "  background-color: transparent;\n" +
            "  font-family: Arial, Helvetica, Geneva, sans-serif;\n" +
            "  padding: 0;\n" +
            "  margin: 0;\n" +
            "}\n" +
            "\n" +
            ".JXGinfobox {\n" +
            "  border-style: none;\n" +
            "  border-width: 1px;\n" +
            "  border-color: black;\n" +
            "}\n" +
            "\n" +
            ".JXGimage {\n" +
            "  opacity: 1.0;\n" +
            "}\n" +
            "\n" +
            ".JXGimageHighlight {\n" +
            "  opacity: 0.6;\n" +
            "}\n";

        const width = 600
        const height = 600
        // The following canvasId matches the default used in Eight.Js
        const canvasId = 'canvas'

        const T0: ITemplate = new Doodle()
        T0.uuid = uuid.generate()
        T0.description = "EightJS — 3D Library for WebGL Graphics and Geometric Algebra"
        T0.files = makeFiles(
            EIGHTJS_HTML(styleMarker, scriptsMarker, libsMarker, codeMarker, width, height, canvasId),
            EIGHTJS_CODE(width, height, canvasId, true, true),
            EIGHTJS_LIBS(),
            EIGHTJS_LESS(width, height))
        T0.dependencies = ['stats.js', 'dat-gui', 'davinci-eight']

        const T1: ITemplate = new Doodle()
        T1.uuid = uuid.generate()
        T1.description = "SingleViewApp — Template for WebGL Graphics and Geometric Algebra"
        T1.files = makeFiles(
            SINGLE_VIEW_HTML(styleMarker, scriptsMarker, libsMarker, codeMarker, width, height, canvasId),
            SINGLE_VIEW_CODE(width, height, 'canvas', true, true),
            SINGLE_VIEW_LIBS(),
            SINGLE_VIEW_LESS(width, height))
        T1.dependencies = ['stats.js', 'dat-gui', 'davinci-eight']

        const T2: ITemplate = new Doodle()
        T2.uuid = uuid.generate()
        T2.description = "Geometric Algebra and Unit of Measure calculations using EIGHT"
        T2.files = makeFiles(
            HTML_TEMPLATE_CALCULATION,
            CODE_TEMPLATE_CALCULATION,
            LIBS_TEMPLATE_CALCULATION,
            LESS_TEMPLATE_CALCULATION)
        T2.dependencies = ['DomReady', 'davinci-eight']

        const T3: Doodle = new Doodle()
        T3.uuid = uuid.generate()
        T3.description = "Getting Started"
        T3.files = {}
        T3.newFile(FILENAME_HTML).content = MINIMAL_HTML()
        T3.newFile('bootstrap.ts').content = MINIMAL_BOOTSTRAP()
        T3.newFile('greeting.ts').content = MINIMAL_GREETING()
        T3.newFile('style.css').content = MINIMAL_CSS()
        T3.newFile('README.md').content = MINIMAL_README()
        T3.dependencies = []

        const T4: ITemplate = new Doodle()
        T4.uuid = uuid.generate()
        T4.description = "JSXGraph — 2D Library for Geometry"
        T4.files = makeFiles(
            HTML_TEMPLATE_JSXGRAPH_DEMO,
            CODE_TEMPLATE_JSXGRAPH_DEMO,
            LIBS_TEMPLATE_JSXGRAPH_DEMO,
            LESS_TEMPLATE_JSXGRAPH_DEMO)
        T4.dependencies = ['jsxgraph']

        return [T3, T0, T2, T4];
    }]);
