/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/twitter/twitter.d.ts" />
angular.module('twitter-widgets', []).factory('$twitter', [
  '$window',
  'NAMESPACE_TWITTER_WIDGETS',
  function(
    $window: angular.IWindowService,
    NAMESPACE_TWITTER_WIDGETS: string
  ) {

  // Load the widgets.js file asynchronously. 
  $window[NAMESPACE_TWITTER_WIDGETS] = (function(tagName: string, id: string) {
    var js: HTMLScriptElement;
    var fjs: Node = $window.document.getElementsByTagName(tagName)[0];
    var t: {ready: (callback: (twttr: Twitter) => void) => void} = $window[NAMESPACE_TWITTER_WIDGETS] || {};
    if ($window.document.getElementById(id)) return t;
    js = <HTMLScriptElement>$window.document.createElement(tagName);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
   
    t['_e'] = [];
    t.ready = function(callback: (twttr: Twitter) => void) {
      t['_e'].push(callback);
    };

    return t;
  }('script', 'twitter-wjs'));

  // Wait for asynchronous resources to load.
  $window[NAMESPACE_TWITTER_WIDGETS].ready(function(twttr: Twitter) {
    // We could use this callback to register hooks. e.g. Google Analytics.
  });

  return $window[NAMESPACE_TWITTER_WIDGETS];
}]);