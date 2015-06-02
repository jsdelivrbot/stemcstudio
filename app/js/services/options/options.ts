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
      version: 'latest',
      visible: true,
      js: 'angular@1.4.0.min.js',
      dts: 'angular@1.4.0.d.ts',
      dependencies: {

      }
    },
    {
      name: 'blade',
      version: 'latest',
      visible: true,
      js: 'davinci-blade.min.js',
      dts: 'davinci-blade.d.ts',
      dependencies: {

      }
    },
    {
      name: 'd3',
      version: '3.5.5',
      visible: true,
      js: 'd3@3.5.5.min.js',
      dts: 'd3@3.5.5.d.ts',
      dependencies: {

      }
    },
    {
      name: 'DomReady',
      version: 'latest',
      visible: true,
      js: 'domready@1.0.0.js',
      dts: 'domready@1.0.0.d.ts',
      dependencies: {

      }
    },
    {
      name: 'jsxgraph',
      version: '0.99.3',
      visible: true,
      js: 'jsxgraph@0.99.3.min.js',
      dts: 'jsxgraph@0.99.3.d.ts',
      dependencies: {

      }
    },
    {
      name: 'THREE',
      version: 'latest',
      visible: true,
      js: 'three.min.js',
      dts: 'three.d.ts',
      dependencies: {

      }
    },
    {
      name: 'tQuery',
      version: 'latest',
      visible: true,
      js: 'tquery.min.js',
      dts: 'tquery.d.ts',
      dependencies: {
        'THREE': '*'
      }
    },
    {
      name: 'microAjax',
      version: 'latest',
      visible: false,
      js: 'microajax.js',
      dts: 'microajax.d.ts',
      dependencies: {}
    },
    {
      name: 'MicroEvent',
      version: 'latest',
      visible: false,
      js: 'microevent.js',
      dts: 'microevent.d.ts',
      dependencies: {}
    },
    {
      name: 'THREEx.screenshot',
      version: 'latest',
      visible: false,
      js: 'THREEx.screenshot.js',
      dts: 'THREEx.screenshot.d.ts',
      dependencies: {
        'THREE': '*'
      }
    },
    {
      name: 'ThreeBox',
      version: 'latest',
      visible: false,
      js: 'ThreeBox-core.js',
      dts: 'ThreeBox-core.d.ts',
      dependencies: {
        'microAjax': 'latest',
        'MicroEvent': '*',
        'THREE': '*',
        'THREEx.screenshot': '*',
        'tQuery': '*',
        'underscore': '1.8.3'
      }
    },
    {
      name: 'underscore',
      version: 'latest',
      visible: true,
      js: 'underscore@1.8.3.min.js',
      dts: 'underscore@1.8.3.d.ts',
      dependencies: {}
    },
    {
      name: 'ThreeRTT',
      version: 'latest',
      visible: false,
      js: 'ThreeRTT-core.js',
      dts: 'ThreeRTT-core.d.ts',
      dependencies: {
        'THREE': '*'
      }
    },
    {
      name: 'ShaderGraph',
      version: 'latest',
      visible: false,
      js: 'ShaderGraph-core.js',
      dts: 'ShaderGraph-core.d.ts',
      dependencies: {}
    },
    {
      name: 'MathBox',
      version: 'latest',
      visible: true,
      js: 'MathBox-core.js',
      dts: 'MathBox-core.d.ts',
      dependencies: {
        'ShaderGraph': '*',
        'ThreeBox': '*',
        'ThreeRTT': '*',
        'THREE': '*'
      }
    },
    {
      name: 'visual',
      version: 'latest',
      visible: false,
      js: 'davinci-visual.min.js',
      dts: 'davinci-visual.d.ts',
      dependencies: {
        'THREE': '*'
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