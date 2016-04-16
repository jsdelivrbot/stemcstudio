System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "@angular/router": "npm:@angular/router@0.2.0",
    "ace.js": "github:ace2ts/ace@0.1.143",
    "ace2ts/ace": "github:ace2ts/ace@0.1.143",
    "angular": "github:angular/bower-angular@1.5.4",
    "angular-animate": "github:angular/bower-angular-animate@1.5.3",
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@1.3.2",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.18",
    "angular2": "npm:angular2@2.0.0-beta.15",
    "bootstrap": "vendor/bootstrap/dist/js/npm",
    "bootstrap-dialog": "npm:bootstrap-dialog@1.34.6",
    "davinci-mathscript": "github:geometryzen/davinci-mathscript@1.0.11",
    "geometryzen/davinci-mathscript": "github:geometryzen/davinci-mathscript@1.0.11",
    "jquery": "npm:jquery@2.2.3",
    "underscore": "npm:underscore@1.8.3",
    "github:ace2ts/ace@0.1.143": {
      "ace2ts/ace-workers": "github:ace2ts/ace-workers@0.1.49",
      "typescript": "npm:typescript@1.8.10"
    },
    "github:angular-ui/ui-router@0.2.18": {
      "angular": "github:angular/bower-angular@1.5.4"
    },
    "github:angular/bower-angular-animate@1.5.3": {
      "angular": "github:angular/bower-angular@1.5.4"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
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
    "npm:@angular/router@0.2.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:angular2@2.0.0-beta.15": {
      "reflect-metadata": "npm:reflect-metadata@0.1.2",
      "rxjs": "npm:rxjs@5.0.0-beta.6",
      "zone.js": "npm:zone.js@0.6.11"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:bootstrap-dialog@1.34.6": {
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:reflect-metadata@0.1.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:rxjs@5.0.0-beta.6": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:typescript@1.8.10": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:zone.js@0.6.11": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
