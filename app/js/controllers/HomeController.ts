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
/// <reference path="../typings/IOption.ts" />
/// <reference path="../typings/IOutputFile.ts" />
/// <reference path="../typings/cookie.ts" />
/// <reference path="../services/uuid/IUuidService.ts" />
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
  var outputFile: IOutputFile;

  scope.templates = templates;

  scope.options = [
    {
      name: 'angular',
      version: '1.4.0-rc.1',
      js: 'angular@1.4.0-rc.1.min.js',
      dts: 'angular@1.4.0-rc.1.d.ts'
    },
    {
      name: 'blade',
      version: '0.9.35',
      js: 'blade@0.9.35.min.js',
      dts: 'blade@0.9.35.d.ts'
    },
    {
      name: 'd3',
      version: '3.5.5',
      js: 'd3@3.5.5.min.js',
      dts: 'd3@3.5.5.d.ts'
    },
    {
      name: 'eight',
      version: '0.9.15',
      js: 'eight@0.9.15.min.js',
      dts: 'eight@0.9.15.d.ts'
    },
    {
      name: 'jsxgraph',
      version: '0.99.3',
      js: 'jsxgraph@0.99.3.min.js',
      dts: 'jsxgraph@0.99.3.d.ts'
    },
    {
      name: 'three',
      version: '0.71.0',
      js: 'three@0.71.0.min.js',
      dts: 'three@0.71.0.d.ts'
    },
    {
      name: 'visual',
      version: '0.0.52',
      js: 'visual@0.0.52.min.js',
      dts: 'visual@0.0.52.d.ts'
    }
  ];

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
    else {
      // If we are returning to editing we probably don't want the view running.
      if (scope.isViewVisible) {
        // However, we'll let the user make that determination.
        // It's surprising when the mode change cascades for no good reason.
        // setViewMode(false);
        // updatePreview(WAIT_NO_MORE);
      }
      else {
        // The view is not running, no need to do a pointless cleanup.
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
    var d: any = document.getElementById('new-dialog');
    var dialog: HTMLDialogElement = d;
    var closeHandler = function() {
      dialog.removeEventListener('close', closeHandler);
      if (dialog.returnValue.length > 0) {
        var response: INewParameters = JSON.parse(dialog.returnValue);
        createDoodle(response.template, response.description);
        updateStorage();
        updateView();
        updatePreview(WAIT_NO_MORE);
      }
    };
    dialog.addEventListener('close', closeHandler);
    dialog.showModal();
  };

  scope.doOpen = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'open', label, value);
    var d: any = document.getElementById('open-dialog');
    var dialog: HTMLDialogElement = d;
    var closeHandler = function() {
      dialog.removeEventListener('close', closeHandler);
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
    dialog.addEventListener('close', closeHandler);
    dialog.showModal();
  };

  scope.doCopy = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'copy', label, value);
    var d: any = document.getElementById('copy-dialog');
    var dialog: HTMLDialogElement = d;
    scope.description = scope.doodles[0].description;
    var closeHandler = function() {
      dialog.removeEventListener('close', closeHandler);
      if (dialog.returnValue.length > 0) {
        var response: ICopyParameters = JSON.parse(dialog.returnValue);
        createDoodle(scope.doodles[0], response.description);
        updateStorage();
        updateView();
        updatePreview(WAIT_NO_MORE);
      }
    };
    dialog.addEventListener('close', closeHandler);
    dialog.showModal();
  };

  scope.doProperties = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'properties', label, value);
    var d: any = document.getElementById('doodle-dialog');
    var dialog: HTMLDialogElement = d;
    // It's wierd that we can get the `returnValue` but not set the initial value.
    // JavaScript strings are immutable so changing scope.description does not affect the original.
    // Make a copy of the doodle's dependencies so that Cancel works correctly.
    scope.description = scope.doodles[0].description;
    scope.dependencies = scope.doodles[0].dependencies.map(function(x: string) {return x;});
    var closeHandler = function() {
      dialog.removeEventListener('close', closeHandler);
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
    dialog.addEventListener('close', closeHandler);
    dialog.showModal();
  };

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
          html: gist.files[FILENAME_HTML].content,
          code: gist.files[FILENAME_CODE].content,
          dependencies: config.dependencies
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
        var d: any = document.getElementById('download-dialog');
        var dialog: HTMLDialogElement = d;
        var closeHandler = function() {
          dialog.removeEventListener('close', closeHandler);
          if (dialog.returnValue.length > 0) {
            var response: IDownloadParameters = JSON.parse(dialog.returnValue);
            downloadGist(token, response.gistId);
          }
          else {

          }
        };
        dialog.addEventListener('close', closeHandler);
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
    gist.files[FILENAME_META] = {content: JSON.stringify(configuration(scope.doodles[0]))};
    gist.files[FILENAME_HTML] = { content: scope.doodles[0].html };
    gist.files[FILENAME_CODE] = { content: scope.doodles[0].code };
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
              alert("Your doodle was successfully uploaded, patching the existing Gist.");
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
    var d: any = document.getElementById('share-dialog');
    var dialog: HTMLDialogElement = d;
    var closeHandler = function() {
      dialog.removeEventListener('close', closeHandler);
      if (dialog.returnValue.length > 0) {
        returnValueHandler(dialog.returnValue);
      }
    };
    dialog.addEventListener('close', closeHandler);
    dialog.showModal();
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
    outputFiles.forEach(function(file: IOutputFile) {
      outputFile = file;
      updatePreview(WAIT_FOR_MORE_CODE_KEYSTROKES);
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

        var chosenFileNames: string[] = options.map(function(option: IOption) {return option.js;});
        // TODO: We will later want to make operator overloading configurable for speed.
        var scriptFileNames: string[] = chosenFileNames.concat('maths.min.js');
        var scriptTags = scriptFileNames.map(function(fileName: string) {
          return "<script src='" + DOMAIN + "/js/" + fileName + "'></script>\n";
        });

        var html = scope.doodles[0].html;
        html = html.replace(/<!-- SCRIPTS-MARKER -->/, scriptTags.join(""));
        html = html.replace(/<!-- CODE-MARKER -->/, mathscript.transpile(outputFile.text));

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
    
    if (scope.doodles.length === 0) {
      createDoodle(scope.templates[2]);
    }
    // We are now guaranteed that there is a current doodle i.e. scope.doodles[0]

    // We need to make sure that the files have names (for the TypeScript compiler).
    // FIXME: These names aren't the same as those used in GitHub
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
  }

  init();
}]);