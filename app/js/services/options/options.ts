/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="IOptionManager.ts" />
/// <reference path="IOption.ts" />

angular.module('app').factory('options', [
  '$window',
  'doodlesKey',
  'VENDOR_FOLDER_MARKER',
  function(
    $window: angular.IWindowService,
    doodlesKey: string,
    VENDOR_FOLDER_MARKER
  ) {

  let VERSION_ANGULARJS  = '1.4.6'
  let VERSION_ASYNC      = '1.4.2'
  let VERSION_BLADE      = '1.7.2'
  let VERSION_DOMREADY   = '1.0.0'
  let VERSION_D3         = '3.5.5'
  let VERSION_EIGHT      = '2.102.0'
  let VERSION_GLMATRIX   = '2.3.1'
  let VERSION_JSXGRAPH   = '0.99.3'
  let VERSION_REQUIREJS  = '2.1.9'
  let VERSION_STATSJS    = '0.0.14'
  let VERSION_THREEJS    = '0.72.0'
  let VERSION_UNDERSCORE = '1.8.3'

  // FIXME: DRY This function is defined in constants.ts?
  function vendorFolder(packageFolder: string, version: string, subFolder: string, fileName: string): string {
    let steps: string[] = []
    steps.push(VENDOR_FOLDER_MARKER)
    steps.push('/')
    steps.push(packageFolder)
    steps.push('@')
    steps.push(version)
    steps.push('/')
    if (subFolder) {
      steps.push(subFolder)
      steps.push('/')
    }
    steps.push(fileName)
    return steps.join('')
  }

  function async(fileName: string): string {
    return vendorFolder('async', VERSION_ASYNC, void 0, fileName)
  }
  function ng(fileName: string): string {
    return vendorFolder('angular', VERSION_ANGULARJS, void 0, fileName)
  }
  function blade(subFolder: string, fileName: string): string {
    return vendorFolder('davinci-blade', VERSION_BLADE, subFolder, fileName)
  }
  function domready(fileName: string): string {
    return vendorFolder('domready', VERSION_DOMREADY, void 0, fileName)
  }
  function d3(fileName: string): string {
      return vendorFolder('d3', VERSION_D3, void 0, fileName)
  }
  function eight(subFolder: string, fileName: string): string {
      return vendorFolder('davinci-eight', VERSION_EIGHT, subFolder, fileName)
  }
  function glMatrix(fileName: string): string {
    return vendorFolder('gl-matrix', VERSION_GLMATRIX, 'dist', fileName);
  }
  function jsxgraph(fileName: string): string {
      return vendorFolder('jsxgraph', VERSION_JSXGRAPH, void 0, fileName);
  }
  function requirejs(fileName: string): string {
    return vendorFolder('requirejs', VERSION_REQUIREJS, void 0, fileName);
  }
  function statsjs(fileName: string): string {
    return vendorFolder('stats.js', VERSION_STATSJS, void 0, fileName);
  }
  function threejs(fileName: string): string {
    return vendorFolder('threejs', VERSION_THREEJS, 'build', fileName)
  }
  function underscore(fileName: string): string {
    return vendorFolder('underscore', VERSION_UNDERSCORE, void 0, fileName);
  }
  var _options: IOption[] = [
    {
      name: 'requirejs',
      moniker: 'RequireJS',
      description: "A file and module loader for JavaScript",
      homepage: 'http://requirejs.org',
      version: VERSION_REQUIREJS,
      visible: true,
      dts: requirejs('require.d.ts'),
      js: requirejs('require.js'),
      minJs: requirejs('require.js'),
      dependencies: {}
    },
    {
      name: 'angular',
      moniker: 'Angular JS',
      description: "HTML enhanced for Web Applications",
      homepage: 'https://angularjs.org',
      version: VERSION_ANGULARJS,
      visible: true,
      dts: ng('angular.d.ts'),
      js: ng('angular.js'),
      minJs: ng('angular.min.js'),
      dependencies: {}
    },
    {
      name: 'async',
      moniker: 'async',
      description: "Async utilities for node and the browser",
      homepage: 'https://github.com/caolan/async',
      version: VERSION_ASYNC,
      visible: true,
      dts: async('async.ts'),
      js: async('async.js'),
      minJs: async('async.js'),
      dependencies: {}
    },
    {
      name: 'davinci-blade',
      moniker: 'blade',
      description: "Geometric Algebra Library",
      homepage: 'https://github.com/geometryzen/davinci-blade',
      version: VERSION_BLADE,
      visible: true,
      dts:   blade('dist', 'davinci-blade.d.ts'),
      js:    blade('dist', 'davinci-blade.js'),
      minJs: blade('dist', 'davinci-blade.min.js'),
      dependencies: {}
    },
    {
      name: 'gl-matrix',
      moniker: 'gl-matrix',
      description: "Matrix and Vector library for High Performance WebGL apps",
      homepage: 'http://glmatrix.net',
      version: VERSION_GLMATRIX,
      visible: true,
      dts: glMatrix('gl-matrix.d.ts'),
      js: glMatrix('gl-matrix-min.js'),
      minJs: glMatrix('gl-matrix-min.js'),
      dependencies: {}
    },
    {
      name: 'davinci-eight',
      moniker: 'EIGHT',
      description: "Mathematical Computer Graphics using WebGL",
      homepage: 'https://github.com/geometryzen/davinci-eight',
      version: VERSION_EIGHT,
      visible: true,
      dts: eight('dist', 'davinci-eight.d.ts'),
      js: eight('dist', 'davinci-eight.js'),
      minJs: eight('dist', 'davinci-eight.min.js'),
      dependencies: {'davinci-blade': '*','gl-matrix': '*'}
    },
    {
      name: 'd3',
      moniker: 'd3',
      description: "Data-Driven Documents",
      homepage: 'http://d3js.org',
      version: VERSION_D3,
      visible: true,
      dts: d3('d3.d.ts'),
      js: d3('d3.js'),
      minJs: d3('d3.min.js'),
      dependencies: {}
    },
    {
      name: 'DomReady',
      moniker: 'DomReady',
      description: "Browser portable and safe way to know when DOM has loaded",
      homepage: '',
      version: VERSION_DOMREADY,
      visible: true,
      dts: domready('domready.d.ts'),
      js: domready('domready.js'),
      minJs: domready('domready.js'),
      dependencies: {}
    },
    {
      name: 'jsxgraph',
      moniker: 'JSXGraph',
      description: "2D Geometry, Plotting, and Visualization",
      homepage: 'http://jsxgraph.uni-bayreuth.de',
      version: VERSION_JSXGRAPH,
      visible: true,
      dts: jsxgraph('jsxgraph.d.ts'),
      js: jsxgraph('jsxgraph.js'),
      minJs: jsxgraph('jsxgraph.min.js'),
      dependencies: {}
    },
    {
      name: 'stats.js',
      moniker: 'Stats',
      description: "JavaScript Performance Monitoring",
      homepage: 'https://github.com/mrdoob/stats.js',
      version: VERSION_STATSJS,
      visible: true,
      dts: statsjs('stats.d.ts'),
      js: statsjs('stats.min.js'),
      minJs: statsjs('stats.min.js'),
      dependencies: {}
    },
    {
      name: 'three.js',
      moniker: 'THREE',
      description: "JavaScript 3D library",
      homepage: 'http://threejs.org/',
      version: VERSION_THREEJS,
      visible: true,
      dts: threejs('three.d.ts'),
      js: threejs('three.js'),
      minJs: threejs('three.min.js'),
      dependencies: {}
    },
    {
      name: 'underscore',
      moniker: 'underscore',
      description: "Functional Programming Library",
      homepage: 'http://underscorejs.org',
      version: VERSION_UNDERSCORE,
      visible: true,
      dts: underscore('underscore.d.ts'),
      js: underscore('underscore.js'),
      minJs: underscore('underscore.min.js'),
      dependencies: {}
    },
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