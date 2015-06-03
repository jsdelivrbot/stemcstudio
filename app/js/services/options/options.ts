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
      name: 'angular',
      moniker: 'Angular JS',
      description: '',
      version: 'latest',
      visible: true,
      js: 'angular@1.4.0.min.js',
      dts: 'angular@1.4.0.d.ts',
      dependencies: {

      }
    },
    {
      name: 'davinci-blade',
      moniker: 'blade',
      description: '',
      version: '1.1.1',
      visible: true,
      js: 'davinci-blade@1.1.1/davinci-blade.min.js',
      dts: 'davinci-blade@1.1.1/davinci-blade.d.ts',
      dependencies: {

      }
    },
    {
      name: 'd3',
      moniker: 'd3',
      description: '',
      version: '3.5.5',
      visible: true,
      js: 'd3@3.5.5.min.js',
      dts: 'd3@3.5.5.d.ts',
      dependencies: {

      }
    },
    {
      name: 'DomReady',
      moniker: 'DomReady',
      description: '',
      version: 'latest',
      visible: true,
      js: 'domready@1.0.0.js',
      dts: 'domready@1.0.0.d.ts',
      dependencies: {

      }
    },
    {
      name: 'jsxgraph',
      moniker: 'JSXGraph',
      description: '',
      version: '0.99.3',
      visible: true,
      js: 'jsxgraph@0.99.3.min.js',
      dts: 'jsxgraph@0.99.3.d.ts',
      dependencies: {

      }
    },
    {
      name: 'threejs',
      moniker: 'three.js',
      description: '',
      version: 'latest',
      visible: true,
      js: 'three.js',
      dts: 'three.d.ts',
      dependencies: {

      }
    },
    {
      name: 'davinci-tquery',
      moniker: 'tQuery',
      description: '',
      version: 'latest',
      visible: true,
      js: 'tquery.min.js',
      dts: 'tquery.d.ts',
      dependencies: {
        'threejs': '*'
      }
    },
    {
      name: 'microAjax',
      moniker: 'microAjax',
      description: '',
      version: 'latest',
      visible: false,
      js: 'microajax.js',
      dts: 'microajax.d.ts',
      dependencies: {}
    },
    {
      name: 'MicroEvent',
      moniker: 'MicroEvent',
      description: '',
      version: 'latest',
      visible: false,
      js: 'microevent.js',
      dts: 'microevent.d.ts',
      dependencies: {}
    },
    {
      name: 'THREEx.screenshot',
      moniker: 'THREEx.screenshot',
      description: '',
      version: 'latest',
      visible: false,
      js: 'THREEx.screenshot.js',
      dts: 'THREEx.screenshot.d.ts',
      dependencies: {
        'threejs': '*'
      }
    },
    {
      name: 'davinci-threebox',
      moniker: 'ThreeBox.js',
      description: '',
      version: 'latest',
      visible: false,
      js: 'ThreeBox-core.js',
      dts: 'ThreeBox-core.d.ts',
      dependencies: {
        'microAjax': 'latest',
        'MicroEvent': '*',
        'threejs': '*',
        'THREEx.screenshot': '*',
        'davinci-tquery': '*',
        'underscore': '1.8.3'
      }
    },
    {
      name: 'underscore',
      moniker: 'underscore',
      description: '',
      version: 'latest',
      visible: true,
      js: 'underscore@1.8.3.min.js',
      dts: 'underscore@1.8.3.d.ts',
      dependencies: {}
    },
    {
      name: 'davinci-threertt',
      moniker: 'ThreeRTT.js',
      description: '',
      version: 'latest',
      visible: false,
      js: 'ThreeRTT-core.js',
      dts: 'ThreeRTT-core.d.ts',
      dependencies: {
        'threejs': '*'
      }
    },
    {
      name: 'davinci-shadergraph',
      moniker: 'ShaderGraph.js',
      description: '',
      version: 'latest',
      visible: false,
      js: 'ShaderGraph-core.js',
      dts: 'ShaderGraph-core.d.ts',
      dependencies: {}
    },
    {
      name: 'davinci-mathbox',
      moniker: 'MathBox.js',
      description: '',
      version: 'latest',
      visible: true,
      js: 'MathBox-core.js',
      dts: 'MathBox-core.d.ts',
      dependencies: {
        'davinci-shadergraph': '*',
        'davinci-threebox': '*',
        'davinci-threertt': '*',
        'threejs': '*'
      }
    },
    {
      name: 'davinci-visual',
      moniker: 'visual',
      description: '',
      version: 'latest',
      visible: false,
      js: 'davinci-visual.min.js',
      dts: 'davinci-visual.d.ts',
      dependencies: {
        'threejs': '*'
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