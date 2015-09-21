module.exports = function(lineman) {

  function davinciBlade(path) {
    return '../davinci-blade/' + path;
  }

  function davinciEight(path) {
    return '../davinci-eight/' + path;
  }

  function davinciMathBox(path) {
    return '../davinci-mathbox/' + path;
  }

  function davinciSlideShow(path) {
    return '../davinci-slideshow/' + path;
  }

  function davinciThreeBox(path) {
    return '../davinci-threebox/' + path;
  }

  function dev(path) {
    return 'generated/' + path;
  }

  function prod(path) {
    return 'dist/' + path;
  }

  // This is how typescript.coffee is invoked.
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

          {src: "vendor/davinci-deuce/build/src-noconflict/worker-workspace.js",  dest: "generated/js/worker-workspace.js"},
          {src: "vendor/davinci-deuce/build/src-noconflict/worker-html.js",       dest: "generated/js/worker-html.js"},
          {src: "vendor/davinci-deuce/build/src-noconflict/worker-javascript.js", dest: "generated/js/worker-javascript.js"},
          {src: "vendor/davinci-deuce/build/src-noconflict/worker-json.js",       dest: "generated/js/worker-json.js"},
          {src: "vendor/davinci-deuce/build/src-noconflict/worker-typescript.js", dest: "generated/js/worker-typescript.js"},
          {src: "vendor/davinci-deuce/build/src-noconflict/worker-css.js",        dest: "generated/js/worker-css.js"},

          {src: "vendor/davinci-visual/dist/davinci-visual.d.ts",  dest: "generated/ts/davinci-visual.d.ts"},
          {src: "vendor/davinci-visual/dist/davinci-visual.js",    dest: "generated/js/davinci-visual.js"},
          {src: "vendor/davinci-visual/dist/davinci-visual.min.js",dest: "generated/js/davinci-visual.min.js"},

          {src: "museum/stats/stats.d.ts",                                   dest: "generated/ts/stats.d.ts"},
          {src: "vendor/stats.js/build/stats.min.js",                        dest: "generated/js/stats.min.js"},

          {src: "museum/three/three@0.71.0.d.ts",                            dest: "generated/ts/three.d.ts"},
          {src: "vendor/davinci-threejs/build/three.js",                     dest: "generated/js/three.js"},
          {src: "vendor/davinci-threejs/build/three.min.js",                 dest: "generated/js/three.min.js"},
//        {src: "../davinci-threejs/build/three.js",                         dest: "generated/js/three.js"},
//        {src: "../davinci-threejs/build/three.min.js",                     dest: "generated/js/three.min.js"},

          {src: "museum/angular/angular@1.4.0.d.ts",                         dest: "generated/ts/angular@1.4.0.d.ts"},
          {src: "museum/angular/angular@1.4.0.js",                           dest: "generated/js/angular@1.4.0.js"},
          {src: "museum/angular/angular@1.4.0.min.js",                       dest: "generated/js/angular@1.4.0.min.js"},
          {src: "museum/angular/angular@1.4.0.min.js.map",                   dest: "generated/js/angular@1.4.0.min.js.map"},

          {src: "museum/async/async.d.ts",                                   dest: "generated/ts/async.ts"},
          {src: "museum/async/async.js",                                     dest: "generated/js/async.js"},

          {src: davinciBlade("dist/davinci-blade.d.ts"),                     dest: "generated/ts/davinci-blade/davinci-blade.d.ts"},
          {src: davinciBlade("dist/davinci-blade.js"),                       dest: "generated/js/davinci-blade/davinci-blade.js"},
          {src: davinciBlade("dist/davinci-blade.min.js"),                   dest: "generated/js/davinci-blade/davinci-blade.min.js"},

          {src: davinciEight("dist/davinci-eight.d.ts"),                     dest: "generated/ts/davinci-eight/davinci-eight.d.ts"},
          {src: davinciEight("dist/davinci-eight.js"),                       dest: "generated/js/davinci-eight/davinci-eight.js"},
          {src: davinciEight("dist/davinci-eight.min.js"),                   dest: "generated/js/davinci-eight/davinci-eight.min.js"},
//        {src: davinciEight("documentation/**/*.*"),                        dest: "generated/js/davinci-eight/documentation"},

          {src: "vendor/davinci-mathscript/dist/davinci-mathscript.min.js", dest: "generated/js/davinci-mathscript@1.0.6.min.js"},

          {src: "museum/d3/d3@3.5.5.min.js",                                 dest: "generated/js/d3@3.5.5.min.js"},
          {src: "museum/jsxgraph/jsxgraph@0.99.3.min.js",                    dest: "generated/js/jsxgraph@0.99.3.min.js"},
          {src: "museum/visual/visual@1.6.0.min.js",                         dest: "generated/js/visual@1.6.0.min.js"},

          {src: "museum/d3/d3@3.5.5.d.ts",                                   dest: "generated/ts/d3@3.5.5.d.ts"},
          {src: "museum/jsxgraph/jsxgraph@0.99.3.d.ts",                      dest: "generated/ts/jsxgraph@0.99.3.d.ts"},
          {src: "museum/typescript/lib@1.4.1.3.d.ts",                        dest: dev("ts/lib@1.4.1.3.d.ts")},
          {src: "museum/visual/davinci-visual.d.ts",                         dest: "generated/ts/davinci-visual.d.ts"},
          {src: "museum/visual/visual@1.6.0.d.ts",                           dest: "generated/ts/visual@1.6.0.d.ts"},

          {src: "museum/domready/domready@1.0.0.js",                         dest: "generated/js/domready@1.0.0.js"},
          {src: "museum/domready/domready@1.0.0.d.ts",                       dest: "generated/ts/domready@1.0.0.d.ts"},

          {src: "museum/gl-matrix@2.2.1/gl-matrix.d.ts",                     dest: "generated/ts/gl-matrix@2.2.1/gl-matrix.d.ts"},
          {src: "museum/gl-matrix@2.2.1/gl-matrix.js",                       dest: "generated/js/gl-matrix@2.2.1/gl-matrix.js"},
          {src: "museum/gl-matrix@2.2.1/gl-matrix.min.js",                   dest: "generated/js/gl-matrix@2.2.1/gl-matrix.min.js"},

          {src: "museum/MathBox.js/MathBox-core.d.ts",                       dest: "generated/ts/MathBox-core.d.ts"},
          {src: "museum/MathBox.js/snippets.glsl.html",                      dest: "generated/shaders/snippets.glsl.html"},
          {src: davinciMathBox("build/MathBox.glsl.html"),                   dest: "generated/shaders/MathBox.glsl.html"},
          {src: davinciMathBox("build/MathBox-core.js"),                     dest: "generated/js/MathBox-core.js"},
          {src: davinciMathBox("build/MathBox-core.min.js"),                 dest: "generated/js/MathBox-core.min.js"},

          {src: "museum/microajax/microajax.d.ts",                           dest: "generated/ts/microajax.d.ts"},
          {src: "museum/microajax/microajax.js",                             dest: "generated/js/microajax.js"},

          {src: "museum/microevent/microevent.d.ts",                         dest: "generated/ts/microevent.d.ts"},
          {src: "museum/microevent/microevent.js",                           dest: "generated/js/microevent.js"},

          {src: "museum/requirejs/require.d.ts",                             dest: "generated/ts/require.d.ts"},
          {src: "museum/requirejs/require.js",                               dest: "generated/js/require.js"},

          {src: "museum/ShaderGraph.js/ShaderGraph-core.d.ts",               dest: "generated/ts/ShaderGraph-core.d.ts"},
          {src: "vendor/davinci-shadergraph/build/ShaderGraph-core.js",      dest: "generated/js/ShaderGraph-core.js"},
          {src: "vendor/davinci-shadergraph/build/ShaderGraph-core.min.js",  dest: "generated/js/ShaderGraph-core.min.js"},

          {src: davinciSlideShow("dist/davinci-slideshow.d.ts"),             dest: "generated/ts/davinci-slideshow/davinci-slideshow.d.ts"},
          {src: davinciSlideShow("dist/davinci-slideshow.js"),               dest: "generated/js/davinci-slideshow/davinci-slideshow.js"},
          {src: davinciSlideShow("dist/davinci-slideshow.min.js"),           dest: "generated/js/davinci-slideshow/davinci-slideshow.min.js"},

          {src: "museum/ThreeBox.js/ThreeBox-core.d.ts",                     dest: "generated/ts/ThreeBox-core.d.ts"},
          {src: davinciThreeBox("build/ThreeBox-core.js"),                   dest: "generated/js/ThreeBox-core.js"},
          {src: davinciThreeBox("build/ThreeBox-core.min.js"),               dest: "generated/js/ThreeBox-core.min.js"},

          {src: "museum/ThreeRTT.js/ThreeRTT-core.d.ts",                     dest: "generated/ts/ThreeRTT-core.d.ts"},
          {src: "vendor/davinci-threertt/build/ThreeRTT-core.js",            dest: "generated/js/ThreeRTT-core.js"},
          {src: "vendor/davinci-threertt/build/ThreeRTT-core.min.js",        dest: "generated/js/ThreeRTT-core.min.js"},
          {src: "vendor/davinci-threertt/build/ThreeRTT.glsl.html",          dest: "generated/shaders/ThreeRTT.glsl.html"},

          {src: "museum/threex/THREEx.screenshot.d.ts",                      dest: "generated/ts/THREEx.screenshot.d.ts"},
          {src: "museum/threex/THREEx.screenshot.js",                        dest: "generated/js/THREEx.screenshot.js"},

          {src: "museum/tquery/tquery.d.ts",                                 dest: "generated/ts/tquery.d.ts"},
          {src: "vendor/davinci-tquery/build/tquery.js",                     dest: "generated/js/tquery.js"},
          {src: "vendor/davinci-tquery/build/tquery.min.js",                 dest: "generated/js/tquery.min.js"},

          {src: "museum/underscore/underscore@1.8.3.d.ts",                   dest: "generated/ts/underscore@1.8.3.d.ts"},
          {src: "museum/underscore/underscore@1.8.3.js",                     dest: "generated/js/underscore@1.8.3.js"},
          {src: "museum/underscore/underscore@1.8.3.min.js",                 dest: "generated/js/underscore@1.8.3.min.js"},

          {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",   dest: "generated/fonts/glyphicons-halflings-regular.eot"},
          {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",   dest: "generated/fonts/glyphicons-halflings-regular.svg"},
          {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",   dest: "generated/fonts/glyphicons-halflings-regular.ttf"},
          {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",  dest: "generated/fonts/glyphicons-halflings-regular.woff"},
          {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2", dest: "generated/fonts/glyphicons-halflings-regular.woff2"}
        ]
      },
      dist: {
        files: [
          {src: "appcache.mf", dest: "dist/appcache.mf"},

          {src: "vendor/davinci-deuce/build/src-min-noconflict/worker-workspace.js",  dest: "dist/js/worker-workspace.js"},
          {src: "vendor/davinci-deuce/build/src-min-noconflict/worker-html.js",       dest: "dist/js/worker-html.js"},
          {src: "vendor/davinci-deuce/build/src-min-noconflict/worker-javascript.js", dest: "dist/js/worker-javascript.js"},
          {src: "vendor/davinci-deuce/build/src-min-noconflict/worker-json.js",       dest: "dist/js/worker-json.js"},
          {src: "vendor/davinci-deuce/build/src-min-noconflict/worker-typescript.js", dest: "dist/js/worker-typescript.js"},
          {src: "vendor/davinci-deuce/build/src-min-noconflict/worker-css.js",        dest: "dist/js/worker-css.js"},
       
          {src: "vendor/davinci-visual/dist/davinci-visual.d.ts",  dest: "dist/ts/davinci-visual.d.ts"},
          {src: "vendor/davinci-visual/dist/davinci-visual.js",    dest: "dist/js/davinci-visual.js"},
          {src: "vendor/davinci-visual/dist/davinci-visual.min.js",dest: "dist/js/davinci-visual.min.js"},

          {src: "museum/stats/stats.d.ts",                                   dest: "dist/ts/stats.d.ts"},
          {src: "vendor/stats.js/build/stats.min.js",                        dest: "dist/js/stats.min.js"},

          {src: "typings/threejs/three.d.ts",                                dest: "dist/ts/three.d.ts"},
          {src: "vendor/davinci-threejs/build/three.js",           dest: "dist/js/three.js"},
          {src: "vendor/davinci-threejs/build/three.min.js",       dest: "dist/js/three.min.js"},

          {src: "museum/angular/angular@1.4.0.d.ts",                         dest: "dist/ts/angular@1.4.0.d.ts"},
          {src: "museum/angular/angular@1.4.0.js",                           dest: "dist/js/angular@1.4.0.js"},
          {src: "museum/angular/angular@1.4.0.min.js",                       dest: "dist/js/angular@1.4.0.min.js"},
          {src: "museum/angular/angular@1.4.0.min.js.map",                   dest: "dist/js/angular@1.4.0.min.js.map"},

          {src: "museum/async/async.d.ts",                                   dest: "dist/ts/async.ts"},
          {src: "museum/async/async.js",                                     dest: "dist/js/async.js"},

          {src: davinciBlade("dist/davinci-blade.d.ts"),                    dest: "dist/ts/davinci-blade/davinci-blade.d.ts"},
          {src: davinciBlade("dist/davinci-blade.js"),                      dest: "dist/js/davinci-blade/davinci-blade.js"},
          {src: davinciBlade("dist/davinci-blade.min.js"),                  dest: "dist/js/davinci-blade/davinci-blade.min.js"},

          {src: davinciEight("dist/davinci-eight.d.ts"),                    dest: "dist/ts/davinci-eight/davinci-eight.d.ts"},
          {src: davinciEight("dist/davinci-eight.js"),                      dest: "dist/js/davinci-eight/davinci-eight.js"},
          {src: davinciEight("dist/davinci-eight.min.js"),                  dest: "dist/js/davinci-eight/davinci-eight.min.js"},

          {src: "vendor/davinci-mathscript/dist/davinci-mathscript.min.js", dest: "dist/js/davinci-mathscript@1.0.6.min.js"},

          {src: "museum/d3/d3@3.5.5.min.js",                                 dest: "dist/js/d3@3.5.5.min.js"},
          {src: "museum/jsxgraph/jsxgraph@0.99.3.min.js",                    dest: "dist/js/jsxgraph@0.99.3.min.js"},
          {src: "museum/three/three@0.71.0.min.js",                          dest: "dist/js/three@0.71.0.min.js"},
          {src: "museum/visual/visual@1.6.0.min.js",                         dest: "dist/js/visual@1.6.0.min.js"},

          {src: "museum/d3/d3@3.5.5.d.ts",                                   dest: "dist/ts/d3@3.5.5.d.ts"},
          {src: "museum/jsxgraph/jsxgraph@0.99.3.d.ts",                      dest: "dist/ts/jsxgraph@0.99.3.d.ts"},
          {src: "museum/three/three@0.71.0.d.ts",                            dest: "dist/ts/three@0.71.0.d.ts"},
          {src: "museum/typescript/lib@1.4.1.3.d.ts",                        dest: prod("ts/lib@1.4.1.3.d.ts")},
          {src: "museum/visual/visual@1.6.0.d.ts",                           dest: "dist/ts/visual@1.6.0.d.ts"},

          {src: "museum/domready/domready@1.0.0.js",                         dest: "dist/js/domready@1.0.0.js"},
          {src: "museum/domready/domready@1.0.0.d.ts",                       dest: "dist/ts/domready@1.0.0.d.ts"},

          {src: "museum/gl-matrix@2.2.1/gl-matrix.d.ts",                     dest: "dist/ts/gl-matrix@2.2.1/gl-matrix.d.ts"},
          {src: "museum/gl-matrix@2.2.1/gl-matrix.js",                       dest: "dist/js/gl-matrix@2.2.1/gl-matrix.js"},
          {src: "museum/gl-matrix@2.2.1/gl-matrix.min.js",                   dest: "dist/js/gl-matrix@2.2.1/gl-matrix.min.js"},

          {src: "museum/MathBox.js/MathBox-core.d.ts",                       dest: "dist/ts/MathBox-core.d.ts"},
          {src: "museum/MathBox.js/snippets.glsl.html",                      dest: "dist/shaders/snippets.glsl.html"},
          {src: davinciMathBox("build/MathBox-core.js"),                     dest: "dist/js/MathBox-core.js"},
          {src: davinciMathBox("build/MathBox-core.min.js"),                 dest: "dist/js/MathBox-core.min.js"},
          {src: davinciMathBox("build/MathBox.glsl.html"),                   dest: "dist/shaders/MathBox.glsl.html"},

          {src: "museum/microajax/microajax.d.ts",                           dest: "dist/ts/microajax.d.ts"},
          {src: "museum/microajax/microajax.js",                             dest: "dist/js/microajax.js"},

          {src: "museum/microevent/microevent.d.ts",                         dest: "dist/ts/microevent.d.ts"},
          {src: "museum/microevent/microevent.js",                           dest: "dist/js/microevent.js"},

          {src: "museum/requirejs/require.d.ts",                             dest: "dist/ts/require.d.ts"},
          {src: "museum/requirejs/require.js",                               dest: "dist/js/require.js"},

          {src: "museum/ShaderGraph.js/ShaderGraph-core.d.ts",                        dest: "dist/ts/ShaderGraph-core.d.ts"},
          {src: "vendor/davinci-shadergraph/build/ShaderGraph-core.js",     dest: "dist/js/ShaderGraph-core.js"},
          {src: "vendor/davinci-shadergraph/build/ShaderGraph-core.min.js", dest: "dist/js/ShaderGraph-core.min.js"},

          {src: "museum/ThreeBox.js/ThreeBox-core.d.ts",                        dest: "dist/ts/ThreeBox-core.d.ts"},
          {src: davinciThreeBox("build/ThreeBox-core.js"),                      dest: "dist/js/ThreeBox-core.js"},
          {src: davinciThreeBox("build/ThreeBox-core.min.js"),                  dest: "dist/js/ThreeBox-core.min.js"},

          {src: "museum/ThreeRTT.js/ThreeRTT-core.d.ts",                        dest: "dist/ts/ThreeRTT-core.d.ts"},
          {src: "vendor/davinci-threertt/build/ThreeRTT-core.js",     dest: "dist/js/ThreeRTT-core.js"},
          {src: "vendor/davinci-threertt/build/ThreeRTT-core.min.js", dest: "dist/js/ThreeRTT-core.min.js"},
          {src: "vendor/davinci-threertt/build/ThreeRTT.glsl.html",   dest: "dist/shaders/ThreeRTT.glsl.html"},

          {src: "museum/threex/THREEx.screenshot.d.ts",                      dest: "dist/ts/THREEx.screenshot.d.ts"},
          {src: "museum/threex/THREEx.screenshot.js",                        dest: "dist/js/THREEx.screenshot.js"},

          {src: "museum/tquery/tquery.d.ts",                                 dest: "dist/ts/tquery.d.ts"},
          {src: "vendor/davinci-tquery/build/tquery.js",           dest: "dist/js/tquery.js"},
          {src: "vendor/davinci-tquery/build/tquery.min.js",       dest: "dist/js/tquery.min.js"},

          {src: "museum/underscore/underscore@1.8.3.d.ts",                   dest: "dist/ts/underscore@1.8.3.d.ts"},
          {src: "museum/underscore/underscore@1.8.3.js",                     dest: "dist/js/underscore@1.8.3.js"},
          {src: "museum/underscore/underscore@1.8.3.min.js",                 dest: "dist/js/underscore@1.8.3.min.js"},

          {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",   dest: "dist/fonts/glyphicons-halflings-regular.eot"},
          {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",   dest: "dist/fonts/glyphicons-halflings-regular.svg"},
          {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",   dest: "dist/fonts/glyphicons-halflings-regular.ttf"},
          {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",  dest: "dist/fonts/glyphicons-halflings-regular.woff"},
          {src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2", dest: "dist/fonts/glyphicons-halflings-regular.woff2"}
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