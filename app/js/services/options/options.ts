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
      js: 'angular@1.4.0.min.js',
      dts: 'angular@1.4.0.d.ts'
    },
    {
      name: 'blade',
      version: 'latest',
      js: 'davinci-blade.min.js',
      dts: 'davinci-blade.d.ts'
    },
    {
      name: 'd3',
      version: '3.5.5',
      js: 'd3@3.5.5.min.js',
      dts: 'd3@3.5.5.d.ts'
    },
    {
      name: 'domready',
      version: 'latest',
      js: 'domready@1.0.0.js',
      dts: 'domready@1.0.0.d.ts'
    },
    {
      name: 'jsxgraph',
      version: '0.99.3',
      js: 'jsxgraph@0.99.3.min.js',
      dts: 'jsxgraph@0.99.3.d.ts'
    },
    {
      name: 'MathBox-bundle',
      version: 'latest',
      js: 'MathBox-bundle.js',
      dts: 'MathBox-bundle.d.ts'
    },
    {
      name: 'ThreeBox',
      version: 'latest',
      js: 'ThreeBox@1.0.0.min.js',
      dts: 'ThreeBox@1.0.0.d.ts'
    },
    {
      name: 'three',
      version: 'latest',
      js: 'three.min.js',
      dts: 'three.d.ts'
    },
    {
      name: 'underscore',
      version: 'latest',
      js: 'underscore@1.8.3.min.js',
      dts: 'underscore@1.8.3.d.ts'
    },
    {
      name: 'visual',
      version: 'latest',
      js: 'davinci-visual.min.js',
      dts: 'davinci-visual.d.ts'
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