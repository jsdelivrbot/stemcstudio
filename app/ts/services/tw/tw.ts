import app from '../../app';

function twitterFactory(
    $window: ng.IWindowService,
    NAMESPACE_TWITTER_WIDGETS: string
) {
    // Load the widgets.js file asynchronously. 
    $window[NAMESPACE_TWITTER_WIDGETS] = (function (tagName: string, id: string) {
        const fjs: Node = $window.document.getElementsByTagName(tagName)[0];
        const t: { ready: (callback: (twttr: Twitter) => void) => void } = $window[NAMESPACE_TWITTER_WIDGETS] || {};
        if ($window.document.getElementById(id)) return t;
        const js = <HTMLScriptElement>$window.document.createElement(tagName);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        if (fjs.parentNode) {
            fjs.parentNode.insertBefore(js, fjs);
        }
        else {
            throw new Error(`${tagName}[0] has no parentNode`);
        }

        t['_e'] = [];
        t.ready = function (callback: (twttr: Twitter) => void) {
            t['_e'].push(callback);
        };

        return t;
    }('script', 'twitter-wjs'));

    // Wait for asynchronous resources to load.
    $window[NAMESPACE_TWITTER_WIDGETS].ready(function () {
        // We could use this callback to register hooks. e.g. Google Analytics.
    });

    return $window[NAMESPACE_TWITTER_WIDGETS];
}

app.factory('$twitter', [
    '$window',
    'NAMESPACE_TWITTER_WIDGETS',
    twitterFactory
]);
