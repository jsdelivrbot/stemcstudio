/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/bootstrap-dialog/bootstrap-dialog.d.ts" />
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
/// <reference path="../typings/IOption.ts" />
/// <reference path="../typings/IOutputFile.ts" />
/// <reference path="../typings/cookie.ts" />
/// <reference path="../typings/cookie.ts" />
/// <reference path="../../../bower_components/dialog-polyfill/dialog-polyfill.d.ts" />
angular.module('app').controller('HomeController', ['$scope', '$http', '$location','$routeParams', '$timeout', '$window', 'mathscript', 'GitHub', 'GitHubAuthManager', 'cookie', 'templates', 'uuid4', 'ga', function(scope: IHomeScope, http: angular.IHttpService, location: angular.ILocationService, routeParams, $timeout: angular.ITimeoutService, $window, mathscript, github, authManager, cookie: ICookieService, templates: IDoodle[], uuid4: IUuidService, ga: UniversalAnalytics.ga) {

  var FWD_SLASH = '/';

  var WAIT_NO_MORE = 0;
  var WAIT_FOR_MORE_HTML_KEYSTROKES = 350;
  var WAIT_FOR_MORE_CODE_KEYSTROKES = 1500;

  var TEXT_CODE_HIDE = "View";
  var TEXT_CODE_SHOW = "Edit";

  var TEXT_VIEW_RESUME = "Resume";
  var TEXT_VIEW_SUSPEND = "Suspend";

  var FILENAME_META = 'doodle.json';
  var FILENAME_HTML = 'index.html';
  var FILENAME_CODE = 'script.ts';
  var FILENAME_LESS = 'style.less';

  var STORAGE_KEY = 'davincidoodle';

  var WELCOME_NEWBIE_BLURB = "" +
  "Welcome to Davinci Doodle!"

  var ELEVATOR_SPEECH_DOODLE = "" +
  "DaVinci Doodle is a tool for learning modern mathematics through " +
  "interactive programming using cutting-edge software development technologies."

  var CAVEAT_NOTICE = "" +
  "Davinci Doodle (Beta) is best experienced in a Google Chrome browser."

  var COPYRIGHT_NOTICE = "" +
  "Copyright (c) 2015 David DOT Geo DOT Holmes AT gmail DOT com"

  // Reminder: Do not create multiple trackers in this (single page) app.
  ga('create', 'UA-41504069-2', 'auto');
  ga('send', 'pageview');

  var GITHUB_TOKEN_COOKIE_NAME = 'github-token';

  authManager.handleLoginCallback(function(err, token) {
    if (err) {
      scope.alert(err.message);
    }
  });

  // We'll keep the transpiled code here.
  // var outputFile: IOutputFile;

  scope.templates = templates;

  scope.options = [
    {
      name: 'angular',
      version: 'latest',
      js: 'angular.min.js',
      dts: 'angular.d.ts'
    },
    {
      name: 'blade',
      version: 'latest',
      js: 'davinci-blade.min.js',
      dts: 'davinci-blade.d.ts'
    },
    {
      name: 'd3',
      version: '3.5.5',
      js: 'd3@3.5.5.min.js',
      dts: 'd3@3.5.5.d.ts'
    },
    {
      name: 'jsxgraph',
      version: '0.99.3',
      js: 'jsxgraph@0.99.3.min.js',
      dts: 'jsxgraph@0.99.3.d.ts'
    },
    {
      name: 'three',
      version: 'latest',
      js: 'three.min.js',
      dts: 'three.d.ts'
    },
    {
      name: 'visual',
      version: 'latest',
      js: 'davinci-visual.min.js',
      dts: 'davinci-visual.d.ts'
    }
  ];

  // Temporary to ensure correct Gist deserialization.
  function depArray(deps: {[key:string]:string}): string[] {
    var ds: string[] = [];
    for (var prop in deps) {
      ds.push(prop);
    }
    return ds;
  }

  // Temporary to ensure correct Gist serialization.
  function depObject(names: string[]): {[key:string]:string} {
    function version(name: string): string {
      var matching = scope.options.filter(function(option) { return option.name === name;});
      if (matching.length > 0) {
        return matching[0].version;
      }
      else {
        return undefined;
      }
    }
    var obj: { [key: string]: string } = {};
    names.forEach(function(name: string) {
      obj[name] = version(name);
    });
    return obj;
  }

  function showModalDialog(dialog: HTMLDialogElement, closeHandler: () => void) {
      if (!dialog.show) {
        // Registering the dialog shims the methods show, showModal and close.
        dialogPolyfill.registerDialog(dialog);
      }
      dialog.addEventListener('close', closeHandler);
      // Firefox compatibility.
      dialog.style.display = '';
      dialog.showModal();
  }

  function hideModalDialog(dialog: HTMLDialogElement, closeHandler: () => void) {
      // Firefox compatibility.
      dialog.style.display = 'none';
      dialog.removeEventListener('close', closeHandler);
  }

  /**
   * Keep track of the dependencies that are loaded in the workspace.
   */
  var olds: string[] = [];

  function loadModel() {
    scope.doodles = localStorage[STORAGE_KEY] !== undefined ? JSON.parse(localStorage[STORAGE_KEY]) : [];
  }

  function updateStorage() {
    localStorage[STORAGE_KEY] = JSON.stringify(scope.doodles);
  }

  function updateView() {
    updateWorkspace();
    htmlEditor.setValue(scope.doodles[0].html, -1);
    codeEditor.setValue(scope.doodles[0].code, -1);
    setEditMode(scope.doodles[0].isCodeVisible);
    setViewMode(scope.doodles[0].isViewVisible);
    setFocusEditor(scope.doodles[0].focusEditor);
  }

  var createDoodle = function(template: IDoodle, description?: string) {
    if (!description) {
      description = nextUntitled();
    }
    var doodle: IDoodle = {
      uuid: uuid4.generate(),
      description: description,
      isCodeVisible: template.isCodeVisible,
      isViewVisible: template.isViewVisible,
      focusEditor: template.focusEditor,
      lastKnownJs: template.lastKnownJs,
      html: template.html,
      code: template.code,
      dependencies: template.dependencies
    };
    scope.doodles.unshift(doodle);
  };

  function activeDoodle(uuid: string) {
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
  }

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
  };

  var nextUntitled = function() {
    // We assume that a doodle with a lower index will have a higher Untitled number.
    // To reduce sorting, sort as a descending sequence and use the resulting first
    // element as the highest number used so far. Add one to that.
    function compareNumbers(a: number, b: number) {
        return b - a;
    }
    var nums: number[] = scope.doodles.filter(function(doodle: IDoodle) {
        return typeof doodle.description.match(/Untitled/) !== 'null';
    }).
        map(function(doodle: IDoodle) {
        return parseInt(doodle.description.replace('Untitled ', '').trim(), 10);
    }).
        filter(function(num) {
        return !isNaN(num);
    });

    nums.sort(compareNumbers);

    return 'Untitled ' + (nums.length === 0 ? 1 : nums[0] + 1);
  };

  var setViewMode = function(isViewVisible: boolean) {
    scope.isViewVisible = isViewVisible;
    scope.resumeText = isViewVisible ? TEXT_VIEW_SUSPEND : TEXT_VIEW_RESUME;
  }

  scope.$watch('isViewVisible', function(newVal: boolean, oldVal, scope) {
    scope.doodles[0].isViewVisible = scope.isViewVisible;
    updateStorage();
  });

  function setEditMode(editMode: boolean) {
    scope.isEditMode = editMode;
    scope.toggleText = editMode ? TEXT_CODE_HIDE : TEXT_CODE_SHOW;
  }

  scope.$watch('isEditMode', function(newVal: boolean, oldVal, scope) {
    scope.doodles[0].isCodeVisible = scope.isEditMode;
    updateStorage();
  });

  scope.toggleMode = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'toggleMode', label, value);
    setEditMode(!scope.isEditMode);
    if (!scope.isEditMode) {
      // We're not editing so the view had better be running.
      if (!scope.isViewVisible) {
        setViewMode(true);
        updatePreview(WAIT_NO_MORE);
      }
      else {
        // The view is already running, don't restart it with an updatePreview.
      }
    }
  };

  scope.toggleView = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'toggleView', label, value);
    setViewMode(!scope.isViewVisible);
    updatePreview(WAIT_NO_MORE);
  };

  scope.showHTML = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'showHTML', label, value);
    setFocusEditor(FILENAME_HTML);
  }

  scope.showCode = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'showCode', label, value);
    setFocusEditor(FILENAME_CODE);
  }

  function setFocusEditor(fileName: string) {

    if (fileName === FILENAME_CODE) {
      scope.isShowingHTML = false;
      scope.isShowingCode = true;
      codeEditor.focus();
      codeEditor.gotoLine(0, 0);
      scope.doodles[0].focusEditor = fileName;
      updateStorage();
    }
    else if (fileName === FILENAME_HTML) {
      scope.isShowingHTML = true;
      scope.isShowingCode = false;
      htmlEditor.focus();
      htmlEditor.gotoLine(0, 0);
      scope.doodles[0].focusEditor = fileName;
      updateStorage();
    }
    else {
      setFocusEditor(FILENAME_CODE);
    }
  }

  scope.doNew = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'new', label, value);
    var dialog = <HTMLDialogElement>document.getElementById('new-dialog');
    var closeHandler = function() {
      hideModalDialog(dialog, closeHandler);
      if (dialog.returnValue.length > 0) {
        var response: INewParameters = JSON.parse(dialog.returnValue);
        createDoodle(response.template, response.description);
        updateStorage();
        updateView();
        updatePreview(WAIT_NO_MORE);
      }
    };
    showModalDialog(dialog, closeHandler);
  };

  scope.doOpen = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'open', label, value);
    var dialog = <HTMLDialogElement>document.getElementById('open-dialog');
    var closeHandler = function() {
      hideModalDialog(dialog, closeHandler);
      if (dialog.returnValue.length > 0) {
        var response: IOpenParameters = JSON.parse(dialog.returnValue);
        if (response.byeBye) {
          deleteDoodle(response.uuid);
        }
        else {
          activeDoodle(response.uuid);
        }
        updateStorage();
        updateView();
        updatePreview(WAIT_NO_MORE);
      }
    };
    showModalDialog(dialog, closeHandler);
  };

  scope.doCopy = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'copy', label, value);
    var dialog = <HTMLDialogElement>document.getElementById('copy-dialog');
    scope.description = scope.doodles[0].description;
    var closeHandler = function() {
      hideModalDialog(dialog, closeHandler);
      if (dialog.returnValue.length > 0) {
        var response: ICopyParameters = JSON.parse(dialog.returnValue);
        createDoodle(scope.doodles[0], response.description);
        updateStorage();
        updateView();
        updatePreview(WAIT_NO_MORE);
      }
    };
    showModalDialog(dialog, closeHandler);
  };

  scope.doProperties = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'properties', label, value);
    var dialog = <HTMLDialogElement>document.getElementById('doodle-dialog');
    // It's wierd that we can get the `returnValue` but not set the initial value.
    // JavaScript strings are immutable so changing scope.description does not affect the original.
    // Make a copy of the doodle's dependencies so that Cancel works correctly.
    scope.description = scope.doodles[0].description;
    scope.dependencies = scope.doodles[0].dependencies;
    var closeHandler = function() {
      hideModalDialog(dialog, closeHandler);
      if (dialog.returnValue.length > 0) {
        var response: IDoodleParameters = JSON.parse(dialog.returnValue);
        scope.doodles[0].description = response.description;
        scope.doodles[0].dependencies = response.dependencies;
        // TODO: It would be nice to determine if there have been any changes,
        // and then only requre updates accordingly. Perhaps we can ensure that
        // the doodle is in a canonical format or have a doodle class?
        updateStorage();
        updateView();
      }
    };
    showModalDialog(dialog, closeHandler);
  };

  scope.doAbout = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'about', label, value);
    showAboutDialog([], []);
  }

  function showAboutDialog(prologs: string[], epilogs: string[]) {
    function p(text: string) {return "<p>" + text + "</p>" };
    var blurbs = [ELEVATOR_SPEECH_DOODLE, CAVEAT_NOTICE, COPYRIGHT_NOTICE];
    prologs.forEach(function(prolog) {blurbs.unshift(prolog)});
    epilogs.forEach(function(epilog) {blurbs.push(epilog)});
    var messageText = blurbs.map(p).join("");
    BootstrapDialog.show({
      title: $("<h3>DaVinci Doodle (Beta)</h3>"),
      message: $(messageText),
      buttons: [{
        label: "Close",
        cssClass: 'btn btn-primary',
        action: function(dialog) {
          dialog.close();
        }
      }]
    });
  }

  function downloadGist(token: string, gistId: string) {
    github.getGist(token, gistId, function(err, gist) {
      if (!err) {
        var config: IDoodleConfig = JSON.parse(gist.files[FILENAME_META].content);
        var html = gist.files[FILENAME_HTML].content;
        var code = gist.files[FILENAME_CODE].content;

        var codeInfo: IDoodle = {
          gistId: gistId,
          uuid: config.uuid,
          description: gist.description,
          // TODO: Should we persist the UI state in the Gist?
          isCodeVisible: true,
          isViewVisible: false,
          focusEditor: FILENAME_CODE,
          lastKnownJs: undefined,
          html: gist.files[FILENAME_HTML].content,
          code: gist.files[FILENAME_CODE].content,
          dependencies: depArray(config.dependencies)
        };
        deleteDoodle(config.uuid);
        scope.doodles.unshift(codeInfo);
        updateStorage();
        updateView();
        updatePreview(WAIT_NO_MORE);
      }
      else {
        scope.alert("Error attempting to download Gist");
      }
    });
  }

  scope.doDownload = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'download', label, value);
    var token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
    github.getGists(token, function(err, gists: IGist[]) {
      if (!err) {
        scope.gists = gists;
        var dialog = <HTMLDialogElement>document.getElementById('download-dialog');
        var closeHandler = function() {
          hideModalDialog(dialog, closeHandler);
          if (dialog.returnValue.length > 0) {
            var response: IDownloadParameters = JSON.parse(dialog.returnValue);
            downloadGist(token, response.gistId);
          }
          else {

          }
        };
        showModalDialog(dialog, closeHandler);
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
      description: doodle.description,
      dependencies: depObject(doodle.dependencies)
    };
  }

  function doodleToGist(doodle: IDoodle): IGist {
    var gist: IGist = {
      description: scope.doodles[0].description,
      public: true,
      files: {}
    };
    gist.files[FILENAME_META] = {content: JSON.stringify(configuration(scope.doodles[0]), null, 2)};
    gist.files[FILENAME_HTML] = {content: scope.doodles[0].html};
    gist.files[FILENAME_CODE] = {content: scope.doodles[0].code};
    return gist;
  }

  scope.doUpload = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'upload', label, value);
    var token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
    if (token) {
      var data = doodleToGist(scope.doodles[0]);
      if (scope.doodles[0].gistId) {
        github.patchGist(token, scope.doodles[0].gistId, data, function(err, response, status: number, headers, config) {
            if (err) {
              if (status === 404) {
                if (confirm("The Gist associated with your doodle no longer exists.\nWould you like me to disassociate your doodle so that you can create a new Gist?")) {
                  scope.doodles[0].gistId = undefined;
                  updateStorage();
                }
              }
              else {
                // If the status is 404 then the Gist no longer exists on GitHub.
                // We might as well set the gistId to undefined and let the user try to POST.
                alert("status: " + JSON.stringify(status));
                alert("err: " + JSON.stringify(err));
                alert("response: "+ JSON.stringify(response));
              }
            }
            else {
              // No changes when we patch, I don't think.
              alert("Your doodle was successfully uploaded and patched the existing Gist.");
            }
        });
      }
      else {
        github.postGist(token, data, function(err, response, status: number, headers, config) {
            if (err) {
                alert("status: " + JSON.stringify(status));
                alert("err: " + JSON.stringify(err));
                alert("response: "+ JSON.stringify(response));
            }
            else {
              scope.doodles[0].gistId = response.id;
              updateStorage();
              alert("Your doodle was successfully uploaded and associated with a new Gist.");
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
    function returnValueHandler(value: string) {

    }
    var dialog = <HTMLDialogElement>document.getElementById('share-dialog');
    var closeHandler = function() {
      hideModalDialog(dialog, closeHandler);
      if (dialog.returnValue.length > 0) {
        returnValueHandler(dialog.returnValue);
      }
    };
    showModalDialog(dialog, closeHandler);
  };

  scope.doHelp = function() {
  };

  var DOMAIN = location.protocol() + ':'+ FWD_SLASH + FWD_SLASH + location.host() + ":" + location.port();

  ace.config.set('workerPath', '/js')

  var workspace = ace.workspace();

  var codeEditor = ace.edit('code-editor', workspace);

  codeEditor.setTheme('ace/theme/textmate');
  codeEditor.getSession().setMode('ace/mode/typescript');
  codeEditor.getSession().setTabSize(2);
  codeEditor.setShowInvisibles(true);
  codeEditor.setFontSize('18px');
  codeEditor.setShowPrintMargin(false);
  codeEditor.setDisplayIndentGuides(false);

  codeEditor.getSession().on('initAfter', function(event) {
    // Not sure when we need to know that the worker has started?
  });

  codeEditor.getSession().on('syntaxErrors', function(event) {
    // I'm not seeing any events by this name!
  });

  codeEditor.getSession().on('outputFiles', function(event) {
    var outputFiles: IOutputFile[] = event.data;
    outputFiles.forEach(function(outputFile: IOutputFile) {
      if (scope.doodles[0].lastKnownJs !== outputFile.text) {
        scope.doodles[0].lastKnownJs = outputFile.text;
        updateStorage();
        updatePreview(WAIT_FOR_MORE_CODE_KEYSTROKES);
      }
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
  
  codeEditor.getSession().on('change', function(event) {
    scope.doodles[0].code = codeEditor.getValue();
    updateStorage();
    // Don't trigger a change to the preview, that happens
    // when the compiler emits a file.
  });

  htmlEditor.getSession().on('change', function(event) {
    scope.doodles[0].html = htmlEditor.getValue();
    updateStorage();
    updatePreview(WAIT_FOR_MORE_HTML_KEYSTROKES);
  });

  var rebuildPromise: angular.IPromise<void>;
  function updatePreview(delay: number) {
    if (rebuildPromise) {$timeout.cancel(rebuildPromise);}
    rebuildPromise = $timeout(function() {rebuildPreview(); rebuildPromise = undefined; }, delay);
  }

  function rebuildPreview() {
    try {
      // Kill any existing frames.
      var preview = document.getElementById('preview');
      while (preview.children.length > 0) {
        preview.removeChild(preview.firstChild);
      }

      if (scope.isViewVisible && scope.doodles[0].lastKnownJs) {
        var iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = '0';
        preview.appendChild(iframe);

        var content = iframe.contentDocument || iframe.contentWindow.document;

        var options = scope.options.filter(function(option: IOption, index: number, array: IOption[]) {
          return scope.doodles[0].dependencies.indexOf(option.name) > -1;
        });

        var chosenFileNames: string[] = options.map(function(option: IOption) {return option.js;});
        // TODO: We will later want to make operator overloading configurable for speed.
        var scriptFileNames: string[] = chosenFileNames.concat('maths.min.js');
        var scriptTags = scriptFileNames.map(function(fileName: string) {
          return "<script src='" + DOMAIN + "/js/" + fileName + "'></script>\n";
        });

        var html = scope.doodles[0].html;
        html = html.replace(/<!-- SCRIPTS-MARKER -->/, scriptTags.join(""));
        html = html.replace(/<!-- CODE-MARKER -->/, mathscript.transpile(scope.doodles[0].lastKnownJs));

        content.open();
        content.write(html);
        content.close();
      }
    }
    catch(e) {
    }
  };

  /**
   * Update the scripts that the workspace uses to type-check the code.
   * This involves comparing the dependencies of the doodle to the
   * units that are already loaded. We compute those that must be added
   * and those that must be removed from the workspace in order to minimize
   * network traffic and to ensure that the doodle defines the correct dependencies.
   */
  function updateWorkspace() {
    // Load the wokspace with the appropriate TypeScript definitions.
    // Quick Hack to eliminate maths which is only needed at runtime.
    var news: string[] = scope.doodles[0].dependencies;

    var adds: string[] = news.filter(function(dep) { return olds.indexOf(dep)<0; }).filter(function(name) { return (name !== 'maths');});

    var rmvs: string[] = olds.filter(function(dep) { return news.indexOf(dep)<0; });
    // The following is not essential, as `lib` is not an option, it's always there.
    // However, we do it to be explicit.
    if (rmvs.indexOf('lib')>=0) {
      rmvs.splice(rmvs.indexOf('lib'),1);
    }

    var rmvOpts: IOption[] = scope.options.filter(function(option) { return rmvs.indexOf(option.name)>=0; });

    var rmvUnits: { name: string; fileName: string }[] = rmvOpts.map(function(option) { return {name: option.name, fileName: option.dts }; });

    var addOpts: IOption[] = scope.options.filter(function(option) { return adds.indexOf(option.name)>=0; });

    // TODO: Optimize so that we don't keep loading `lib`.
    var addUnits: { name: string; fileName: string }[] = addOpts.map(function(option) { return {name: option.name, fileName: option.dts }; })
    if (olds.indexOf('lib') < 0) {
      addUnits = addUnits.concat({name: 'lib', fileName: 'lib.d.ts'});
    }

    var readFile = function(fileName: string, callback: (err, data?) => void) {
      var url = DOMAIN + "/ts/" + fileName;
      http.get(url)
        .success(function(data, status: number, headers, config) {
          callback(null, data)
        })
        .error(function(data, status: number, headers, config) {
          callback(new Error("Unable to wrangle #{fileName}."));
        })
    }

    rmvUnits.forEach(function(rmvUnit){
      workspace.removeScript(rmvUnit.fileName);
      olds.splice(olds.indexOf(rmvUnit.name),1);
    });

    addUnits.forEach(function(addUnit) {
      readFile(addUnit.fileName, function(err, content) {
        if (!err) {
          if (workspace) {
            workspace.ensureScript(addUnit.fileName, content.replace(/\r\n?/g, '\n'), true);
            olds.unshift(addUnit.name);
          }
          else {
          }
        }
      });
    });
  }
  
  function init() {

    // Load the doodles
    loadModel();

    /**
     * Our best guess as to whether this user has been here.
     */
    var newbie: boolean = (scope.doodles.length === 0);
    
    if (scope.doodles.length === 0) {
      // If there is no document, construct one based upon the first template.
      createDoodle(scope.templates[0], "My DaVinci Doodle");
    }
    else {

    }
    // We are now guaranteed that there is a current doodle i.e. scope.doodles[0] exists.

    // Following a browser refresh, show the code so that it refreshes correctly (bug).
    // This also side-steps the issue of the time it takes to restart the preview.
    // Ideally we remove this line and use the cached `lastKnownJs` to provide the preview.
    scope.doodles[0].isCodeVisible = true;
//  scope.doodles[0].isViewVisible = false;
    // We need to make sure that the files have names (for the TypeScript compiler).
    htmlEditor.changeFile(scope.doodles[0].html, FILENAME_HTML);
    codeEditor.changeFile(scope.doodles[0].code, FILENAME_CODE);

    // Now that things have settled down...
    updateStorage();
    updateView();

    if (routeParams.gistId) {
      var token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
      // This is an asynchronous call!
      downloadGist(token, routeParams.gistId);
    }
    else {
      updatePreview(WAIT_NO_MORE);
    }

    if (newbie) {
      showAboutDialog([WELCOME_NEWBIE_BLURB],[]);
    }
  }

  init();
}]);