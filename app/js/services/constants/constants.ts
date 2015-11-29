/// <reference path="../../../../typings/angularjs/angular.d.ts" />
(function() {

  function makeKey(name: string): string {
    var DOMAIN = ['mathdoodle', 'io'];
    return DOMAIN.reverse().concat(name).join('.');
  }

  let VENDOR_FOLDER_MARKER = '$VENDOR-FOLDER-MARKER'

  function vendorPath(packageFolder: string, fileName: string): string {
    return VENDOR_FOLDER_MARKER + '/' + packageFolder + '/' + fileName;
  }

  angular.module('app').constant('version', '1.224.0');
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
  angular.module('app').constant('FILENAME_LIBS', 'extras.ts');
  angular.module('app').constant('FILENAME_LESS', 'style.less');

  // Special marker to indicate that JavaScript or TypeScript file is
  // stored locally in the DOMAIN/vendor folder.
  // This enables us to handle locally stored files in both development and production.
  // This constant is used in the `options` service to construct file locations
  // and the DoodleController to look up files.
  // Ultimately we would like to be able to access modules through only a manifest.
  angular.module('app').constant('VENDOR_FOLDER_MARKER', VENDOR_FOLDER_MARKER);

  // For backwards compatibility, don't change the values of these constants.
  angular.module('app').constant('SCRIPTS_MARKER', '<!-- SCRIPTS-MARKER -->');
  angular.module('app').constant('STYLE_MARKER',   '/* STYLE-MARKER */');
  angular.module('app').constant('CODE_MARKER',    '// CODE-MARKER');
  angular.module('app').constant('LIBS_MARKER',    '// LIBS-MARKER');

  // We can change the global namespace used by Google's Universal Analytics.
  // All access should be through the service wrapper.
  angular.module('app').constant('NAMESPACE_GOOGLE_ANALYTICS', 'googleAnalytics');
  // This twitter widget namespace is a symbolic constant. It cannot be changed.
  angular.module('app').constant('NAMESPACE_TWITTER_WIDGETS', 'twttr');
  angular.module('app').constant('GITHUB_TOKEN_COOKIE_NAME', 'github-token');

  angular.module('app').constant('STATE_DOODLE', 'doodle');
  angular.module('app').constant('STATE_GISTS',  'gists');

  // The following entries must be synchronized with appcache.mf:
  // The TypeScript d.ts library provides the type checking of global JavaScript types.
  angular.module('app').constant('FILENAME_TYPESCRIPT_CURRENT_LIB_DTS', vendorPath('typescript@1.4.1.3', 'lib.d.ts'))
  // The MathScript js library provides operator overloading at runtime.
  angular.module('app').constant('FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS', vendorPath('davinci-mathscript@1.0.8','dist/davinci-mathscript.min.js'))
})();
