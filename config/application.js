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
          {src: "bower_components/ace-builds/src-noconflict/worker-workspace.js",  dest: "generated/js/worker-workspace.js"},
          {src: "bower_components/ace-builds/src-noconflict/worker-javascript.js", dest: "generated/js/worker-javascript.js"},
          {src: "bower_components/ace-builds/src-noconflict/worker-typescript.js", dest: "generated/js/worker-typescript.js"},
          {src: "node_modules/typescript/bin/lib.d.ts",                            dest: "generated/ts/lib.d.ts"}
        ]
      }
    }

  };
};