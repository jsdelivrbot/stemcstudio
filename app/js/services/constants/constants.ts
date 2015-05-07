/// <reference path="../../../../typings/angularjs/angular.d.ts" />
(function() {

  function makeKey(name: string): string {
    var DOMAIN = ['mathdoodle','io'];
    return DOMAIN.reverse().concat(name).join('.');
  }

  // githubKey stores the key of the item in local storage for maintaining GitHub OAuth data.
  // Remark: This value is duplicated in views/github_callback.jade
  angular.module('app').constant('githubKey',  makeKey('github'));
  angular.module('app').constant('doodlesKey', makeKey('doodles'));
})();
