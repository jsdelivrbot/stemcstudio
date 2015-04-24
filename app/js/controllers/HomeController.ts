/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/deuce/deuce.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../INewParameters.ts" />
/// <reference path="../IOpenParameters.ts" />
/// <reference path="../ICopyParameters.ts" />
var app = angular.module('app');

var FWD_SLASH = '/';

var TEXT_CODE_HIDE = "Hide Code";
var TEXT_CODE_SHOW = "Show Code";

var TEXT_VIEW_RESUME = "Resume View";
var TEXT_VIEW_SUSPEND = "Suspend View";

var STORAGE_KEY = 'geometryzen';

// Define the interface for scope for type-safety.
// It should only contain the API required for the view.
interface IHomeScope extends angular.IScope {
  isEditMode: boolean;
  toggleText: string;
  toggleMode: () => void;
  isViewVisible: boolean;
  resumeText: string;
  toggleView: () => void;
  isMenuVisible: boolean;
  toggleMenu: () => void;
  doNew: () => void;
  doOpen: () => void;
  doSave: () => void;
  doCopy: () => void;
  doShare: () => void;
  doHelp: () => void;
  documents: ILocalDocument[];
}

interface IOutputFile {
  name: string;
  writeByteOrderMark: boolean;
  text: string;
  sourceMapEntries: any[];
}

interface ILocalDocument {
  fileName: string;
  autoupdate: boolean;
  /**
   * 
   */
  code: string;
}

app.controller('HomeController', ['$scope', '$http', '$location', function(scope: IHomeScope, http: angular.IHttpService, location: angular.ILocationService) {

  // We'll store the transpiled code here.
  var outputFile: IOutputFile;

  var EMPTY_DOCUMENT = function(): ILocalDocument {
    return {fileName: "", autoupdate: true, code: ""};
  }

  var templates: ILocalDocument[] = [];

  scope.documents = localStorage[STORAGE_KEY] !== undefined ? JSON.parse(localStorage[STORAGE_KEY]) : [EMPTY_DOCUMENT()];

  var syncStore = function() {
    localStorage[STORAGE_KEY] = JSON.stringify(scope.documents);
  };

  var createProject = function(name, template_name) {
    var code = templates.reduce(function(code, template) {
      if (template.fileName === template_name) {
        return template.code;
      }
      return code;
    }, undefined);

    create(code, name);

    changeProject(name);
  };
  
  var create = function(code, title: string) {

    if (!title) title = nextUntitled();
    if (scope.documents.length == 0 || scope.documents[0].fileName !== title) {
      // Add a new document to the beginning of the array of documents.
      var newDocument: ILocalDocument = {fileName: title, filetype: 'text/plain', autoupdate: true, code: code};
      scope.documents.unshift(newDocument);
    }

    syncStore();
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
    setCode(scope.documents[0].code);
    setView(scope.documents[0].autoupdate)
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

  var setCode = function(code: string) {
    editor.getSession().removeListener('change', handleChange);
    editor.setValue(code, -1);
//  editor.getSession().setUndoManager(new UndoManager());
    editor.getSession().on('change', handleChange);
    update();
  }

  var setView = function(isViewVisible) {
    scope.isViewVisible = isViewVisible;
    scope.resumeText = isViewVisible ? TEXT_VIEW_SUSPEND : TEXT_VIEW_RESUME;
    update();
  }

  var handleChange = function(event) {
    save();
    // resetUpdateTimer();
  }

  scope.$watch('isViewVisible', function(newVal: boolean, oldVal, scope) {
    save();
  });

  scope.isEditMode = true;
  scope.toggleText = TEXT_CODE_HIDE;

  scope.toggleMode = function() {
    scope.isEditMode = !scope.isEditMode;
    scope.toggleText = scope.isEditMode ? TEXT_CODE_HIDE : TEXT_CODE_SHOW;
  };

  scope.toggleView = function() {setView(!scope.isViewVisible);};

  scope.isMenuVisible = false;

  scope.toggleMenu = function() {
    scope.isMenuVisible = !scope.isMenuVisible;
  };

  scope.doNew = function() {
    scope.isMenuVisible = false;
    var d: any = document.getElementById('new-dialog');
    var dialog: HTMLDialogElement = d;
    dialog.addEventListener('close', function() {
      if (dialog.returnValue.length > 0) {
        var response: INewParameters = JSON.parse(dialog.returnValue);
        console.log("name: " + response.name);
        createProject(response.name, response.templateName);
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
        console.log("fileName: " + response.fileName);
        if (response.byeBye) {
          deleteProject(response.fileName);
        }
        else {
          changeProject(response.fileName);
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

  var fileNames = ['lib.d.ts', 'three.d.ts'];

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

  var editor = ace.edit('editor', workspace);

  editor.setTheme('ace/theme/textmate');
  editor.getSession().setMode('ace/mode/typescript');
  editor.getSession().setTabSize(2);
  editor.setShowInvisibles(true);
  editor.setFontSize('18px');
  editor.setShowPrintMargin(false);
  editor.setDisplayIndentGuides(false);

  // var UndoManager = require("ace/undomanager").UndoManager;
  // var EmacsManager = require("ace/keyboard/emacs").handler;
  // var CommandManager = editor.getKeyboardHandler();
  // editor.setKeyboardHandler(CommandManager);

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

  var source = "" +
    "var camera: THREE.PerspectiveCamera;\n"+
    "var scene: THREE.Scene;\n"+
    "var renderer: THREE.WebGLRenderer;\n" +
    "var mesh: THREE.Mesh;\n" +
    "\n" +
    "init();\n"+
    "animate();\n"+
    "\n"+
    "function init() {\n" +
    "  scene = new THREE.Scene();\n" +
    "  var aspect = window.innerWidth / window.innerHeight;\n" +
    "  camera = new THREE.PerspectiveCamera(75, aspect, 1, 1000);\n" +
    "  camera.position.z = 500;\n" +
    "  scene.add(camera);\n" +
    "\n" +
    "  var geometry = new THREE.IcosahedronGeometry(200, 1);\n" +
    "  var material = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true, wireframeLinewidth: 2});\n" +
    "\n" +
    "  mesh = new THREE.Mesh(geometry, material);\n" +
    "  scene.add(mesh);\n" +
    "\n" +
    "  renderer = new THREE.WebGLRenderer();\n" +
    "  renderer.setClearColor(0xffffff, 1.0);\n" +
    "  renderer.setSize(window.innerWidth, window.innerHeight);\n" +
    "\n" +
    "  document.body.style.margin = '0';\n" +
    "  document.body.style.overflow = 'hidden';\n" +
    "  document.body.appendChild(renderer.domElement);\n" +
    "}\n" +
    "\n" +
    "function animate() {\n" +
    "  requestAnimationFrame(animate);\n" +
    "\n" +
    "  mesh.rotation.x = Date.now() * 0.0005;\n"+
    "  mesh.rotation.y = Date.now() * 0.001;\n"+
    "\n"+
    "  renderer.render(scene, camera);\n"+
  "}\n";

  // We must supply a (dummy) fileName for the editor in order for the TypeScript processing to work.
  editor.changeFile(source, 'whatever.ts');
  editor.focus();
  editor.gotoLine(0,0);

  setView(true);

  function save() {
    scope.documents[0].code = editor.getValue();
    scope.documents[0].autoupdate = scope.isViewVisible;
    syncStore();
  }

  function update() {

    try {
      var preview = document.getElementById('preview');
      var editorElement = document.getElementById('editor');

      while ( preview.children.length > 0 ) {
        preview.removeChild( preview.firstChild );
      }

      if (scope.isViewVisible) {
        var iframe = document.createElement( 'iframe' );
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = '0';
        preview.appendChild( iframe );

        var content = iframe.contentDocument || iframe.contentWindow.document;

        var three = "<script src='" + DOMAIN + "/js/" + "three.min.js'></script>\n";

        content.open();
        content.write("<body></body>\n" + three + "<script>" + outputFile.text + "</script>" );
        content.close();

        content.body.style.margin = '0';
      }
    }
    catch(e) {
      console.log(e);
    }
  };
}]);