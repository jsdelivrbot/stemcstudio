module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
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
            'node_modules/systemjs/dist/system.src.js',

            //
            { pattern: 'systemjs.config.js', included: false, watched: false },

            'node_modules/typescript/lib/typescript.js',

            'karma-test-shim.js',

            { pattern: 'src/**/*.js', included: false, watched: true },
            { pattern: 'test/**/*.js', included: false, watched: true },

            // Karma will load these under /base/node_modules/...
            { pattern: 'node_modules/tslib/tslib.js', included: false, watched: false },
            { pattern: 'node_modules/code-writer/build/browser/index.js', included: false, watched: false },
            { pattern: 'node_modules/davinci-csv/build/browser/index.js', included: false, watched: false },
            { pattern: 'node_modules/editor-document/build/browser/index.js', included: false, watched: false },
            { pattern: 'node_modules/generic-rbtree/build/browser/index.js', included: false, watched: false },
            { pattern: 'node_modules/typhon-lang/build/browser/index.js', included: false, watched: false },
            { pattern: 'node_modules/typhon-typescript/build/browser/index.js', included: false, watched: false }
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/**/!(*spec).js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage', 'kjhtml'],


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
        browsers: ['PhantomJS'],
        // browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
