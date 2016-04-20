import * as angular from 'angular';
import app from '../app';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import HomeScope from '../scopes/HomeScope';

app.controller('home-controller', [
    '$scope',
    '$state',
    '$twitter',
    '$window',
    'GitHubAuthManager',
    'NAMESPACE_TWITTER_WIDGETS',
    'STATE_DOODLE',
    'STATE_EXAMPLES',
    function(
        $scope: HomeScope,
        $state: angular.ui.IStateService,
        $twitter: Twitter,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        NAMESPACE_TWITTER_WIDGETS: string,
        STATE_DOODLE: string,
        STATE_EXAMPLES: string
    ) {

        // Ensure that scrollbars are disabled.
        // This is so that we don't get double scrollbars when using the editor.
        $window.document.body.style.overflow = 'auto';

        authManager.handleGitHubLoginCallback(function(err, token: string) {
            if (err) {
                $scope.alert(err.message);
            }
        });

        if ($window[NAMESPACE_TWITTER_WIDGETS] && $window[NAMESPACE_TWITTER_WIDGETS].widgets) {
            $window[NAMESPACE_TWITTER_WIDGETS].widgets.load();
        }
        else {
            // We'll probably end up here the first time because the script load is asynchronous.
            // But that doesn't matter because the widgets will be initialized by the script itself.
            // On subsequent reloading of the home template, when the controller is invoked, it triggers a load.
        }

        $scope.twitterShareText = "STEMCstudio · Learning Science and Mathematics through Computational Modeling.";

        $scope.goDoodle = function() {
            $state.go(STATE_DOODLE);
        }

        $scope.goExamples = function() {
            $state.go(STATE_EXAMPLES);
        }
    }]);
