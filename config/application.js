//
// This module is building a data-structure which looks to me like overrides to a Gruntfile.js
//
// The module exports a function, which when executed with the linman argument, returns a
// data structure not unlike a Gruntfile.js
//
// In other words, this file works like Gruntfile.js
// 
module.exports = function(lineman) {

  // These versions should correspond to those used in config/application.js
  var specs = [
    {name: 'angular',            version: '1.4.6',   src: ['**']},
    {name: 'async',              version: '1.4.2',   src: ['dist/**']},
    {name: 'davinci-blade',      version: '1.7.2',   src: ['dist/**','documentation/**', 'bower.json', 'LICENSE']},
    {name: 'davinci-eight',      version: '2.102.0', src: ['dist/**','documentation/**', 'bower.json', 'LICENSE']},
    {name: 'davinci-mathscript', version: '1.0.8',   src: ['dist/**','documentation/**', 'bower.json', 'LICENSE']},
    {name: 'd3',                 version: '3.5.5',   src: ['**']},
    {name: 'domready',           version: '1.0.0',   src: ['**']},
    {name: 'gl-matrix',          version: '2.3.1',   src: ['dist/**']},
    {name: 'jsxgraph',           version: '0.99.3',  src: ['**']},
    {name: 'requirejs',          version: '2.1.9',   src: ['**']},
    {name: 'stats.js',           version: '0.0.14',  src: ['**']},
    {name: 'threejs',            version: '0.72.0',  src: ['build/**']},
    {name: 'threejs',            version: '0.72.0',  src: ['bower.json']},
    {name: 'typescript',         version: '1.4.1.3', src: ['**']},
    {name: 'underscore',         version: '1.8.3',   src: ['**']}
  ];

  /**
   * The folder that contains manually added d.ts files.
   * This folder is version-specific and named package@major.minor.patch.
   */
  var CURATED_COMPONENTS = 'museum';
  /**
   * The folder in the development or production folder that contains components.
   * This folder is version-specific and named package@major.minor.patch.
   */
  var MDOODLE_COMPONENTS = 'vendor'

  function deuceDir(fileName) {
    return MDOODLE_COMPONENTS + '/davinci-deuce/' + fileName
  }
  function deuceDirReg(fileName) {
    return deuceDir('build/src-noconflict/' + fileName)
  }
  function deuceDirMin(fileName) {
    return deuceDir('build/src-min-noconflict/' + fileName)
  }

  /**
   * Compute the files to be copied.
   * This is almost the same for development and production, the only difference
   * being the locations that we pull and push to.
   * param deuceIn {(name:string)=>string} Computes the source path from a filename for davinci-deuce.
   */
  function files(deuceIn, targetOut) {
    var copies = [
      {src: "appcache.mf", dest: targetOut("appcache.mf")},

      {src: deuceIn("worker-workspace.js"),   dest: targetOut("js/worker-workspace.js")},
      {src: deuceIn("worker-html.js"),        dest: targetOut("js/worker-html.js")},
      {src: deuceIn("worker-javascript.js)"), dest: targetOut("js/worker-javascript.js")},
      {src: deuceIn("worker-json.js"),        dest: targetOut("js/worker-json.js")},
      {src: deuceIn("worker-typescript.js"),  dest: targetOut("js/worker-typescript.js")},
      {src: deuceIn("worker-css.js"),         dest: targetOut("js/worker-css.js")},

      {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",   dest: targetOut("fonts/glyphicons-halflings-regular.eot")},
      {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",   dest: targetOut("fonts/glyphicons-halflings-regular.svg")},
      {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",   dest: targetOut("fonts/glyphicons-halflings-regular.ttf")},
      {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",  dest: targetOut("fonts/glyphicons-halflings-regular.woff")},
      {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2", dest: targetOut("fonts/glyphicons-halflings-regular.woff2")}
    ];
    for (var i = 0; i < specs.length; i++) {
      var spec = specs[i];
      var wildPath = '/' + spec.name;
      var versPath = wildPath + '@' + spec.version;
      var outPath = MDOODLE_COMPONENTS + versPath;
      var museumCwd = CURATED_COMPONENTS + versPath;
      copies.push({expand: true, cwd: museumCwd, src: spec.src, dest: targetOut(outPath)});
      var vendorCwd = 'vendor' + wildPath;
      copies.push({expand: true, cwd: vendorCwd, src: spec.src, dest: targetOut(outPath)});
      var parentCwd = '..' + wildPath;
      copies.push({expand: true, cwd: parentCwd, src: spec.src, dest: targetOut(outPath)});
    }
    return copies;
  }

  // Invoke typescript.coffee in the plugins folder.
  // Not sure how requiring this file is "morally equivalent" to the following line placed
  // inside the configuration JSON returned below.
  // `loadNpmTasks: ['grunt-typescript'],`
  require("./plugins/typescript")

  // So how does Lineman know to run the `typescript` task, and when?
  //
  // Normally we would have (in config/application.js):
  //
  //  prependTasks: {
  //    common: ['typescript']
  //  }
  //
  //  or `appendTasks` to add it to the end of the Lineman build process
  //
  //  I now see that this too is done in the typescript.coffee file!
  //
  // It seems that we are creating a modular Grunt configuration!!

  return {
    ///////////////////////////////////////////////////////////////////////////
    // BEGIN: stuff that looks like a Gruntfile.js
    //////////////////////////////////////////////////////////////////////////
    concat_sourcemap: {
      js: {
        src: [
          "<%= files.js.vendor %>",
          "<%= files.typescript.generated %>",
          "<%= files.coffee.generated %>",
          "<%= files.js.app %>",
          "<%= files.ngtemplates.dest %>"
        ]
      }
    },

    copy: {
      dev: {
        files: files(deuceDirReg, function (path) {return 'generated/' + path})
      },
      dist: {
        files: files(deuceDirMin, function (path) {return 'dist/' + path})
      }
    },

    watch: {
      museum: {
        files: ['museum/**/*.d.ts','appcache.mf'],
        tasks: ['copy:dev']
      }
    },
    // Just putting this in by way of example.
    removeTasks: {
      common: ["webfonts:dev", "images:dev"],
      dist: []
    },
    // TODO: Find out what this does.
    // Proxy API requests to localhost:4567
    server: {
      apiProxy: {
        enabled: false,
        host: 'localhost',
        port: 4567
      }
    },
    
    typescript: {
      compile: {
        src: 'app/js/**/*.ts',
        dest: 'generated/js/app.ts.js',
        options: {
          target: 'es5'
        }
      }
    }
    ///////////////////////////////////////////////////////////////////////////
    // END: stuff that looks like a Gruntfile.js
    //////////////////////////////////////////////////////////////////////////
  }; // end of the data structure returned by the exported function
}; // end of the exported function implementation.