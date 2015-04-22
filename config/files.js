module.exports = function(lineman) {
  return {
    js: {
      vendor: [
        "bower_components/jquery/dist/jquery.js",
        "bower_components/angular/angular.js",
        "bower_components/angular-resource/angular-resource.js",
        "bower_components/angular-route/angular-route.js",
        "manual/ace-builds/src-noconflict/ace.js",
        "manual/ace-builds/src-noconflict/theme-chrome.js",
        "manual/ace-builds/src-noconflict/theme-eclipse.js",
        "manual/ace-builds/src-noconflict/theme-monokai.js",
        "manual/ace-builds/src-noconflict/theme-textmate.js",
        "manual/ace-builds/src-noconflict/theme-twilight.js",
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
          paths: ["vendor/css/normalize.css", "app/css/**/*.less"]
        }
      }
    }

  };
};
