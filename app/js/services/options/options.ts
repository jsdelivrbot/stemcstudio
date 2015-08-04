/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="IOptionManager.ts" />
/// <reference path="IOption.ts" />

angular.module('app').factory('options', [
  '$window',
  'doodlesKey',
  function(
    $window: angular.IWindowService,
    doodlesKey: string
  ) {

  var _options: IOption[] = [
    {
      name: 'requirejs',
      moniker: 'RequireJS',
      description: "A file and module loader for JavaScript",
      homepage: 'http://requirejs.org',
      version: '2.1.18',
      visible: true,
      dts: 'require.d.ts',
      js: 'require.js',
      minJs: 'require.js',
      dependencies: {

      }
    },
    {
      name: 'angular',
      moniker: 'Angular JS',
      description: "HTML enhanced for Web Applications",
      homepage: 'https://angularjs.org',
      version: '1.4.0',
      visible: true,
      dts: 'angular@1.4.0.d.ts',
      js: 'angular@1.4.0.js',
      minJs: 'angular@1.4.0.min.js',
      dependencies: {

      }
    },
    {
      name: 'async',
      moniker: 'async',
      description: "Async utilities for node and the browser",
      homepage: 'https://github.com/caolan/async',
      version: '1.2.1',
      visible: true,
      dts: 'async.ts',
      js: 'async.js',
      minJs: 'async.js',
      dependencies: {}
    },
    {
      name: 'davinci-blade',
      moniker: 'blade',
      description: "Geometric Algebra Library",
      homepage: 'https://github.com/geometryzen/davinci-blade',
      version: '1.1.1',
      visible: true,
      dts: 'davinci-blade/davinci-blade.d.ts',
      js: 'davinci-blade/davinci-blade.js',
      minJs: 'davinci-blade/davinci-blade.min.js',
      dependencies: {

      }
    },
    {
      name: 'gl-matrix',
      moniker: 'gl-matrix',
      description: "Matrix and Vector library for High Performance WebGL apps",
      homepage: 'http://glmatrix.net',
      version: '2.2.1',
      visible: true,
      dts: 'gl-matrix@2.2.1/gl-matrix.d.ts',
      js: 'gl-matrix@2.2.1/gl-matrix.js',
      minJs: 'gl-matrix@2.2.1/gl-matrix.min.js',
      dependencies: {
      }
    },
    {
      name: 'davinci-eight',
      moniker: 'EIGHT',
      description: "Mathematical Computer Graphics using WebGL",
      homepage: 'https://github.com/geometryzen/davinci-eight',
      version: 'latest',
      visible: true,
      dts: 'davinci-eight/davinci-eight.d.ts',
      js: 'davinci-eight/davinci-eight.js',
      minJs: 'davinci-eight/davinci-eight.js',
      dependencies: {
        'davinci-blade': '*',
        'gl-matrix': '*'
      }
    },
    {
      name: 'd3',
      moniker: 'd3',
      description: "Data-Driven Documents",
      homepage: 'http://d3js.org',
      version: '3.5.5',
      visible: true,
      dts: 'd3@3.5.5.d.ts',
      js: 'd3@3.5.5.js',
      minJs: 'd3@3.5.5.min.js',
      dependencies: {

      }
    },
    {
      name: 'DomReady',
      moniker: 'DomReady',
      description: "Browser portable and safe way to know when DOM has loaded",
      homepage: '',
      version: 'latest',
      visible: true,
      dts: 'domready@1.0.0.d.ts',
      js: 'domready@1.0.0.js',
      minJs: 'domready@1.0.0.js',
      dependencies: {

      }
    },
    {
      name: 'jsxgraph',
      moniker: 'JSXGraph',
      description: "2D Geometry, Plotting, and Visualization",
      homepage: 'http://jsxgraph.uni-bayreuth.de',
      version: '0.99.3',
      visible: true,
      dts: 'jsxgraph@0.99.3.d.ts',
      js: 'jsxgraph@0.99.3.js',
      minJs: 'jsxgraph@0.99.3.min.js',
      dependencies: {

      }
    },
    {
      name: 'davinci-threejs',
      moniker: 'THREE',
      description: "WebGL Library",
      homepage: 'http://threejs.org/',
      version: '0.71.4',
      visible: true,
      dts: 'three.d.ts',
      js: 'three.js',
      minJs: 'three.min.js',
      dependencies: {

      }
    },
    {
      name: 'davinci-tquery',
      moniker: 'tQuery',
      description: "tQuery API is a thin library on top of three.js",
      homepage: 'https://jeromeetienne.github.io/tquery',
      version: '1.0.0',
      visible: true,
      dts: 'tquery.d.ts',
      js: 'tquery.js',
      minJs: 'tquery.min.js',
      dependencies: {
        'davinci-threejs': '*'
      }
    },
    {
      name: 'microAjax',
      moniker: 'microAjax',
      description: "",
      homepage: '',
      version: 'latest',
      visible: true,
      dts: 'microajax.d.ts',
      js: 'microajax.js',
      minJs: 'microajax.js',
      dependencies: {}
    },
    {
      name: 'MicroEvent',
      moniker: 'MicroEvent',
      description: '',
      homepage: '',
      version: 'latest',
      visible: false,
      dts: 'microevent.d.ts',
      js: 'microevent.js',
      minJs: 'microevent.js',
      dependencies: {}
    },
    {
      name: 'THREEx.screenshot',
      moniker: 'THREEx.screenshot',
      description: '',
      homepage: '',
      version: 'latest',
      visible: false,
      dts: 'THREEx.screenshot.d.ts',
      js: 'THREEx.screenshot.js',
      minJs: 'THREEx.screenshot.js',
      dependencies: {
        'threejs': '*'
      }
    },
    {
      name: 'davinci-threebox',
      moniker: 'ThreeBox.js',
      description: '',
      homepage: '',
      version: 'latest',
      visible: false,
      dts: 'ThreeBox-core.d.ts',
      js: 'ThreeBox-core.js',
      minJs: 'ThreeBox-core.js',
      dependencies: {
        'microAjax': 'latest',
        'MicroEvent': '*',
        'davinci-threejs': '*',
        'THREEx.screenshot': '*',
        'davinci-tquery': '*',
        'underscore': '1.8.3'
      }
    },
    {
      name: 'underscore',
      moniker: 'underscore',
      description: "Functional Programming Library",
      homepage: 'http://underscorejs.org',
      version: '1.8.3',
      visible: true,
      dts: 'underscore@1.8.3.d.ts',
      js: 'underscore@1.8.3.js',
      minJs: 'underscore@1.8.3.min.js',
      dependencies: {}
    },
    {
      name: 'davinci-threertt',
      moniker: 'ThreeRTT.js',
      description: '',
      homepage: '',
      version: 'latest',
      visible: false,
      dts: 'ThreeRTT-core.d.ts',
      js: 'ThreeRTT-core.js',
      minJs: 'ThreeRTT-core.min.js',
      dependencies: {
        'davinci-threejs': '*'
      }
    },
    {
      name: 'davinci-shadergraph',
      moniker: 'ShaderGraph.js',
      description: '',
      homepage: '',
      version: 'latest',
      visible: false,
      dts: 'ShaderGraph-core.d.ts',
      js: 'ShaderGraph-core.js',
      minJs: 'ShaderGraph-core.min.js',
      dependencies: {}
    },
    {
      name: 'davinci-mathbox',
      moniker: 'MathBox.js',
      description: "Presentation quality math diagrams in WebGL",
      homepage: 'https://github.com/unconed/MathBox.js',
      version: 'latest',
      visible: true,
      dts: 'MathBox-core.d.ts',
      js: 'MathBox-core.js',
      minJs: 'MathBox-core.min.js',
      dependencies: {
        'davinci-shadergraph': '*',
        'davinci-threebox': '*',
        'davinci-threertt': '*',
        'davinci-threejs': '*'
      }
    },
    {
      name: 'davinci-visual',
      moniker: 'visual',
      description: "WebGL Mathematical Visualization Library extending three.js",
      homepage: 'https://github.com/geometryzen/davinci-visual',
      version: '1.6.0',
      visible: true,
      dts: 'davinci-visual.d.ts',
      js: 'davinci-visual.js',
      minJs: 'davinci-visual.min.js',
      dependencies: {
        'davinci-threejs': '*'
      }
    }
  ];

  var that: IOptionManager = {

      unshift: function(doodle: IOption) {
          return _options.unshift(doodle);
      },

      get length() {
          return _options.length;
      },

      filter: function(callback: (doodle: IOption, index: number, array: IOption[]) => boolean) {
          return _options.filter(callback);
      },

      deleteOption: function(name: string) {
        var options: IOption[] = [];

        var i = 0, found;
        while (i < _options.length) {
          if (_options[i].name === name) {
            found = _options[i];
          }
          else {
            options.push(_options[i]);
          }
          i++;
        }

        if ( ! found ) return;

        _options = options;
      }
    };

  return that;
}]);