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

        "manual/ace/ace.js"
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
