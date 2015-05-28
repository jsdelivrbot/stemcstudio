/// <reference path="../../../../typings/angularjs/angular.d.ts" />
angular.module('twitter-widgets', []).factory('tw', [
  '$window',
  'NAMESPACE_TWITTER_WIDGETS',
  function(
    $window: angular.IWindowService,
    NAMESPACE_TWITTER_WIDGETS: string
  ) {

  console.log('Loading: ' + NAMESPACE_TWITTER_WIDGETS);

  $window[NAMESPACE_TWITTER_WIDGETS] = (function(tagName: string, id: string) {
    var js: HTMLScriptElement;
    var fjs: Node = $window.document.getElementsByTagName(tagName)[0];
    var t = window[NAMESPACE_TWITTER_WIDGETS] || {};
    if ($window.document.getElementById(id)) return t;
    js = <HTMLScriptElement>$window.document.createElement(tagName);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
   
    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };
   
    return t;
  }('script', "twitter-wjs"));

  var service = function() {
  };
  return service;
}]);