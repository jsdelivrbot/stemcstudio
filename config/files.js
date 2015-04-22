module.exports = function(lineman) {
  return {
    js: {
      vendor: [
        "bower_components/jquery/dist/jquery.js",
        "bower_components/angular/angular.js",
        "bower_components/angular-resource/angular-resource.js",
        "bower_components/angular-route/angular-route.js",
        "bower_components/ace-builds/src-min-noconflict/ace.js",
        "bower_components/ace-builds/src-min-noconflict/theme-chrome.js",
        "bower_components/ace-builds/src-min-noconflict/theme-eclipse.js",
        "bower_components/ace-builds/src-min-noconflict/theme-monokai.js",
        "bower_components/ace-builds/src-min-noconflict/theme-textmate.js",
        "bower_components/ace-builds/src-min-noconflict/theme-twilight.js",
        "bower_components/ace-builds/src-min-noconflict/mode-typescript.js"
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
