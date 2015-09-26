/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../services/doodles/doodles.ts" />
/// <reference path="../../services/uuid/IUuidService.ts" />
/**
 * The `templates` service provides starting point doodles.
 * A template is essentially a doodle that is copied.
 * Instead of being a fixed set of templates, we want to make the templates extensible.
 * We expect that this will happen through HTTP, hence the inclusion of $http.
 */
angular.module('app').factory('templates', [
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
  ): mathdoodle.IDoodle[] {

  function newLine(s: string) {return s + "\n"}
  function indent(s: string) {return "    " + s}

  function styleMarker(): string {return ['<style>', STYLE_MARKER, '</style>'].map(indent).map(newLine).join("");}
  function scriptsMarker(): string {return [SCRIPTS_MARKER].map(indent).map(newLine).join("");}
  function codeMarker(): string {return ['<script>', CODE_MARKER, '</script>'].map(indent).map(newLine).join("");}
  function libsMarker(): string {return ['<script>', LIBS_MARKER, '</script>'].map(indent).map(newLine).join("");}

  // DOMAIN is used to define the URL for links to documentation.
  let FWD_SLASH = '/';
  let DOMAIN = $location.protocol() + ':'+ FWD_SLASH + FWD_SLASH + $location.host() + ":" + $location.port();

  var HTML_TEMPLATE_BASIC = "" +
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

  var CODE_TEMPLATE_BASIC = "";

  var LESS_TEMPLATE_BASIC = "";

  var LIBS_TEMPLATE_BASIC = "";

  var HTML_TEMPLATE_CALCULATION = "" +
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

  var CODE_TEMPLATE_CALCULATION = [
    "// Create shortcuts for some values.",
    "var e1 = blade.e3ga.e1;",
    "var e2 = blade.e3ga.e2;",
    "var e3 = blade.e3ga.e3;",
    "var meter = blade.scalarE3(1, blade.units.meter);",
    "var newton = blade.scalarE3(1, blade.units.newton);",
    "var kilogram = blade.scalarE3(1, blade.units.kilogram);",
    "var second = blade.scalarE3(1, blade.units.second);",
    "",
    "// Wait for the DOM to be loaded.",
    "DomReady.ready(function() {",
    "  try {",
    "    calculate();",
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
    " * Performs the calculation.",
    " */",
    "function calculate() {",
    "  var a = -9.81 * e3 * newton / kilogram;",
    "  var m = 70 * kilogram;",
    "  var F = m * a;",
    "",
    "  printvar('a', a);",
    "  printvar('m', m);",
    "  printvar('F = m * a', F.toFixed(2));",
    "}",
    "",
    "/**",
    " * Print the HTML string without a line ending.",
    " */",
    "function print(html: string): void {",
    "  var element = document.getElementById('info');",
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

  var LIBS_TEMPLATE_CALCULATION = "//\n";

  var LESS_TEMPLATE_CALCULATION = "" +
  "#info {\n" +
  "  position: absolute;\n" +
  "  left: 40%;\n" +
  "  top: 200px;\n" +
  "  font-size: 26px;\n" +
  "}\n";

  var HTML_TEMPLATE_CANVAS = "" +
    "<!doctype html>\n" +
    "<html>\n" +
    "  <head>\n" +
    "    <title>Vector graphics with canvas</title>\n" +
    styleMarker() +
    scriptsMarker() +
    "  </head>\n" +
    "  <body>\n" +
    "    <hr/>\n" +
    "    <ul>\n" +
    "      <li>\n" +
    "        <a href='https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API' target='_blank'>Canvas API</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    libsMarker() +
    codeMarker() +
    "  </body>\n" +
    "</html>\n";

  var CODE_TEMPLATE_CANVAS = "" +
    "DomReady.ready(load);\n" +
    "\n" +
    "/**\n" +
    " * The handler function to be called at the end of the document loading process.\n" +
    " * @param ev The `load` event.\n" +
    " */\n" +
    "function load() {\n" +
    "\n" +
    "  var canvas: HTMLCanvasElement = document.createElement('canvas');\n" +
    "\n" +
    "  canvas.id = 'doodle1';\n" +
    "  canvas.width = 1000;\n" +
    "  canvas.height = 1000;\n" +
    "\n" +
    "  document.body.appendChild(canvas);\n" +
    "\n" +
    "  var context: CanvasRenderingContext2D = canvas.getContext('2d');\n"+
    "\n" +
    "  // The width and height properties are the modeling dimensions.\n" +
    "  // The CSS style determines the physical size in pixels.\n" +
    "\n" +
    "  context.fillStyle = 'orange';\n" +
    "  context.fillRect(0, 0, 500, 500);\n" +
    "}\n";

  var LIBS_TEMPLATE_CANVAS = "//\n";

  var LESS_TEMPLATE_CANVAS = "" +
    "#doodle1 {\n" +
    "  position: absolute;\n" +
    "  background-color: #cccccc;\n" +
    "  width: 400px;\n" +
    "  height: 400px;\n" +
    "  top: 150px;\n" +
    "  left: 400px;\n" +
    "}\n";

  var HTML_TEMPLATE_EIGHTJS = "" +
    "<!doctype html>\n" +
    "<html>\n" +
    "  <head>\n" +
      styleMarker() +
    "    <script i d='vs-triangles' type='x-sha der/x-vertex'>\n" +
    "      attribute vec3 aPosition;\n" +
    "      attribute vec3 aNormal;\n" +
    "      uniform vec3 uColor;\n" +
    "      uniform mat4 uModel;\n" +
    "      uniform mat3 uNormal;\n" +
    "      uniform mat4 uView;\n" +
    "      uniform mat4 uProjection;\n" +
    "      unifor m vec3 uAmbientLight;\n" +
    "      uniform vec3 uDirectionalLightColor;\n" +
    "      uniform vec3 uDirectionalLightDirection;\n" +
    "      varying highp vec4 vColor;\n" +
    "      varying highp vec3 vLight;\n" +
    "      void main(void) {\n" +
    "        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);\n" +
    "        vColor = vec4(uColor, 1.0);\n"+
    "        vec3 L = normalize(uDirectionalLightDirection);\n"+
    "        vec3 N = normalize(uNormal * aNormal);\n"+
    "        float cosineFactor = max(dot(N,L), 0.0);\n"+
    "        vLight = uAmbientLight + cosineFactor * uDirectionalLightColor;\n"+
    "      }\n" +
    "    </script>\n" +
    "    <script id='fs-triangles' type='x-shader/x-fragment'>\n" +
    "      varying highp vec4 vColor;\n" +
    "      varying highp vec3 vLight;\n" +
    "      void main(void) {\n" +
    "        gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);\n" +
    "      }\n" +
    "    </script>\n" +
    "    <script id='vs-lines' type='x-shader/x-vertex'>\n" +
    "      attribute vec3 aPosition;\n" +
    "      uniform vec3 uColor;\n" +
    "      uniform mat4 uModel;\n" +
    "      uniform mat4 uView;\n" +
    "      un iform mat4 uProjection;\n" +
    "      varying highp vec4 vC olor;\n" +
    "      vo id main(void) {\n" +
    "        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);\n" +
    "        vColor = vec4(uColor, 1.0);\n"+
    "      }\n" +
    "    </script>\n" +
    "    <script id='fs-lines' type='x-shader/x-fragment'>\n" +
    "      varying highp vec4 vColor;\n" +
    "       void main(void) {\n" +
    "        gl_FragColor = vec4(vColor.xyz, vColor.a);\n" +
    "      }\n" +
    "    </script>\n" +
    "    <script id='vs-points' type='x-shader/x-vertex'>\n" +
    "      attribute vec3 aPosition;\n" +
    "      uniform vec3 uColor;\n" +
    "      uniform mat4 uModel;\n" +
    "      uniform mat4 uView;\n" +
    "      uniform mat4 uProjection;\n" +
    "      uniform float uPointSize;\n" +
    "      varying highp vec4 vColor;\n" +
    "      void main(void) {\n" +
    "        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);\n" +
    "        gl_PointSize = uPointSize;\n"+
    "        vColor = vec4(uColor, 1.0);\n"+
    "      }\n" +
    "    </script>\n" +
    "    <script id='fs-points' type='x-shader/x-fragment'>\n" +
    "      varying highp vec4 vColor;\n" +
    "      void main(void) {\n" +
    "        gl_FragColor = vec4(vColor.xyz, vColor.a);\n" +
    "      }\n" +
    "    </script>\n" +
    scriptsMarker() +
    "  </head>\n" +
    "  <body>\n" +
    libsMarker() +
    codeMarker() +
    "    <canvas id='my-canvas'>\n" +
    "      Your browser does not support the canvas element.\n" +
    "    </canvas>\n" +
    "  </body>\n" +
    "</html>\n";

  var CODE_TEMPLATE_EIGHTJS = "" +
    "var scene = new EIGHT.Scene()\n" +
    "var cameraL: EIGHT.PerspectiveCamera\n" +
    "var cameraR: EIGHT.PerspectiveCamera\n" +
    "var c3d = new EIGHT.Canvas3D()\n" +
    "var mesh: EIGHT.Mesh<EIGHT.Geometry, EIGHT.MeshNormalMaterial, EIGHT.Model>\n" +
    "\n" +
    "var e1 = EIGHT.Vector3.e1\n" +
    "var e2 = EIGHT.Vector3.e2\n" +
    "var e3 = EIGHT.Vector3.e3\n" +
    "\n" +
    "var stats = new Stats()\n" +
    "stats.setMode(0)\n" +
    "document.body.appendChild(stats.domElement)\n" +
    "\n" +
    "document.body.style.margin = '0px'\n" +
    "document.body.style.overflow = 'hidden'\n" +
    "document.body.appendChild(c3d.canvasElement)\n" +
    "\n" +
    "init()\n" +
    "animate()\n" +
    "\n" +
    "/**\n" +
    " * Initializes the scene.\n" +
    " */\n" +
    "function init() {\n" +
    "  var aspect = window.innerWidth / window.innerHeight\n" +
    "  cameraL = new EIGHT.PerspectiveCamera(75 * Math.PI / 180, aspect, 1, 1000).setEye(e3 * 1.5 - e1 * 0.05 + e2)\n" +
    "  scene.add(cameraL)\n" +
    "  cameraR = new EIGHT.PerspectiveCamera(75 * Math.PI / 180, aspect, 1, 1000).setEye(e3 * 1.5 + e1 * 0.05 + e2)\n" +
    "  scene.add(cameraR)\n" +
    "\n" +
    "  var complex = new EIGHT.CuboidComplex()\n" +
    "  complex.subdivide(2)\n" +
    "  complex.boundary(1)\n" +
    "  var geometry = complex.toGeometry()\n" +
    "  var material = new EIGHT.MeshNormalMaterial()\n" +
    "\n" +
    "  mesh = new EIGHT.Mesh(geometry, material, new EIGHT.Model())\n" +
    "  scene.add(mesh)\n" +
    "  mesh.model.color.set(0, 1, 0)\n" +
    "\n" +
    "  c3d.setSize(window.innerWidth, window.innerHeight)\n" +
    "  c3d.addContextListener(scene)\n" +
    "  c3d.synchronize(scene)\n" +
    "}\n" +
    "\n" +
    "/**\n" +
    " * Animates the scene.\n" +
    " */\n" +
    "function animate() {\n" +
    "  stats.begin()\n" +
    "\n" +
    "  requestAnimationFrame(animate)\n" +
    "\n" +
    "  var theta = Date.now() * 0.001\n" +
    "\n" +
    "  mesh.model.attitude.wedgeVectors(e1, e2).multiplyScalar(-theta/2).exp()\n" +
    "\n" +
    "  c3d.prolog()\n" +
    "\n" +
    "  // mesh.model.color.set(1, 0, 0)\n" +
    "  // scene.draw(cameraL, c3d.canvasId)\n" +
    "\n" +
    "  // mesh.model.color.set(0, 1, 1)\n" +
    "  scene.draw(cameraR, c3d.canvasId)\n" +
    "\n" +
    "  stats.end()\n" +
    "}\n";

  var LIBS_TEMPLATE_EIGHTJS = "\n";

  var LESS_TEMPLATE_EIGHTJS = "" +
      "body { margin: 0; }\n" +
      "canvas { width: 100%; height: 100% }\n" +
      "#stats { position: absolute; top: 0; left: 0; }\n";

  var HTML_TEMPLATE_EIGHT = "" +
    "<!doctype html>\n" +
    "<html>\n" +
    "  <head>\n" +
    styleMarker() +
    "    <script id='vs-triangles' type='x-shader/x-vertex'>\n" +
    "      attribute vec3 aPosition;\n" +
    "      attribute vec3 aNormal;\n" +
    "      uniform vec3 uColor;\n" +
    "      uniform mat4 uModel;\n" +
    "      uniform mat3 uNormal;\n" +
    "      uniform mat4 uView;\n" +
    "      uniform mat4 uProjection;\n" +
    "      uniform vec3 uAmbientLight;\n" +
    "      uniform vec3 uDirectionalLightColor;\n" +
    "      uniform vec3 uDirectionalLightDirection;\n" +
    "      varying highp vec4 vColor;\n" +
    "      varying highp vec3 vLight;\n" +
    "      void main(void) {\n" +
    "        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);\n" +
    "        vColor = vec4(uColor, 1.0);\n"+
    "        vec3 L = normalize(uDirectionalLightDirection);\n"+
    "        vec3 N = normalize(uNormal * aNormal);\n"+
    "        float cosineFactor = max(dot(N,L), 0.0);\n"+
    "        vLight = uAmbientLight + cosineFactor * uDirectionalLightColor;\n"+
    "      }\n" +
    "    </script>\n" +
    "    <script id='fs-triangles' type='x-shader/x-fragment'>\n" +
    "      varying highp vec4 vColor;\n" +
    "      varying highp vec3 vLight;\n" +
    "      void main(void) {\n" +
    "        gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);\n" +
    "      }\n" +
    "    </script>\n" +
    "    <script id='vs-lines' type='x-shader/x-vertex'>\n" +
    "      attribute vec3 aPosition;\n" +
    "      uniform vec3 uColor;\n" +
    "      uniform mat4 uModel;\n" +
    "      uniform mat4 uView;\n" +
    "      uniform mat4 uProjection;\n" +
    "      varying highp vec4 vColor;\n" +
    "      void main(void) {\n" +
    "        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);\n" +
    "        vColor = vec4(uColor, 1.0);\n"+
    "      }\n" +
    "    </script>\n" +
    "    <script id='fs-lines' type='x-shader/x-fragment'>\n" +
    "      varying highp vec4 vColor;\n" +
    "      void main(void) {\n" +
    "        gl_FragColor = vec4(vColor.xyz, vColor.a);\n" +
    "      }\n" +
    "    </script>\n" +
    "    <script id='vs-points' type='x-shader/x-vertex'>\n" +
    "      attribute vec3 aPosition;\n" +
    "      uniform vec3 uColor;\n" +
    "      uniform mat4 uModel;\n" +
    "      uniform mat4 uView;\n" +
    "      uniform mat4 uProjection;\n" +
    "      uniform float uPointSize;\n" +
    "      varying highp vec4 vColor;\n" +
    "      void main(void) {\n" +
    "        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);\n" +
    "        gl_PointSize = uPointSize;\n"+
    "        vColor = vec4(uColor, 1.0);\n"+
    "      }\n" +
    "    </script>\n" +
    "    <script id='fs-points' type='x-shader/x-fragment'>\n" +
    "      varying highp vec4 vColor;\n" +
    "      void main(void) {\n" +
    "        gl_FragColor = vec4(vColor.xyz, vColor.a);\n" +
    "      }\n" +
    "    </script>\n" +
    scriptsMarker() +
    "  </head>\n" +
    "  <body>\n" +
    libsMarker() +
    codeMarker() +
    "    <canvas id='my-canvas'>\n" +
    "      Your browser does not support the canvas element.\n" +
    "    </canvas>\n" +
    "  </body>\n" +
    "</html>\n";

  var CODE_TEMPLATE_EIGHT = "" +
    "/**\n" +
    " * The period of the motions in the animation.\n" +
    " * Break the rules! It's better to use (sometimes) short variable names in math programs!!\n" +
    " * Hint: Hover over a variable anywhere in the program to see the corresponding documentation.\n" +
    " */\n" +
    "var T: blade.Euclidean3 = 4 * second;\n" +
    "/**\n" +
    " * The frequency of the motions in the animation.\n" +
    " */\n" +
    "var f = (1 / T);\n" +
    "/**\n" +
    " * The angular velocity, omega, corresponding to the frequency, f.\n" +
    " */\n" +
    "var omega = (2 * Math.PI * f);\n" +
    "\n" +
    "/**\n" +
    " * For a future example...\n" +
    " */\n" +
    "function surfaceFn(u: number, v: number): EIGHT.Cartesian3 {\n" +
    "  var x = 3 * (u - 0.5);\n" +
    "  var z = 3 * (v - 0.5);\n" +
    "  var y = 0;\n" +
    "  return x * e1 + y * e2 + z * e3;\n" +
    "}\n" +
    "\n" +
    "/**\n" +
    " * main() is called by the DomReady preamble in the Libs file, in case you were wondering!\n" +
    " * This code illustrates the main ideas in using EIGHT and blade.\n" +
    " * This code does not show how to perform robust resource management.\n" +
    " * See the example template 'EIGHT + blade + AngularJS' for advanced resource management and tracking.\n" +
    " */\n" +
    "function main() {\n" +
    "\n" +
    "  // Let's take a look at the program 'parameters' in the Console. (Ctrl-Shift-J) on Linux.\n" +
    "  console.log('period,    T    => ' + T);\n" +
    "  console.log('frequency, f    => ' + f);\n" +
    "  console.log('surfaceFn(1, 1) => ' + surfaceFn(1, 1));\n" +
    "\n" +
    "  // Cast to HTMLCanvasElement because getElementById has no clue what we are dealing with.\n" +
    "  var canvas = <HTMLCanvasElement>document.getElementById('my-canvas');\n" +
    "  canvas.width = window.innerWidth;\n" +
    "  canvas.height = window.innerHeight;\n" +
    "\n" +
    "  /**\n" +
    "   * The user-defined canvas id (important in multi-canvas applications).\n" +
    "   */\n" +
    "  var canvasId = 42;\n" +
    "\n" +
    "  /**\n" +
    "   * The manager takes care of WebGLBuffer(s) and other resources so that you don't have to.\n" +
    "   * The manager also assists with context loss handling.\n" +
    "   * This frees you to write great shader programs, geometry generators, and your own scene graph.\n" +
    "   * But there are also utilities for smart programs, predefined geometries, and transformations to get you started or for demos.\n" +
    "   * We start the manager now to initialize the WebGL context.\n" +
    "   */\n" +
    "  var c3d = new EIGHT.Canvas3D();\n" +
    "\n" +
    "  /**\n" +
    "   * The camera is mutable and provides uniforms through the EIGHT.UniformData interface.\n" +
    "   */\n" +
    "  var camera = new EIGHT.PerspectiveCamera().setAspect(canvas.clientWidth / canvas.clientHeight).setEye(2.0 * e3);\n" +
    "  /**\n" +
    "   * Ambient Light.\n" +
    "   */\n" +
    "  var ambientLight = new EIGHT.Vector3([0.3, 0.3, 0.3]);\n" +
    "  /**\n" +
    "   * Directional Light Color.\n" +
    "   */\n" +
    "  var dLightColor = new EIGHT.Vector3([0.7, 0.7, 0.7]);\n" +
    "  /**\n" +
    "   * Directional Light Directiion.\n" +
    "   */\n" +
    "  var dLightDirection = new EIGHT.Vector3([2, 3, 5]);\n" +
    "\n" +
    "  /**\n" +
    "   * Program for rendering TRIANGLES with moderately fancy lighting.\n" +
    "   */\n" +
    "  var programT = new EIGHT.HTMLScriptsMaterial([c3d], ['vs-triangles', 'fs-triangles'], document);\n" +
    "  /**\n" +
    "   * Program for rendering LINES.\n" +
    "   */\n" +
    "  var programL = new EIGHT.HTMLScriptsMaterial([c3d], ['vs-lines', 'fs-lines'], document);\n" +
    "  /**\n" +
    "   * Program for rendering POINTS.\n" +
    "   */\n" +
    "  var programP = new EIGHT.HTMLScriptsMaterial([c3d], ['vs-points', 'fs-points'], document);\n" +
    "  /**\n" +
    "   * Program used by the cube, TBD based on geometry dimensionality.\n" +
    "   */\n" +
    "  var materialCube: EIGHT.IMaterial;\n" +
    "\n" +
    "  c3d.start(canvas, canvasId);\n" +
    "\n" +
    "  var stats = new Stats();\n" +
    "  stats.setMode(0);\n" +
    "  document.body.appendChild(stats.domElement);\n" +
    "\n" +
    "  // The camera sets uniforms for the visiting program by canvas.\n" +
    "  camera.setUniforms(programT, canvasId);\n" +
    "  camera.setUniforms(programL, canvasId);\n" +
    "  camera.setUniforms(programP, canvasId);\n" +
    "  // Uniforms may also be set directly and some standard names are symbolically defined.\n" +
    "  // The names used here should match the names used in the program source code.\n" +
    "  programT.uniformVector3(EIGHT.Symbolic.UNIFORM_AMBIENT_LIGHT, ambientLight);\n" +
    "  programT.uniformVector3('uDirectionalLightColor', dLightColor);\n" +
    "  programT.uniformVector3('uDirectionalLightDirection', dLightDirection);\n" +
    "  programP.uniform1f('uPointSize', 4);\n" +
    "\n" +
    "  /**\n" +
    "   * The buffered geometry for the cube.\n" +
    "   * This is an object that hides the messy buffer management details.\n" +
    "   */\n" +
    "  var geobuff: EIGHT.IBufferGeometry;\n" +
    "  /**\n" +
    "   * The model for the cube, which implements EIGHT.UniformData having the\n" +
    "   * method `setUniforms(visitor: EIGHT.UniformDataVisitor, canvasId: number): void`./\n" +
    "   * Implement your own custom models to do e.g., articulated robots./\n" +
    "   * See example in Libs file./\n" +
    "   */\n" +
    "  var model: EIGHT.Model;\n" +
    "\n" +
    "  // We start with the geometry (complex) for a unit cube at the origin...\n" +
    "  // A complex is considered to be an array of simplices.\n" +
    "  var complex = new EIGHT.CuboidComplex(1, 1, 1);\n" +
    "  // Subdivide the geometry (here twice) if you wish to get more detail.\n" +
    "  // Hit 'Play' in mathdoodle.io to see the effect of, say, n = 0, 1, 2, 3.\n" +
    "  complex.subdivide(2);\n" +
    "  // Apply the boundary operator once to make TRIANGLES => LINES,\n" +
    "  // twice to make TRIANGLES => POINTS,\n" +
    "  // three times to make TRIANGLES => an empty simplex with k = -1,)\n" +
    "  // four times to make TRIANGLES => undefined.\n" +
    "  // Try the values n = 0, 1, 2, 3, 4, 5. Look at the canvas and the Console.\n" +
    "  complex.boundary(1);\n" +
    "  /**\n" +
    "   * Summary information on the geometry such as dimensionality and sizes for attributes.\n" +
    "   * This same data structure may be used to map geometry attribute names to program names.\n" +
    "   */\n" +
    "  // Check that we still have a defined complex after all that mucking about.\n" +
    "  if (complex.meta) {\n" +
    "    // Convert the complex to a geometry.\n" +
    "    var geometry: EIGHT.Geometry = complex.toGeometry();\n" +
    "    // Submit the geometry data to the context which will manage underlying WebGLBuffer(s) for you.\n" +
    "    geobuff = c3d.createBufferGeometry(geometry.data);\n" +
    "    if (geobuff) {\n" +
    "      // Pick an appropriate program to use with the mesh based upon the dimensionality.\n" +
    "      switch(geometry.meta.k) {\n" +
    "        case EIGHT.Simplex.K_FOR_POINT: {\n" +
    "          materialCube = programP;\n" +
    "        }\n" +
    "        break;\n" +
    "        case EIGHT.Simplex.K_FOR_LINE_SEGMENT: {\n" +
    "          materialCube = programL;\n" +
    "        }\n" +
    "        break;\n" +
    "        case EIGHT.Simplex.K_FOR_TRIANGLE: {\n" +
    "          materialCube = programT;\n" +
    "        }\n" +
    "        break;\n" +
    "        default: {\n" +
    "          throw new Error('Unexpected dimensions for simplex: ' + geometry.meta.k);\n" +
    "        }\n" +
    "      }\n" +
    "    }\n" +
    "    else {\n" +
    "      console.warn('Nothing to see because the geometry is empty. dimensions => ' + geometry.meta.k);\n" +
    "    }\n" +
    "  }\n" +
    "  else {\n" +
    "    console.warn('Nothing to see because the geometry is undefined.');\n" +
    "  }\n" +
    "  // Create the model anyway (not what we would do in the real world).\n" +
    "  model = new EIGHT.Model();\n" +
    "  // Green, like on the 'Matrix', would be a good color, Neo. Or maybe red or blue?\n" +
    "  model.color.set(0, 1, 0);\n" +
    "\n" +
    "  // PERFORMANCE HINT\n"+
    "  // In order to avoid creating temporary objects and excessive garbage collection,\n" +
    "  // perform blade computations outside of the animation loop and\n" +
    "  // use EIGHT mutable components inside the animation loop.\n" +
    "  /**\n" +
    "   * The angle of tilt of the precessing vector.\n" +
    "   */\n" +
    "  var tiltAngle = 30 * Math.PI / 180;\n" +
    "  /**\n" +
    "   * S, a spinor representing the default attitude of the cube.\n" +
    "   */\n" +
    "  // We're using blade, Geometric Algebra, and operator overloading here.\n" +
    "  // We perform similar calculations inside the animation loop using BLADE mutable types.\n" +
    "  // The global constants, e1, e2 and e3, are defined in the 'Libs' file.\n" +
    "  var S = exp(-(e2 ^ e1) * tiltAngle / 2);\n" +
    "  var B = e3 ^ e1;\n" +
    "  var rotorL = EIGHT.rotor3();\n" +
    "  var rotorR = EIGHT.rotor3();\n" +
    "\n" +
    "  EIGHT.animation((time: number) => {\n" +
    "    stats.begin();\n" +
    "    // Use the scalar property, w, in order to keep things fast.\n" +
    "    /**\n" +
    "     * theta = omega * time, is the basic angle used in the animation.\n" +
    "     */\n" +
    "    var theta: number = omega.w * time;\n" +
    "    // Simple Harmonic Motion.\n" +
    "    // model.position.copy(e2).multiplyScalar(1.2 * sin(theta));\n" +
    "\n" +
    "    // Precession demonstrates spinor multiplication.\n" +
    "    // R = exp(-B * theta / 2)\n" +
    "    // attitude = R * S * ~R\n" +
    "    rotorL.copy(B).multiplyScalar(-theta / 2).exp();\n" +
    "    rotorR.copy(rotorL).reverse();\n" +
    "    model.attitude.copy(rotorL).multiply(S).multiply(rotorR);\n" +
    "\n" +
    "    // Rotation generated by e3 ^ e2.\n" +
    "    // model.attitude.wedgeVectors(e3, e2).multiplyScalar(-theta / 2).exp();\n" +
    "\n" +
    "    // orbit\n" +
    "    // position = R * e1 * ~R\n" +
    "    // model.position.copy(e1).rotate(rotorL);\n" +
    "\n" +
    "    c3d.prolog();\n" +
    "\n" +
    "    if (geobuff) {\n" +
    "      // Make the appropriate WebGLProgram current.\n" +
    "      materialCube.use(canvasId);\n" +
    "      // The model sets uniforms on the program, for the specified canvas.\n" +
    "      model.setUniforms(materialCube, canvasId);\n" +
    "      // Bind the appropriate underlying buffers and enable attribute locations.\n" +
    "      geobuff.bind(materialCube);\n" +
    "      // Make the appropriate drawElements() or drawArrays() call.\n" +
    "      geobuff.draw();\n" +
    "      // Unbind the buffers and disable attribute locations.\n" +
    "      geobuff.unbind();\n" +
    "    }\n" +
    "\n" +
    "    stats.end();\n" +
    "  }).start();\n" +
    "}\n";

  var LIBS_TEMPLATE_EIGHT = "" +
    "DomReady.ready(function() {\n" +
    "  try {\n" +
    "    main();\n" +
    "  }\n" +
    "  catch(e) {\n" +
    "    console.error(e);\n" +
    "  }\n" +
    "});\n" +
    "\n" +
    "/**\n" +
    " * Standard basis vector in the x-axis direction.\n" +
    " */\n" +
    "var e1 = blade.e3ga.e1;\n" +
    "/**\n" +
    " * Standard basis vector in the y-axis direction.\n" +
    " */\n" +
    "var e2 = blade.e3ga.e2;\n" +
    "/**\n" +
    " * Standard basis vector in the z-axis direction.\n" +
    " */\n" +
    "var e3 = blade.e3ga.e3;\n" +
    "var e12 = e1 * e2;\n" +
    "var e23 = e2 * e3;\n" +
    "var e32 = e3 * e2;\n" +
    "\n" +
    "/**\n" +
    " * Returns the cosine of a number.\n" +
    " */\n" +
    "var cos = blade.universals.cos;\n" +
    "/**\n" +
    " * Returns e (the base of natural logarithms) raised to a power.\n" +
    " */\n" +
    "var exp = blade.universals.exp;\n" +
    "/**\n" +
    " * Returns the sine of a number.\n" +
    " */\n" +
    "var sin = blade.universals.sin;\n" +
    "\n" +
    "/**\n" +
    " * S.I. units of measure.\n" +
    " */\n" +
    "var kilogram = blade.e3ga.units.kilogram;\n" +
    "var meter    = blade.e3ga.units.meter;\n" +
    "var second   = blade.e3ga.units.second;\n" +
    "var hertz    = blade.e3ga.units.hertz;\n" +
    "\n" +
    "class Model implements EIGHT.UniformData {\n" +
    "  public position = new EIGHT.Vector3();\n" +
    "  public attitude = EIGHT.rotor3();\n" +
    "  public scale: EIGHT.Vector3 = new EIGHT.Vector3([1, 1, 1]);\n" +
    "  public color: EIGHT.Vector3 = new EIGHT.Vector3([1, 1, 1]);\n" +
    "  private M = EIGHT.Matrix4.identity();\n" +
    "  private N = EIGHT.Matrix3.identity();\n" +
    "  private R = EIGHT.Matrix4.identity();\n" +
    "  private S = EIGHT.Matrix4.identity();\n" +
    "  private T = EIGHT.Matrix4.identity();\n" +
    "  constructor() {\n" +
    "    this.position.modified = true;\n" +
    "    this.attitude.modified = true;\n" +
    "    this.scale.modified = true;\n" +
    "    this.color.modified = true;\n" +
    "  }\n" +
    "  setUniforms(visitor: EIGHT.UniformDataVisitor, canvasId: number) {\n" +
      "  // FIXME: canvasId will be used in uniform setting calls.\n" +
    "    if (this.position.modified) {\n" +
    "      this.T.translation(this.position);\n" +
    "      this.position.modified = false;\n" +
    "    }\n" +
    "    if (this.attitude.modified) {\n" +
    "        this.R.rotation(this.attitude);\n" +
    "        this.attitude.modified = false;\n" +
    "    }\n" +
    "    if (this.scale.modified) {\n" +
    "      this.S.scaling(this.scale);\n" +
    "      this.scale.modified = false;\n" +
    "    }\n" +
    "    this.M.copy(this.T).multiply(this.R).multiply(this.S);\n" +
    "\n" +
    "    this.N.normalFromMatrix4(this.M)\n" +
    "\n" +
    "    visitor.uniformMatrix4(EIGHT.Symbolic.UNIFORM_MODEL_MATRIX, false, this.M);\n" +
    "    visitor.uniformMatrix3(EIGHT.Symbolic.UNIFORM_NORMAL_MATRIX, false, this.N);\n" +
    "    visitor.uniformVector3(EIGHT.Symbolic.UNIFORM_COLOR, this.color);\n" +
    "  }\n" +
    "}\n" +
    "";

  var LESS_TEMPLATE_EIGHT = "" +
    "body { margin: 0; }\n" +
    "canvas { width: 100%; height: 100% }\n" +
    "#stats { position: absolute; top: 0; left: 0; }\n";

  var HTML_TEMPLATE_ANGULAR = "" +
    "<!doctype html>\n" +
    "<html ng-app='doodle'>\n" +
    "  <head>\n" +
    "    <meta charset='utf-8'/>\n" +
    "    <link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css'>\n" +
    styleMarker() +
    scriptsMarker() +
    "  </head>\n" +
    "  <body style='margin: 0;'>\n" +
    "    <div class='container'>\n" +
    "      <div class='page-header'>\n" +
    "        <h1><a href='#'>My Heading</a></h1>\n" +
    "      </div>\n" +
    "      <div ng-controller='MySectionController'>\n" +
    "        <h3>My Section</h3>\n" +
    "        <label>Name:</label>\n"+
    "        <input ng-model='name' type='text' placeholder=\"Enter a name here\"/>\n" +
    "        <hr/>\n" +
    "        <h1>Hello, {{name}}!</h1>\n" +
    "        <hr/>\n" +
    "        <a href='https://angularjs.org' target='_blank'>AngularJS Home Page</a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    libsMarker() +
    codeMarker() +
    "  </body>\n" +
    "</html>\n";

  var CODE_TEMPLATE_ANGULAR = "" +
    "/**\n" +
    " * This is the scope for MySectionController.\n" +
    " */\n" +
    "interface IMySectionScope extends angular.IScope {\n" +
    "  /**\n" +
    "   * The `name` property.\n" +
    "   */\n" +
    "  name: string;\n" +
    "}\n" +
    "\n" +
    "(function (app: angular.IModule) {\n" +
    "  'use-strict';\n" +
    "\n" +
    "  app.controller('MySectionController', ['$scope', function MySectionController($scope: IMySectionScope) {\n" +
    "    $scope.name = \"World\";\n" +
    "  }]);\n" +
    "\n" +
    "})(angular.module('doodle', []));\n";

  var LIBS_TEMPLATE_ANGULAR = "//\n";

  var CODE_TEMPLATE_THREEJS = "" +
    "var scene = new THREE.Scene();\n"+
    "var camera: THREE.PerspectiveCamera;\n"+
    "var renderer = new THREE.WebGLRenderer();\n" +
    "var mesh: THREE.Mesh;\n" +
    "\n" +
    "var stats = new Stats();\n" +
    "stats.setMode(0);\n" +
    "document.body.appendChild(stats.domElement);\n" +
    "\n" +
    "init();\n"+
    "animate();\n"+
    "\n"+
    "/**\n"+
    " * Initializes the scene.\n"+
    " */\n"+
    "function init() {\n" +
    "  var aspect = window.innerWidth / window.innerHeight;\n" +
    "  camera = new THREE.PerspectiveCamera(75, aspect, 1, 1000);\n" +
    "  camera.position.z = 200;\n" +
    "  scene.add(camera);\n" +
    "\n" +
    "  var geometry = new THREE.BoxGeometry(100, 100, 100);\n" +
    "  var material = new THREE.MeshNormalMaterial();\n" +
    "\n" +
    "  mesh = new THREE.Mesh(geometry, material);\n" +
    "  scene.add(mesh);\n" +
    "\n" +
    "  renderer.setClearColor(0xFFFFFF, 1.0);\n" +
    "  renderer.setSize(window.innerWidth, window.innerHeight);\n" +
    "\n" +
    "  document.body.style.margin = '0px';\n" +
    "  document.body.style.overflow = 'hidden';\n" +
    "  document.body.appendChild(renderer.domElement);\n" +
    "}\n" +
    "\n" +
    "/**\n"+
    " * Animates the scene.\n"+
    " */\n"+
    "function animate() {\n" +
    "  stats.begin();\n" +
    "  requestAnimationFrame(animate);\n" +
    "\n" +
    "  mesh.rotation.x = Date.now() * 0.0005;\n" +
    "  mesh.rotation.y = Date.now() * 0.001;\n" +
    "\n"+
    "  renderer.render(scene, camera);\n" +
    "  stats.end();\n" +
  "}\n";

  var LIBS_TEMPLATE_THREEJS = "//\n";

  var LESS_TEMPLATE_THREEJS = "" +
    "body { margin: 0; }\n" +
    "canvas { width: 100%; height: 100% }\n" +
    "#stats { position: absolute; top: 0; left: 0; }\n";

  var HTML_TEMPLATE_JSXGRAPH = "" +
    "<!doctype html>\n" +
    "<html>\n" +
    "  <head>\n" +
    "    <!--link rel='stylesheet' type='text/css' href='http://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css'/-->\n" +
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

  var CODE_TEMPLATE_JSXGRAPH = "" +
    "var graph = JXG.JSXGraph;\n" +
    "var brd = JXG.JSXGraph.initBoard('box',{boundingbox:[-5,5,5,-5], keepaspectratio:true, axis:true});\n";

  var LESS_TEMPLATE_JSXGRAPH = "" +
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
    "}\n";
  "\n" +
  ".JXGimageHighlight {\n" +
  "  opacity: 0.6;\n" +
  "}\n";

  var HTML_TEMPLATE_JSXGRAPH_DEMO = "" +
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

  var CODE_TEMPLATE_JSXGRAPH_DEMO = "" +
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

  var LIBS_TEMPLATE_JSXGRAPH_DEMO = "//\n";

  var CODE_TEMPLATE_D3 = "var x = d3;\n";

  var HTML_TEMPLATE_ANGULAR_BLADE_EIGHT = "" +
    "<!doctype html>\n" +
    "<html ng-app='doodle'>\n" +
    "  <head>\n" +
    "    <meta charset='utf-8'/>\n" +
    "    <link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css'>\n" +
    styleMarker() +
    "    <script id='vs-points' type='x-shader/x-vertex'>\n" +
    "      attribute vec3 aPosition;\n" +
    "      uniform vec3 uColor;\n" +
    "      uniform mat4 uModel;\n" +
    "      uniform mat4 uView;\n" +
    "      uniform mat4 uProjection;\n" +
    "      uniform float uPointSize;\n" +
    "      varying highp vec4 vColor;\n" +
    "      void main(void) {\n" +
    "        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);\n" +
    "        gl_PointSize = uPointSize;\n"+
    "        vColor = vec4(uColor, 1.0);\n"+
    "      }\n" +
    "    </script>\n" +
    "    <script id='fs-points' type='x-shader/x-fragment'>\n" +
    "      varying highp vec4 vColor;\n" +
    "      void main(void) {\n" +
    "        gl_FragColor = vec4(vColor.xyz, vColor.a);\n" +
    "      }\n" +
    "    </script>\n" +
    scriptsMarker() +
    "  </head>\n" +
    "  <body>\n" +
    "    <div class='container'>\n" +
    "      <div class='page-header'>\n" +
    "        <h1>AngularJS, blade, and eight.js</h1>\n" +
    "      </div>\n" +
    "      <div ng-controller='my-controller'>\n" +
    "        <h3>Spinors and Rotations</h3>\n" +
    "        <p>An example using the <em>blade</em> module to perform <b>Geometric Algebra</b> mathematics, <em>eight.js</em> for <b>WebGL</b> rendering, and <em>AngularJS</em> for the Model-View-Whatever <b>User Interface</b>.</p>\n" +
    "        <canvas id='canvasId' style='width:600px; height:400px;'></canvas>\n" +
    "        <div>\n" +
    "          <h1>time: {{runner.time | number:2}}</h1>\n"+
    "          <button ng-click='handleStartOrStop()'>{{runner.isRunning ? 'Stop' : 'Start'}}</button>\n"+
    "          <button ng-click='handleResetOrLap()' ng-show='runner.isPaused'>{{runner.isPaused ? 'Reset' : 'Lap'}}</button>\n"+
    "        </div>\n" +
    "        <hr/>\n" +
    "        <ul>\n" +
    "          <li>\n" +
    "            <a href='http://github.com/geometryzen/davinci-eight' target='_blank'>davinci-eight Home Page</a>\n" +
    "          </li>\n" +
    "          <li>\n" +
    "            <a href='https://angularjs.org' target='_blank'>AngularJS Home Page</a>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    libsMarker() +
    codeMarker() +
    "  </body>\n" +
    "</html>\n";

  var CODE_TEMPLATE_ANGULAR_BLADE_EIGHT = "" +
    "interface IMyScope extends angular.IScope {\n" +
    "  /**\n"+
    "   * The `runner` runs the animation.\n"+
    "   */\n"+
    "  runner: EIGHT.WindowAnimationRunner;\n" +
    "  /**\n"+
    "   * Invoked when the user requests `start` or `stop`.\n"+
    "   */\n"+
    "  handleStartOrStop(): void;\n" +
    "  /**\n"+
    "   * Invoked when the user requests `reset` or `lap`.\n"+
    "   */\n"+
    "  handleResetOrLap(): void;\n" +
    "}\n" +
    "\n" +
    "(function (app: angular.IModule) {\n" +
    "\n" +
    "  app.controller('my-controller', ['$window', '$scope', function MyController($window: Window, $scope: IMyScope) {\n" +
    "\n"+
    "    // PERFORMANCE HINT\n"+
    "    // In order to avoid creating temporary objects and excessive garbage collection,\n"+
    "    // perform blade computations outside of the animation loop and\n"+
    "    // use EIGHT mutable components inside the animation loop.\n"+
    "    var e1 = blade.vectorE3(1,0,0);\n" +
    "    var e2 = blade.vectorE3(0,1,0);\n" +
    "    var e3 = blade.vectorE3(0,0,1);\n" +
    "    var exp = blade.universals.exp;\n" +
    "    var T = 4;\n" +
    "    var f = 1 / T;\n" +
    "    var omega = 2 * Math.PI * f;\n" +
    "\n"+
    "    var canvas = <HTMLCanvasElement>$window.document.getElementById('canvasId');\n" +
    "    canvas.width = 600;\n" +
    "    canvas.height = 400;\n" +
    "\n"+
    "    var c3d: EIGHT.Canvas3D;\n"+
    "\n"+
    "    var camera = new EIGHT.PerspectiveCamera().setAspect(canvas.clientWidth / canvas.clientHeight).setEye(3.0 * e3);\n"+
    "\n"+
    "    var geobuff: EIGHT.IBufferGeometry;\n"+
    "    var material: EIGHT.IMaterial;\n" +
    "    var control = new EIGHT.Model();\n"+
    "\n"+
    "    var R = -(e1 ^ e2) / 2;\n"+
    "\n" +
    "    function setUp() {\n"+
    "      EIGHT.refChange('reset', 'setUp()');\n"+
    "      EIGHT.refChange('start', 'setUp()');\n"+
    "\n"+
    "      c3d = new EIGHT.Canvas3D();\n"+
    "      c3d.start(canvas, 0);\n"+
    "\n"+
    "      material = new EIGHT.HTMLScriptsMaterial([c3d], ['vs-points', 'fs-points'], document);\n" +
    "\n"+
    "      var vec0 = new EIGHT.Vector3([0.0,  0.0, 0.0]);\n"+
    "      var vec1 = new EIGHT.Vector3([1.0, -0.2, 0.0]);\n"+
    "      var vec2 = new EIGHT.Vector3([1.0, +0.2, 0.0]);\n"+
    "      var simplices = EIGHT.triangle(vec0, vec1, vec2);\n"+
    "      var meta = EIGHT.toGeometryMeta(simplices);\n"+
    "      // console.log(JSON.stringify(meta, null, 2));\n"+
    "      // Map standard names in geometry to names used in vertex shader code.\n"+
    "      meta.attributes[EIGHT.Symbolic.ATTRIBUTE_POSITION].name = 'aPosition';\n"+
    "      var data = EIGHT.toGeometryData(simplices, meta);\n"+
    "\n"+
    "      geobuff = c3d.createBufferGeometry(data);\n"+
    "\n"+
    "      camera.setUniforms(material, c3d.canvasId);\n"+
    "    }\n"+
    "\n" +
    "    // If you wish to work with AngularJS scope variables,\n" +
    "    // use tick rather than animate because tick is called from a non-AngularJS context.\n" +
    "    function tick(time: number) {\n"+
    "      $scope.$apply(function() {\n"+
    "        animate(time);\n"+
    "      });\n"+
    "    }\n"+
    "\n" +
    "    function animate(time: number) {\n"+
    "\n" +
    "      var theta = omega * time;\n"+
    "\n" +
    "      c3d.prolog();\n"+
    "\n" +
    "      geobuff.bind(material);\n" +
    "\n" +
    "      control.color.set(0.0, 1.0, 0.0);\n"+
    "      for(var i = 0; i < 8; i++) {\n" +
    "        control.attitude.copy(R).multiplyScalar(theta - i * 2 * Math.PI / 8).exp();\n"+
    "        control.setUniforms(material, c3d.canvasId);\n"+
    "        geobuff.draw();\n"+
    "        control.color.multiplyScalar(0.7);\n"+
    "      }\n" +
    "\n" +
    "      geobuff.unbind();\n" +
    "    }\n"+
    "\n" +
    "    function terminate(time: number) { return false; }\n"+
    "\n" +
    "    function tearDown(e: Error) {\n"+
    "      // Any exception thrown in the animation loop is reported here.\n" +
    "      if (e) {\n"+
    "        console.warn(e);\n"+
    "      }\n"+
    "\n" +
    "      geobuff.release();\n"+
    "      geobuff = void 0;\n"+
    "\n" +
    "      material.release();\n"+
    "      material = void 0;\n"+
    "\n" +
    "      c3d.stop();\n"+
    "      c3d.release();\n"+
    "      c3d = void 0;\n"+
    "\n" +
    "      var outstanding = EIGHT.refChange('stop', 'tearDown()');\n"+
    "      //if (outstanding > 0) {\n" +
    "        EIGHT.refChange('dump', 'tearDown()');\n"+
    "      //}\n" +
    "      EIGHT.refChange('reset', 'tearDown()');\n"+
    "\n" +
    "      $scope.$apply(function() {\n"+
    "      });\n"+
    "    }\n"+
    "\n" +
    "    // Again, if you wish to work with AngularJS scope variables,\n" +
    "    // use tick rather than animate because tick is called from a non-AngularJS context.\n" +
    "    $scope.runner = EIGHT.animation(animate, {terminate: terminate, setUp: setUp, tearDown: tearDown, window: $window});\n"+
    "\n" +
    "    $scope.handleStartOrStop = function() {\n"+
    "      if ($scope.runner.isRunning) {\n"+
    "        $scope.runner.stop();\n"+
    "      }\n"+
    "      else {\n"+
    "        $scope.runner.start();\n"+
    "      }\n"+
    "    }\n"+
    "\n" +
    "    $scope.handleResetOrLap = function() {\n"+
    "      if ($scope.runner.isPaused) {\n"+
    "        $scope.runner.reset();\n"+
    "      }\n"+
    "      else if ($scope.runner.isRunning) {\n"+
    "        $scope.runner.lap();\n"+
    "      }\n"+
    "    }\n"+
    "\n" +
    "  }]);\n" +
    "})(angular.module('doodle', []));\n";

  var LIBS_TEMPLATE_ANGULAR_BLADE_EIGHT = "//\n";

  var HTML_TEMPLATE_MATHBOX = "" +
    "<!doctype html>\n" +
    "<html>\n" +
    "  <head>\n" +
    styleMarker() +
    scriptsMarker() +
    "  </head>\n" +
    "  <body>\n" +
    "        <hr/>\n" +
    "        <ul>\n" +
    "          <li>\n" +
    "            <a href='https://github.com/geometryzen/davinci-mathbox' target='_blank'>MathBox Home Page</a>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    libsMarker() +
    codeMarker() +
    "  </body>\n" +
    "</html>\n";

  var CODE_TEMPLATE_MATHBOX = "" +
    "DomReady.ready(function() {ThreeBox.preload(['../shaders/MathBox.glsl.html',], load);});\n" +
    "\n" +
    "function load() {\n" +
    "  var mathbox = mathBox({stats: false}).start();\n" +
    "\n" +
    "  mathbox.viewport({type: 'cartesian'})\n" +
    "  .camera({orbit: 15, phi: Math.PI, theta: .2})\n" +
    "  .transition(300);\n" +
    "\n" +
    "  mathbox.surface({\n" +
    "    mesh: false,\n" +
    "    line: true,\n" +
    "    shaded: true,\n" +
    "    domain: [[-2.5, 1.5], [-Math.PI*1.5, Math.PI*1.5]],\n" +
    "    n: [32, 64],\n" +
    "    expression: surfaceFn,\n" +
    "  });\n" +
    "\n" +
    "  mathbox.world().loop().hookPreRender(function () {\n" +
    "    mathbox.set('camera', {phi: Date.now() * 0.0003});\n" +
    "  });\n" +
    "}\n" +
"\n" +
"function surfaceFn(x: number, y: number): number[] {\n" +
"  var z = new blade.Complex(x, y).exp();\n" +
"  return [z.x, z.y, x+y];\n" +
"}\n";

  var LIBS_TEMPLATE_MATHBOX = "//\n";

  var LESS_TEMPLATE_MATHBOX = "";

  return [
    {
        uuid: uuid.generate(),
        description: "None",
        isCodeVisible: true,
        isViewVisible: true,
        focusEditor: undefined,
        lastKnownJs: {},
        operatorOverloading: true,
        html: HTML_TEMPLATE_BASIC,
        code: CODE_TEMPLATE_BASIC,
        libs: LIBS_TEMPLATE_BASIC,
        less: LESS_TEMPLATE_BASIC,
        dependencies: []
    },
    {
      uuid: uuid.generate(),
      description: "EIGHT — Mathematical Computer Graphics using WebGL",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: {},
      operatorOverloading: true,
      html: HTML_TEMPLATE_EIGHTJS,
      code: CODE_TEMPLATE_EIGHTJS,
      libs: LIBS_TEMPLATE_EIGHTJS,
      less: LESS_TEMPLATE_EIGHTJS,
      dependencies: ['DomReady', 'davinci-eight', 'stats.js']
    },
    {
      uuid: uuid.generate(),
      description: "EIGHT + blade — Mathematical Computer Graphics using WebGL",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: {},
      operatorOverloading: true,
      html: HTML_TEMPLATE_EIGHT,
      code: CODE_TEMPLATE_EIGHT,
      libs: LIBS_TEMPLATE_EIGHT,
      less: LESS_TEMPLATE_EIGHT,
      dependencies: ['DomReady', 'davinci-blade', 'davinci-eight', 'stats.js']
    },
    {
      uuid: uuid.generate(),
      description: "EIGHT + blade + AngularJS — Mathematical Computer Graphics using WebGL",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: {},
      operatorOverloading: true,
      html: HTML_TEMPLATE_ANGULAR_BLADE_EIGHT,
      code: CODE_TEMPLATE_ANGULAR_BLADE_EIGHT,
      libs: LIBS_TEMPLATE_ANGULAR_BLADE_EIGHT,
      less: LESS_TEMPLATE_BASIC,
      dependencies: ['angular', 'davinci-blade', 'davinci-eight', 'stats.js']
    },
    {
      uuid: uuid.generate(),
      description: "Blade — Geometric Algebra and Unit of Measure calculations",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: {},
      operatorOverloading: true,
      html: HTML_TEMPLATE_CALCULATION,
      code: CODE_TEMPLATE_CALCULATION,
      libs: LIBS_TEMPLATE_CALCULATION,
      less: LESS_TEMPLATE_CALCULATION,
      dependencies: ['DomReady', 'davinci-blade']
    },
    /*
    {
      uuid: uuid.generate(),
      description: "MathBox — Mathematical Diagrams",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: {},
      operatorOverloading: true,
      html: HTML_TEMPLATE_MATHBOX,
      code: CODE_TEMPLATE_MATHBOX,
      libs: LIBS_TEMPLATE_MATHBOX,
      less: LESS_TEMPLATE_MATHBOX,
      dependencies: ['DomReady','davinci-mathbox','davinci-blade']
    },
    */
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
      less: LESS_TEMPLATE_JSXGRAPH,
      dependencies: ['jsxgraph']
    },
    {
      uuid: uuid.generate(),
      description: "ThreeJS — 3D Library for WebGL Graphics",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: {},
      operatorOverloading: true,
      html: HTML_TEMPLATE_BASIC,
      code: CODE_TEMPLATE_THREEJS,
      libs: LIBS_TEMPLATE_THREEJS,
      less: LESS_TEMPLATE_THREEJS,
      dependencies: ['three.js', 'stats.js']
    },
    {
      uuid: uuid.generate(),
      description: "Canvas — 2D Vector Graphics with HTML5 Canvas API",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: {},
      operatorOverloading: true,
      html: HTML_TEMPLATE_CANVAS,
      code: CODE_TEMPLATE_CANVAS,
      libs: LIBS_TEMPLATE_CANVAS,
      less: LESS_TEMPLATE_CANVAS,
      dependencies: ['DomReady']
    },
    {
      uuid: uuid.generate(),
      description: "AngularJS — HTML enhanced for Web Applications",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: {},
      operatorOverloading: true,
      html: HTML_TEMPLATE_ANGULAR,
      code: CODE_TEMPLATE_ANGULAR,
      libs: LIBS_TEMPLATE_ANGULAR,
      less: LESS_TEMPLATE_BASIC,
      dependencies: ['angular']
    }
    /*
    {
      uuid: uuid.generate(),
      description: "d3 — Data Driven Documents",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: {},
      operatorOverloading: true,
      html: HTML_TEMPLATE_BASIC,
      code: CODE_TEMPLATE_D3,
      less: LESS_TEMPLATE_BASIC,
      dependencies: ['d3']
    }
    */
  ];
}]);