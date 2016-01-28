System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "ace.js": "github:ace2ts/ace@0.1.132",
    "ace2ts/ace": "github:ace2ts/ace@0.1.134",
    "angular": "github:angular/bower-angular@1.4.9",
    "angular-animate": "github:angular/bower-angular-animate@1.4.9",
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@1.1.1",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.17",
    "bootstrap": "vendor/bootstrap/dist/js/npm",
    "bootstrap-dialog": "npm:bootstrap-dialog@1.34.6",
    "davinci-mathscript": "github:geometryzen/davinci-mathscript@1.0.11",
    "geometryzen/davinci-mathscript": "github:geometryzen/davinci-mathscript@1.0.11",
    "jquery": "npm:jquery@2.2.0",
    "underscore": "npm:underscore@1.8.3",
    "github:ace2ts/ace@0.1.132": {
      "ace2ts/ace-workers": "github:ace2ts/ace-workers@0.1.36",
      "typescript": "npm:typescript@1.7.5"
    },
    "github:ace2ts/ace@0.1.134": {
      "ace2ts/ace-workers": "github:ace2ts/ace-workers@0.1.36",
      "typescript": "npm:typescript@1.7.5"
    },
    "github:angular-ui/ui-router@0.2.17": {
      "angular": "github:angular/bower-angular@1.4.9"
    },
    "github:angular/bower-angular-animate@1.4.9": {
      "angular": "github:angular/bower-angular@1.4.9"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:bootstrap-dialog@1.34.6": {
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
