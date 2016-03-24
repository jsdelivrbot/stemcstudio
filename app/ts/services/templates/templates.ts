import app from '../../app';
import IDoodle from '../doodles/IDoodle';
import IUuidService from '../uuid/IUuidService';

// import BOOTSTRAP_HTML from './BOOTSTRAP_HTML';
// import BOOTSTRAP_CODE from './BOOTSTRAP_CODE';
// import BOOTSTRAP_LIBS from './BOOTSTRAP_LIBS';
// import BOOTSTRAP_LESS from './BOOTSTRAP_LESS';

import EIGHTJS_HTML from './EIGHTJS_HTML';
import EIGHTJS_CODE from './EIGHTJS_CODE';
import EIGHTJS_LIBS from './EIGHTJS_LIBS';
import EIGHTJS_LESS from './EIGHTJS_LESS';

import SINGLE_VIEW_HTML from './SINGLE_VIEW_HTML';
import SINGLE_VIEW_CODE from './SINGLE_VIEW_CODE';
import SINGLE_VIEW_LIBS from './SINGLE_VIEW_LIBS';
import SINGLE_VIEW_LESS from './SINGLE_VIEW_LESS';

/**
 * The `templates` service provides starting point doodles.
 * A template is essentially a doodle that is copied.
 * Instead of being a fixed set of templates, we want to make the templates extensible.
 * We expect that this will happen through HTTP, hence the inclusion of $http.
 */
app.factory('templates', [
  '$http',
  '$location',
  'uuid4',
  'CODE_MARKER',
  'LIBS_MARKER',
  'STYLE_MARKER',
  'SCRIPTS_MARKER',
  function(
    $http: angular.IHttpService,
    $location: angular.ILocationService,
    uuid: IUuidService,
    CODE_MARKER: string,
    LIBS_MARKER: string,
    STYLE_MARKER: string,
    SCRIPTS_MARKER: string
  ): IDoodle[] {

    function newLine(s: string) { return s + "\n" }
    function indent(s: string) { return "    " + s }

    function styleMarker(): string { return ['<style>', STYLE_MARKER, '</style>'].map(indent).map(newLine).join(""); }
    function scriptsMarker(): string { return [SCRIPTS_MARKER].map(indent).map(newLine).join(""); }
    function codeMarker(): string { return ['<script>', CODE_MARKER, '</script>'].map(indent).map(newLine).join(""); }
    function libsMarker(): string { return ['<script>', LIBS_MARKER, '</script>'].map(indent).map(newLine).join(""); }

    const HTML_TEMPLATE_MINIMAL = "" +
      "<!doctype html>\n" +
      "<html>\n" +
      "  <head>\n" +
      styleMarker() +
      scriptsMarker() +
      "  </head>\n" +
      "  <body>\n" +
      libsMarker() +
      codeMarker() +
      "  </body>\n" +
      "</html>\n";

    const CODE_TEMPLATE_MINIMAL = "";

    const LESS_TEMPLATE_MINIMAL = "";

    const LIBS_TEMPLATE_MINIMAL = "";

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

    return [
      {
        uuid: uuid.generate(),
        description: "EightJS — 3D Library for WebGL Graphics and Geometric Algebra",
        isCodeVisible: true,
        isViewVisible: true,
        focusEditor: undefined,
        lastKnownJs: {},
        operatorOverloading: true,
        html: EIGHTJS_HTML(styleMarker, scriptsMarker, libsMarker, codeMarker, width, height, canvasId),
        code: EIGHTJS_CODE(width, height, canvasId, true, true),
        libs: EIGHTJS_LIBS(),
        less: EIGHTJS_LESS(width, height),
        dependencies: ['stats.js', 'dat-gui', 'davinci-eight']
      },
      {
        uuid: uuid.generate(),
        description: "SingleViewApp — Template for WebGL Graphics and Geometric Algebra",
        isCodeVisible: true,
        isViewVisible: true,
        focusEditor: undefined,
        lastKnownJs: {},
        operatorOverloading: true,
        html: SINGLE_VIEW_HTML(styleMarker, scriptsMarker, libsMarker, codeMarker, width, height, canvasId),
        code: SINGLE_VIEW_CODE(width, height, 'canvas', true, true),
        libs: SINGLE_VIEW_LIBS(),
        less: SINGLE_VIEW_LESS(width, height),
        dependencies: ['stats.js', 'dat-gui', 'davinci-eight']
      },
      {
        uuid: uuid.generate(),
        description: "Geometric Algebra and Unit of Measure calculations using EIGHT",
        isCodeVisible: true,
        isViewVisible: true,
        focusEditor: undefined,
        lastKnownJs: {},
        operatorOverloading: true,
        html: HTML_TEMPLATE_CALCULATION,
        code: CODE_TEMPLATE_CALCULATION,
        libs: LIBS_TEMPLATE_CALCULATION,
        less: LESS_TEMPLATE_CALCULATION,
        dependencies: ['DomReady', 'davinci-eight']
      },
      {
        uuid: uuid.generate(),
        description: "Minimal",
        isCodeVisible: true,
        isViewVisible: false,
        focusEditor: undefined,
        lastKnownJs: {},
        operatorOverloading: false,
        html: HTML_TEMPLATE_MINIMAL,
        code: CODE_TEMPLATE_MINIMAL,
        libs: LIBS_TEMPLATE_MINIMAL,
        less: LESS_TEMPLATE_MINIMAL,
        dependencies: []
      },
      {
        uuid: uuid.generate(),
        description: "JSXGraph — 2D Library for Geometry",
        isCodeVisible: true,
        isViewVisible: true,
        focusEditor: undefined,
        lastKnownJs: {},
        operatorOverloading: true,
        html: HTML_TEMPLATE_JSXGRAPH_DEMO,
        code: CODE_TEMPLATE_JSXGRAPH_DEMO,
        libs: LIBS_TEMPLATE_JSXGRAPH_DEMO,
        less: LESS_TEMPLATE_JSXGRAPH_DEMO,
        dependencies: ['jsxgraph']
      }
    ];
  }]);
