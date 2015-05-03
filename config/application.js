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

          {src: "bower_components/davinci-mathscript/dist/davinci-mathscript.min.js",  dest: "generated/js/maths.min.js"},

          {src: "museum/angular/angular@1.4.0-rc.1.min.js",                  dest: "generated/js/angular@1.4.0-rc.1.min.js"},
          {src: "museum/blade/blade@0.9.35.min.js",                          dest: "generated/js/blade@0.9.35.min.js"},
          {src: "museum/blade/blade@0.9.36.min.js",                          dest: "generated/js/blade@0.9.36.min.js"},
          {src: "museum/blade/blade@1.0.1.min.js",                           dest: "generated/js/blade@1.0.1.min.js"},
          {src: "museum/d3/d3@3.5.5.min.js",                                 dest: "generated/js/d3@3.5.5.min.js"},
          {src: "museum/eight/eight@0.9.15.min.js",                          dest: "generated/js/eight@0.9.15.min.js"},
          {src: "museum/eight/eight@1.0.0.min.js",                           dest: "generated/js/eight@1.0.0.min.js"},
          {src: "museum/jsxgraph/jsxgraph@0.99.3.min.js",                    dest: "generated/js/jsxgraph@0.99.3.min.js"},
          {src: "museum/three/three@0.71.0.min.js",                          dest: "generated/js/three@0.71.0.min.js"},
          {src: "museum/visual/visual@0.0.52.min.js",                        dest: "generated/js/visual@0.0.52.min.js"},
          {src: "museum/visual/visual@1.0.0.min.js",                         dest: "generated/js/visual@1.0.0.min.js"},
          {src: "museum/visual/visual@1.1.0.min.js",                         dest: "generated/js/visual@1.1.0.min.js"},
          {src: "museum/visual/visual@1.1.1.min.js",                         dest: "generated/js/visual@1.1.1.min.js"},
          {src: "museum/visual/visual@1.2.0.min.js",                         dest: "generated/js/visual@1.2.0.min.js"},
          {src: "museum/visual/visual@1.3.0.min.js",                         dest: "generated/js/visual@1.3.0.min.js"},
          {src: "museum/visual/visual@1.4.0.min.js",                         dest: "generated/js/visual@1.4.0.min.js"},
          {src: "museum/visual/visual@1.4.1.min.js",                         dest: "generated/js/visual@1.4.1.min.js"},

          {src: "node_modules/typescript/bin/lib.d.ts",                      dest: "generated/ts/lib.d.ts"},

          {src: "museum/angular/angular@1.4.0-rc.1.d.ts",                    dest: "generated/ts/angular@1.4.0-rc.1.d.ts"},
          {src: "museum/blade/blade@0.9.35.d.ts",                            dest: "generated/ts/blade@0.9.35.d.ts"},
          {src: "museum/blade/blade@0.9.36.d.ts",                            dest: "generated/ts/blade@0.9.36.d.ts"},
          {src: "museum/blade/blade@1.0.1.d.ts",                             dest: "generated/ts/blade@1.0.1.d.ts"},
          {src: "museum/d3/d3@3.5.5.d.ts",                                   dest: "generated/ts/d3@3.5.5.d.ts"},
          {src: "museum/eight/eight@0.9.15.d.ts",                            dest: "generated/ts/eight@0.9.15.d.ts"},
          {src: "museum/eight/eight@1.0.0.d.ts",                             dest: "generated/ts/eight@1.0.0.d.ts"},
          {src: "museum/jsxgraph/jsxgraph@0.99.3.d.ts",                      dest: "generated/ts/jsxgraph@0.99.3.d.ts"},
          {src: "museum/three/three@0.71.0.d.ts",                            dest: "generated/ts/three@0.71.0.d.ts"},
          {src: "museum/visual/visual@0.0.52.d.ts",                          dest: "generated/ts/visual@0.0.52.d.ts"},
          {src: "museum/visual/visual@1.0.0.d.ts",                           dest: "generated/ts/visual@1.0.0.d.ts"},
          {src: "museum/visual/visual@1.1.0.d.ts",                           dest: "generated/ts/visual@1.1.0.d.ts"},
          {src: "museum/visual/visual@1.1.1.d.ts",                           dest: "generated/ts/visual@1.1.1.d.ts"},
          {src: "museum/visual/visual@1.2.0.d.ts",                           dest: "generated/ts/visual@1.2.0.d.ts"},
          {src: "museum/visual/visual@1.3.0.d.ts",                           dest: "generated/ts/visual@1.3.0.d.ts"},
          {src: "museum/visual/visual@1.4.0.d.ts",                           dest: "generated/ts/visual@1.4.0.d.ts"},
          {src: "museum/visual/visual@1.4.1.d.ts",                           dest: "generated/ts/visual@1.4.1.d.ts"},

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

          {src: "bower_components/davinci-mathscript/dist/davinci-mathscript.min.js",  dest: "dist/js/maths.min.js"},

          {src: "museum/angular/angular@1.4.0-rc.1.min.js",                  dest: "dist/js/angular@1.4.0-rc.1.min.js"},
          {src: "museum/blade/blade@0.9.35.min.js",                          dest: "dist/js/blade@0.9.35.min.js"},
          {src: "museum/blade/blade@0.9.36.min.js",                          dest: "dist/js/blade@0.9.36.min.js"},
          {src: "museum/blade/blade@1.0.1.min.js",                           dest: "dist/js/blade@1.0.1.min.js"},
          {src: "museum/d3/d3@3.5.5.min.js",                                 dest: "dist/js/d3@3.5.5.min.js"},
          {src: "museum/eight/eight@0.9.15.min.js",                          dest: "dist/js/eight@0.9.15.min.js"},
          {src: "museum/eight/eight@1.0.0.min.js",                           dest: "dist/js/eight@1.0.0.min.js"},
          {src: "museum/jsxgraph/jsxgraph@0.99.3.min.js",                    dest: "dist/js/jsxgraph@0.99.3.min.js"},
          {src: "museum/three/three@0.71.0.min.js",                          dest: "dist/js/three@0.71.0.min.js"},
          {src: "museum/visual/visual@0.0.52.min.js",                        dest: "dist/js/visual@0.0.52.min.js"},
          {src: "museum/visual/visual@1.0.0.min.js",                         dest: "dist/js/visual@1.0.0.min.js"},
          {src: "museum/visual/visual@1.1.0.min.js",                         dest: "dist/js/visual@1.1.0.min.js"},
          {src: "museum/visual/visual@1.1.1.min.js",                         dest: "dist/js/visual@1.1.1.min.js"},
          {src: "museum/visual/visual@1.2.0.min.js",                         dest: "dist/js/visual@1.2.0.min.js"},
          {src: "museum/visual/visual@1.3.0.min.js",                         dest: "dist/js/visual@1.3.0.min.js"},
          {src: "museum/visual/visual@1.4.0.min.js",                         dest: "dist/js/visual@1.4.0.min.js"},
          {src: "museum/visual/visual@1.4.1.min.js",                         dest: "dist/js/visual@1.4.1.min.js"},

          {src: "node_modules/typescript/bin/lib.d.ts",                      dest: "dist/ts/lib.d.ts"},

          {src: "museum/angular/angular@1.4.0-rc.1.d.ts",                    dest: "dist/ts/angular@1.4.0-rc.1.d.ts"},
          {src: "museum/blade/blade@0.9.35.d.ts",                            dest: "dist/ts/blade@0.9.35.d.ts"},
          {src: "museum/blade/blade@0.9.36.d.ts",                            dest: "dist/ts/blade@0.9.36.d.ts"},
          {src: "museum/blade/blade@1.0.1.d.ts",                             dest: "dist/ts/blade@1.0.1.d.ts"},
          {src: "museum/d3/d3@3.5.5.d.ts",                                   dest: "dist/ts/d3@3.5.5.d.ts"},
          {src: "museum/eight/eight@0.9.15.d.ts",                            dest: "dist/ts/eight@0.9.15.d.ts"},
          {src: "museum/eight/eight@1.0.0.d.ts",                             dest: "dist/ts/eight@1.0.0.d.ts"},
          {src: "museum/jsxgraph/jsxgraph@0.99.3.d.ts",                      dest: "dist/ts/jsxgraph@0.99.3.d.ts"},
          {src: "museum/three/three@0.71.0.d.ts",                            dest: "dist/ts/three@0.71.0.d.ts"},
          {src: "museum/visual/visual@0.0.52.d.ts",                          dest: "dist/ts/visual@0.0.52.d.ts"},
          {src: "museum/visual/visual@1.0.0.d.ts",                           dest: "dist/ts/visual@1.0.0.d.ts"},
          {src: "museum/visual/visual@1.1.0.d.ts",                           dest: "dist/ts/visual@1.1.0.d.ts"},
          {src: "museum/visual/visual@1.1.1.d.ts",                           dest: "dist/ts/visual@1.1.1.d.ts"},
          {src: "museum/visual/visual@1.2.0.d.ts",                           dest: "dist/ts/visual@1.2.0.d.ts"},
          {src: "museum/visual/visual@1.3.0.d.ts",                           dest: "dist/ts/visual@1.3.0.d.ts"},
          {src: "museum/visual/visual@1.4.0.d.ts",                           dest: "dist/ts/visual@1.4.0.d.ts"},
          {src: "museum/visual/visual@1.4.1.d.ts",                           dest: "dist/ts/visual@1.4.1.d.ts"},

          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",   dest: "dist/fonts/glyphicons-halflings-regular.eot"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",   dest: "dist/fonts/glyphicons-halflings-regular.svg"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",   dest: "dist/fonts/glyphicons-halflings-regular.ttf"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",  dest: "dist/fonts/glyphicons-halflings-regular.woff"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2", dest: "dist/fonts/glyphicons-halflings-regular.woff2"}
        ]
      }
    },

    watch: {
      museum: {
        files: ["museum/**/*.d.ts"],
        tasks: ["copy:dev"]
      }
    }

  };
};