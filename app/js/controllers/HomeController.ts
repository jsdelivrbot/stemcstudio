/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../typings/bootstrap-dialog/bootstrap-dialog.d.ts" />
/// <reference path="../../../typings/deuce/deuce.d.ts" />
/// <reference path="../../../typings/davinci-mathscript/davinci-mathscript.d.ts" />
/// <reference path="../../../typings/google-analytics/ga.d.ts" />
/// <reference path="../controllers/DoodleController.ts" />
/// <reference path="../directives/deuce.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../services/cloud/cloud.ts" />
/// <reference path="../services/cookie/cookie.ts" />
/// <reference path="../services/gham/IGitHubAuthManager.ts" />
/// <reference path="../services/gist/IGist.ts" />
/// <reference path="../services/github/GitHub.ts" />
/// <reference path="../services/options/IOption.ts" />
/// <reference path="../services/options/IOptionManager.ts" />
/// <reference path="../services/settings/settings.ts" />
/// <reference path="../../../bower_components/dialog-polyfill/dialog-polyfill.d.ts" />
module mathdoodle {
  export interface IHomeScope extends mathdoodle.IDoodleScope {
    /**
     * @param label Used by Universal Analytics to categorize events.
     * @param value Values must be non-negative. Useful to pass counts.
     */
    showHTML: (label?: string, value?: number) => void;
    /**
     * @param label Used by Universal Analytics to categorize events.
     * @param value Values must be non-negative. Useful to pass counts.
     */
    showCode: (label?: string, value?: number) => void;
    /**
     * @param label Used by Universal Analytics to categorize events.
     * @param value Values must be non-negative. Useful to pass counts.
     */
    showLess: (label?: string, value?: number) => void;

    isShowingHTML: boolean;
    isShowingCode: boolean;
    isShowingLess: boolean;

    isEditMode: boolean;
    toggleText: string;
    toggleMode: () => void;

    isViewVisible: boolean;
    resumeText: string;
    toggleView: () => void;

    doNew: () => void;
    doOpen: () => void;
    doCopy: () => void;
    doProperties(): void;
    doAbout(): void;
    doShare: () => void;
    doHelp: () => void;

    doUpload(): void;

    templates: IDoodle[];

    shareURL: () => string;

    updateView(): void;
    updatePreview(delay: number): void;
    previewIFrame: HTMLIFrameElement;
  }
  export interface IOutputFile {
    name: string;
    writeByteOrderMark: boolean;
    text: string;
    sourceMapEntries: any[];
  }
}

angular.module('app').controller('home-controller', [
  '$scope',
  '$state',
  '$http',
  '$location',
  '$timeout',
  '$window',
  '$modal',
  'mathscript',
  'GitHub',
  'GitHubAuthManager',
  'cookie',
  'templates',
  'uuid4',
  'ga',
  'doodlesKey',
  'doodles',
  'options',
  'FILENAME_META',
  'FILENAME_HTML',
  'FILENAME_CODE',
  'FILENAME_LESS',
  'settings',
  function(
    scope: mathdoodle.IHomeScope,
    $state: angular.ui.IStateService,
    http: angular.IHttpService,
    $location: angular.ILocationService,
    $timeout: angular.ITimeoutService,
    $window: angular.IWindowService,
    $modal,
    mathscript,
    github,
    authManager: IGitHubAuthManager,
    cookie: ICookieService,
    templates: mathdoodle.IDoodle[],
    uuid4: IUuidService,
    ga: UniversalAnalytics.ga,
    doodlesKey: string,
    doodles: mathdoodle.IDoodleManager,
    options: IOptionManager,
    FILENAME_META: string,
    FILENAME_HTML: string,
    FILENAME_CODE: string,
    FILENAME_LESS: string,
    settings: mathdoodle.ISettingsService
  ) {

  var FWD_SLASH = '/';

  var WAIT_NO_MORE = 0;
  var WAIT_FOR_MORE_HTML_KEYSTROKES = 350;
  var WAIT_FOR_MORE_CODE_KEYSTROKES = 1500;
  var WAIT_FOR_MORE_LESS_KEYSTROKES = 350;

  var TEXT_CODE_HIDE = "View";
  var TEXT_CODE_SHOW = "Edit";

  var TEXT_VIEW_RESUME = "Resume";
  var TEXT_VIEW_SUSPEND = "Suspend";

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

  authManager.handleGitHubLoginCallback(function(err, token: string) {
    if (err) {
      scope.alert(err.message);
    }
  });

  // We'll keep the transpiled code here.
  // var outputFile: IOutputFile;

  scope.templates = templates;

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
      var matching = options.filter(function(option) { return option.name === name;});
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

  scope.updateView = function() {
    updateWorkspace();
    htmlEditor.setValue(doodles.current().html, -1);
    codeEditor.setValue(doodles.current().code, -1);
    lessEditor.setValue(doodles.current().less, -1);
    setEditMode(doodles.current().isCodeVisible);
    setViewMode(doodles.current().isViewVisible);
    setCurrentEditor(doodles.current().focusEditor);
  }

  var setViewMode = function(isViewVisible: boolean) {
    scope.isViewVisible = isViewVisible;
    scope.resumeText = isViewVisible ? TEXT_VIEW_SUSPEND : TEXT_VIEW_RESUME;
  }

  scope.$watch('isViewVisible', function(newVal: boolean, oldVal, scope) {
    doodles.current().isViewVisible = scope.isViewVisible;
    doodles.updateStorage();
  });

  function setEditMode(editMode: boolean) {
    scope.isEditMode = editMode;
    scope.toggleText = editMode ? TEXT_CODE_HIDE : TEXT_CODE_SHOW;
  }

  scope.$watch('isEditMode', function(newVal: boolean, oldVal, scope) {
    doodles.current().isCodeVisible = scope.isEditMode;
    doodles.updateStorage();
  });

  scope.toggleMode = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'toggleMode', label, value);
    setEditMode(!scope.isEditMode);
    // Ensure the preview is running when going away from editing.
    if (!scope.isEditMode) {
      setViewMode(true);
      scope.updatePreview(WAIT_NO_MORE);
    }
    else {
      if (scope.isViewVisible) {
        scope.updatePreview(WAIT_NO_MORE);
      }
    }
    // This does not seem sufficient to force the editors to repaint when...
    // (Mobile Keyboard or Developer Tools visible), followed by
    // View, followed by
    // Edit.
    htmlEditor.resize(true);
    codeEditor.resize(true);
    lessEditor.resize(true);
  };

  scope.toggleView = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'toggleView', label, value);
    setViewMode(!scope.isViewVisible);
    scope.updatePreview(WAIT_NO_MORE);
  };

  scope.showHTML = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'showHTML', label, value);
    setCurrentEditor(FILENAME_HTML);
  }

  scope.showCode = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'showCode', label, value);
    setCurrentEditor(FILENAME_CODE);
  }

  scope.showLess = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'showLess', label, value);
    setCurrentEditor(FILENAME_LESS);
  }

  function setCurrentEditor(fileName: string) {
    // We don't set the focus or go to a line because that would
    // activate the keyboard on a mobile device. The user will
    // want to set the insertion point anyway which will trigger
    // keyboard activation at the right time.
    // Notice that we call `resize` on the editor to force a repaint.
    if (fileName === FILENAME_CODE) {
      scope.isShowingHTML = false;
      scope.isShowingCode = true;
      scope.isShowingLess = false;
      htmlEditor.resize(true);
      doodles.current().focusEditor = fileName;
      doodles.updateStorage();
    }
    else if (fileName === FILENAME_HTML) {
      scope.isShowingHTML = true;
      scope.isShowingCode = false;
      scope.isShowingLess = false;
      codeEditor.resize(true);
      doodles.current().focusEditor = fileName;
      doodles.updateStorage();
    }
    else if (fileName === FILENAME_LESS) {
      scope.isShowingHTML = false;
      scope.isShowingCode = false;
      scope.isShowingLess = true;
      lessEditor.resize(true);
      doodles.current().focusEditor = fileName;
      doodles.updateStorage();
    }
    else {
      setCurrentEditor(FILENAME_CODE);
    }
  }

  scope.doNew = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'new', label, value);
    $state.go('new');
  };

  scope.doOpen = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'open', label, value);
    $state.go('open');
  };

  scope.doCopy = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'copy', label, value);
    $state.go('copy');
  };

  scope.doProperties = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'properties', label, value);
    $state.go('properties', {doodle: doodles.current()});
  };

  scope.doAbout = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'about', label, value);
    showAboutDialog([], []);
  }

  function showAboutDialog(prologs: string[], epilogs: string[]) {
    $state.go('about');
  }

  function downloadGist(token: string, gistId: string) {
    github.getGist(token, gistId, function(err, gist) {
      if (!err) {
        var config: mathdoodle.IDoodleConfig = JSON.parse(gist.files[FILENAME_META].content);
        var html = gist.files[FILENAME_HTML].content;
        var code = gist.files[FILENAME_CODE].content;

        var codeInfo: mathdoodle.IDoodle = {
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
          less: gist.files[FILENAME_LESS].content,
          dependencies: depArray(config.dependencies)
        };
        doodles.deleteDoodle(config.uuid);
        doodles.unshift(codeInfo);
        doodles.updateStorage();
        scope.updateView();
        scope.updatePreview(WAIT_NO_MORE);
      }
      else {
        scope.alert("Error attempting to download Gist");
      }
    });
  }

  /**
   * Maps the doodle to the format required for GitHub.
   */
  function configuration(doodle: mathdoodle.IDoodle): mathdoodle.IDoodleConfig {
    return {
      uuid: doodle.uuid,
      description: doodle.description,
      dependencies: depObject(doodle.dependencies)
    };
  }

  function doodleToGist(doodle: mathdoodle.IDoodle): IGist {
    var gist: IGist = {
      description: doodles.current().description,
      public: true,
      files: {}
    };
    gist.files[FILENAME_META] = {content: JSON.stringify(configuration(doodles.current()), null, 2)};
    gist.files[FILENAME_HTML] = {content: doodles.current().html};
    gist.files[FILENAME_CODE] = {content: doodles.current().code};
    gist.files[FILENAME_LESS] = {content: doodles.current().less};
    return gist;
  }

  scope.doUpload = function(label?: string, value?: number) {
    ga('send', 'event', 'doodle', 'upload', label, value);
    var token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
    if (token) {
      var data = doodleToGist(doodles.current());
      if (doodles.current().gistId) {
        github.patchGist(token, doodles.current().gistId, data, function(err, response, status: number, headers, config) {
            if (err) {
              if (status === 404) {
                if (confirm("The Gist associated with your doodle no longer exists.\nWould you like me to disassociate your doodle so that you can create a new Gist?")) {
                  doodles.current().gistId = undefined;
                  doodles.updateStorage();
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
              BootstrapDialog.show({
                type: BootstrapDialog.TYPE_SUCCESS,
                title: $("<h3>Upload complete</h3>"),
                message: "Your doodle was successfully uploaded and patched the existing Gist.",
                buttons: [{
                  label: "Close",
                  cssClass: 'btn btn-primary',
                  action: function(dialog) {
                    dialog.close();
                  }
                }]
              });
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
              doodles.current().gistId = response.id;
              doodles.updateStorage();
              BootstrapDialog.show({
                type: BootstrapDialog.TYPE_SUCCESS,
                title: $("<h3>Upload complete</h3>"),
                message: "Your doodle was successfully uploaded and associated with a new Gist.",
                  buttons: [{
                    label: "Close",
                    cssClass: 'btn btn-primary',
                    action: function(dialog) {
                      dialog.close();
                    }
                  }]
              });
            }
        });
      }
    }
    else {
        BootstrapDialog.alert({
          type: BootstrapDialog.TYPE_INFO,
          message: "You must be logged in."
        });
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

  var DOMAIN = $location.protocol() + ':'+ FWD_SLASH + FWD_SLASH + $location.host() + ":" + $location.port();

  ace.config.set('workerPath', '/js')

  var workspace = ace.workspace();

  var codeEditor = ace.edit($window.document.getElementById('code-editor'), workspace);
  codeEditor.resize(true);
  codeEditor.getSession().setMode('ace/mode/typescript');

  codeEditor.setTheme(settings.theme);
  codeEditor.getSession().setTabSize(settings.indent);
  codeEditor.setShowInvisibles(settings.showInvisibles);
  codeEditor.setFontSize(settings.fontSize);
  codeEditor.setShowPrintMargin(settings.showPrintMargin);
  codeEditor.setDisplayIndentGuides(settings.displayIndentGuides);

  codeEditor.getSession().on('initAfter', function(event) {
    // Not sure when we need to know that the worker has started?
  });

  codeEditor.getSession().on('syntaxErrors', function(event) {
    // I'm not seeing any events by this name!
  });

  codeEditor.getSession().on('outputFiles', function(event) {
    var outputFiles: mathdoodle.IOutputFile[] = event.data;
    outputFiles.forEach(function(outputFile: mathdoodle.IOutputFile) {
      if (doodles.current().lastKnownJs !== outputFile.text) {
        doodles.current().lastKnownJs = outputFile.text;
        doodles.updateStorage();
        scope.updatePreview(WAIT_FOR_MORE_CODE_KEYSTROKES);
      }
    });
  });

  codeEditor.getSession().on('change', function(event) {
    doodles.current().code = codeEditor.getValue();
    doodles.updateStorage();
    // Don't trigger a change to the preview, that happens
    // when the compiler emits a file.
  });

  var htmlEditor = ace.edit($window.document.getElementById('html-editor'), workspace);
  htmlEditor.resize(true);
  htmlEditor.getSession().setMode('ace/mode/html');

  htmlEditor.setTheme(settings.theme);
  htmlEditor.getSession().setTabSize(settings.indent);
  htmlEditor.setShowInvisibles(settings.showInvisibles);
  htmlEditor.setFontSize(settings.fontSize);
  htmlEditor.setShowPrintMargin(settings.showPrintMargin);
  htmlEditor.setDisplayIndentGuides(settings.displayIndentGuides);

  htmlEditor.getSession().on('change', function(event) {
    doodles.current().html = htmlEditor.getValue();
    doodles.updateStorage();
    scope.updatePreview(WAIT_FOR_MORE_HTML_KEYSTROKES);
  });

  var lessEditor = ace.edit($window.document.getElementById('less-editor'), workspace);
  lessEditor.resize(true);
  lessEditor.getSession().setMode('ace/mode/less');

  lessEditor.setTheme(settings.theme);
  lessEditor.getSession().setTabSize(settings.indent);
  lessEditor.setShowInvisibles(settings.showInvisibles);
  lessEditor.setFontSize(settings.fontSize);
  lessEditor.setShowPrintMargin(settings.showPrintMargin);
  lessEditor.setDisplayIndentGuides(settings.displayIndentGuides);

  lessEditor.getSession().on('change', function(event) {
    doodles.current().less = lessEditor.getValue();
    doodles.updateStorage();
    scope.updatePreview(WAIT_FOR_MORE_LESS_KEYSTROKES);
  });

  var rebuildPromise: angular.IPromise<void>;
  scope.updatePreview = function(delay: number) {
    if (rebuildPromise) {$timeout.cancel(rebuildPromise);}
    rebuildPromise = $timeout(function() {rebuildPreview(); rebuildPromise = undefined; }, delay);
  }

  function rebuildPreview() {
    try {
      // Kill any existing frames.
      scope.previewIFrame = undefined;
      var preview = document.getElementById('preview');
      while (preview.children.length > 0) {
        preview.removeChild(preview.firstChild);
      }

      var toolbar = document.getElementById('toolbar');
      if (scope.isViewVisible && doodles.current().lastKnownJs) {
        scope.previewIFrame = document.createElement('iframe');
        scope.previewIFrame.style.width = '100%';
        scope.previewIFrame.style.height = '100%';
        scope.previewIFrame.style.border = '0';

        preview.appendChild(scope.previewIFrame);

        var content = scope.previewIFrame.contentDocument || scope.previewIFrame.contentWindow.document;

        var selOpts = options.filter(function(option: IOption, index: number, array: IOption[]) {
          return doodles.current().dependencies.indexOf(option.name) > -1;
        });

        var chosenFileNames: string[] = selOpts.map(function(option: IOption) {return option.js;});
        // TODO: We will later want to make operator overloading configurable for speed.
        var scriptFileNames: string[] = chosenFileNames.concat('maths.min.js');
        var scriptTags = scriptFileNames.map(function(fileName: string) {
          return "<script src='" + DOMAIN + "/js/" + fileName + "'></script>\n";
        });

        var html = doodles.current().html;
        html = html.replace(/<!-- SCRIPTS-MARKER -->/, scriptTags.join(""));
        html = html.replace(/<!-- STYLE-MARKER -->/, ['<style type="text/css">', doodles.current().less,'</style>'].join(""));
        html = html.replace(/<!-- CODE-MARKER -->/, mathscript.transpile(doodles.current().lastKnownJs));

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
    var news: string[] = doodles.current().dependencies;

    var adds: string[] = news.filter(function(dep) { return olds.indexOf(dep)<0; }).filter(function(name) { return (name !== 'maths');});

    var rmvs: string[] = olds.filter(function(dep) { return news.indexOf(dep)<0; });
    // The following is not essential, as `lib` is not an option, it's always there.
    // However, we do it to be explicit.
    if (rmvs.indexOf('lib')>=0) {
      rmvs.splice(rmvs.indexOf('lib'),1);
    }

    var rmvOpts: IOption[] = options.filter(function(option) { return rmvs.indexOf(option.name)>=0; });

    var rmvUnits: { name: string; fileName: string }[] = rmvOpts.map(function(option) { return {name: option.name, fileName: option.dts }; });

    var addOpts: IOption[] = options.filter(function(option) { return adds.indexOf(option.name)>=0; });

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

    // Since the doodles are available as a service, do we need them to be bound to the scope?
    // scope.doodles = doodles;

    /**
     * Our best guess as to whether this user has been here.
     */
    var newbie: boolean = (doodles.length === 0);
    
    if (doodles.length === 0) {
      // If there is no document, construct one based upon the first template.
      doodles.createDoodle(scope.templates[0], "My DaVinci Doodle");
    }
    else {

    }
    if (typeof doodles.current().html !== 'string') {
        doodles.current().html = "";
    }
    if (typeof doodles.current().code !== 'string') {
        doodles.current().code = "";
    }
    if (typeof doodles.current().less !== 'string') {
        doodles.current().less = "";
    }
    // We are now guaranteed that there is a current doodle i.e. doodles.current() exists.

    // Following a browser refresh, show the code so that it refreshes correctly (bug).
    // This also side-steps the issue of the time it takes to restart the preview.
    // Ideally we remove this line and use the cached `lastKnownJs` to provide the preview.
    doodles.current().isCodeVisible = true;
//  doodles.current().isViewVisible = false;
    // We need to make sure that the files have names (for the TypeScript compiler).
    htmlEditor.changeFile(doodles.current().html, FILENAME_HTML);
    htmlEditor.resize(true);
    codeEditor.changeFile(doodles.current().code, FILENAME_CODE);
    codeEditor.resize(true);
    lessEditor.changeFile(doodles.current().less, FILENAME_LESS);
    lessEditor.resize(true);

    // Now that things have settled down...
    doodles.updateStorage();
    scope.updateView();

//    if (routeParams.gistId) {
//      var token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
      // This is an asynchronous call!
//      downloadGist(token, routeParams.gistId);
//    }
//    else {
      scope.updatePreview(WAIT_NO_MORE);
//    }

    if (newbie) {
      showAboutDialog([WELCOME_NEWBIE_BLURB],[]);
    }
  }

  init();
}]);