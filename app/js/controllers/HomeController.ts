/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/deuce/deuce.d.ts" />
/// <reference path="../../../typings/davinci-mathscript/davinci-mathscript.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../INewParameters.ts" />
/// <reference path="../IOpenParameters.ts" />
/// <reference path="../ICopyParameters.ts" />
/// <reference path="../ICodeInfo.ts" />
/// <reference path="../IHomeScope.ts" />
var app = angular.module('app');

var FWD_SLASH = '/';

var TEXT_CODE_HIDE = "VIEW";
var TEXT_CODE_SHOW = "EDIT";

var TEXT_VIEW_RESUME = "Resume";
var TEXT_VIEW_SUSPEND = "Suspend";

var STORAGE_KEY = 'geodoodle';

interface IOutputFile {
  name: string;
  writeByteOrderMark: boolean;
  text: string;
  sourceMapEntries: any[];
}

var HTML_TEMPLATE_BASIC = "" +
  "<html>\n" +
  "  <head>\n" +
  "  </head>\n" +
  "  <body>\n" +
  "  </body>\n" +
  "</html>\n";

var CODE_TEMPLATE_BLANK = "";

var CODE_TEMPLATE_THREEJS = "" +
  "var scene: THREE.Scene;\n"+
  "var camera: THREE.PerspectiveCamera;\n"+
  "var renderer: THREE.WebGLRenderer;\n" +
  "var mesh: THREE.Mesh;\n" +
  "\n" +
  "init();\n"+
  "animate();\n"+
  "\n"+
  "/**\n"+
  " * Initializes the scene.\n"+
  " */\n"+
  "function init() {\n" +
  "  scene = new THREE.Scene();\n" +
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
  "  renderer = new THREE.WebGLRenderer();\n" +
  "  renderer.setClearColor(0xFFFFFF, 1.0);\n" +
  "  renderer.setSize(window.innerWidth, window.innerHeight);\n" +
  "\n" +
  "  document.body.style.margin = '0';\n" +
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
  "    // Really? norm yields a Euclidean3?\n"+
  "    // We now have to extract the scalar component to calculate cos, sin.\n"+
  "    // Of course, we could have universal functions instead.\n"+
  "    var angle = x.norm().w;\n"+
  "    /**\n"+
  "     * A unit bivector representing the generator of the rotation.\n"+
  "     */\n"+
  "    var B = x / angle;\n"+
  "    return Math.cos(angle) + B * Math.sin(angle);\n"+
  "}\n"+
  "\n"+
  "console.log(\"visual.VERSION: \" + visual.VERSION + \"\\n\");\n"+
  "\n"+
  "var viz = new visual.Visual(window);\n"+
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


app.controller('HomeController', ['$scope', '$http', '$location', function(scope: IHomeScope, http: angular.IHttpService, location: angular.ILocationService) {

  // We'll store the transpiled code here.
  var outputFile: IOutputFile;
  scope.isShowingHTML = false;
  scope.isShowingCode = true;

  scope.templates = [
    {fileName: "Blank",    autoupdate: false, html: HTML_TEMPLATE_BASIC, code: CODE_TEMPLATE_BLANK},
    {fileName: "three.js", autoupdate: true,  html: HTML_TEMPLATE_BASIC, code: CODE_TEMPLATE_THREEJS},
    {fileName: "visual",   autoupdate: true,  html: HTML_TEMPLATE_BASIC, code: CODE_TEMPLATE_VISUAL}
  ];

  scope.documents = localStorage[STORAGE_KEY] !== undefined ? JSON.parse(localStorage[STORAGE_KEY]) : [];

  var syncStore = function() {
    localStorage[STORAGE_KEY] = JSON.stringify(scope.documents);
  };

  var createProject = function(name: string, template: ICodeInfo) {
    var document = createDocument(template, name);
    syncStore();
    changeProject(document.fileName);
  };
  
  var createDocument = function(template: ICodeInfo, name?: string): ICodeInfo {

    if (!name) {
      name = nextUntitled();
    }
    // FIXME: We're assuming that the name of the thing does not already exist.
    // FIXME: We must keep it unique.
    // Add a new document to the beginning of the array of documents.
    var document: ICodeInfo = {fileName: name, autoupdate: template.autoupdate, html: template.html, code: template.code};
    scope.documents.unshift(document);
    return document;
  };

  var changeProject = function(fileName: string) {
    var new_documents = [];

    var i = 0, found;
    while (i < scope.documents.length) {
      if (scope.documents[i].fileName == fileName) {
        found = scope.documents[i];
      }
      else {
        new_documents.push(scope.documents[i]);
      }
      i++;
    }

    if ( ! found ) return;

    new_documents.unshift(found);
    scope.documents = new_documents;
    setViewMode(false);
    setCode(scope.documents[0].html, scope.documents[0].code);
    setViewMode(scope.documents[0].autoupdate)
  };

  var deleteProject = function(fileName) {
    var new_documents = [];

    var i = 0, found;
    while (i < scope.documents.length) {
      if (scope.documents[i].fileName == fileName) {
        found = scope.documents[i];
      }
      else {
        new_documents.push(scope.documents[i]);
      }
      i++;
    }

    if ( ! found ) return;

    scope.documents = new_documents;
    syncStore();
  };

  var nextUntitled = function() {
    var nums = scope.documents.filter(function(doc) {
        return typeof doc.fileName.match(/Untitled/) !== 'null';
      }).
      map(function(doc) {
        return parseInt(doc.fileName.replace(/Untitled\s*/, ''), 10);
      }).
      filter(function (num) {
        return !isNaN(num);
      }).
      sort();

    return 'Untitled ' + (nums.length == 0 ? 1 : nums[nums.length-1] + 1);
  };

  var setCode = function(html: string, code: string) {
    htmlEditor.setValue(html, -1);
    codeEditor.setValue(code, -1);
    update();
  }

  var setViewMode = function(isViewVisible: boolean) {
    scope.isViewVisible = isViewVisible;
    scope.resumeText = isViewVisible ? TEXT_VIEW_SUSPEND : TEXT_VIEW_RESUME;
    try {
      update();
    }
    catch(e) {
      console.log(e);
    }
  }

  scope.$watch('isViewVisible', function(newVal: boolean, oldVal, scope) {
    save();
  });

  function setEditMode(editMode: boolean) {
    scope.isEditMode = editMode;
    scope.toggleText = editMode ? TEXT_CODE_HIDE : TEXT_CODE_SHOW;
    setViewMode(!editMode);
  }

  scope.toggleMode = function() {
    setEditMode(!scope.isEditMode);
  };

  scope.toggleView = function() {
    setViewMode(!scope.isViewVisible);
  };

  scope.isMenuVisible = false;

  scope.toggleMenu = function() {
    scope.isMenuVisible = !scope.isMenuVisible;
  };

  scope.showHTML = function() {
    scope.isShowingHTML = true;
    scope.isShowingCode = false;
    htmlEditor.focus();
    htmlEditor.gotoLine(0, 0);
  }

  scope.showCode = function() {
    scope.isShowingHTML = false;
    scope.isShowingCode = true;
    codeEditor.focus();
    codeEditor.gotoLine(0, 0);
  }
  scope.doNew = function() {
    scope.isMenuVisible = false;
    var d: any = document.getElementById('new-dialog');
    var dialog: HTMLDialogElement = d;
    dialog.addEventListener('close', function() {
      if (dialog.returnValue.length > 0) {
        var response: INewParameters = JSON.parse(dialog.returnValue);
        createProject(response.name, response.template);
        scope.showCode();
      }
    });
    dialog.showModal();
  };

  scope.doOpen = function() {
    scope.isMenuVisible = false;
    var d: any = document.getElementById('open-dialog');
    var dialog: HTMLDialogElement = d;
    dialog.addEventListener('close', function() {
      if (dialog.returnValue.length > 0) {
        var response: IOpenParameters = JSON.parse(dialog.returnValue);
        if (response.byeBye) {
          deleteProject(response.fileName);
        }
        else {
          changeProject(response.fileName);
          scope.showCode();
        }
      }
    });
    dialog.showModal();
  };

  scope.doSave = function() {
    scope.isMenuVisible = false;
    save();
  };

  scope.doCopy = function() {
    scope.isMenuVisible = false;
    var d: any = document.getElementById('copy-dialog');
    var dialog: HTMLDialogElement = d;
    dialog.addEventListener('close', function() {
      if (dialog.returnValue.length > 0) {
        var response: ICopyParameters = JSON.parse(dialog.returnValue);
        createProject(response.name, scope.documents[0]);
        scope.showCode();
      }
    });
    dialog.showModal();
  };

  scope.doShare = function() {
    scope.isMenuVisible = false;
  };

  scope.doHelp = function() {
    scope.isMenuVisible = false;
  };

  var DOMAIN = location.protocol() + ':'+ FWD_SLASH + FWD_SLASH + location.host() + ":" + location.port();

  ace.config.set('workerPath', '/js')

  var workspace = ace.workspace();

  var fileNames = ['lib.d.ts', 'blade.d.ts', 'eight.d.ts', 'three.d.ts', 'visual.d.ts'];

  var readFile = function(fileName, callback) {
    var url = DOMAIN + "/ts/" + fileName;
    http.get(url)
      .success(function(data, status, headers, config) {
        callback(null, data)
      })
      .error(function(data, status, headers, config) {
        callback(new Error("Unable to wrangle #{fileName}."));
      })
  }

  var codeEditor = ace.edit('code-editor', workspace);

  codeEditor.setTheme('ace/theme/textmate');
  codeEditor.getSession().setMode('ace/mode/typescript');
  codeEditor.getSession().setTabSize(2);
  codeEditor.setShowInvisibles(true);
  codeEditor.setFontSize('18px');
  codeEditor.setShowPrintMargin(false);
  codeEditor.setDisplayIndentGuides(false);

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

  codeEditor.getSession().on('initAfter', function(event) {
    // Not sure when we need to know that the worker has started?
  });

  codeEditor.getSession().on('syntaxErrors', function(event) {
    // I'm not seeing any events by this name!
    console.log("Received syntaxErrors event");
  });

  codeEditor.getSession().on('change', function(event) {
      // console.log("codeEditor session change: " + JSON.stringify(event));
      save();
  });

  codeEditor.getSession().on('outputFiles', function(event) {
    try {
      var outputFiles: IOutputFile[] = event.data;
      outputFiles.forEach(function(file) {
        var text = file.text;
        outputFile = file;
        update();
      });
    }
    catch(e) {
      console.log(e);
    }
  });

  var htmlEditor = ace.edit('html-editor', workspace);

  htmlEditor.setTheme('ace/theme/textmate');
  htmlEditor.getSession().setMode('ace/mode/html');
  htmlEditor.getSession().setTabSize(2);
  htmlEditor.setShowInvisibles(true);
  htmlEditor.setFontSize('18px');
  htmlEditor.setShowPrintMargin(false);
  htmlEditor.setDisplayIndentGuides(false);

  // Now that we have both editors created, configure the scope.
  if (scope.documents.length > 0) {
    htmlEditor.changeFile(scope.documents[0].html, 'app.html');
    codeEditor.changeFile(scope.documents[0].code, 'app.ts');
  }
  else {
    htmlEditor.changeFile(HTML_TEMPLATE_BASIC, 'app.html');
    codeEditor.changeFile("", 'app.ts');
  }
  setEditMode(true);
  setViewMode(true);
  scope.showCode();

  function save() {
    if (scope.documents.length === 0) {
        createDocument({fileName:nextUntitled(), autoupdate: scope.isViewVisible, html: htmlEditor.getValue(), code: codeEditor.getValue()});
    }
    else {
      // TODO: This might be called updateDocument()
      scope.documents[0].html = htmlEditor.getValue();
      scope.documents[0].code = codeEditor.getValue();
      scope.documents[0].autoupdate = scope.isViewVisible;
    }
    syncStore();
  }

  function update() {

    try {
      var preview = document.getElementById('preview');

      while (preview.children.length > 0) {
        preview.removeChild(preview.firstChild);
      }

      if (scope.isViewVisible && outputFile) {
        var iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = '0';
        preview.appendChild(iframe);

        var content = iframe.contentDocument || iframe.contentWindow.document;

        var blade   = "<script src='" + DOMAIN + "/js/" + "blade.min.js'></script>\n";
        var eight   = "<script src='" + DOMAIN + "/js/" + "eight.min.js'></script>\n";
        var maths   = "<script src='" + DOMAIN + "/js/" + "maths.min.js'></script>\n";
        var three   = "<script src='" + DOMAIN + "/js/" + "three.min.js'></script>\n";
        var visual  = "<script src='" + DOMAIN + "/js/" + "visual.min.js'></script>\n";
        var scripts = [blade, eight, maths, three, visual].join("");

        content.open();
        content.write("<html><head>" + scripts + "</head><body style='margin: 0;'><script>try {\n" + Ms.transpile(outputFile.text) + "\n} catch(e){console.log(e);}</script></body></html>" );
        content.close();
      }
    }
    catch(e) {
      console.log(e);
    }
  };
}]);