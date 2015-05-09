/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../services/uuid/IUuidService.ts" />
/**
 * The `templates` service provides starting point doodles.
 * A template is essentially a doodle that is copied.
 * Instead of being a fixed set of templates, we want to make the templates extensible.
 * We expect that this will happen through HTTP, hence the inclusion of $http.
 */
angular.module('app').factory('templates', ['$http', 'uuid4', function($http: angular.IHttpService, uuid: IUuidService): mathdoodle.IDoodle[] {

  var HTML_TEMPLATE_BASIC = "" +
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "  <head>\n" +
    "    <!-- STYLE-MARKER -->\n" +
    "    <!-- SCRIPTS-MARKER -->\n" +
    "  </head>\n" +
    "  <body style='margin: 0;'>\n" +
    "    <script type='text/javascript'>\n" +
    "      try {\n" +
    "      <!-- CODE-MARKER -->\n" +
    "      }\n" +
    "      catch(e) {\n" +
    "        console.log(e);\n" +
    "      }\n" +
    "    </script>\n" +
    "  </body>\n" +
    "</html>\n";

  var CODE_TEMPLATE_BASIC = "" +
    "// Enter your TypeScript code here\n" +
    "// It will be combined with the HTML at the <!-- CODE-MARKER --> comment.\n";

  var LESS_TEMPLATE_BASIC = "" +
    "// Enter your CSS style here\n" +
    "// It will be combined with the HTML at the <!-- STYLE-MARKER --> comment.\n";

  var HTML_TEMPLATE_ANGULAR = "" +
    "<!doctype html>\n" +
    "<html ng-app='doodle'>\n" +
    "  <head>\n" +
    "    <meta charset='utf-8'/>\n" +
    "    <link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css'>\n" +
    "    <!-- STYLE-MARKER -->\n" +
    "    <!-- SCRIPTS-MARKER -->\n" +
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
    "    <script type='text/javascript'>\n" +
    "      try {\n" +
    "      <!-- CODE-MARKER -->\n" +
    "      }\n" +
    "      catch(e) {\n" +
    "        console.log(e);\n" +
    "      }\n" +
    "    </script>\n" +
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

  var CODE_TEMPLATE_THREEJS = "" +
    "var scene = new THREE.Scene();\n"+
    "var camera: THREE.PerspectiveCamera;\n"+
    "var renderer = new THREE.WebGLRenderer();\n" +
    "var mesh: THREE.Mesh;\n" +
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
    "  requestAnimationFrame(animate);\n" +
    "\n" +
    "  mesh.rotation.x = Date.now() * 0.0005;\n"+
    "  mesh.rotation.y = Date.now() * 0.001;\n"+
    "\n"+
    "  renderer.render(scene, camera);\n"+
  "}\n";

  var CODE_TEMPLATE_VISUAL = "" +
    "/**\n"+
    " * The unit vector in the x-direction.\n"+
    " */\n"+
    "var e1 = blade.vectorE3(1, 0, 0);\n"+
    "/**\n"+
    " * The unit vector in the y-direction.\n"+
    " */\n"+
    "var e2 = blade.vectorE3(0, 1, 0);\n"+
    "/**\n"+
    " * The unit vector in the z-direction.\n"+
    " */\n"+
    "var e3 = blade.vectorE3(0, 0, 1);\n"+
    "/**\n"+
    " * Computes the exponential function for a bivector argument.\n"+
    " * @param x The argument to the exponential function, a bivector is expected.\n"+
    " */\n"+
    "function exp(x: blade.Euclidean3): blade.Euclidean3 {\n"+
    "    // We now have to extract the scalar component to calculate cos, sin.\n"+
    "    // Of course, we could have universal functions instead.\n"+
    "    var angle = x.norm();\n"+
    "    /**\n"+
    "     * A unit bivector representing the generator of the rotation.\n"+
    "     */\n"+
    "    var B = x / angle;\n"+
    "    return Math.cos(angle.w) + B * Math.sin(angle.w);\n"+
    "}\n"+
    "\n"+
    "var viz = new visual.WebGLCanvas(window);\n"+
    //"\n"+
    //var title = new createjs.Text("Visualizing Geometric Algebra with WebGL", "24px Helvetica", "white");
    //title.x = 100; title.y = 60;
    //viz.stage.addChild(title);
    //var help = new createjs.Text("Hit Esc key to exit. Mouse to Rotate, Zoom, and Pan.", "20px Helvetica", "white");
    //help.x = 140; help.y = 100;
    //viz.stage.addChild(help);
    "\n"+
    "var box1 = new visual.Box({height: 0.02, color: 0x00FF00});\n"+
    "box1.pos = -2 * e2 / 5;\n"+
    "viz.scene.add(box1);\n"+
    "\n"+
    "var arrow = new visual.Arrow({color: 0xFFFF00});\n"+
    "viz.scene.add(arrow);\n"+
    "\n"+
    "var box2 = new visual.Box({width:0.2, height:0.4, depth:0.6, color:0xFF0000, opacity:0.25});\n"+
    "viz.scene.add(box2);\n"+
    "box2.position.set(0.6,-0.6,0.6);\n"+
    "\n"+
    "var vortex = new visual.Vortex({radius:0.8,radiusCone:0.07,color:0x00FFFF});\n"+
    "viz.scene.add(vortex);\n"+
    "\n"+
    "var box3 = new visual.Box({width:2, height:2, depth:0.02, color:0x0000FF, opacity:0.25, transparent:true});\n"+
    "viz.scene.add(box3);\n"+
    "\n"+
    "var ball = new visual.Sphere({radius:0.2, widthSegments: 20, heightSegments: 16, color:0x0000FF});\n"+
    "viz.scene.add(ball);\n"+
    "\n"+
    "/**\n"+
    " * The frequency of the rotation.\n"+
    " */\n"+
    "var frequency = 1/10;\n"+
    "/**\n"+
    " * The angular velocity, represented as a bivector.\n"+
    " */\n"+
    "var omega = 2 * Math.PI * frequency * e3 ^ e1;\n"+
    "\n"+
    "function setUp() {\n"+
    "  viz.setUp();\n"+
    "  viz.camera.position.set(2, 2, 2);\n"+
    "}\n"+
    "\n"+
    "/**\n"+
    " * Called repeatedly by the animation runner.\n"+
    " */\n"+
    "function tick(time: number) {\n"+
    "    var theta = omega * time;\n"+
    "    var R = exp(-theta/2);\n"+
    "    ball.pos = R * e3 * ~R;\n"+
    "    arrow.attitude = R;\n"+
    "    box2.attitude = R;\n"+
    "    box3.attitude = R;\n"+
    "    vortex.attitude = R;\n"+
    "    viz.update();\n"+
    "}\n"+
    "\n"+
    "function terminate(time: number) { return false; }\n"+
    "\n"+
    "function tearDown(e: Error) { viz.tearDown(); }\n"+
    "\n"+
    "eight.animationRunner(tick, terminate, setUp, tearDown, window).start();\n";

  var CODE_TEMPLATE_JSXGRAPH = "var graph = JXG.JSXGraph;\n";

  var CODE_TEMPLATE_D3 = "var x = d3;\n";

  var HTML_TEMPLATE_ANGULAR_THREE = "" +
    "<!doctype html>\n" +
    "<html ng-app='doodle'>\n" +
    "  <head>\n" +
    "    <meta charset='utf-8'/>\n" +
    "    <link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css'>\n" +
    "    <!-- STYLE-MARKER -->\n" +
    "    <!-- SCRIPTS-MARKER -->\n" +
    "  </head>\n" +
    "  <body style='margin: 0;'>\n" +
    "    <div class='container'>\n" +
    "      <div class='page-header'>\n" +
    "        <h1><a href='#'>AngularJS and three.js</a></h1>\n" +
    "      </div>\n" +
    "      <div ng-controller='MySectionController'>\n" +
    "        <h3>Euler Angles</h3>\n" +
    "        <canvas id='canvasID' style='width:100px; height:400px;'></canvas>\n" +
    "        <div>\n" +
    "          <label>x</label>\n"+
    "          <input ng-model='rotation.x' type='text' placeholder=\"x axis rotation angle (radians)\"/>\n" +
    "          <label>y</label>\n"+
    "          <input ng-model='rotation.y' type='text' placeholder=\"y axis rotation angle (radians)\"/>\n" +
    "          <label>z</label>\n"+
    "          <input ng-model='rotation.z' type='text' placeholder=\"z axis rotation angle (radians)\"/>\n" +
    "        </div>\n" +
    "        <hr/>\n" +
    "        <ul>\n" +
    "          <li>\n" +
    "            <a href='https://angularjs.org' target='_blank'>AngularJS Home Page</a>\n" +
    "          </li>\n" +
    "          <li>\n" +
    "            <a href='http://threejs.org' target='_blank'>three.js Home Page</a>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <script type='text/javascript'>\n" +
    "      try {\n" +
    "      <!-- CODE-MARKER -->\n" +
    "      }\n" +
    "      catch(e) {\n" +
    "        console.log(e);\n" +
    "      }\n" +
    "    </script>\n" +
    "  </body>\n" +
    "</html>\n";

  var CODE_TEMPLATE_ANGULAR_THREE = "" +
    "/**\n" +
    " * This is the scope for MySectionController.\n" +
    " */\n" +
    "interface IMySectionScope extends angular.IScope {\n" +
    "  /**\n" +
    "   * The `rotation` property.\n" +
    "   */\n" +
    "  rotation: THREE.Euler;\n" +
    "}\n" +
    "\n" +
    "(function (app: angular.IModule) {\n" +
    "  'use-strict';\n" +
    "\n" +
    "  app.controller('MySectionController', ['$scope', function MySectionController($scope: IMySectionScope) {\n" +
    "\n" +
    "    $scope.rotation = new THREE.Euler();\n" +
    "    $scope.rotation.x = 0.5;\n" +
    "    $scope.rotation.y = 0.8;\n" +
    "    $scope.rotation.z = Math.PI / 2;\n" +
    "\n" +
    "    var scene = new THREE.Scene();\n"+
    "    var camera: THREE.PerspectiveCamera;\n" +
    "    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvasID')\n" +
    "    var renderer = new THREE.WebGLRenderer({ canvas: canvas });\n" +
    "    var mesh: THREE.Mesh;\n" +
    "\n" +
    "    init();\n"+
    "    animate();\n"+
    "\n"+
    "    /**\n"+
    "     * Initializes the scene.\n"+
    "     */\n"+
    "    function init() {\n" +
    "      var aspect = 600 / 400;\n" +
    "      camera = new THREE.PerspectiveCamera(75, aspect, 1, 1000);\n" +
    "      camera.position.z = 200;\n" +
    "      scene.add(camera);\n" +
    "\n" +
    "      var geometry = new THREE.BoxGeometry(100, 100, 100);\n" +
    "      var material = new THREE.MeshNormalMaterial();\n" +
    "\n" +
    "      mesh = new THREE.Mesh(geometry, material);\n" +
    "      scene.add(mesh);\n" +
    "\n" +
    "      renderer.setClearColor(0xCCCCCC, 1.0);\n" +
    "      renderer.setSize(600, 400);\n" +
    "}\n" +
    "\n" +
    "    /**\n"+
    "     * Animates the scene.\n"+
    "     */\n"+
    "    function animate() {\n" +
    "      requestAnimationFrame(animate);\n" +
    "\n" +
    "      mesh.rotation.x = $scope.rotation.x;\n"+
    "      mesh.rotation.y = $scope.rotation.y;\n"+
    "      mesh.rotation.z = $scope.rotation.z;\n"+
    "\n"+
    "      renderer.render(scene, camera);\n"+
    "    }\n" +
    "  }]);\n" +
    "})(angular.module('doodle', []));\n";

  var HTML_TEMPLATE_ANGULAR_VISUAL = "" +
    "<!doctype html>\n" +
    "<html ng-app='doodle'>\n" +
    "  <head>\n" +
    "    <meta charset='utf-8'/>\n" +
    "    <link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css'>\n" +
    "    <!-- STYLE-MARKER -->\n" +
    "    <!-- SCRIPTS-MARKER -->\n" +
    "  </head>\n" +
    "  <body style='margin: 0;'>\n" +
    "    <div class='container'>\n" +
    "      <div class='page-header'>\n" +
    "        <h1>AngularJS, three.js, and visual</h1>\n" +
    "      </div>\n" +
    "      <div ng-controller='my-controller'>\n" +
    "        <h3>Euler rotations</h3>\n" +
    "        <p>Bacon ipsum dolor amet sausage meatball.</p>" +
    "        <canvas id='canvasId' style='width:100px; height:400px;'></canvas>\n" +
    "        <div>\n" +
    "          <label>x</label>\n"+
    "          <input ng-model='box.rotation.x' type='text' placeholder=\"x axis rotation angle (radians)\"/>\n" +
    "          <label>y</label>\n"+
    "          <input ng-model='box.rotation.y' type='text' placeholder=\"y axis rotation angle (radians)\"/>\n" +
    "          <label>z</label>\n"+
    "          <input ng-model='box.rotation.z' type='text' placeholder=\"z axis rotation angle (radians)\"/>\n" +
    "        </div>\n" +
    "        <hr/>\n" +
    "        <ul>\n" +
    "          <li>\n" +
    "            <a href='https://angularjs.org' target='_blank'>AngularJS Home Page</a>\n" +
    "          </li>\n" +
    "          <li>\n" +
    "            <a href='http://threejs.org' target='_blank'>three.js Home Page</a>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <script type='text/javascript'>\n" +
    "      try {\n" +
    "      <!-- CODE-MARKER -->\n" +
    "      }\n" +
    "      catch(e) {\n" +
    "        console.log(e);\n" +
    "      }\n" +
    "    </script>\n" +
    "  </body>\n" +
    "</html>\n";

  var CODE_TEMPLATE_ANGULAR_VISUAL = "" +
    "interface IMyScope extends angular.IScope {\n" +
    "  canvas: visual.WebGLCanvas;\n" +
    "  box: visual.Box;\n" +
    "}\n" +
    "\n" +
    "(function (app: angular.IModule) {\n" +
    "\n" +
    "  app.controller('my-controller', ['$window', '$scope', function MyController($window: Window, $scope: IMyScope) {\n" +
    "\n"+
    "    $scope.canvas = new visual.WebGLCanvas($window, 'canvasId');\n" +
    "    $scope.box = new visual.Box();\n" +
    "    $scope.canvas.scene.add($scope.box);\n" +
    "    $scope.canvas.width = 600;\n" +
    "    $scope.canvas.height = 400;\n" +
    "\n" +
    "    var pointLight = new THREE.PointLight(0xFFFFFF);\n"+
    "    pointLight.position.set(0, -10, 0);\n"+
    "    $scope.canvas.scene.add(pointLight);\n"+
    "\n" +
    "    animate();\n"+
    "\n" +
    "    function animate() {\n" +
    "      requestAnimationFrame(animate);\n" +
    "      $scope.canvas.update();\n"+
    "    }\n" +
    "\n" +
    "  }]);\n" +
    "})(angular.module('doodle', []));\n";

  var HTML_TEMPLATE_ANGULAR_BLADE_VISUAL = "" +
    "<!doctype html>\n" +
    "<html ng-app='doodle'>\n" +
    "  <head>\n" +
    "    <meta charset='utf-8'/>\n" +
    "    <link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css'>\n" +
    "    <!-- STYLE-MARKER -->\n" +
    "    <!-- SCRIPTS-MARKER -->\n" +
    "  </head>\n" +
    "  <body style='margin: 0;'>\n" +
    "    <div class='container'>\n" +
    "      <div class='page-header'>\n" +
    "        <h1>AngularJS, blade, three.js, and visual</h1>\n" +
    "      </div>\n" +
    "      <div ng-controller='my-controller'>\n" +
    "        <h3>Spinors and Rotations</h3>\n" +
    "        <p>An example using the <em>blade</em> module to perform <b>Geometric Algebra</b> mathematics, the <em>visual</em> module to simplify the <b>simulation</b> code, <em>three.js</em> for <b>WebGL</b> rendering, and <em>AngularJS</em> for the Model-View-Whatever <b>User Interface</b>.</p>\n" +
    "        <p>The HTML / TypeScript code editor provides integrated type-checking, content-assist and documentation.</p>\n"+
    "        <p>Save your work locally and upload/download to your personal GitHub account.</p>\n"+
    "        <p>Share your doodles and complete assignments using GitHub forks.</p>\n"+
    "        <canvas id='canvasId' style='width:100px; height:400px;'></canvas>\n" +
    "        <div>\n" +
    "          <h1>time: {{runner.time | number:2}}</h1>\n"+
    "          <button ng-click='clickedOne()'>{{runner.isRunning ? 'Stop' : 'Start'}}</button>\n"+
    "          <button ng-click='clickedTwo()' ng-show='runner.isPaused'>{{runner.isPaused ? 'Reset' : 'Lap'}}</button>\n"+
    "        </div>\n" +
    "        <hr/>\n" +
    "        <ul>\n" +
    "          <li>\n" +
    "            <a href='https://angularjs.org' target='_blank'>AngularJS Home Page</a>\n" +
    "          </li>\n" +
    "          <li>\n" +
    "            <a href='http://threejs.org' target='_blank'>three.js Home Page</a>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <script type='text/javascript'>\n" +
    "      try {\n" +
    "      <!-- CODE-MARKER -->\n" +
    "      }\n" +
    "      catch(e) {\n" +
    "        console.log(e);\n" +
    "      }\n" +
    "    </script>\n" +
    "  </body>\n" +
    "</html>\n";

  var CODE_TEMPLATE_ANGULAR_BLADE_VISUAL = "" +
    "interface IMyScope extends angular.IScope {\n" +
    "  canvas: visual.WebGLCanvas;\n" +
    "  box: visual.Box;\n" +
    "  /**\n"+
    "   * The `runner` property runs the sumulation.\n"+
    "   */\n"+
    "  runner: visual.IStopwatch;\n" +
    "  /**\n"+
    "   * Invoked when the user clicks the left hand button (start, stop).\n"+
    "   */\n"+
    "  clickedOne(): void;\n" +
    "  /**\n"+
    "   * Invoked when the user clicks the right hand button (reset, lap).\n"+
    "   */\n"+
    "  clickedTwo(): void;\n" +
    "}\n" +
    "\n" +
    "(function (app: angular.IModule) {\n" +
    "\n" +
    "  app.controller('my-controller', ['$window', '$scope', function MyController($window: Window, $scope: IMyScope) {\n" +
    "\n"+
    "    var e1 = visual.vectorE3(1,0,0);\n" +
    "    var e2 = visual.vectorE3(0,1,0);\n" +
    "    var e3 = visual.vectorE3(0,0,1);\n" +
    "\n"+
    "    function exp(x: blade.Euclidean3): blade.Euclidean3 {\n"+
    "      // We now have to extract the scalar component to calculate cos, sin.\n" +
    "      // Of course, we could have universal functions instead.\n" +
    "      var angle = x.norm();\n" +
    "      /**\n" +
    "       * A unit bivector representing the generator of the rotation.\n" +
    "       */\n" +
    "      var B = x / angle;\n" +
    "      return Math.cos(angle.w) + B * Math.sin(angle.w);\n" +
    "    }\n" +
    "\n"+
    "    $scope.canvas = new visual.WebGLCanvas($window, 'canvasId');\n" +
    "    $scope.box = new visual.Box();\n" +
    "    $scope.canvas.scene.add($scope.box);\n" +
    "    $scope.canvas.width = 600;\n" +
    "    $scope.canvas.height = 400;\n" +
    "\n" +
    "    var pointLight = new THREE.PointLight(0xFFFFFF);\n"+
    "    pointLight.position.set(0, -10, 0);\n"+
    "    $scope.canvas.scene.add(pointLight);\n"+
    "\n" +
    "    var frequency = 2/10;\n"+
    "    var omega = 2 * Math.PI * frequency * e3 ^ e2;\n"+
    "    var spin = 2 * Math.PI * frequency * e1 ^ e2;\n"+
    "\n" +
    "    function setUp() {\n"+
    "    }\n"+
    "\n" +
    "    function tick(time: number) {\n"+
    "      $scope.$apply(function() {\n"+
    "        draw(time);\n"+
    "      });\n"+
    "    }\n"+
    "\n" +
    "    function draw(time: number) {\n"+
    "      var theta = omega * time;\n"+
    "      var R = exp(-theta/2);\n"+
    "      var S = exp(-spin*time/2)\n"+
    "      $scope.box.pos = R * e3 * ~R;\n"+
    "      $scope.box.attitude = S;\n"+
    "      $scope.canvas.update();\n"+
    "    }\n"+
    "\n" +
    "    function terminate(time: number) { return false; }\n"+
    "\n" +
    "    function tearDown(e: Error) {\n"+
    "      $scope.$apply(function() {\n"+
    "        if (e) {\n"+
    "          console.log(e);\n"+
    "        }\n"+
    "      });\n"+
    "    }\n"+
    "\n" +
    "    $scope.runner = visual.animationRunner(tick, terminate, setUp, tearDown, $window);\n"+
    "    draw($scope.runner.time);\n"+
    "\n" +
    "    $scope.clickedOne = function() {\n"+
    "      if ($scope.runner.isRunning) {\n"+
    "        $scope.runner.stop();\n"+
    "      }\n"+
    "      else {\n"+
    "        $scope.runner.start();\n"+
    "      }\n"+
    "    }\n"+
    "\n" +
    "    $scope.clickedTwo = function() {\n"+
    "      if ($scope.runner.isPaused) {\n"+
    "        $scope.runner.reset();\n"+
    "        draw($scope.runner.time);\n"+
    "      }\n"+
    "      else if ($scope.runner.isRunning) {\n"+
    "        $scope.runner.lap();\n"+
    "      }\n"+
    "    }\n"+
    "\n" +
    "  }]);\n" +
    "})(angular.module('doodle', []));\n";

  return [
    {
      uuid: uuid.generate(),
      description: "AngularJS, blade, three.js, and visual",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: undefined,
      html: HTML_TEMPLATE_ANGULAR_BLADE_VISUAL,
      code: CODE_TEMPLATE_ANGULAR_BLADE_VISUAL,
      less: LESS_TEMPLATE_BASIC,
      dependencies: ['angular', 'blade', 'three', 'visual']
    },
    {
      uuid: uuid.generate(),
      description: "AngularJS, three.js, and visual",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: undefined,
      html: HTML_TEMPLATE_ANGULAR_VISUAL,
      code: CODE_TEMPLATE_ANGULAR_VISUAL,
      less: LESS_TEMPLATE_BASIC,
      dependencies: ['angular', 'three', 'visual']
    },
    {
      uuid: uuid.generate(),
      description: "AngularJS and three.js",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: undefined,
      html: HTML_TEMPLATE_ANGULAR_THREE,
      code: CODE_TEMPLATE_ANGULAR_THREE,
      less: LESS_TEMPLATE_BASIC,
      dependencies: ['angular', 'three']
    },
    {
      uuid: uuid.generate(),
      description: "AngularJS — Superheroic JavaScript MVW Framework",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: undefined,
      html: HTML_TEMPLATE_ANGULAR,
      code: CODE_TEMPLATE_ANGULAR,
      less: LESS_TEMPLATE_BASIC,
      dependencies: ['angular']
    },
    {
      uuid: uuid.generate(),
      description: "three.js — JavaScript 3D Library for WebGL",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: undefined,
      html: HTML_TEMPLATE_BASIC,
      code: CODE_TEMPLATE_THREEJS,
      less: LESS_TEMPLATE_BASIC,
      dependencies: ['three']
    },
    /*
    {
      uuid: uuid.generate(),
      description: "blade — Geometric Algebra Library",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: undefined,
      html: HTML_TEMPLATE_BASIC,
      code: CODE_TEMPLATE_VISUAL,
      less: LESS_TEMPLATE_BASIC,
      dependencies: ['blade','eight','three','visual']
    },
    */
    {
      uuid: uuid.generate(),
      description: "JSXGraph — Dynamic Mathematics with JavaScript",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: undefined,
      html: HTML_TEMPLATE_BASIC,
      code: CODE_TEMPLATE_JSXGRAPH,
      less: LESS_TEMPLATE_BASIC,
      dependencies: ['jsxgraph']
    },
    {
      uuid: uuid.generate(),
      description: "d3 — Data Driven Documents",
      isCodeVisible: true,
      isViewVisible: true,
      focusEditor: undefined,
      lastKnownJs: undefined,
      html: HTML_TEMPLATE_BASIC,
      code: CODE_TEMPLATE_D3,
      less: LESS_TEMPLATE_BASIC,
      dependencies: ['d3']
    },
    {
      uuid: uuid.generate(),
      description: "Basic",
      isCodeVisible: true,
      isViewVisible: false,
      focusEditor: undefined,
      lastKnownJs: undefined,
      html: HTML_TEMPLATE_BASIC,
      code: CODE_TEMPLATE_BASIC,
      less: LESS_TEMPLATE_BASIC,
      dependencies: []
    }
  ];
}]);