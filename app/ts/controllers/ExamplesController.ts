import * as angular from 'angular';
import app from '../app';
import ExamplesScope from '../scopes/ExamplesScope';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';

app.controller('examples-controller', [
    '$scope',
    '$state',
    '$stateParams',
    '$http',
    '$location',
    '$timeout',
    '$window',
    'GitHubAuthManager',
    'ga',
    'STATE_GISTS',
    function(
        scope: ExamplesScope,
        $state: angular.ui.IStateService,
        $stateParams: angular.ui.IStateParamsService,
        http: angular.IHttpService,
        $location: angular.ILocationService,
        $timeout: angular.ITimeoutService,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        STATE_GISTS: string
    ) {

        ///////////////////////////////////////////////////////////////////////////
        authManager.handleGitHubLoginCallback(function(err: any, token: string) {
            if (err) {
                scope.alert(err.message);
            }
        });
        ///////////////////////////////////////////////////////////////////////
        // THIS IS A TEST OF SOCKET.IO
        /*
        const socket = io({ autoConnect: false });
        socket.connect();
        socket.on('foo', function(msg) {
            console.log('foo: ' + msg);
        });
        socket.emit('test', [1, 2, 3]);
        */
        ///////////////////////////////////////////////////////////////////////

        // Disable scrollbars for this editing page ('hidden' and 'auto').
        $window.document.body.style.overflow = "auto";

        ///////////////////////////////////////////////////////////////////////

        // Ensure that scrollbars are disabled.
        // This is so that we don't get double scrollbars when using the editor.
        // I don't think we want this anymore now that we have side-by-side views.
        // $window.document.body.style.overflow = 'hidden'

        // Reminder: Do not create multiple trackers in this (single page) app.
        ga('create', 'UA-41504069-3', 'auto');
        ga('send', 'pageview');

        ///////////////////////////////////////////////////////////////////////
        scope.goHome = function(label?: string, value?: number) {
            ga('send', 'event', 'examples', 'goHome', label, value);
            $state.go('home');
        };

    }]);
