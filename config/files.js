module.exports = function(lineman) {
  return {
    js: {
      vendor: [
        "vendor/jquery/dist/jquery.js",
        "vendor/underscore/underscore.js",

        "vendor/angular/angular.js",
        "vendor/angular-animate/angular-animate.js",
        "vendor/angular-bootstrap/ui-bootstrap-tpls.js",
        "vendor/angular-bootstrap/ui-bootstrap.js",
        "vendor/angular-material-icons/angular-material-icons.js",
        "vendor/angular-sanitize/angular-sanitize.js",
        "vendor/angular-translate/angular-translate.js",
        "vendor/angular-ui-router/release/angular-ui-router.js",
        "vendor/bootstrap/dist/js/bootstrap.js",

        "vendor/dialog-polyfill/dialog-polyfill.js",
        "vendor/bootstrap3-dialog/dist/js/bootstrap-dialog.js",

        "vendor/davinci-mathscript/dist/davinci-mathscript.js",

        "../davinci-deuce/build/src-noconflict/ace.js",
        "../davinci-deuce/build/src-noconflict/theme-mathdoodle.js",

        "vendor/davinci-deuce/build/src-noconflict/theme-chrome.js",
        "vendor/davinci-deuce/build/src-noconflict/theme-eclipse.js",
        "vendor/davinci-deuce/build/src-noconflict/theme-iplastic.js",
        "vendor/davinci-deuce/build/src-noconflict/theme-mathdoodle.js",
        "vendor/davinci-deuce/build/src-noconflict/theme-monokai.js",
        "vendor/davinci-deuce/build/src-noconflict/theme-textmate.js",
        "vendor/davinci-deuce/build/src-noconflict/theme-twilight.js",

        "vendor/davinci-deuce/build/src-noconflict/mode-coffee.js",
        "vendor/davinci-deuce/build/src-noconflict/mode-css.js",
        "vendor/davinci-deuce/build/src-noconflict/mode-glsl.js",
        "vendor/davinci-deuce/build/src-noconflict/mode-html.js",
        "vendor/davinci-deuce/build/src-noconflict/mode-json.js",
        "vendor/davinci-deuce/build/src-noconflict/mode-less.js",
        "vendor/davinci-deuce/build/src-noconflict/mode-python.js",
        "vendor/davinci-deuce/build/src-noconflict/mode-javascript.js",
        "vendor/davinci-deuce/build/src-noconflict/mode-typescript.js"
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
            "vendor/bootstrap/less/normalize.less",
            "vendor/bootstrap3-dialog/dist/less/bootstrap-dialog.less",
            "vendor/dialog-polyfill/dialog-polyfill.css",
            "vendor/angular-dialog-service/dialogs.min.css",
            "app/css/**/*.less"
          ]
        }
      }
    }

  };
};
