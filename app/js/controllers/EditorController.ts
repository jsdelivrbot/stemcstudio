/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/deuce/deuce.d.ts" />
var app = angular.module('app');

app.controller('EditorController', ['$scope', '$http', '$location', function($scope, $http, $location) {

  var DOMAIN = $location.protocol() + "://" + $location.host() + ":" + $location.port();

  ace.config.set('workerPath', '/js')

  var workspace = ace.workspace();

  var fileNames = ['lib.d.ts', 'three.d.ts'];

  var readFile = function(fileName, callback) {
    var url = DOMAIN + "/ts/" + fileName;
    $http.get(url)
      .success(function(data, status, headers, config) {
        callback(null, data)
      })
      .error(function(data, status, headers, config) {
        callback(new Error("Unable to wrangle #{fileName}."));
      })
  }


  var editor = ace.edit('editor', workspace);

  editor.setTheme('ace/theme/textmate');
  editor.getSession().setMode('ace/mode/typescript');
  editor.getSession().setTabSize(2);
  editor.setShowInvisibles(true);
  editor.setFontSize('18px');
  editor.setShowPrintMargin(false);
  editor.setDisplayIndentGuides(false);

  fileNames.forEach(function(fileName) {
    readFile(fileName, function(err, content) {
      if (!err) {
        if (workspace) {
          workspace.ensureScript(fileName, content.replace(/\r\n?/g, '\n'), true);
        }
        else {
          console.log("#{err}");
        }
      }
    });
  });

  editor.getSession().on('initAfter', function(event) {
    // Not sure when we need to know that the worker has started?
  });

  editor.getSession().on('syntaxErrors', function(event) {
    // I'm not seeing any events by this name!
    console.log("Received syntaxErrors event");
  });

  editor.getSession().on('change', function(event) {
  });

  editor.getSession().on('outputFiles', function(event) {
    try {
      var outputFiles = event.data;
      outputFiles.forEach(function(file) {
        var text = file.text;
        $scope.outputFile = file;
        // console.log(JSON.stringify(file));
        update();
      });
    }
    catch(e) {
      console.log(e);
    }
  });

  var source = "" +
    "var camera: THREE.PerspectiveCamera;\n"+
    "var scene: THREE.Scene;\n"+
    "var renderer: THREE.WebGLRenderer;\n" +
    "var geometry;\n"+
    "var material;\n"+
    "var mesh: THREE.Mesh;\n" +
    "\n" +
    "init();\n"+
    "animate();\n"+
    "\n"+
    "function init() {\n" +
    "scene = new THREE.Scene();\n" +
    "var aspect = window.innerWidth / window.innerHeight;\n" +
    "camera = new THREE.PerspectiveCamera(75, aspect, 1, 1000);\n" +
    "camera.position.z = 500;\n" +
    "scene.add(camera);\n" +
    "\n" +
    "geometry = new THREE.IcosahedronGeometry(200, 1);\n" +
    "material = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true, wireframeLinewidth: 2});\n" +
    "\n" +
    "mesh = new THREE.Mesh(geometry, material);\n" +
    "scene.add(mesh);\n" +
    "\n" +
    "renderer = new THREE.WebGLRenderer();\n" +
    "renderer.setClearColor(0xffffff, 1.0);\n" +
    "renderer.setSize(window.innerWidth, window.innerHeight);\n" +
    "\n" +
    "document.body.style.margin = '0';\n" +
    "document.body.style.overflow = 'hidden';\n" +
    "document.body.appendChild(renderer.domElement);\n" +
    "}\n" +
    "\n" +
    "function animate() {\n" +
    "requestAnimationFrame(animate);\n" +
    "\n" +
    "mesh.rotation.x = Date.now() * 0.0005;\n"+
    "mesh.rotation.y = Date.now() * 0.001;\n"+
    "\n"+
    "renderer.render(scene, camera);\n"+
  "}\n";

  // We must supply a (dummy) fileName for the editor in order for the TypeScript processing to work.
  editor.changeFile(source, 'whatever.ts');
  editor.focus();
  editor.gotoLine(0,0);

  var update = function () {

    try {
      var preview = document.getElementById('preview');
      var editorElement = document.getElementById('editor');

      while ( preview.children.length > 0 ) {
        preview.removeChild( preview.firstChild );
      }

      var iframe = document.createElement( 'iframe' );
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      preview.appendChild( iframe );

      var content = iframe.contentDocument || iframe.contentWindow.document;

      var three = "<script src='" + DOMAIN + "/js/" + "three.min.js'></script>\n";

      content.open();
      content.write("<body></body>\n" + three + "<script>" + $scope.outputFile.text + "</script>" );
      content.close();

      content.body.style.margin = '0';

      // editorElement.style.display = 'none';
    }
    catch(e) {
      console.log(e);
    }
  };
}]);