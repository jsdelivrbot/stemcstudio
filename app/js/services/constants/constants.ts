/// <reference path="../../../../typings/angularjs/angular.d.ts" />
(function() {

  function makeKey(name: string): string {
    var DOMAIN = ['mathdoodle','io'];
    return DOMAIN.reverse().concat(name).join('.');
  }

  // githubKey stores the key of the item in local storage for maintaining GitHub OAuth data.
  // Remark: This value is duplicated in views/github_callback.jade
  angular.module('app').constant('githubKey',  makeKey('github'));
  // io.mathdoodle.doodles is the local storage key for doodles.
  angular.module('app').constant('doodlesKey', makeKey('doodles'));
  // io.mathdoodle.config is the local storage key for configuration.
  angular.module('app').constant('configKey',  makeKey('config'));

  angular.module('app').constant('FILENAME_META', 'doodle.json');
  angular.module('app').constant('FILENAME_HTML', 'index.html');
  angular.module('app').constant('FILENAME_CODE', 'script.ts');
  angular.module('app').constant('FILENAME_LESS', 'style.less');

  // For backwards compatibility, don't change the values of these constants.
  angular.module('app').constant('SCRIPTS-MARKER-COMMENT', '<!-- SCRIPTS-MARKER -->');
  angular.module('app').constant('STYLE-MARKER-COMMENT',   '<!-- STYLE-MARKER -->');
  angular.module('app').constant('CODE-MARKER-COMMENT',    '<!-- CODE-MARKER -->');

  // We can change the global namespace used by Google's Universal Analytics.
  // All access should be through the service wrapper.
  angular.module('app').constant('NAMESPACE_GOOGLE_ANALYTICS', 'googleAnalytics');
  angular.module('app').constant('NAMESPACE_TWITTER_WIDGETS', 'twttr');
  angular.module('app').constant('GITHUB_TOKEN_COOKIE_NAME', 'github-token');

  angular.module('app').constant('STATE_DOODLE', 'doodle');
  angular.module('app').constant('STATE_GISTS',  'gists');
})();
