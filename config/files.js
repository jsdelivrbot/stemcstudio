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

        "submodules/deuce/build/src-noconflict/ace.js",

        "submodules/deuce/build/src-noconflict/theme-chrome.js",
        "submodules/deuce/build/src-noconflict/theme-eclipse.js",
        "submodules/deuce/build/src-noconflict/theme-iplastic.js",
        "submodules/deuce/build/src-noconflict/theme-monokai.js",
        "submodules/deuce/build/src-noconflict/theme-textmate.js",
        "submodules/deuce/build/src-noconflict/theme-twilight.js",

        "submodules/deuce/build/src-noconflict/mode-coffee.js",
        "submodules/deuce/build/src-noconflict/mode-css.js",
        "submodules/deuce/build/src-noconflict/mode-html.js",
        "submodules/deuce/build/src-noconflict/mode-less.js",
        "submodules/deuce/build/src-noconflict/mode-python.js",
        "submodules/deuce/build/src-noconflict/mode-javascript.js",
        "submodules/deuce/build/src-noconflict/mode-typescript.js"
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
