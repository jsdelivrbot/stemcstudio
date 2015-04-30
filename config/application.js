module.exports = function(lineman) {

  require("./plugins/typescript");

  return {
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
        files: [
          {src: "manual/ace-builds/src-min-noconflict/worker-workspace.js",  dest: "generated/js/worker-workspace.js"},
          {src: "manual/ace-builds/src-min-noconflict/worker-html.js",       dest: "generated/js/worker-html.js"},
          {src: "manual/ace-builds/src-min-noconflict/worker-javascript.js", dest: "generated/js/worker-javascript.js"},
          {src: "manual/ace-builds/src-min-noconflict/worker-typescript.js", dest: "generated/js/worker-typescript.js"},
      
          {src: "bower_components/davinci-blade/dist/davinci-blade.min.js",    dest: "generated/js/blade.min.js"},
          {src: "bower_components/davinci-eight/dist/davinci-eight.min.js",    dest: "generated/js/eight.min.js"},
          {src: "bower_components/davinci-visual/dist/davinci-visual.min.js",  dest: "generated/js/visual.min.js"},
          {src: "bower_components/davinci-mathscript/dist/davinci-mathscript.min.js",  dest: "generated/js/maths.min.js"},
          {src: "bower_components/angular/angular.min.js",                   dest: "generated/js/angular.min.js"},
          {src: "bower_components/threejs/build/three.min.js",               dest: "generated/js/three.min.js"},
          {src: "museum/d3/d3@3-5-5.min.js",                                 dest: "generated/js/d3@3-5-5.min.js"},
          {src: "museum/jsxgraph/jsxgraph-0-99-3.min.js",                    dest: "generated/js/jsxgraph-0-99-3.min.js"},

          {src: "bower_components/davinci-blade/dist/davinci-blade.d.ts",    dest: "generated/ts/blade.d.ts"},
          {src: "bower_components/davinci-eight/dist/davinci-eight.d.ts",    dest: "generated/ts/eight.d.ts"},
          {src: "bower_components/davinci-visual/dist/davinci-visual.d.ts",  dest: "generated/ts/visual.d.ts"},
          {src: "node_modules/typescript/bin/lib.d.ts",                      dest: "generated/ts/lib.d.ts"},
          {src: "typings/angularjs/angular.d.ts",                            dest: "generated/ts/angular.d.ts"},
          {src: "typings/threejs/three.d.ts",                                dest: "generated/ts/three.d.ts"},
          {src: "museum/d3/d3@3-5-5.d.ts",                                   dest: "generated/ts/d3@3-5-5.d.ts"},
          {src: "museum/jsxgraph/jsxgraph-0-99-3.d.ts",                      dest: "generated/ts/jsxgraph-0-99-3.d.ts"},

          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",   dest: "generated/fonts/glyphicons-halflings-regular.eot"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",   dest: "generated/fonts/glyphicons-halflings-regular.svg"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",   dest: "generated/fonts/glyphicons-halflings-regular.ttf"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",  dest: "generated/fonts/glyphicons-halflings-regular.woff"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2", dest: "generated/fonts/glyphicons-halflings-regular.woff2"}
        ]
      },
      dist: {
        files: [
          {src: "manual/ace-builds/src-min-noconflict/worker-workspace.js",  dest: "dist/js/worker-workspace.js"},
          {src: "manual/ace-builds/src-min-noconflict/worker-html.js",       dest: "dist/js/worker-html.js"},
          {src: "manual/ace-builds/src-min-noconflict/worker-javascript.js", dest: "dist/js/worker-javascript.js"},
          {src: "manual/ace-builds/src-min-noconflict/worker-typescript.js", dest: "dist/js/worker-typescript.js"},
      
          {src: "bower_components/davinci-blade/dist/davinci-blade.min.js",    dest: "dist/js/blade.min.js"},
          {src: "bower_components/davinci-eight/dist/davinci-eight.min.js",    dest: "dist/js/eight.min.js"},
          {src: "bower_components/davinci-visual/dist/davinci-visual.min.js",  dest: "dist/js/visual.min.js"},
          {src: "bower_components/davinci-mathscript/dist/davinci-mathscript.min.js",  dest: "dist/js/maths.min.js"},
          {src: "bower_components/angular/angular.min.js",                   dest: "dist/js/angular.min.js"},
          {src: "bower_components/threejs/build/three.min.js",               dest: "dist/js/three.min.js"},
          {src: "museum/d3/d3@3-5-5.min.js",                                 dest: "dist/js/d3@3-5-5.min.js"},
          {src: "museum/jsxgraph/jsxgraph-0-99-3.min.js",                    dest: "dist/js/jsxgraph-0-99-3.min.js"},

          {src: "bower_components/davinci-blade/dist/davinci-blade.d.ts",    dest: "dist/ts/blade.d.ts"},
          {src: "bower_components/davinci-eight/dist/davinci-eight.d.ts",    dest: "dist/ts/eight.d.ts"},
          {src: "bower_components/davinci-visual/dist/davinci-visual.d.ts",  dest: "dist/ts/visual.d.ts"},
          {src: "node_modules/typescript/bin/lib.d.ts",                      dest: "dist/ts/lib.d.ts"},
          {src: "typings/angularjs/angular.d.ts",                            dest: "dist/ts/angular.d.ts"},
          {src: "typings/threejs/three.d.ts",                                dest: "dist/ts/three.d.ts"},
          {src: "museum/d3/d3@3-5-5.d.ts",                                   dest: "dist/ts/d3@3-5-5.d.ts"},
          {src: "museum/jsxgraph/jsxgraph-0-99-3.d.ts",                      dest: "dist/ts/jsxgraph-0-99-3.d.ts"},

          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",   dest: "dist/fonts/glyphicons-halflings-regular.eot"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",   dest: "dist/fonts/glyphicons-halflings-regular.svg"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",   dest: "dist/fonts/glyphicons-halflings-regular.ttf"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",  dest: "dist/fonts/glyphicons-halflings-regular.woff"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2", dest: "dist/fonts/glyphicons-halflings-regular.woff2"}
        ]
      }
    }

  };
};