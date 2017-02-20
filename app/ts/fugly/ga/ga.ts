import app from '../../app';

app.factory('ga', [
  '$window',
  'NAMESPACE_GOOGLE_ANALYTICS',
  function (
    $window: angular.IWindowService,
    NAMESPACE_GOOGLE_ANALYTICS: string
  ) {
    //
    // Experimenting with putting this directly in the HTML.
    //
    /*
        (
          function(
            i,
            $document,
            tagName: string,
            url,
            r: string,
            a?,
            m?) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() { (i[r].q = i[r].q || []).push(arguments) }, i[r].l = new Date().valueOf();
            a = $document.createElement(tagName);
            m = $document.getElementsByTagName(tagName)[0];
            a.async = 1;
            a.src = url;
            m.parentNode.insertBefore(a, m);
          }
        )(
          $window,
          document,
          'script',
          'https://www.google-analytics.com/analytics.js',
          NAMESPACE_GOOGLE_ANALYTICS);
    */
    // FIXME: Might be better here to get an interface. 
    const service = function (this: any) {
      if (angular.isArray(arguments[0])) {
        for (var i = 0; i < arguments.length; ++i) {
          service.apply(this, arguments[i]);
        }
        return;
      }
      if ($window[NAMESPACE_GOOGLE_ANALYTICS]) {
        // TS2339: Property 'apply' does not exist on type 'Window'.
        $window[NAMESPACE_GOOGLE_ANALYTICS]['apply'](this, arguments);
      }
    };
    return service;
  }]);
