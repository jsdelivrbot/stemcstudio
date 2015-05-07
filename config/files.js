module.exports = function(lineman) {
  return {
    js: {
      vendor: [
        "bower_components/jquery/dist/jquery.js",
        "bower_components/underscore/underscore.js",

        "bower_components/angular/angular.js",
        "bower_components/angular-animate/angular-animate.js",
        "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
        "bower_components/angular-bootstrap/ui-bootstrap.js",

        "bower_components/angular-ui-router/release/angular-ui-router.js",

        "bower_components/angular-sanitize/angular-sanitize.js",
        "bower_components/angular-translate/angular-translate.js",
        "bower_components/bootstrap/dist/js/bootstrap.js",

        // TODO: No dialogs.
        "bower_components/dialog-polyfill/dialog-polyfill.js",
        "bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.js",

        "bower_components/davinci-mathscript/dist/davinci-mathscript.js",

        "manual/ace-builds/src-noconflict/ace.js",

        "manual/ace-builds/src-noconflict/theme-chrome.js",
        "manual/ace-builds/src-noconflict/theme-eclipse.js",
        "manual/ace-builds/src-noconflict/theme-monokai.js",
        "manual/ace-builds/src-noconflict/theme-textmate.js",
        "manual/ace-builds/src-noconflict/theme-twilight.js",

        "manual/ace-builds/src-noconflict/mode-html.js",
        "manual/ace-builds/src-noconflict/mode-typescript.js"
      ],
      app: [
        "app/js/app.js",
        "app/js/**/*.js"
      ]
    },

    less: {
      compile: {
        options: {
          paths: [
            "bower_components/bootstrap/less/normalize.less",
            "bower_components/bootstrap3-dialog/dist/less/bootstrap-dialog.less",
            "bower_components/dialog-polyfill/dialog-polyfill.css",
            "bower_components/angular-dialog-service/dialogs.min.css",
            "app/css/**/*.less"
          ]
        }
      }
    }

  };
};
