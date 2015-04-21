module.exports = function(lineman) {
  return {
    js: {
      vendor: [
        "bower_components/angular/angular.js",
        "bower_components/angular-resource/angular-resource.js",
        "bower_components/angular-route/angular-route.js"
      ],
      app: [
        "app/js/app.js",
        "app/js/**/*.js"
      ]
    }
  };
};
