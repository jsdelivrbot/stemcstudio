// Karma configuration
// Generated on Fri Jan 29 2016 10:38:22 GMT-0500 (EST)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    // Keeping the base path as this karma config file allows the shim file to be a sibling,
    // which keeps it out of generated.
    basePath: './',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // Karma auto loads plugins unless you specify a plugins config.
    plugins: [
      require('karma-coverage'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-jasmine-html-reporter')
    ],

    // list of files / patterns to load in the browser
    // These files are loaded using <script> tags so it's a good place to put polyfill files.
    files: [
      // Polyfills.
      'node_modules/core-js/client/shim.min.js',

      // Include this with a <script> tag so that System is defined.
      'generated/jspm_packages/system.js',
      { pattern: 'jspm_packages/system.js.map', included: false, watched: false },

      // When the karma-test-shim goes looking for this file.
      { pattern: 'generated/jspm.config.js', included: false, watched: false },

      // This file is effectively our bootstrap mechanism.
      'karma-test-shim.js',

      // Load all test specifications and their map files.
      { pattern: 'generated/js/**/*.spec.js', included: false, watched: true },
      { pattern: 'generated/js/**/*.spec.js.map', included: false, watched: true },
      // Load tested files as needed to keep resource requirements down.
      { pattern: 'generated/js/constants.js', included: false, watched: true },
      { pattern: 'generated/js/constants.js.map', included: false, watched: true },
      { pattern: 'generated/js/directives/editor/setLanguage.js', included: false, watched: true },
      { pattern: 'generated/js/directives/editor/setLanguage.js.map', included: false, watched: true },
      { pattern: 'generated/js/editor/**/*.js', included: false, watched: true },
      { pattern: 'generated/js/editor/**/*.js.map', included: false, watched: true },
      { pattern: 'generated/js/languages/**/*.js', included: false, watched: true },
      { pattern: 'generated/js/languages/**/*.js.map', included: false, watched: true },
      { pattern: 'generated/js/utils/**/*.js', included: false, watched: true },
      { pattern: 'generated/js/utils/**/*.js.map', included: false, watched: true },
      // { pattern: 'generated/js/virtual/**/*.js', included: false, watched: true },
      // { pattern: 'generated/js/virtual/**/*.js.map', included: false, watched: true },
      { pattern: 'generated/js/workbench/**/*.js', included: false, watched: true },
      { pattern: 'generated/js/workbench/**/*.js.map', included: false, watched: true },
      // Stage in base only what we need.
      { pattern: 'generated/jspm_packages/system.js.map', included: false, watched: false },
      // Don't forget to change baseURL in jspm.config.js in generated as per CONTRIBUTING.md
      // { pattern: 'generated/jspm_packages/npm/rxjs@5.4.1/symbol/observable.js', included: false, watched: false },
      // { pattern: 'generated/jspm_packages/npm/rxjs@5.4.1/symbol/rxSubscriber.js', included: false, watched: false },
      // { pattern: 'generated/jspm_packages/npm/rxjs@5.4.1/util/*.js', included: false, watched: false },
      // { pattern: 'generated/jspm_packages/npm/rxjs@5.4.1/Observable.js', included: false, watched: false },
      // { pattern: 'generated/jspm_packages/npm/rxjs@5.4.1/Observer.js', included: false, watched: false },
      // { pattern: 'generated/jspm_packages/npm/rxjs@5.4.1/Subscriber.js', included: false, watched: false },
      // { pattern: 'generated/jspm_packages/npm/rxjs@5.4.1/Subscription.js', included: false, watched: false },
      // { pattern: 'generated/jspm_packages/**/!(*.spec).js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/github/jspm/nodelibs-process@0.1.2.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/github/jspm/nodelibs-process@0.1.2/index.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/process@0.11.10.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/process@0.11.10/browser.js', included: false, watched: false },

      { pattern: 'generated/jspm_packages/npm/editor-document@0.0.5.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/editor-document@0.0.5/build/browser/index.js', included: false, watched: false },
      
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/Observable.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/Observer.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/Subscription.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/symbol/observable.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/symbol/rxSubscriber.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/util/toSubscriber.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/Subscriber.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/util/isArray.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/util/isFunction.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/util/isObject.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/util/tryCatch.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/util/errorObject.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/util/UnsubscriptionError.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/util/pipe.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/util/root.js', included: false, watched: false },
      { pattern: 'generated/jspm_packages/npm/rxjs@5.5.6/util/noop.js', included: false, watched: false },
      
      // Karma will load this under /base/node_modules/tslib/tslib.js
      // The following is only needed if we are using the TypeScript runtime library.
      // { pattern: 'node_modules/tslib/tslib.js', included: false, watched: false },
    ],

    // This allows us to avoid the Karma base virtual directory issue without dropping
    // the baseURL in the JSPM configuration.
    proxies: {
    },


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'kjhtml'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    // concurrency: Infinity
  })
}