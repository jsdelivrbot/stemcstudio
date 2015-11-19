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

        function newLine(s: string) { return s + "\n" }
        function indent(s: string) { return "    " + s }

        function styleMarker(): string { return ['<style>', STYLE_MARKER, '</style>'].map(indent).map(newLine).join(""); }
        function scriptsMarker(): string { return [SCRIPTS_MARKER].map(indent).map(newLine).join(""); }
        function codeMarker(): string { return ['<script>', CODE_MARKER, '</script>'].map(indent).map(newLine).join(""); }
        function libsMarker(): string { return ['<script>', LIBS_MARKER, '</script>'].map(indent).map(newLine).join(""); }

        // DOMAIN is used to define the URL for links to documentation.
        let FWD_SLASH = '/';
        let DOMAIN = $location.protocol() + ':' + FWD_SLASH + FWD_SLASH + $location.host() + ":" + $location.port();

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
            "var e1 = EIGHT.Euclidean3.e1",
            "var e2 = EIGHT.Euclidean3.e2",
            "var e3 = EIGHT.Euclidean3.e3",
            "var meter    = EIGHT.Euclidean3.meter",
            "var kilogram = EIGHT.Euclidean3.kilogram",
            "var second   = EIGHT.Euclidean3.second",
            "var coulomb  = EIGHT.Euclidean3.coulomb",
            "var ampere   = EIGHT.Euclidean3.ampere",
            "var kelvin   = EIGHT.Euclidean3.kelvin",
            "var mole     = EIGHT.Euclidean3.mole",
            "var candela  = EIGHT.Euclidean3.candela",
            "var newton   = meter * kilogram / (second * second)",
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
            "  left: 60px;\n" +
            "  top: 60px;\n" +
            "  font-size: 26px;\n" +
            "  color: #F9EE98;\n" +
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
            "      <li>\n" +
            "        <a href='http://www.mathdoodle.io/vendor/davinci-eight@2.102.0/documentation/index.html' target='_blank'>EIGHT API</a>\n" +
            "      </li>\n" +
            "      <li>\n" +
            "        <a href='http://www.snible.org/greek/greek-keys.html' target='_blank'>Greek Keyboard</a>\n" +
            "      </li>\n" +
            "    </ul>\n" +
            libsMarker() +
            codeMarker() +
            "  </body>\n" +
            "</html>\n";

        var CODE_TEMPLATE_CANVAS = "" +
            "//\n" +
            "// 2D Mathematical Graphics with the HTML5 Canvas and Geometric Algebra.\n" +
            "//\n" +
            "\n" +
            "/**\n" +
            " * The handler function that will be called at the end of the document loading process.\n" +
            " */\n" +
            "function main() {\n" +
            "\n" +
            "  // Boilerplate code for creating a canvas and '2d' context.\n" +
            "  var canvas: HTMLCanvasElement = document.createElement('canvas')\n" +
            "  canvas.id = 'doodle1'\n" +
            "  // The width and height properties are the modeling dimensions.\n" +
            "  // The CSS style determines the physical size in pixels.\n" +
            "  canvas.width = 400\n" +
            "  canvas.height = 400\n" +
            "  document.body.appendChild(canvas)\n" +
            "  var context: CanvasRenderingContext2D = canvas.getContext('2d');\n" +
            "\n" +
            "  /**\n" +
            "   * The <em>east</em> <em>unit vector</em> (alias for <b>e</b><sub>1</sub>).\n" +
            "   */\n" +
            "  var E = e1\n" +
            "  var S = e2\n" +
            "  var W = -E\n" +
            "  var N = -S\n" +
            "  var origin = zero\n" +
            "\n" +
            "  var T = 4\n" +
            "  var f = 1 / T\n" +
            "  var ω = τ * f\n" +
            "\n" +
            "  /**\n" +
            "   * The <em>rotational velocity</em>, a <em>bivector</em>.\n" +
            "   */\n" +
            "  var Ω = -clockwise * ω\n" +
            "\n" +
            "  // Define permanent mutable variables (for performance).\n" +
            "  // Initialize them with sensible defaults.\n" +
            "  var θ = Ω.clone().scale(0)\n" +
            "  var red = N.clone()\n" +
            "  var blue = E.clone()\n" +
            "  var magnet = one.clone()\n" +
            "  var R = one.clone()\n" +
            "\n" +
            "  function animate() {\n" +
            "    // Reset permanent variables for this frame.\n" +
            "    red.copy(N)\n" +
            "    blue.copy(E)\n" +
            "\n" +
            "    var t = Date.now() * 0.001\n" +
            "    // θ = Ω * t\n" +
            "    θ.copy(Ω).scale(t)\n" +
            "\n" +
            "    // R = exp(-θ/2)\n" +
            "    R.copy(θ).scale(-0.5).exp()\n" +
            "    // R.rotorFromDirections(N, N + E)\n" +
            "    // R.rotorFromGeneratorAngle(clockwise, θ.magnitude()).scale(1)\n" +
            "    // R.copy(E).mul(N).log().scale(-0.5*(1/3)).exp()\n" +
            "\n" +
            "    // red = R * red * ~R\n" +
            "    red.rotate(R)\n" +
            "\n" +
            "    // blue = R * blue * ~R\n" +
            "    blue.rotate(R)\n" +
            "\n" +
            "    magnet.copy(R)\n" +
            "\n" +
            "    context.clearRect(0, 0, canvas.width, canvas.height)\n" +
            "\n" +
            "    drawLineTee(context, origin, red, 'red', canvas)\n" +
            "    drawLineTee(context, origin, blue, 'blue', canvas)\n" +
            "    drawSpinTee(context, origin, R, 'magenta', canvas)\n" +
            "    drawMagnet(context, origin, magnet, canvas)\n" +
            "\n" +
            "    window.requestAnimationFrame(guard(animate))\n" +
            "  }\n" +
            "  guard(animate)()\n" +
            "}\n" +
            "\n" +
            "DomReady.ready(guard(main))\n" +
            "\n";

        var LIBS_TEMPLATE_CANVAS = "" +
            "var π = Math.PI\n" +
            "var τ = 2 * π\n" +
            "/**\n" +
            " * <b>e</b><sub>1</sub> is the basis <em>vector</em> corresponding to the <em>x coordinate</em>.\n" +
            " */\n" +
            "var e1 = EIGHT.G2.e1\n" +
            "/**\n" +
            " * <b>e</b><sub>2</sub> is the basis <em>vector</em> corresponding to the <em>y coordinate</em>.\n" +
            " */\n" +
            "var e2 = EIGHT.G2.e2\n" +
            "var zero = EIGHT.G2.zero\n" +
            "var one = EIGHT.G2.one\n" +
            "\n" +
            "/**\n" +
            " * The clockwise <em>bivector</em>, <b>e</b><sub>1</sub> * <b>e</b><sub>2</sub>.\n" +
            " * It is the <em>generator</em> of rotations in the plane.\n" +
            " * It's also a unitary <em>spinor</em> (magnitude is 1).\n" +
            " */\n" +
            "var clockwise = e1 * e2\n" +
            "//console.log(\"clockwise => \" + clockwise)\n" +
            "//console.log(\"angle(clockwise) => \" + clockwise.clone().angle().scale(2 / π) + \" * π / 2 \")\n" +
            "\n" +
            "var up = -e2\n" +
            "var exp = EIGHT.exp\n" +
            "var sqrt = EIGHT.sqrt\n" +
            "\n" +
            "var LINE_WIDTH = 6\n" +
            "var TEE_WIDTH = 6 * LINE_WIDTH\n" +
            "var MAGNET_WIDTH = 0.15\n" +
            "var MAGNET_LENGTH = 4 * MAGNET_WIDTH\n" +
            "\n" +
            "function toCanvasX(position: EIGHT.VectorE2, canvas: HTMLCanvasElement): number {\n" +
            "  return (position.x + 1) * canvas.width / 2\n" +
            "}\n" +
            "\n" +
            "function toCanvasY(position: EIGHT.VectorE2, canvas: HTMLCanvasElement): number {\n" +
            "  return (position.y + 1) * canvas.height / 2\n" +
            "}\n" +
            "\n" +
            "var zeroTwoPi = (θ: number) => {return (θ < 0) ? θ + τ : θ}\n" +
            "var circleRadiusFromArea = (A: number) => {return sqrt(A/π)}\n" +
            "\n" +
            "/**\n" +
            " * Computes the <em>radian measure</em> in going from <em>direction</em> <code>a</code> to <em>direction</em> <code>b</code> relative to the specified angle <code>θ</code>.\n" +
            " */\n" +
            "function radiansFromDirections(a: EIGHT.G2, b: EIGHT.G2, θ: EIGHT.G2): number {\n" +
            "  // a * b = exp(angle)\n" +
            "  var angle = (a * b).angle()\n" +
            "  return radiansFromAngle(angle, θ)\n" +
            "}\n" +
            "\n" +
            "/**\n" +
            " *\n" +
            " */\n" +
            "function radiansFromAngle(angle: EIGHT.G2, θ: EIGHT.G2): number {\n" +
            "  var signum = θ.clone().scp(angle).α < 0 ? +1 : -1\n" +
            "  return angle.magnitude() * signum\n" +
            "}\n" +
            "\n" +
            "/**\n" +
            " *\n" +
            " */\n" +
            "function radiansFromSpinor(spinor: EIGHT.G2, θ: EIGHT.G2): number {return radiansFromAngle(spinor.clone().angle(), θ)}\n" +
            "\n" +
            "/**\n" +
            " * Draws a <em>curly tee</em> as the geometric representation of a spinor.\n" +
            " */\n" +
            "function drawSpinTee(context: CanvasRenderingContext2D, position: EIGHT.VectorE2, spinor: EIGHT.G2, color: any, canvas: HTMLCanvasElement) {\n" +
            "  var radius = circleRadiusFromArea(spinor.magnitude()) * canvas.width / 2\n" +
            "  var θ = zeroTwoPi(radiansFromSpinor(spinor, clockwise))\n" +
            "\n" +
            "  context.save()\n" +
            "  context.lineWidth = LINE_WIDTH\n" +
            "  context.strokeStyle = color\n" +
            "\n" +
            "  context.translate(toCanvasX(position, canvas), toCanvasY(position, canvas))\n" +
            "  context.rotate(-θ)\n" +
            "  context.beginPath()\n" +
            "  context.arc(0, 0, radius, +θ, 0, θ > 0)\n" +
            "  context.moveTo(radius - TEE_WIDTH / 2, 0)\n" +
            "  context.lineTo(radius + TEE_WIDTH / 2, 0)\n" +
            "  context.stroke()\n" +
            "  context.restore()\n" +
            "}\n" +
            "\n" +
            "/**\n" +
            " * Draws a <em>bar magnet</em> at the specified <code>position</code> and with the specified <code>attitude</code>.\n" +
            " */\n" +
            "function drawMagnet(context: CanvasRenderingContext2D, position: EIGHT.VectorE2, attitude: EIGHT.G2, canvas: HTMLCanvasElement) {\n" +
            "  var width = MAGNET_WIDTH * canvas.width / 2\n" +
            "  var length = MAGNET_LENGTH * canvas.width / 2\n" +
            "\n" +
            "  context.save()\n" +
            "  context.translate(toCanvasX(position, canvas), toCanvasY(position, canvas))\n" +
            "  context.rotate(radiansFromSpinor(attitude, clockwise) * -2)\n" +
            "  // var squaredNorm = attitude.squaredNorm()\n" +
            "  // context.scale(squaredNorm, squaredNorm)\n" +
            "  context.fillStyle = 'red'\n" +
            "  context.fillRect(-width / 2, -length / 2, width, length / 2)\n" +
            "  context.fillStyle = 'white'\n" +
            "  context.fillRect(-width / 2, 0, width, length / 2)\n" +
            "  context.restore()\n" +
            "}\n" +
            "\n" +
            "/**\n" +
            " * Draws a <em>wind tee</em> as the geometric representation of a vector.\n" +
            " */\n" +
            "function drawLineTee(context: CanvasRenderingContext2D, position: EIGHT.G2, vector: EIGHT.G2, color: any, canvas: HTMLCanvasElement) {\n" +
            "  context.save()\n" +
            "  context.translate(toCanvasX(position, canvas), toCanvasY(position, canvas))\n" +
            "  context.rotate(radiansFromDirections(up, vector, clockwise))\n" +
            "  context.fillStyle = color\n" +
            "  var height = vector.magnitude() * canvas.width / 2\n" +
            "  context.fillRect(-TEE_WIDTH / 2, -height / 2, TEE_WIDTH, LINE_WIDTH)\n" +
            "  context.fillRect(-LINE_WIDTH / 2, -height / 2, LINE_WIDTH, height)\n" +
            "  context.restore()\n" +
            "}\n" +
            "\n" +
            "/**\n" +
            " * Wrapper function to catch exceptions and log them to the Console as warnings.\n" +
            " * This allows us to continue editing without being interrupted by the debugger.\n" +
            " * <b>Ctrl+Shift+I</b> will open the <em>Developer tools</em> in the Google Chrome browser.\n" +
            " * @param f The function to be wrapped.\n" +
            " */\n" +
            "function guard(f: () => void) {\n" +
            "  return function() {\n" +
            "    try {\n" +
            "      f()\n" +
            "    }\n" +
            "    catch(e) {\n" +
            "      console.warn(e)\n" +
            "    }\n" +
            "  }\n" +
            "}\n" +
            "\n";

        var LESS_TEMPLATE_CANVAS = "" +
            "#doodle1 {\n" +
            "  position: absolute;\n" +
            "  background-color: #cccccc;\n" +
            "  width: 400px;\n" +
            "  height: 400px;\n" +
            "  top: 100px;\n" +
            "  left: 100px;\n" +
            "}\n";

        var HTML_TEMPLATE_EIGHT_2D_1 = "" +
            "<!doctype html>\n" +
            "<html>\n" +
            "  <head>\n" +
            styleMarker() +
            "    <script id='vs' type='x-shader/x-vertex'>\n" +
            "      attribute vec2 aPosition;\n" +
            "      uniform vec3 uColor;\n" +
            "      varying highp vec4 vColor;\n" +
            "      void main(void) {\n" +
            "        gl_Position = vec4(aPosition, 0.0, 1.0);\n" +
            "        vColor = vec4(uColor, 1.0);\n" +
            "      }\n" +
            "    </script>\n" +
            "    <script id='fs' type='x-shader/x-fragment'>\n" +
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

        var CODE_TEMPLATE_EIGHT_2D_1 = "" +
            "DomReady.ready(main)\n" +
            "\n" +
            "function main() {\n" +
            "  var canvas = <HTMLCanvasElement>document.getElementById('my-canvas')\n" +
            "  canvas.width = 400\n" +
            "  canvas.height = 400\n" +
            "\n" +
            "  var ctxt = new EIGHT.GraphicsContext()\n" +
            "  ctxt.clearColor(0.1, 0.1, 0.1, 1.0)\n" +
            "\n" +
            "  ctxt.start(canvas)\n" +
            "\n" +
            "  var attributes: {[name: string]: EIGHT.DrawAttribute} = {}\n" +
            "  var points = new EIGHT.DrawAttribute([0, 0, 0.75, 0, 0, 1], 2)\n" +
            "  attributes[EIGHT.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points\n" +
            "  var primitive = new EIGHT.DrawPrimitive(EIGHT.DrawMode.LINE_LOOP, [0, 1, 2], attributes)\n" +
            "  var triangleElements = ctxt.createBufferGeometry(primitive)\n" +
            "\n" +
            "  // Generate the graphics program rather than building it manually.\n" +
            "  var builder = new EIGHT.GraphicsProgramBuilder()\n" +
            "  // Describe the required program parameters to the builder.\n" +
            "  builder.attribute(EIGHT.GraphicsProgramSymbols.ATTRIBUTE_POSITION, 2)\n" +
            "  builder.uniform(EIGHT.GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3')\n" +
            "  var program = builder.build([ctxt])\n" +
            "  // Take a look at the shader source code that was generated for us.\n" +
            "  console.log(program.vertexShader)\n" +
            "  console.log(program.fragmentShader)\n" +
            "\n" +
            "  // Take control of the the Graphics Pipeline Programming.\n" +
            "  // var program = new EIGHT.HTMLScriptsGraphicsProgram([ctxt], ['vs', 'fs'])\n" +
            "\n" +
            "  function animate() {\n" +
            "\n" +
            "    ctxt.gl.clear(ctxt.gl.COLOR_BUFFER_BIT)\n" +
            "\n" +
            "    program.use()\n" +
            "\n" +
            "    program.uniform3f(EIGHT.GraphicsProgramSymbols.UNIFORM_COLOR, 1, 0, 0)\n" +
            "    triangleElements.bind(program)\n" +
            "    triangleElements.draw()\n" +
            "    triangleElements.unbind()\n" +
            "\n" +
            "    window.requestAnimationFrame(animate)\n" +
            "  }\n" +
            "\n" +
            "  animate()\n" +
            "}\n"

        var LIBS_TEMPLATE_EIGHT_2D_1 = ""

        var LESS_TEMPLATE_EIGHT_2D_1 = "" +
            "#my-canvas {\n" +
            "  position: absolute;\n" +
            "  top: 0;\n" +
            "  left: 15px;\n" +
            "  background-color: #141414;\n" +
            "}\n"

        var HTML_TEMPLATE_EIGHT_3D_1 = "" +
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
            "        vColor = vec4(uColor, 1.0);\n" +
            "        vec3 L = normalize(uDirectionalLightDirection);\n" +
            "        vec3 N = normalize(uNormal * aNormal);\n" +
            "        float cosineFactor = max(dot(N,L), 0.0);\n" +
            "        vLight = uAmbientLight + cosineFactor * uDirectionalLightColor;\n" +
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
            "      varying highp vec4 vC olor;\n" +
            "      vo id main(void) {\n" +
            "        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);\n" +
            "        vColor = vec4(uColor, 1.0);\n" +
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
            "        gl_PointSize = uPointSize;\n" +
            "        vColor = vec4(uColor, 1.0);\n" +
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
            "    <div id='viewer'>\n" +
            "      <canvas id='my-canvas'>\n" +
            "        Your browser does not support the canvas element.\n" +
            "      </canvas>\n" +
            "      <div id='overlay'>\n" +
            "        <div>t: <span id='t'></span></div>\n" +
            "        <div>θ: <span id='θ'></span></div>\n" +
            "        <div>R: <span id='R'></span></div>\n" +
            "      </div>\n" +
            "    </div>\n" +
            "  </body>\n" +
            "</html>\n";

        var CODE_TEMPLATE_EIGHT_3D_1 = "" +
            "DomReady.ready(() => {\n" +
            "  init()\n" +
            "  animate()\n" +
            "})\n" +
            "\n" +
            "var ctxt = new EIGHT.GraphicsContext()\n" +
            "ctxt.enable(EIGHT.Capability.DEPTH_TEST)\n" +
            "ctxt.clearColor(0.2, 0.2, 0.2, 1.0)\n" +
            "\n" +
            "var ambients: EIGHT.IFacet[] = []\n" +
            "var scene = new EIGHT.Scene([ctxt])\n" +
            "var camera: EIGHT.PerspectiveCamera\n" +
            "var cube: EIGHT.Drawable<EIGHT.MeshMaterial>\n" +
            "\n" +
            "var timeElement: HTMLElement\n" +
            "var timeNode: Text\n" +
            "var angleElement: HTMLElement\n" +
            "var angleNode: Text\n" +
            "var spinorElement: HTMLElement\n" +
            "var spinorNode: Text\n" +
            "\n" +
            "/**\n" +
            " * The time interval between animation frames.\n" +
            " */\n" +
            "var dt = 1 / 60 // assume we are getting 60 frames a second.\n" +
            "\n" +
            "/**\n" +
            " * The rotational velocity vector.\n" +
            " */\n" +
            "var ω = 2 * Math.PI * (1/5) * e2\n" +
            "var Ω = dual(ω)\n" +
            "\n" +
            "ambients.push(new EIGHT.AmbientLight(EIGHT.Color.white))\n" +
            "ambients.push(new EIGHT.DirectionalLightE3(-e3))\n" +
            "\n" +
            "/**\n" +
            " * Initializes the scene.\n" +
            " */\n" +
            "function init() {\n" +
            "  var canvas = <HTMLCanvasElement>document.getElementById('my-canvas')\n" +
            "  ctxt.start(canvas)\n" +
            "\n" +
            "  var aspect = window.innerWidth / window.innerHeight\n" +
            "  camera = new EIGHT.PerspectiveCamera(75 * Math.PI / 180, aspect, 1, 1000).setEye(e3 * 2 + e1 * 0.05 + e2)\n" +
            "  ambients.push(camera)\n" +
            "\n" +
            "  var geometry = new EIGHT.BarnSimplexGeometry()\n" +
            "  geometry.k = 1\n" +
            "  var primitives = geometry.toPrimitives()\n" +
            "  var material = new EIGHT.LineMaterial()\n" +
            "\n" +
            "  cube = new EIGHT.Drawable(primitives, material)\n" +
            "  scene.add(cube)\n" +
            "  cube.setFacet('kinematics', new EIGHT.RigidBodyFacetE3()).Ω.copy(I * ω)\n" +
            "  cube.setFacet('color', new EIGHT.ColorFacet()).setRGB(0, 1, 0)\n" +
            "\n" +
            "  ctxt.canvas.width = window.innerWidth\n" +
            "  ctxt.canvas.height = window.innerHeight\n" +
            "  ctxt.viewport(0, 0, window.innerWidth, window.innerHeight)\n" +
            "\n" +
            "  timeElement = document.getElementById('t')\n" +
            "  timeNode = document.createTextNode('')\n" +
            "  timeElement.appendChild(timeNode)\n" +
            "\n" +
            "  angleElement = document.getElementById('θ')\n" +
            "  angleNode = document.createTextNode('')\n" +
            "  angleElement.appendChild(angleNode)\n" +
            "\n" +
            "  spinorElement = document.getElementById('R')\n" +
            "  spinorNode = document.createTextNode('')\n" +
            "  spinorElement.appendChild(spinorNode)\n" +
            "}\n" +
            "\n" +
            "/**\n" +
            " * Animates the scene.\n" +
            " */\n" +
            "function animate() {\n" +
            "  try {\n" +
            "    var gl = ctxt.gl\n" +
            "\n" +
            "    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)\n" +
            "\n" +
            "    var time = Date.now() * 0.001\n" +
            "    timeNode.nodeValue = time.toFixed(2)\n" +
            "\n" +
            "    var θ = time\n" +
            "\n" +
            "    var kinematics = <EIGHT.RigidBodyFacetE3>cube.getFacet('kinematics')\n" +
            "    var X = kinematics.X\n" +
            "    var R = kinematics.R\n" +
            "    var V = kinematics.V\n" +
            "    var Ω = kinematics.Ω\n" +
            "    // X.copy(e1)\n" +
            "    R.rotorFromAxisAngle(e2, θ)\n" +
            "    // R.dual(e2).scale(-θ / 2).exp()\n" +
            "    // R.copy(I * e2).scale(-θ / 2).exp()\n" +
            "    // R.copy(exp(I * e2 * -θ / 2))\n" +
            "    // R.copy(exp(e1 * e2 * e3 * e2 * -θ / 2))\n" +
            "    // R.spinor(e3, e1).scale(-θ / 2).exp()\n" +
            "    // R.sub(Ω * R * dt / 2) // Integrate dR(t)/dt wrt t\n" +
            "\n" +
            "    angleNode.nodeValue = R.clone().angle().toFixed(2)\n" +
            "    spinorNode.nodeValue = R.toFixed(2)\n" +
            "\n" +
            "    scene.draw(ambients)\n" +
            "\n" +
            "    requestAnimationFrame(animate)\n" +
            "  }\n" +
            "  catch(e) {\n" +
            "    console.error(e)\n" +
            "  }\n" +
            "}\n";

        var LIBS_TEMPLATE_EIGHT_3D_1 = "" +
            "var zero = EIGHT.Euclidean3.zero\n" +
            "var one = EIGHT.Euclidean3.one\n" +
            "var e1 = EIGHT.Euclidean3.e1\n" +
            "var e2 = EIGHT.Euclidean3.e2\n" +
            "var e3 = EIGHT.Euclidean3.e3\n" +
            "\n" +
            "/**\n" +
            " * The pseudoscalar for the Euclidean3 Geometric Space, I = e1 * e2 * e3.\n" +
            " */\n" +
            "var I  = e1 * e2 * e3\n" +
            "\n" +
            "/**\n" +
            " * The universal exponential function, exp.\n" +
            " */\n" +
            "var exp = EIGHT.exp\n" +
            "\n" +
            "/**\n" +
            " * The universal logarithm function, log.\n" +
            " */\n" +
            "var log = EIGHT.log\n" +
            "\n" +
            "/**\n" +
            " * dual(m) = m << I<sub>3</sub><sup>-1</sup>\n" +
            " */\n" +
            "function dual(m: EIGHT.Euclidean3): EIGHT.Euclidean3 {\n" +
            "  return m << (I / (I * I)) // Dorst, Fontijne, Mann\n" +
            "  // return I * m // Hestenes, Doran, Lasenby\n" +
            "  // return m * (I / (I * I)) // Hestenes, Doran, Lasenby\n" +
            "}\n" +
            "\n"

        var LESS_TEMPLATE_EIGHT_3D_1 = "" +
            "body {\n" +
            "  margin: 0;\n" +
            "}\n" +
            "\n" +
            "canvas {\n" +
            "  width: 100%;\n" +
            "  height: 100%;\n" +
            "}\n" +
            "\n" +
            "#overlay {\n" +
            "  position: absolute;\n" +
            "  left: 10px;\n" +
            "  top: 10px;\n" +
            "  background-color: rgba(0, 0, 0, 0.7);\n" +
            "  color: white;\n" +
            "  font-family: monospace;\n" +
            "  padding: 1em;\n" +
            "  border-radius: 1em;\n" +
            "  border: 2px solid #00ff00;\n" +
            "  // text-shadow: 0px 0px 4px white;\n" +
            "}\n" +
            "\n" +
            "#stats { position: absolute; top: 0; left: 0; }\n";

        var HTML_TEMPLATE_EIGHT_3D_2 = "" +
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
            "        vColor = vec4(uColor, 1.0);\n" +
            "        vec3 L = normalize(uDirectionalLightDirection);\n" +
            "        vec3 N = normalize(uNormal * aNormal);\n" +
            "        float cosineFactor = max(dot(N,L), 0.0);\n" +
            "        vLight = uAmbientLight + cosineFactor * uDirectionalLightColor;\n" +
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
            "        vColor = vec4(uColor, 1.0);\n" +
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
            "        gl_PointSize = uPointSize;\n" +
            "        vColor = vec4(uColor, 1.0);\n" +
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

        var CODE_TEMPLATE_EIGHT_3D_2 = "" +
            "/**\n" +
            " * The period of the motions in the animation.\n" +
            " * Break the rules! It's better to use (sometimes) short variable names in math programs!!\n" +
            " * Hint: Hover over a variable anywhere in the program to see the corresponding documentation.\n" +
            " */\n" +
            "var T: EIGHT.Euclidean3 = 4 * second\n" +
            "/**\n" +
            " * The frequency of the motions in the animation.\n" +
            " */\n" +
            "var f = (1 / T)\n" +
            "/**\n" +
            " * The angular velocity, omega, corresponding to the frequency, f.\n" +
            " */\n" +
            "var omega = (2 * Math.PI * f)\n" +
            "\n" +
            "/**\n" +
            " * For a future example...\n" +
            " */\n" +
            "function surfaceFn(u: number, v: number): EIGHT.VectorE3 {\n" +
            "  var x = 3 * (u - 0.5)\n" +
            "  var z = 3 * (v - 0.5)\n" +
            "  var y = 0\n" +
            "  return x * e1 + y * e2 + z * e3\n" +
            "}\n" +
            "\n" +
            "/**\n" +
            " * main() is called by the DomReady preamble in the Libs file, in case you were wondering!\n" +
            " * This code illustrates the main ideas in using EIGHT.\n" +
            " * This code does not show how to perform robust resource management.\n" +
            " */\n" +
            "function main() {\n" +
            "\n" +
            "  // Let's take a look at the program 'parameters' in the Console. (Ctrl-Shift-J) on Linux.\n" +
            "  console.log('period,    T    => ' + T)\n" +
            "  console.log('frequency, f    => ' + f)\n" +
            "  console.log('surfaceFn(1, 1) => ' + surfaceFn(1, 1))\n" +
            "\n" +
            "  // Cast to HTMLCanvasElement because getElementById has no clue what we are dealing with.\n" +
            "  var canvas = <HTMLCanvasElement>document.getElementById('my-canvas')\n" +
            "  canvas.width = window.innerWidth\n" +
            "  canvas.height = window.innerHeight\n" +
            "\n" +
            "  /**\n" +
            "   * The user-defined canvas id (important in multi-canvas applications).\n" +
            "   */\n" +
            "  var canvasId = 42\n" +
            "\n" +
            "  /**\n" +
            "   * The manager takes care of WebGLBuffer(s) and other resources so that you don't have to.\n" +
            "   * The manager also assists with context loss handling.\n" +
            "   * This frees you to write great shader programs, geometry generators, and your own scene graph.\n" +
            "   * But there are also utilities for smart programs, predefined geometries, and transformations to get you started or for demos.\n" +
            "   * We start the manager now to initialize the WebGL context.\n" +
            "   */\n" +
            "  var ctxt = new EIGHT.GraphicsContext()\n" +
            "  ctxt.enable(EIGHT.Capability.DEPTH_TEST)\n" +
            "  ctxt.clearColor(0.2, 0.2, 0.2, 1.0)\n" +
            "\n" +
            "  /**\n" +
            "   * The camera is mutable and provides uniforms through the EIGHT.IFacet interface.\n" +
            "   */\n" +
            "  var camera = new EIGHT.PerspectiveCamera().setAspect(canvas.clientWidth / canvas.clientHeight).setEye(2.0 * e3)\n" +
            "  /**\n" +
            "   * Ambient Light.\n" +
            "   */\n" +
            "  var ambientLight = new EIGHT.R3([0.3, 0.3, 0.3])\n" +
            "  /**\n" +
            "   * Directional Light Color.\n" +
            "   */\n" +
            "  var dLightColor = new EIGHT.R3([0.7, 0.7, 0.7])\n" +
            "  /**\n" +
            "   * Directional Light Directiion.\n" +
            "   */\n" +
            "  var dLightDirection = new EIGHT.R3([2, 3, 5])\n" +
            "\n" +
            "  /**\n" +
            "   * Program for rendering TRIANGLES with moderately fancy lighting.\n" +
            "   */\n" +
            "  var programT = new EIGHT.HTMLScriptsGraphicsProgram([ctxt], ['vs-triangles', 'fs-triangles'], document)\n" +
            "  /**\n" +
            "   * Program for rendering LINES.\n" +
            "   */\n" +
            "  var programL = new EIGHT.HTMLScriptsGraphicsProgram([ctxt], ['vs-lines', 'fs-lines'], document)\n" +
            "  /**\n" +
            "   * Program for rendering POINTS.\n" +
            "   */\n" +
            "  var programP = new EIGHT.HTMLScriptsGraphicsProgram([ctxt], ['vs-points', 'fs-points'], document)\n" +
            "  /**\n" +
            "   * Program used by the cube, TBD based on geometry dimensionality.\n" +
            "   */\n" +
            "  var materialCube: EIGHT.IGraphicsProgram\n" +
            "\n" +
            "  ctxt.start(canvas, canvasId)\n" +
            "\n" +
            "  var stats = new Stats()\n" +
            "  stats.setMode(0)\n" +
            "  document.body.appendChild(stats.domElement)\n" +
            "\n" +
            "  // The camera sets uniforms for the visiting program by canvas.\n" +
            "  camera.setUniforms(programT, canvasId)\n" +
            "  camera.setUniforms(programL, canvasId)\n" +
            "  camera.setUniforms(programP, canvasId)\n" +
            "  // Uniforms may also be set directly and some standard names are symbolically defined.\n" +
            "  // The names used here should match the names used in the program source code.\n" +
            "  programT.vector3(EIGHT.GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, ambientLight.coords, canvasId)\n" +
            "  programT.vector3('uDirectionalLightColor', dLightColor.coords, canvasId)\n" +
            "  programT.vector3('uDirectionalLightDirection', dLightDirection.coords, canvasId)\n" +
            "  programP.uniform1f('uPointSize', 4, canvasId)\n" +
            "\n" +
            "  /**\n" +
            "   * The buffered geometry for the cube.\n" +
            "   * This is an object that hides the messy buffer management details.\n" +
            "   */\n" +
            "  var geobuff: EIGHT.IBufferGeometry\n" +
            "  /**\n" +
            "   * The model for the cube, which implements EIGHT.IFacet having the\n" +
            "   * method `setUniforms(visitor: EIGHT.IFacetVisitor, canvasId: number): void`./\n" +
            "   * Implement your own custom models to do e.g., articulated robots./\n" +
            "   * See example in Libs file./\n" +
            "   */\n" +
            "  var model: EIGHT.ModelFacetE3\n" +
            "  var color: EIGHT.ColorFacet\n" +
            "\n" +
            "  // We start with the geometry (geometry) for a unit cube at the origin...\n" +
            "  // A geometry is considered to be an array of simplices.\n" +
            "  var geometry = new EIGHT.CuboidSimplexGeometry()\n" +
            "  geometry.k = EIGHT.Simplex.TRIANGLE\n" +
            "  // Subdivide the geometry (here twice) if you wish to get more detail.\n" +
            "  // Hit 'Play' in mathdoodle.io to see the effect of, say, n = 0, 1, 2, 3.\n" +
            "  geometry.subdivide(2);\n" +
            "  // Apply the boundary operator once to make TRIANGLES => LINES,\n" +
            "  // twice to make TRIANGLES => POINTS,\n" +
            "  // three times to make TRIANGLES => an empty simplex with k = -1,)\n" +
            "  // four times to make TRIANGLES => undefined.\n" +
            "  // Try the values n = 0, 1, 2, 3, 4. Look at the canvas and the Console.\n" +
            "  geometry.boundary(0)\n" +
            "  /**\n" +
            "   * Summary information on the geometry such as dimensionality and sizes for attributes.\n" +
            "   * This same data structure may be used to map geometry attribute names to program names.\n" +
            "   */\n" +
            "  // Check that we still have a defined geometry after all that mucking about.\n" +
            "  if (geometry.meta) {\n" +
            "    // Convert the geometry to drawing elements.\n" +
            "    var primitives: EIGHT.DrawPrimitive[] = geometry.toPrimitives();\n" +
            "    // Submit the geometry data to the context which will manage underlying WebGLBuffer(s) for you.\n" +
            "    geobuff = ctxt.createBufferGeometry(primitives[0])\n" +
            "    if (geobuff) {\n" +
            "      // Pick an appropriate program to use with the mesh based upon the dimensionality.\n" +
            "      switch(geometry.meta.k) {\n" +
            "        case EIGHT.Simplex.POINT: {\n" +
            "          materialCube = programP\n" +
            "        }\n" +
            "        break\n" +
            "        case EIGHT.Simplex.LINE: {\n" +
            "          materialCube = programL\n" +
            "        }\n" +
            "        break\n" +
            "        case EIGHT.Simplex.TRIANGLE: {\n" +
            "          materialCube = programT\n" +
            "        }\n" +
            "        break\n" +
            "        default: {\n" +
            "          throw new Error('Unexpected dimensions for simplex: ' + geometry.meta.k)\n" +
            "        }\n" +
            "      }\n" +
            "    }\n" +
            "    else {\n" +
            "      console.warn('Nothing to see because the geometry is empty. dimensions => ' + geometry.meta.k)\n" +
            "    }\n" +
            "  }\n" +
            "  else {\n" +
            "    console.warn('Nothing to see because the geometry is undefined.')\n" +
            "  }\n" +
            "  // Create the model anyway (not what we would do in the real world).\n" +
            "  model = new EIGHT.ModelFacetE3()\n" +
            "  // Green, like on the 'Matrix', would be a good color, Neo. Or maybe red or blue?\n" +
            "  color = new EIGHT.ColorFacet().setRGB(0, 1, 0)\n" +
            "\n" +
            "  // PERFORMANCE HINT\n" +
            "  // In order to avoid creating temporary objects and excessive garbage collection,\n" +
            "  // perform immutable/operator computations outside of the animation loop and\n" +
            "  // use EIGHT mutable objects and methods inside the animation loop.\n" +
            "  /**\n" +
            "   * The angle of tilt of the precessing vector.\n" +
            "   */\n" +
            "  var tiltAngle = 30 * Math.PI / 180\n" +
            "  /**\n" +
            "   * S, a spinor representing the default attitude of the cube.\n" +
            "   */\n" +
            "  // We're using EIGHT, Geometric Algebra, and operator overloading here.\n" +
            "  // We perform similar calculations inside the animation loop using BLADE mutable types.\n" +
            "  // The global constants, e1, e2 and e3, are defined in the 'Libs' file.\n" +
            "  var S = exp(-(e2 ^ e1) * tiltAngle / 2)\n" +
            "  var B = e3 ^ e1\n" +
            "  var rotorL = new EIGHT.G3()\n" +
            "  var rotorR = new EIGHT.G3()\n" +
            "\n" +
            "  EIGHT.animation((time: number) => {\n" +
            "    stats.begin()\n" +
            "    // Use the scalar property, w, in order to keep things fast.\n" +
            "    /**\n" +
            "     * theta = omega * time, is the basic angle used in the animation.\n" +
            "     */\n" +
            "    var theta: number = omega.α * time\n" +
            "    // Simple Harmonic Motion.\n" +
            "    // model.X.copy(e2).scale(1.2 * sin(theta))\n" +
            "\n" +
            "    // Precession demonstrates spinor multiplication.\n" +
            "    // R = exp(-B * theta / 2)\n" +
            "    // attitude = R * S * ~R\n" +
            "    rotorL.copy(B).scale(-theta / 2).exp()\n" +
            "    rotorR.copy(rotorL).rev()\n" +
            "    model.R.copy(rotorL).mul(S).mul(rotorR)\n" +
            "\n" +
            "    // Rotation generated by e1 ^ e3.\n" +
            "    // model.R.spinor(e1, e3).scale(-theta / 2).exp()\n" +
            "\n" +
            "    // orbit\n" +
            "    // position = R * e1 * ~R\n" +
            "    // model.X.copy(e1).rotate(rotorL)\n" +
            "\n" +
            "    var gl = ctxt.gl\n" +
            "\n" +
            "    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)\n" +
            "\n" +
            "    if (geobuff) {\n" +
            "      // Make the appropriate WebGLProgram current.\n" +
            "      materialCube.use(canvasId)\n" +
            "      // The model sets uniforms on the program, for the specified canvas.\n" +
            "      model.setUniforms(materialCube, canvasId)\n" +
            "      color.setUniforms(materialCube, canvasId)\n" +
            "      // Bind the appropriate underlying buffers and enable attribute locations.\n" +
            "      geobuff.bind(materialCube)\n" +
            "      // Make the appropriate drawElements() or drawArrays() call.\n" +
            "      geobuff.draw()\n" +
            "      // Unbind the buffers and disable attribute locations.\n" +
            "      geobuff.unbind()\n" +
            "    }\n" +
            "\n" +
            "    stats.end()\n" +
            "  }).start()\n" +
            "}\n";

        var LIBS_TEMPLATE_EIGHT_3D_2 = "" +
            "DomReady.ready(function() {\n" +
            "  try {\n" +
            "    main()\n" +
            "  }\n" +
            "  catch(e) {\n" +
            "    console.error(e)\n" +
            "  }\n" +
            "})\n" +
            "\n" +
            "/**\n" +
            " * Standard basis vector in the x-axis direction.\n" +
            " */\n" +
            "var e1 = EIGHT.Euclidean3.e1\n" +
            "/**\n" +
            " * Standard basis vector in the y-axis direction.\n" +
            " */\n" +
            "var e2 = EIGHT.Euclidean3.e2\n" +
            "/**\n" +
            " * Standard basis vector in the z-axis direction.\n" +
            " */\n" +
            "var e3 = EIGHT.Euclidean3.e3\n" +
            "var e12 = e1 * e2\n" +
            "var e23 = e2 * e3\n" +
            "var e32 = e3 * e2\n" +
            "\n" +
            "/**\n" +
            " * Returns the cosine of a number.\n" +
            " */\n" +
            "var cos = EIGHT.cos\n" +
            "/**\n" +
            " * Returns e (the base of natural logarithms) raised to a power.\n" +
            " */\n" +
            "var exp = EIGHT.exp\n" +
            "/**\n" +
            " * Returns the sine of a number.\n" +
            " */\n" +
            "var sin = EIGHT.sin\n" +
            "\n" +
            "/**\n" +
            " * S.I. units of measure.\n" +
            " */\n" +
            "var kilogram = EIGHT.Euclidean3.kilogram\n" +
            "var meter    = EIGHT.Euclidean3.meter\n" +
            "var second   = EIGHT.Euclidean3.second\n" +
            "var hertz    = 1 / EIGHT.Euclidean3.second\n" +
            "\n" +
            "class Model extends EIGHT.Shareable implements EIGHT.IFacet {\n" +
            "  public position = new EIGHT.R3()\n" +
            "  public attitude = new EIGHT.SpinG3()\n" +
            "  public scale: EIGHT.R3 = new EIGHT.R3([1, 1, 1])\n" +
            "  public color: EIGHT.R3 = new EIGHT.R3([1, 1, 1])\n" +
            "  private M = EIGHT.Matrix4.one()\n" +
            "  private N = EIGHT.Matrix3.one()\n" +
            "  private R = EIGHT.Matrix4.one()\n" +
            "  private S = EIGHT.Matrix4.one()\n" +
            "  private T = EIGHT.Matrix4.one()\n" +
            "  constructor() {\n" +
            "    super('Model')\n" +
            "    this.position.modified = true\n" +
            "    this.attitude.modified = true\n" +
            "    this.scale.modified = true\n" +
            "    this.color.modified = true\n" +
            "  }\n" +
            "  destructor(): void {\n" +
            "    this.position = void 0\n" +
            "    this.attitude = void 0\n" +
            "    this.scale    = void 0\n" +
            "    this.color    = void 0\n" +
            "    this.M        = void 0\n" +
            "    this.N        = void 0\n" +
            "    this.R        = void 0\n" +
            "    this.S        = void 0\n" +
            "    this.T        = void 0\n" +
            "  }\n" +
            "  getProperty(name: string): number[] {\n" +
            "    throw new Error()\n" +
            "  }\n" +
            "  setProperty(name: string, value: number[]): void {\n" +
            "  }\n" +
            "  \n" +
            "  setUniforms(visitor: EIGHT.IFacetVisitor, canvasId: number) {\n" +
            "  // FIXME: canvasId will be used in uniform setting calls.\n" +
            "    if (this.position.modified) {\n" +
            "      this.T.translation(this.position)\n" +
            "      this.position.modified = false\n" +
            "    }\n" +
            "    if (this.attitude.modified) {\n" +
            "        this.R.rotation(this.attitude)\n" +
            "        this.attitude.modified = false\n" +
            "    }\n" +
            "    if (this.scale.modified) {\n" +
            "      this.S.scaling(this.scale)\n" +
            "      this.scale.modified = false\n" +
            "    }\n" +
            "    this.M.copy(this.T).mul(this.R).mul(this.S)\n" +
            "\n" +
            "    this.N.normalFromMatrix4(this.M)\n" +
            "\n" +
            "    visitor.uniformMatrix4(EIGHT.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, false, this.M, canvasId)\n" +
            "    visitor.uniformMatrix3(EIGHT.GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, false, this.N, canvasId)\n" +
            "    visitor.uniformVectorE3(EIGHT.GraphicsProgramSymbols.UNIFORM_COLOR, this.color, canvasId)\n" +
            "  }\n" +
            "}\n" +
            "";

        var LESS_TEMPLATE_EIGHT_3D_2 = "" +
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
            "        <label>Name:</label>\n" +
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
            "var scene = new THREE.Scene();\n" +
            "var camera: THREE.PerspectiveCamera;\n" +
            "var renderer = new THREE.WebGLRenderer();\n" +
            "var mesh: THREE.Mesh;\n" +
            "\n" +
            "var stats = new Stats();\n" +
            "stats.setMode(0);\n" +
            "document.body.appendChild(stats.domElement);\n" +
            "\n" +
            "init();\n" +
            "animate();\n" +
            "\n" +
            "/**\n" +
            " * Initializes the scene.\n" +
            " */\n" +
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
            "/**\n" +
            " * Animates the scene.\n" +
            " */\n" +
            "function animate() {\n" +
            "  stats.begin();\n" +
            "  requestAnimationFrame(animate);\n" +
            "\n" +
            "  mesh.rotation.x = Date.now() * 0.0005;\n" +
            "  mesh.rotation.y = Date.now() * 0.001;\n" +
            "\n" +
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

        var HTML_TEMPLATE_ANGULAR_EIGHT = "" +
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
            "        gl_PointSize = uPointSize;\n" +
            "        vColor = vec4(uColor, 1.0);\n" +
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
            "        <h1>AngularJS and EIGHT</h1>\n" +
            "      </div>\n" +
            "      <div ng-controller='my-controller'>\n" +
            "        <h3>Spinors and Rotations</h3>\n" +
            "        <p>An example using the <em>EIGHT</em> module to perform <b>Geometric Algebra</b> mathematics, <em>EIGHT</em> for <b>WebGL</b> rendering, and <em>AngularJS</em> for the Model-View-Whatever <b>User Interface</b>.</p>\n" +
            "        <canvas id='canvasId' style='width:600px; height:400px;'></canvas>\n" +
            "        <div>\n" +
            "          <h1>time: {{runner.time | number:2}}</h1>\n" +
            "          <button ng-click='handleStartOrStop()'>{{runner.isRunning ? 'Stop' : 'Start'}}</button>\n" +
            "          <button ng-click='handleResetOrLap()' ng-show='runner.isPaused'>{{runner.isPaused ? 'Reset' : 'Lap'}}</button>\n" +
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

        var CODE_TEMPLATE_ANGULAR_EIGHT = "" +
            "interface IMyScope extends angular.IScope {\n" +
            "  /**\n" +
            "   * The `runner` runs the animation.\n" +
            "   */\n" +
            "  runner: EIGHT.WindowAnimationRunner\n" +
            "  /**\n" +
            "   * Invoked when the user requests `start` or `stop`.\n" +
            "   */\n" +
            "  handleStartOrStop(): void\n" +
            "  /**\n" +
            "   * Invoked when the user requests `reset` or `lap`.\n" +
            "   */\n" +
            "  handleResetOrLap(): void\n" +
            "}\n" +
            "\n" +
            "(function (app: angular.IModule) {\n" +
            "\n" +
            "  app.controller('my-controller', ['$window', '$scope', function MyController($window: Window, $scope: IMyScope) {\n" +
            "\n" +
            "    // PERFORMANCE HINT\n" +
            "    // In order to avoid creating temporary objects and excessive garbage collection,\n" +
            "    // perform immutable/operator computations outside of the animation loop and\n" +
            "    // use EIGHT mutable objects and methods inside the animation loop.\n" +
            "    var e1 = EIGHT.Euclidean3.e1\n" +
            "    var e2 = EIGHT.Euclidean3.e2\n" +
            "    var e3 = EIGHT.Euclidean3.e3\n" +
            "    var exp = EIGHT.exp\n" +
            "    var T = 4\n" +
            "    var f = 1 / T\n" +
            "    var omega = 2 * Math.PI * f\n" +
            "\n" +
            "    var canvas = <HTMLCanvasElement>$window.document.getElementById('canvasId')\n" +
            "    canvas.width = 600\n" +
            "    canvas.height = 400\n" +
            "\n" +
            "    var ctxt: EIGHT.GraphicsContext\n" +
            "\n" +
            "    var camera = new EIGHT.PerspectiveCamera().setAspect(canvas.clientWidth / canvas.clientHeight).setEye(3.0 * e3)\n" +
            "\n" +
            "    var geobuff: EIGHT.IBufferGeometry\n" +
            "    var material: EIGHT.IGraphicsProgram\n" +
            "    var model = new EIGHT.ModelFacetE3()\n" +
            "    var color = new EIGHT.ColorFacet()\n" +
            "\n" +
            "    var R = -(e1 ^ e2) / 2\n" +
            "\n" +
            "    function setUp() {\n" +
            "      EIGHT.refChange('reset', 'setUp()')\n" +
            "      EIGHT.refChange('start', 'setUp()')\n" +
            "\n" +
            "      ctxt = new EIGHT.GraphicsContext()\n" +
            "      ctxt.enable(EIGHT.Capability.DEPTH_TEST)\n" +
            "      ctxt.clearColor(0.2, 0.2, 0.2, 1.0)\n" +
            "      ctxt.start(canvas, 0)\n" +
            "\n" +
            "      material = new EIGHT.HTMLScriptsGraphicsProgram([ctxt], ['vs-points', 'fs-points'], document)\n" +
            "\n" +
            "      var vec0 = new EIGHT.R3([0.0,  0.0, 0.0])\n" +
            "      var vec1 = new EIGHT.R3([1.0, -0.2, 0.0])\n" +
            "      var vec2 = new EIGHT.R3([1.0, +0.2, 0.0])\n" +
            "      var simplices = EIGHT.triangle(vec0, vec1, vec2)\n" +
            "      var meta = EIGHT.simplicesToGeometryMeta(simplices)\n" +
            "      // console.log(JSON.stringify(meta, null, 2))\n" +
            "      // Map standard names in geometry to names used in vertex shader code.\n" +
            "      meta.attributes[EIGHT.GraphicsProgramSymbols.ATTRIBUTE_POSITION].name = 'aPosition'\n" +
            "      var data = EIGHT.simplicesToDrawPrimitive(simplices, meta)\n" +
            "\n" +
            "      geobuff = ctxt.createBufferGeometry(data)\n" +
            "\n" +
            "      camera.setUniforms(material, ctxt.canvasId)\n" +
            "    }\n" +
            "\n" +
            "    // If you wish to work with AngularJS scope variables,\n" +
            "    // use tick rather than animate because tick is called from a non-AngularJS context.\n" +
            "    function tick(time: number) {\n" +
            "      $scope.$apply(function() {\n" +
            "        animate(time)\n" +
            "      })\n" +
            "    }\n" +
            "\n" +
            "    function animate(time: number) {\n" +
            "\n" +
            "      var theta = omega * time\n" +
            "\n" +
            "\n" +
            "      geobuff.bind(material)\n" +
            "\n" +
            "      color.setRGB(0.0, 1.0, 0.0)\n" +
            "      for(var i = 0; i < 8; i++) {\n" +
            "        model.R.copy(R).scale(theta - i * 2 * Math.PI / 8).exp()\n" +
            "        model.setUniforms(material, ctxt.canvasId)\n" +
            "        color.setUniforms(material, ctxt.canvasId)\n" +
            "        geobuff.draw()\n" +
            "        color.scaleRGB(0.7)\n" +
            "      }\n" +
            "\n" +
            "      geobuff.unbind()\n" +
            "    }\n" +
            "\n" +
            "    function terminate(time: number) { return false }\n" +
            "\n" +
            "    function tearDown(e: Error) {\n" +
            "      // Any exception thrown in the animation loop is reported here.\n" +
            "      if (e) {\n" +
            "        console.warn(e)\n" +
            "      }\n" +
            "\n" +
            "      geobuff.release()\n" +
            "      geobuff = void 0\n" +
            "\n" +
            "      material.release()\n" +
            "      material = void 0\n" +
            "\n" +
            "      ctxt.stop()\n" +
            "      ctxt.release()\n" +
            "      ctxt = void 0\n" +
            "\n" +
            "      var outstanding = EIGHT.refChange('stop', 'tearDown()')\n" +
            "      //if (outstanding > 0) {\n" +
            "        EIGHT.refChange('dump', 'tearDown()')\n" +
            "      //}\n" +
            "      EIGHT.refChange('reset', 'tearDown()')\n" +
            "\n" +
            "      $scope.$apply(function() {\n" +
            "      })\n" +
            "    }\n" +
            "\n" +
            "    // Again, if you wish to work with AngularJS scope variables,\n" +
            "    // use tick rather than animate because tick is called from a non-AngularJS context.\n" +
            "    $scope.runner = EIGHT.animation(animate, {terminate: terminate, setUp: setUp, tearDown: tearDown, window: $window});\n" +
            "\n" +
            "    $scope.handleStartOrStop = function() {\n" +
            "      if ($scope.runner.isRunning) {\n" +
            "        $scope.runner.stop()\n" +
            "      }\n" +
            "      else {\n" +
            "        $scope.runner.start()\n" +
            "      }\n" +
            "    }\n" +
            "\n" +
            "    $scope.handleResetOrLap = function() {\n" +
            "      if ($scope.runner.isPaused) {\n" +
            "        $scope.runner.reset()\n" +
            "      }\n" +
            "      else if ($scope.runner.isRunning) {\n" +
            "        $scope.runner.lap()\n" +
            "      }\n" +
            "    }\n" +
            "\n" +
            "  }]);\n" +
            "})(angular.module('doodle', []))\n";

        var LIBS_TEMPLATE_ANGULAR_EIGHT = "//\n";

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
            "  var z = new EIGHT.CC(x, y).exp();\n" +
            "  return [z.x, z.y, x+y];\n" +
            "}\n";

        var LIBS_TEMPLATE_MATHBOX = "//\n";

        var LESS_TEMPLATE_MATHBOX = "";

        return [
            {
                uuid: uuid.generate(),
                description: "2D Mathematical Graphics with EIGHT and WebGL",
                isCodeVisible: true,
                isViewVisible: true,
                focusEditor: undefined,
                lastKnownJs: {},
                operatorOverloading: true,
                html: HTML_TEMPLATE_EIGHT_2D_1,
                code: CODE_TEMPLATE_EIGHT_2D_1,
                libs: LIBS_TEMPLATE_EIGHT_2D_1,
                less: LESS_TEMPLATE_EIGHT_2D_1,
                dependencies: ['DomReady', 'davinci-eight']
            },
            {
                uuid: uuid.generate(),
                description: "2D Mathematical Graphics with HTML5 Canvas API and Geometric Algebra",
                isCodeVisible: true,
                isViewVisible: true,
                focusEditor: undefined,
                lastKnownJs: {},
                operatorOverloading: true,
                html: HTML_TEMPLATE_CANVAS,
                code: CODE_TEMPLATE_CANVAS,
                libs: LIBS_TEMPLATE_CANVAS,
                less: LESS_TEMPLATE_CANVAS,
                dependencies: ['DomReady', 'davinci-eight']
            },
            {
                uuid: uuid.generate(),
                description: "3D Mathematical Graphics with EIGHT, WebGL, and Geometric Algebra (1)",
                isCodeVisible: true,
                isViewVisible: true,
                focusEditor: undefined,
                lastKnownJs: {},
                operatorOverloading: true,
                html: HTML_TEMPLATE_EIGHT_3D_1,
                code: CODE_TEMPLATE_EIGHT_3D_1,
                libs: LIBS_TEMPLATE_EIGHT_3D_1,
                less: LESS_TEMPLATE_EIGHT_3D_1,
                dependencies: ['DomReady', 'davinci-eight', 'stats.js']
            },
            {
                uuid: uuid.generate(),
                description: "3D Mathematical Graphics with EIGHT, WebGL, and Geometric Algebra (2)",
                isCodeVisible: true,
                isViewVisible: true,
                focusEditor: undefined,
                lastKnownJs: {},
                operatorOverloading: true,
                html: HTML_TEMPLATE_EIGHT_3D_2,
                code: CODE_TEMPLATE_EIGHT_3D_2,
                libs: LIBS_TEMPLATE_EIGHT_3D_2,
                less: LESS_TEMPLATE_EIGHT_3D_2,
                dependencies: ['DomReady', 'davinci-eight', 'stats.js']
            },
            {
                uuid: uuid.generate(),
                description: "3D Mathematical Graphics with EIGHT, WebGL, and Geometric Algebra (3)",
                isCodeVisible: true,
                isViewVisible: true,
                focusEditor: undefined,
                lastKnownJs: {},
                operatorOverloading: true,
                html: HTML_TEMPLATE_ANGULAR_EIGHT,
                code: CODE_TEMPLATE_ANGULAR_EIGHT,
                libs: LIBS_TEMPLATE_ANGULAR_EIGHT,
                less: LESS_TEMPLATE_BASIC,
                dependencies: ['angular', 'davinci-eight', 'stats.js']
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
              dependencies: ['DomReady','davinci-mathbox','davinci-eight']
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
            },
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