/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../services/uuid/IUuidService.ts" />

module mathdoodle {
  export interface IDoodle {
    /**
     * Every doodle gets a UUID to determine uniqueness.
     */
    uuid: string;
    /**
     * The GitHub Gist identifier.
     */
    gistId?: string;
    /**
     * 
     */
    description: string;
    /**
     * The `isCodeVisible` property determines whether the code is visible.
     */
    isCodeVisible: boolean;
    /**
     * The `isViewVisible` property determines whether the view is visible.
     */
    isViewVisible: boolean;
    /**
     * The `focusEditor` property contains the fileName of the editor which has focus.
     */
    focusEditor: string;
    /**
     * The last known generated JavaScript file. This is cached to improve startup.
     */
    lastKnownJs: string;
    /**
     * 
     */
    html: string;
    /**
     * 
     */
    code: string;
    /**
     * 
     */
    dependencies: string[];
  }
  export interface IDoodleManager {
    unshift(doodle: mathdoodle.IDoodle): void;
    length: number;
    filter(callback: (doodle: mathdoodle.IDoodle, index: number, array: mathdoodle.IDoodle[]) => boolean): mathdoodle.IDoodle[];
    current(): mathdoodle.IDoodle;
    makeCurrent(uuid: string): void;
    deleteDoodle(uuid: string): void;
    updateStorage(): void;
    createDoodle(template: mathdoodle.IDoodle, description?: string);
    suggestName(): string;
  }  
}

angular.module('app').factory('doodles', [
  '$window',
  'uuid4',
  'doodlesKey',
  function(
    $window: angular.IWindowService,
    uuid4: IUuidService,
    doodlesKey: string
  ) {

  var _doodles: mathdoodle.IDoodle[] = $window.localStorage[doodlesKey] !== undefined ? JSON.parse($window.localStorage[doodlesKey]) : [];
  
  var suggestName = function(): string {
    var UNTITLED = "Doodle";
    // We assume that a doodle with a lower index will have a higher Untitled number.
    // To reduce sorting, sort as a descending sequence and use the resulting first
    // element as the highest number used so far. Add one to that.
    function compareNumbers(a: number, b: number) {
        return b - a;
    }
    var nums: number[] = _doodles.filter(function(doodle: mathdoodle.IDoodle) {
        return typeof doodle.description.match(new RegExp(UNTITLED)) !== 'null';
    }).
        map(function(doodle: mathdoodle.IDoodle) {
        return parseInt(doodle.description.replace(UNTITLED + ' ', '').trim(), 10);
    }).
        filter(function(num) {
        return !isNaN(num);
    });

    nums.sort(compareNumbers);

    return UNTITLED + ' ' + (nums.length === 0 ? 1 : nums[0] + 1);
  };

  var that: mathdoodle.IDoodleManager = {

      unshift: function(doodle: mathdoodle.IDoodle) {
          return _doodles.unshift(doodle);
      },

      get length() {
          return _doodles.length;
      },

      filter: function(callback: (doodle: mathdoodle.IDoodle, index: number, array: mathdoodle.IDoodle[]) => boolean) {
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

      createDoodle: function(template: mathdoodle.IDoodle, description?: string) {
        if (!description) {
          description = suggestName();
        }
        var doodle: mathdoodle.IDoodle = {
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

      makeCurrent: function(uuid: string) {
        var doodles: mathdoodle.IDoodle[] = [];

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
        var doodles: mathdoodle.IDoodle[] = [];

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

      suggestName: suggestName,

      updateStorage: function() {
        $window.localStorage[doodlesKey] = JSON.stringify(_doodles);
      }
  };

  return that;
}]);