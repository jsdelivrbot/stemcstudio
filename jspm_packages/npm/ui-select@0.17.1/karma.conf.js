/* */ 
(function(process) {
  module.exports = function(config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine'],
      files: ['node_modules/jquery/dist/jquery.js', 'node_modules/angular/angular.js', 'node_modules/angular-sanitize/angular-sanitize.js', 'node_modules/angular-mocks/angular-mocks.js', 'dist/select.js', 'test/helpers.js', 'test/**/*.spec.js'],
      exclude: ['./index.js'],
      port: 9876,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],
      singleRun: false
    });
  };
})(require('process'));
