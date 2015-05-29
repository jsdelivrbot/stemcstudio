/// <reference path="../../../../typings/angularjs/angular.d.ts" />
angular.module('google-analytics', []).factory('ga', [
  '$window',
  'NAMESPACE_GOOGLE_ANALYTICS',
  function(
    $window: angular.IWindowService,
    NAMESPACE_GOOGLE_ANALYTICS
  ) {

  (
    function(
      $window,
      $document,
      tagName: string,
      url,
      namespace: string,
      a?,
      m?) {
      $window['GoogleAnalyticsObject']=namespace;
      $window[namespace]=$window[namespace] || function() {
        ($window[namespace].q=$window[namespace].q||[]).push(arguments)
      }, $window[namespace].l=new Date().valueOf();
      a = $document.createElement(tagName);
      m = $document.getElementsByTagName(tagName)[0];
      a.async=1;
      a.src=url;
      m.parentNode.insertBefore(a, m);
    }
  )(
  window,
  document,
  'script',
  '//www.google-analytics.com/analytics.js',
  NAMESPACE_GOOGLE_ANALYTICS);

  var service = function() {
    if (angular.isArray(arguments[0])) {
      for(var i = 0; i < arguments.length; ++i) {
        service.apply(this, arguments[i]);
      }
      return;
    }
    if ($window[NAMESPACE_GOOGLE_ANALYTICS]) {
      $window[NAMESPACE_GOOGLE_ANALYTICS].apply(this, arguments);
    }
  };
  return service;
}]);