module.exports = function(lineman) {

  require("./plugins/typescript");

  return {
    concat_sourcemap: {
      js: {
        src: [
          "<%= files.js.vendor %>",
          "<%= files.coffee.generated %>",
          "<%= files.typescript.generated %>",
          "<%= files.js.app %>",
          "<%= files.ngtemplates.dest %>"
        ]
      }
    }
  };
};