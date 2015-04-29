(
  function($window, $document, tagName: string, url, namespace: string, a?, m?) {
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
)(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
