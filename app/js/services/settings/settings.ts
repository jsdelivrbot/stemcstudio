/// <reference path="../../../../typings/angularjs/angular.d.ts" />

module mathdoodle {
  export interface ISettingsService {
    theme: string;
    indent: number;
    fontSize: string;
    showInvisibles: boolean;
    showPrintMargin: boolean;
    displayIndentGuides: boolean;
  }
}

angular.module('app').factory('settings', [function (): mathdoodle.ISettingsService {
    var settings: mathdoodle.ISettingsService = {
      theme: 'ace/theme/twilight',
      indent: 2,
      fontSize: '16px',
      showInvisibles: false,
      showPrintMargin: false,
      displayIndentGuides: false
    };
    return settings;
}]);
