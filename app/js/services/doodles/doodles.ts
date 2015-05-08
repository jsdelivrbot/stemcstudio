/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="IDoodleManager.ts" />
/// <reference path="IDoodle.ts" />

angular.module('app').factory('doodles', [
  '$window',
  'doodlesKey',
  function(
    $window: angular.IWindowService,
    doodlesKey: string
  ) {

  var _doodles: IDoodle[] = $window.localStorage[doodlesKey] !== undefined ? JSON.parse($window.localStorage[doodlesKey]) : [];

  var that: IDoodleManager = {

      unshift: function(doodle: IDoodle) {
          return _doodles.unshift(doodle);
      },

      get length() {
          return _doodles.length;
      },

      filter: function(callback: (doodle: IDoodle, index: number, array: IDoodle[]) => boolean) {
          return _doodles.filter(callback);
      },

      current: function() {
        if (_doodles.length > 0) {
          return _doodles[0];
        }
        else {
          return undefined;
        }
      },

      activeDoodle: function(uuid: string) {
        var temp: IDoodle[] = [];

        var i = 0, found;
        while (i < _doodles.length) {
          if (_doodles[i].uuid === uuid) {
            found = _doodles[i];
          }
          else {
            temp.push(_doodles[i]);
          }
          i++;
        }
        if ( ! found ) return;
        temp.unshift(found);
        _doodles = temp;
      },

      deleteDoodle: function(uuid: string) {
        var doodles: IDoodle[] = [];

        var i = 0, found;
        while (i < _doodles.length) {
          if (_doodles[i].uuid === uuid) {
            found = _doodles[i];
          }
          else {
            doodles.push(_doodles[i]);
          }
          i++;
        }

        if ( ! found ) return;

        _doodles = doodles;
      },

      updateStorage: function() {
        $window.localStorage[doodlesKey] = JSON.stringify(_doodles);
      }
  };

  return that;
}]);