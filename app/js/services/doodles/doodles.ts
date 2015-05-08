/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="IDoodleManager.ts" />
/// <reference path="IDoodle.ts" />
/// <reference path="../uuid/IUuidService.ts" />

angular.module('app').factory('doodles', [
  '$window',
  'uuid4',
  'doodlesKey',
  function(
    $window: angular.IWindowService,
    uuid4: IUuidService,
    doodlesKey: string
  ) {

  var _doodles: IDoodle[] = $window.localStorage[doodlesKey] !== undefined ? JSON.parse($window.localStorage[doodlesKey]) : [];
  
  var nextUntitled = function() {
    // We assume that a doodle with a lower index will have a higher Untitled number.
    // To reduce sorting, sort as a descending sequence and use the resulting first
    // element as the highest number used so far. Add one to that.
    function compareNumbers(a: number, b: number) {
        return b - a;
    }
    var nums: number[] = _doodles.filter(function(doodle: IDoodle) {
        return typeof doodle.description.match(/Untitled/) !== 'null';
    }).
        map(function(doodle: IDoodle) {
        return parseInt(doodle.description.replace('Untitled ', '').trim(), 10);
    }).
        filter(function(num) {
        return !isNaN(num);
    });

    nums.sort(compareNumbers);

    return 'Untitled ' + (nums.length === 0 ? 1 : nums[0] + 1);
  };

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

      createDoodle: function(template: IDoodle, description?: string) {
        if (!description) {
          description = nextUntitled();
        }
        var doodle: IDoodle = {
          uuid: uuid4.generate(),
          description: description,
          isCodeVisible: template.isCodeVisible,
          isViewVisible: template.isViewVisible,
          focusEditor: template.focusEditor,
          lastKnownJs: template.lastKnownJs,
          html: template.html,
          code: template.code,
          dependencies: template.dependencies
        };
        _doodles.unshift(doodle);
      },

      activeDoodle: function(uuid: string) {
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
        doodles.unshift(found);
        _doodles = doodles;
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