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
          {src: "appcache.mf", dest: "generated/appcache.mf"},

          {src: "submodules/deuce/build/src-noconflict/worker-workspace.js",  dest: "generated/js/worker-workspace.js"},
          {src: "submodules/deuce/build/src-noconflict/worker-html.js",       dest: "generated/js/worker-html.js"},
          {src: "submodules/deuce/build/src-noconflict/worker-javascript.js", dest: "generated/js/worker-javascript.js"},
          {src: "submodules/deuce/build/src-noconflict/worker-typescript.js", dest: "generated/js/worker-typescript.js"},
          {src: "submodules/deuce/build/src-noconflict/worker-css.js",        dest: "generated/js/worker-css.js"},

          {src: "bower_components/davinci-blade/dist/davinci-blade.d.ts",    dest: "generated/ts/davinci-blade.d.ts"},
          {src: "bower_components/davinci-blade/dist/davinci-blade.js",      dest: "generated/js/davinci-blade.js"},
          {src: "bower_components/davinci-blade/dist/davinci-blade.min.js",  dest: "generated/js/davinci-blade.min.js"},
       
          {src: "bower_components/davinci-visual/dist/davinci-visual.d.ts",  dest: "generated/ts/davinci-visual.d.ts"},
          {src: "bower_components/davinci-visual/dist/davinci-visual.js",    dest: "generated/js/davinci-visual.js"},
          {src: "bower_components/davinci-visual/dist/davinci-visual.min.js",dest: "generated/js/davinci-visual.min.js"},

          {src: "typings/threejs/three.d.ts",                                dest: "generated/ts/three.d.ts"},
          {src: "bower_components/threejs/build/three.js",                   dest: "generated/js/three.js"},
          {src: "bower_components/threejs/build/three.min.js",               dest: "generated/js/three.min.js"},

          {src: "museum/angular/angular@1.4.0.d.ts",                         dest: "generated/ts/angular@1.4.0.d.ts"},
          {src: "museum/angular/angular@1.4.0.js",                           dest: "generated/js/angular@1.4.0.js"},
          {src: "museum/angular/angular@1.4.0.min.js",                       dest: "generated/js/angular@1.4.0.min.js"},
          {src: "museum/angular/angular@1.4.0.min.js.map",                   dest: "generated/js/angular@1.4.0.min.js.map"},

          {src: "museum/blade/blade@1.0.1.min.js",                           dest: "generated/js/blade@1.0.1.min.js"},
          {src: "museum/d3/d3@3.5.5.min.js",                                 dest: "generated/js/d3@3.5.5.min.js"},
          {src: "museum/eight/eight@1.0.0.min.js",                           dest: "generated/js/eight@1.0.0.min.js"},
          {src: "museum/jsxgraph/jsxgraph@0.99.3.min.js",                    dest: "generated/js/jsxgraph@0.99.3.min.js"},
          {src: "museum/mathscript/mathscript@1.0.4.min.js",                 dest: "generated/js/mathscript@1.0.4.min.js"},
          {src: "museum/three/three@0.71.0.min.js",                          dest: "generated/js/three@0.71.0.min.js"},
          {src: "museum/visual/visual@1.6.0.min.js",                         dest: "generated/js/visual@1.6.0.min.js"},

          {src: "museum/blade/blade@1.0.1.d.ts",                             dest: "generated/ts/blade@1.0.1.d.ts"},
          {src: "museum/d3/d3@3.5.5.d.ts",                                   dest: "generated/ts/d3@3.5.5.d.ts"},
          {src: "museum/eight/eight@1.0.0.d.ts",                             dest: "generated/ts/eight@1.0.0.d.ts"},
          {src: "museum/jsxgraph/jsxgraph@0.99.3.d.ts",                      dest: "generated/ts/jsxgraph@0.99.3.d.ts"},
          {src: "museum/three/three@0.71.0.d.ts",                            dest: "generated/ts/three@0.71.0.d.ts"},
          {src: "museum/typescript/lib@1.4.1.2.d.ts",                        dest: "generated/ts/lib@1.4.1.2.d.ts"},
          {src: "museum/visual/davinci-visual.d.ts",                         dest: "generated/ts/davinci-visual.d.ts"},
          {src: "museum/visual/visual@1.6.0.d.ts",                           dest: "generated/ts/visual@1.6.0.d.ts"},

          {src: "museum/domready/domready@1.0.0.js",                         dest: "generated/js/domready@1.0.0.js"},
          {src: "museum/domready/domready@1.0.0.d.ts",                       dest: "generated/ts/domready@1.0.0.d.ts"},

          {src: "museum/mathbox/MathBox-bundle.js",                          dest: "generated/js/MathBox-bundle.js"},
          {src: "museum/mathbox/MathBox.glsl.html",                          dest: "generated/shaders/MathBox.glsl.html"},
          {src: "museum/mathbox/snippets.glsl.html",                         dest: "generated/shaders/snippets.glsl.html"},

          {src: "museum/threebox/ThreeBox@1.0.0.min.js",                     dest: "generated/js/ThreeBox@1.0.0.min.js"},
          {src: "museum/threebox/ThreeBox@1.0.0.d.ts",                       dest: "generated/ts/ThreeBox@1.0.0.d.ts"},

          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",   dest: "generated/fonts/glyphicons-halflings-regular.eot"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",   dest: "generated/fonts/glyphicons-halflings-regular.svg"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",   dest: "generated/fonts/glyphicons-halflings-regular.ttf"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",  dest: "generated/fonts/glyphicons-halflings-regular.woff"},
          {src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2", dest: "generated/fonts/glyphicons-halflings-regular.woff2"}
        ]
      },
      dist: {
        files: [
          {src: "appcache.mf", dest: "dist/appcache.mf"},

          {src: "submodules/deuce/build/src-min-noconflict/worker-workspace.js",  dest: "dist/js/worker-workspace.js"},
          {src: "submodules/deuce/build/src-min-noconflict/worker-html.js",       dest: "dist/js/worker-html.js"},
          {src: "submodules/deuce/build/src-min-noconflict/worker-javascript.js", dest: "dist/js/worker-javascript.js"},
          {src: "submodules/deuce/build/src-min-noconflict/worker-typescript.js", dest: "dist/js/worker-typescript.js"},
          {src: "submodules/deuce/build/src-min-noconflict/worker-css.js",        dest: "dist/js/worker-css.js"},

          {src: "bower_components/davinci-blade/dist/davinci-blade.d.ts",    dest: "dist/ts/davinci-blade.d.ts"},
          {src: "bower_components/davinci-blade/dist/davinci-blade.js",      dest: "dist/js/davinci-blade.js"},
          {src: "bower_components/davinci-blade/dist/davinci-blade.min.js",  dest: "dist/js/davinci-blade.min.js"},
       
          {src: "bower_components/davinci-visual/dist/davinci-visual.d.ts",  dest: "dist/ts/davinci-visual.d.ts"},
          {src: "bower_components/davinci-visual/dist/davinci-visual.js",    dest: "dist/js/davinci-visual.js"},
          {src: "bower_components/davinci-visual/dist/davinci-visual.min.js",dest: "dist/js/davinci-visual.min.js"},

          {src: "typings/threejs/three.d.ts",                                dest: "dist/ts/three.d.ts"},
          {src: "bower_components/threejs/build/three.js",                   dest: "dist/js/three.js"},
          {src: "bower_components/threejs/build/three.min.js",               dest: "dist/js/three.min.js"},

          {src: "museum/angular/angular@1.4.0.d.ts",                         dest: "dist/ts/angular@1.4.0.d.ts"},
          {src: "museum/angular/angular@1.4.0.js",                           dest: "dist/js/angular@1.4.0.js"},
          {src: "museum/angular/angular@1.4.0.min.js",                       dest: "dist/js/angular@1.4.0.min.js"},
          {src: "museum/angular/angular@1.4.0.min.js.map",                   dest: "dist/js/angular@1.4.0.min.js.map"},

          {src: "museum/blade/blade@1.0.1.min.js",                           dest: "dist/js/blade@1.0.1.min.js"},
          {src: "museum/d3/d3@3.5.5.min.js",                                 dest: "dist/js/d3@3.5.5.min.js"},
          {src: "museum/eight/eight@1.0.0.min.js",                           dest: "dist/js/eight@1.0.0.min.js"},
          {src: "museum/jsxgraph/jsxgraph@0.99.3.min.js",                    dest: "dist/js/jsxgraph@0.99.3.min.js"},
          {src: "museum/mathscript/mathscript@1.0.4.min.js",                 dest: "dist/js/mathscript@1.0.4.min.js"},
          {src: "museum/three/three@0.71.0.min.js",                          dest: "dist/js/three@0.71.0.min.js"},
          {src: "museum/visual/visual@1.6.0.min.js",                         dest: "dist/js/visual@1.6.0.min.js"},

          {src: "museum/blade/blade@1.0.1.d.ts",                             dest: "dist/ts/blade@1.0.1.d.ts"},
          {src: "museum/d3/d3@3.5.5.d.ts",                                   dest: "dist/ts/d3@3.5.5.d.ts"},
          {src: "museum/eight/eight@1.0.0.d.ts",                             dest: "dist/ts/eight@1.0.0.d.ts"},
          {src: "museum/jsxgraph/jsxgraph@0.99.3.d.ts",                      dest: "dist/ts/jsxgraph@0.99.3.d.ts"},
          {src: "museum/three/three@0.71.0.d.ts",                            dest: "dist/ts/three@0.71.0.d.ts"},
          {src: "museum/typescript/lib@1.4.1.2.d.ts",                        dest: "dist/ts/lib@1.4.1.2.d.ts"},
          {src: "museum/visual/visual@1.6.0.d.ts",                           dest: "dist/ts/visual@1.6.0.d.ts"},

          {src: "museum/domready/domready@1.0.0.js",                         dest: "dist/js/domready@1.0.0.js"},
          {src: "museum/domready/domready@1.0.0.d.ts",                       dest: "dist/ts/domready@1.0.0.d.ts"},

          {src: "museum/mathbox/MathBox-bundle.js",                          dest: "dist/js/MathBox-bundle.js"},
          {src: "museum/mathbox/MathBox.glsl.html",                          dest: "dist/shaders/MathBox.glsl.html"},
          {src: "museum/mathbox/snippets.glsl.html",                         dest: "dist/shaders/snippets.glsl.html"},

          {src: "museum/threebox/ThreeBox@1.0.0.min.js",                     dest: "dist/js/ThreeBox@1.0.0.min.js"},
          {src: "museum/threebox/ThreeBox@1.0.0.d.ts",                       dest: "dist/ts/ThreeBox@1.0.0.d.ts"},

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
        files: ['museum/**/*.d.ts','appcache.mf'],
        tasks: ['copy:dev']
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
  };
};