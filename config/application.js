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
          {src: "bower_components/threejs/build/three.min.js",               dest: "generated/js/three.min.js"},
      
          {src: "bower_components/davinci-blade/dist/davinci-blade.d.ts",    dest: "generated/ts/blade.d.ts"},
          {src: "bower_components/davinci-eight/dist/davinci-eight.d.ts",    dest: "generated/ts/eight.d.ts"},
          {src: "bower_components/davinci-visual/dist/davinci-visual.d.ts",    dest: "generated/ts/visual.d.ts"},
          {src: "node_modules/typescript/bin/lib.d.ts",                      dest: "generated/ts/lib.d.ts"},
          {src: "typings/threejs/three.d.ts",                                dest: "generated/ts/three.d.ts"}
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
          {src: "bower_components/threejs/build/three.min.js",               dest: "dist/js/three.min.js"},
      
          {src: "bower_components/davinci-blade/dist/davinci-blade.d.ts",    dest: "dist/ts/blade.d.ts"},
          {src: "bower_components/davinci-eight/dist/davinci-eight.d.ts",    dest: "dist/ts/eight.d.ts"},
          {src: "bower_components/davinci-visual/dist/davinci-visual.d.ts",    dest: "dist/ts/visual.d.ts"},
          {src: "node_modules/typescript/bin/lib.d.ts",                      dest: "dist/ts/lib.d.ts"},
          {src: "typings/threejs/three.d.ts",                                dest: "dist/ts/three.d.ts"}
        ]
      }
    }

  };
};