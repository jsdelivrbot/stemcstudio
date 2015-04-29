/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/deuce/deuce.d.ts" />
/// <reference path="../../../typings/davinci-mathscript/davinci-mathscript.d.ts" />
/// <reference path="../../../typings/google-analytics/ga.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../INewParameters.ts" />
/// <reference path="../IOpenParameters.ts" />
/// <reference path="../ICopyParameters.ts" />
/// <reference path="../typings/IDoodleParameters.ts" />
/// <reference path="../typings/IDownloadParameters.ts" />
/// <reference path="../typings/IDoodle.ts" />
/// <reference path="../typings/IDoodleConfig.ts" />
/// <reference path="../typings/IHomeScope.ts" />
/// <reference path="../typings/cookie.ts" />
/// <reference path="../typings/UuidService.ts" />
var app = angular.module('app');

var FWD_SLASH = '/';

var TEXT_CODE_HIDE = "View";
var TEXT_CODE_SHOW = "Edit";

var TEXT_VIEW_RESUME = "Resume";
var TEXT_VIEW_SUSPEND = "Suspend";

var STORAGE_KEY = 'davincidoodle';

interface IOutputFile {
  name: string;
  writeByteOrderMark: boolean;
  text: string;
  sourceMapEntries: any[];
}

var HTML_TEMPLATE_BASIC = "" +
  "<!DOCTYPE html>\n" +
  "<html>\n" +
  "  <head>\n" +
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

var CODE_TEMPLATE_BLANK = "";

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


app.controller('HomeController', ['$scope', '$http', '$location','$routeParams', '$window', 'mathscript', 'GitHub', 'GitHubAuthManager', 'cookie', 'uuid4', 'ga', function(scope: IHomeScope, http: angular.IHttpService, location: angular.ILocationService, routeParams, $window, mathscript, github, authManager, cookie: ICookieService, uuid4: UuidService, ga: UniversalAnalytics.ga) {

    // Do not create new trackers in this (single page) app.
    ga('create', 'UA-41504069-2', 'auto');  // Creates a tracker.
//  ga('create', 'UA-41504069-2', {'cookieDomain': 'none'});  // localhost.
    ga('send', 'pageview');

    var GITHUB_TOKEN_COOKIE_NAME = 'github-token';

    authManager.handleLoginCallback(function(err, token) {
      if (err) {
        scope.alert(err.message);
      }
    });

  // We'll store the transpiled code here.
  var outputFile: IOutputFile;
  scope.isShowingHTML = false;
  scope.isShowingCode = true;

  scope.templates = [
    {uuid: "", description: "Blank",    autoupdate: false, html: HTML_TEMPLATE_BASIC, code: CODE_TEMPLATE_BLANK,   dependencies: []},
    {uuid: "", description: "three.js", autoupdate: true,  html: HTML_TEMPLATE_BASIC, code: CODE_TEMPLATE_THREEJS, dependencies: []},
    {uuid: "", description: "visual",   autoupdate: true,  html: HTML_TEMPLATE_BASIC, code: CODE_TEMPLATE_VISUAL,  dependencies: []}
  ];

  scope.options = [
    {name: 'angular', version: '1.4.0',  js: 'angular.min.js', dts: 'angular.d.ts'},
    {name: 'blade',   version: '0.9.35', js: 'blade.min.js',   dts: 'blade.d.ts'},
    {name: 'eight',   version: '0.9.15', js: 'eight.min.js',   dts: 'eight.d.ts'},
    {name: 'maths',   version: '0.9.12', js: 'maths.min.js',   dts: 'maths.d.ts'},
    {name: 'three',   version: '0.0.71', js: 'three.min.js',   dts: 'three.d.ts'},
    {name: 'visual',  version: '0.0.52', js: 'visual.min.js',  dts: 'visual.d.ts'}
  ];

  scope.doodles = localStorage[STORAGE_KEY] !== undefined ? JSON.parse(localStorage[STORAGE_KEY]) : [];

  var syncStore = function() {
    localStorage[STORAGE_KEY] = JSON.stringify(scope.doodles);
  };

  var createProject = function(description: string, template: IDoodle) {
    var document = createDocument(template, description);
    syncStore();
    changeProject(document.uuid);
  };
  
  var createDocument = function(template: IDoodle, description?: string): IDoodle {

    if (!description) {
      description = nextUntitled();
    }
    // FIXME: We're assuming that the description of the doodle does not already exist.
    // FIXME: We must keep it unique.
    // Add a new document to the beginning of the array of doodles.
    var document: IDoodle = {
      uuid: uuid4.generate(),
      description: description,
      autoupdate: template.autoupdate,
      html: template.html,
      code: template.code,
      dependencies: []
    };
    scope.doodles.unshift(document);
    return document;
  };

  var changeProject = function(uuid: string) {
    var doodles: IDoodle[] = [];

    var i = 0, found;
    while (i < scope.doodles.length) {
      if (scope.doodles[i].uuid === uuid) {
        found = scope.doodles[i];
      }
      else {
        doodles.push(scope.doodles[i]);
      }
      i++;
    }

    if ( ! found ) return;

    doodles.unshift(found);
    scope.doodles = doodles;
    setViewMode(false);
    setCode(scope.doodles[0].html, scope.doodles[0].code);
    setViewMode(scope.doodles[0].autoupdate)
  };

  var deleteDoodle = function(uuid: string) {
    var doodles: IDoodle[] = [];

    var i = 0, found;
    while (i < scope.doodles.length) {
      if (scope.doodles[i].uuid === uuid) {
        found = scope.doodles[i];
      }
      else {
        doodles.push(scope.doodles[i]);
      }
      i++;
    }

    if ( ! found ) return;

    scope.doodles = doodles;
    syncStore();
  };

  var nextUntitled = function() {
    var nums = scope.doodles.filter(function(doodle: IDoodle) {
        return typeof doodle.description.match(/Untitled/) !== 'null';
      }).
      map(function(doodle: IDoodle) {
        return parseInt(doodle.description.replace(/Untitled\s*/, ''), 10);
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
    update();
  }

  scope.$watch('isViewVisible', function(newVal: boolean, oldVal, scope) {
    saveLocal();
  });

  function setEditMode(editMode: boolean) {
    scope.isEditMode = editMode;
    scope.toggleText = editMode ? TEXT_CODE_HIDE : TEXT_CODE_SHOW;
    setViewMode(!editMode);
  }

  scope.toggleMode = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'toggleMode', label, value);
    setEditMode(!scope.isEditMode);
  };

  scope.toggleView = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'toggleView', label, value);
    setViewMode(!scope.isViewVisible);
  };

  scope.showHTML = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'showHTML', label, value);
    scope.isShowingHTML = true;
    scope.isShowingCode = false;
    htmlEditor.focus();
    htmlEditor.gotoLine(0, 0);
  }

  scope.showCode = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'showCode', label, value);
    showCode();
  }

  function showCode() {
    scope.isShowingHTML = false;
    scope.isShowingCode = true;
    codeEditor.focus();
    codeEditor.gotoLine(0, 0);
  }

  scope.doNew = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'new', label, value);
    var d: any = document.getElementById('new-dialog');
    var dialog: HTMLDialogElement = d;
    dialog.addEventListener('close', function() {
      if (dialog.returnValue.length > 0) {
        var response: INewParameters = JSON.parse(dialog.returnValue);
        createProject(response.description, response.template);
        showCode();
      }
    });
    dialog.showModal();
  };

  scope.doOpen = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'open', label, value);
    var d: any = document.getElementById('open-dialog');
    var dialog: HTMLDialogElement = d;
    dialog.addEventListener('close', function() {
      if (dialog.returnValue.length > 0) {
        var response: IOpenParameters = JSON.parse(dialog.returnValue);
        if (response.byeBye) {
          deleteDoodle(response.uuid);
        }
        else {
          changeProject(response.uuid);
          showCode();
        }
      }
    });
    dialog.showModal();
  };

  scope.doCopy = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'copy', label, value);
    var d: any = document.getElementById('copy-dialog');
    var dialog: HTMLDialogElement = d;
    dialog.addEventListener('close', function() {
      if (dialog.returnValue.length > 0) {
        var response: ICopyParameters = JSON.parse(dialog.returnValue);
        createProject(response.description, scope.doodles[0]);
        showCode();
      }
    });
    dialog.showModal();
  };

  scope.doProperties = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'properties', label, value);
    var d: any = document.getElementById('doodle-dialog');
    var dialog: HTMLDialogElement = d;
    scope.dependencies = scope.doodles[0].dependencies;
    dialog.addEventListener('close', function() {
      if (dialog.returnValue.length > 0) {
        var response: IDoodleParameters = JSON.parse(dialog.returnValue);
        scope.doodles[0].dependencies = response.dependencies;
        showCode();
      }
    });
    dialog.showModal();
  };

  scope.doDownload = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'download', label, value);
    var token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
    github.getGists(token, function(err, gists: IGist[]) {
      if (!err) {
        scope.gists = gists;
        var d: any = document.getElementById('download-dialog');
        var dialog: HTMLDialogElement = d;
        dialog.addEventListener('close', function() {
          if (dialog.returnValue.length > 0) {
            var response: IDownloadParameters = JSON.parse(dialog.returnValue);
            github.getGist(token, response.gistId, function(err, gist) {
              if (!err) {
                var config: IDoodleConfig = JSON.parse(gist.files['doodle.json'].content);
                var html = gist.files['index.html'].content;
                var code = gist.files['script.ts'].content;
                var codeInfo: IDoodle = {
                  gistId: response.gistId,
                  uuid: config.uuid,
                  description: gist.description,
                  autoupdate: false,
                  html: gist.files['index.html'].content,
                  code: gist.files['script.ts'].content,
                  dependencies: config.dependencies
                };
                deleteDoodle(config.uuid);
                scope.doodles.unshift(codeInfo);
                setViewMode(false);
                setCode(scope.doodles[0].html, scope.doodles[0].code);
                setViewMode(scope.doodles[0].autoupdate)
              }
              else {
                scope.alert("Error attempting to download Gist");
              }
            });
          }
          else {

          }
        });
        dialog.showModal();
      }
      else {
          scope.alert("Error attempting to download Gists");
      }
    });
  };

  /**
   * Maps the doodle to the format required for GitHub.
   */
  function configuration(doodle: IDoodle): IDoodleConfig {
    return {
      uuid: doodle.uuid,
      dependencies: doodle.dependencies
    };
  }

  function doodleToGist(doodle: IDoodle): IGist {
    var gist: IGist = {
      description: scope.doodles[0].description,
      public: true,
      files: {}
    };
    gist.files['doodle.json'] = {content: JSON.stringify(configuration(scope.doodles[0]))};
    gist.files['index.html'] = { content: scope.doodles[0].html };
    gist.files['script.ts'] = { content: scope.doodles[0].code };
    return gist;
  }

  scope.doUpload = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'upload', label, value);
    var token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
    if (token) {
      var data = doodleToGist(scope.doodles[0]);
      if (scope.doodles[0].gistId) {
        github.patchGist(token, scope.doodles[0].gistId, data, function(err, response, status, headers, config) {
            if (err) {
                alert("status: " + JSON.stringify(status));
                alert("err: " + JSON.stringify(err));
                alert("response: "+ JSON.stringify(response));
            }
            else {
                scope.doodles[0].gistId = response.id;
            }
        });
      }
      else {
        github.postGist(token, data, function(err, response, status, headers, config) {
            if (err) {
                alert("status: " + JSON.stringify(status));
                alert("err: " + JSON.stringify(err));
                alert("response: "+ JSON.stringify(response));
            }
            else {
                scope.doodles[0].gistId = response.id;
            }
        });
      }
    }
    else {
        scope.alert("You must be logged in.");
    }
  };

  scope.shareURL = function() {
    // We're using Hashbang Mode.
    return DOMAIN + '/#!/gists/';
  }

  scope.doShare = function() {
    var d: any = document.getElementById('share-dialog');
    var dialog: HTMLDialogElement = d;
    dialog.showModal();
  };

  scope.doHelp = function() {
  };

  var DOMAIN = location.protocol() + ':'+ FWD_SLASH + FWD_SLASH + location.host() + ":" + location.port();

  ace.config.set('workerPath', '/js')

  var workspace = ace.workspace();

  var fileNames = ['lib.d.ts', 'angular.d.ts', 'blade.d.ts', 'eight.d.ts', 'three.d.ts', 'visual.d.ts'];

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

  codeEditor.getSession().on('outputFiles', function(event) {
    var outputFiles: IOutputFile[] = event.data;
    outputFiles.forEach(function(file) {
      var text = file.text;
      outputFile = file;
      update();
    });
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
  if (scope.doodles.length > 0) {
    htmlEditor.changeFile(scope.doodles[0].html, 'app.html');
    codeEditor.changeFile(scope.doodles[0].code, 'app.ts');
  }
  else {
    htmlEditor.changeFile(HTML_TEMPLATE_BASIC,  'app.html');
    codeEditor.changeFile(CODE_TEMPLATE_VISUAL, 'app.ts');
  }
  setEditMode(true);
  setViewMode(true);
  showCode();

  codeEditor.getSession().on('change', function(event) {
      // console.log("codeEditor session change: " + JSON.stringify(event));
      saveLocal();
  });

  htmlEditor.getSession().on('change', function(event) {
      // console.log("codeEditor session change: " + JSON.stringify(event));
      saveLocal();
  });

  function saveLocal() {
    if (scope.doodles.length === 0) {
        createDocument({
          uuid: uuid4.generate(),
          description:nextUntitled(),
          autoupdate: scope.isViewVisible,
          html: htmlEditor.getValue(),
          code: codeEditor.getValue(),
          dependencies: []});
    }
    else {
      // TODO: This might be called updateDocument()
      scope.doodles[0].html = htmlEditor.getValue();
      scope.doodles[0].code = codeEditor.getValue();
      scope.doodles[0].autoupdate = scope.isViewVisible;
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

        var options = scope.options.filter(function(option: IOption, index: number, array: IOption[]) {
          return scope.doodles[0].dependencies.indexOf(option.name) > -1;
        });

        var scripts: string = options.map(function(option: IOption) {
          return "<script src='" + DOMAIN + "/js/" + option.js + "'></script>\n";
        }).join("");

        var html = scope.doodles[0].html;
        html = html.replace(/<!-- SCRIPTS-MARKER -->/, scripts);
        html = html.replace(/<!-- CODE-MARKER -->/, mathscript.transpile(outputFile.text));

        content.open();
        content.write(html);
        content.close();
      }
    }
    catch(e) {
      console.log(e);
    }
  };
}]);