// see a complete list of options here:
// https://github.com/jrburke/r.js/blob/master/build/example.build.js
requirejs.config({
  // all modules loaded are relative to this path
  // e.g. require(["abc/core"]) would grab /src/abc/core.js
  baseUrl: "./amd",

  // specify custom module name paths
  paths: {
    "spec": "../test/spec"
  },

  // target amd loader shim as the main module, path is relative to baseUrl.
  name: "../vendor/almond/almond",

  optimize: "none",

  // files to include along with almond.
  include: [
  "ace",
  "mode/CssMode",
  "mode/HtmlMode",
  "mode/JavaScriptMode",
  "mode/TypeScriptMode"
],

  // code to wrap around the start / end of the resulting build file
  // the global variable used to expose the API is defined here
  wrap: {
    start: "(function(global, define) {\n"+
              // check for amd loader on global namespace
           "  var globalDefine = global.define;\n",

    end:   "  var library = require('ace').default;\n"+
           "  if(typeof module !== 'undefined' && module.exports) {\n"+
                // export library for node
           "    module.exports = library;\n"+
           "  } else if(globalDefine) {\n"+
                // define library for global amd loader that is already present
           "    (function (define) {\n"+
           "      define(function () { return library; });\n"+
           "    }(globalDefine));\n"+
           "  } else {\n"+
                // define library on global namespace for inline script loading
           "    global['ace'] = library;\n"+
           "  }\n"+
           "}(this));\n"
  },

  // don't include these in the optimized file
  stubModules: [],

  // build file destination, relative to the build file itself
  out: "./dist/ace.js"
});
