// Karma configuration
// Generated on Fri Jan 29 2016 10:38:22 GMT-0500 (EST)

//
// I'm trying to write this file so that it reads as a narrative with configuration specified
// 
//

module.exports = function (config) {
  config.set({

    // Let karma know which plugins we are using, so that it can load them.
    // I assume it looks in node_modules.
    // The documentation says that karma loads all sibling modules which have a name
    // starting with `karma-*`, so in theory the following line is redundant since I have
    // exactly these packages in node_modules.

    // Informed by the previous paragraph, maybe the following line will be commented out!
    // plugins: ['karma-jspm', 'karma-jasmine', 'karma-chrome-launcher'],

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    // Framework plugins export factory functions which modify the karma configuration.
    // We want these frameworks to run, so let karma know what they are.
    frameworks: ['jspm', 'jasmine'],

    // If we were to run now with an empty jspm property, we would get an `Executed 0 0f 0 ERROR`.
    // karma needs to be told where to find tests. We do that below in jspm.loadFiles.

    // After setting loadFiles to include `generated/js/**/*.js` and running, we get a surprising
    // XHR error (404) that is mysterious because everything in the URL looks right. It turns out that
    // karma appears to be "copying" files to a `base/` folder. I'm not clear why it does this
    // but the fix appears to lie in using a `proxies` property (next).

    // `proxies` is a standard karma property that lets us map a path to a proxy.
    // I don't know why, but karma seems to look for eveything in a `base/` folder, so
    // this mapping allows us to forget about this fact.
    // This allows us to avoid the Karma base virtual directory issue without dropping
    // the baseURL in the JSPM configuration.
    // Our first attempt is to set '/generated' => '/base/generated'.
    proxies: {
      '/generated': '/base/generated'
    },

    // Using `proxies` solves our loading problem and we appear to have moved into System/JSPM
    // loading territory. We not get an XHR error (404) as the loader tries to resolve a module
    // name (from an import) in our source. The difficulty seems to be that it is looking in the
    // jspm_packages at our root rather than in the `generated/` folder. We don't want to modify
    // our jspm.config.js file because we'd like it to be the same for production and testing.
    // But we note that karma is currently using the JSPM configuration file at the root, and it
    // would be more authentic to use the jspm.config.js in the `generated` folder (mirroring what
    // happens in the dist folder for production).

    // The sensible thing to do appears to be to set the `basePath` property. Reading the karma-jspm
    // source tells us that this will affect where the  JSPM config file is loaded from. But if we
    // do this, we run into trouble later (looks like a `base`problem again). So we accept the
    // inconvenience of not using the basePath property, or at least setting it to '/'.

    // base path that will be used to resolve all patterns (eg. files, exclude)
    // basePath: 'generated/',

    // Having done this, we get "Executed 0 of 0 ERROR", so we must adjust the jspm.loadFiles
    // property by removing the 'generated/' part of the path.

    //  If we run now, karma-jspm has a problem because it thinks the JSPM config file is called
    // 'config.js' (at least it is looking in the correct folder). We fix that by specifying
    // the name of the JSPM configuration file in jspm.config.

    // We are now in JSPM territory.
    // karma-jspm has figured out the name of our JSPM configuration file by looking in the
    // package.json file at the root of the project, finding it to be `jspm.config.js`.
    // That's good because the fallback for karma-jspm is the overly-generic `config.js`.
    // Without further modification, the System loader is resolving packages to the
    // jspm_packages folder of the root. But we want it to go to
    // `generated/jspm_packages` folder.

    // We are having the problem that the System loader is requesting files from the server
    // without inserting the `generated/` part of the path. Changing the baseURL in the
    // jspm.config.json does not seem to help much, and in any case, we don't want to touch
    // this file to be authentic.

    jspm: {
      // If karma-jspm cannot deduce the name of the JSPM configuration file from a
      // package.json file (using the standard jspm.configFile property) (and we don't have
      // a package.json file there) it will fall back to the name 'config.js'. That won't do,
      // so we let it know the name of the JSPM configuration file.
      config: 'jspm.config.js',
      //      packages: 'generated/jspm_packages/',
      // These files are loaded dynamically via SystemJS before the tests run.
      loadFiles: [
        'generated/js/editor/Range.spec.js',
        'generated/js/editor/RangeHelpers.spec.js'
      ],
      serveFiles: [
        'generated/js/editor/Range.js',
        'generated/js/editor/RangeHelpers.js',
        //      'generated/js/**/!(*spec).js',
      ],
      //      map: {
      //        "rxjs": "npm:rxjs@5.3.1",
      //      },
      //      paths: {
      //        //        "github:*": "../generated/jspm_packages/github/*",
      //        "npm:*": "https://www.stemcstudio.com/jspm_packages/npm/*"
      //      }
    },


    // list of files / patterns to load in the browser
    // These files are loaded using <script> tags so it's a good place to put polyfill files.
    // We don't put anything or much here because our plugins are responsible for figuring
    // out what is needed to bootstrap both the testing framework and the JSPM loader.
    files: [
    ],

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


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
    concurrency: Infinity
  })
}
